import prisma from "@/lib/prisma";
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Prisma } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises'
import { PaginationSchema, ToyFilterSchema, ToySchema} from "@/lib/schemas/toy";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ToyResponseSuccess, ToyResponseError } from "@/types/toy";
import { revalidatePath } from 'next/cache'; // 👈 Necesitas esta importación
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')
const MAX_FILES_PER_TOY = 6 // Límite de archivos por post
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB
const EARTH_RADIUS_KM = 6371

// Configuración de almacenamiento
const STORAGE_TYPE = process.env.NEXT_PUBLIC_STORE || 'LOCAL';

// Configuración de S3
let s3Client: S3Client | null = null;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';

if (STORAGE_TYPE === 'AWS') {
  const region = process.env.AWS_BUCKET_REGION || "";
  const accessKeyId = process.env.AWS_ACCESS_KEY || "";
  const secretAccessKey = process.env.AWS_SECRET_KEY || "";
  
  s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/webm',
] as const;

type AllowedMimeType = typeof ALLOWED_TYPES[number];

function isAllowedMimeType(mimeType: string): mimeType is AllowedMimeType {
  return (ALLOWED_TYPES as readonly string[]).includes(mimeType);
}

async function ensureUploadsDirExists() {
  try {
    await mkdir(UPLOADS_DIR, { recursive: true })
  } catch (error) {
    console.error('Error creating uploads directory:', error)
  }
}

// Función para calcular distancia haversine
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}


// GET all toys con paginación y búsqueda
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
 
  const { locale } = await params;

  const g = await getTranslations("General");

  try {
    const { searchParams } = new URL(request.url!)

    const userLanguageCode = locale

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || "1"),
      limit: parseInt(searchParams.get('limit') || "10")
    });

    const filters = ToyFilterSchema.parse({
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      forSell: searchParams.get('forSell') ? String(searchParams.get('forSell')) : undefined,
      forGifts: searchParams.get('forGifts') ? String(searchParams.get('forGifts')) : undefined, 
      forChanges: searchParams.get('forChanges') ? String(searchParams.get('forChanges')) : undefined,      
      categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
      conditions: searchParams.get('conditions') ? String(searchParams.get('conditions')) : undefined,
      locationRadius: searchParams.get('lat') && searchParams.get('lng') && searchParams.get('radius')
        ? {
            lat: Number(searchParams.get('lat')),
            lng: Number(searchParams.get('lng')),
            radius: Number(searchParams.get('radius'))
          }
        : undefined,
      search: searchParams.get('search') || undefined,
    })

    const conditionIds = filters.conditions 
      ? filters.conditions.split(',').map(id => parseInt(id.trim()))
      : [];
   
    // 1. Inicializar el array de condiciones base
    const andConditions: Prisma.ToyWhereInput[] = [
      { statusId: 1 }, // Solo activos y disponibles
      { isActive: true }
    ];
    
    // Construir where object
    const where: Prisma.ToyWhereInput = {};
    
    // Filtro por precio
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {
        gte: filters.minPrice,
        lte: filters.maxPrice
      }
    }

    // Filtro por condicion
    if (conditionIds.length > 0) {
      where.conditionId = { in: conditionIds }
    }

    // Filtro por categoría y condición
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.conditionId) where.conditionId = filters.conditionId;
    
    // 2. Agregar Búsqueda por texto a AND
    if (filters.search) {
      andConditions.push({
        OR: [
          { title: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ]
      });
    }

    // 3. Lógica de filtros de tipo de transacción
    const transactionFilters: Prisma.ToyWhereInput[] = [];
    
    if (filters.forSell === 'true') {
      transactionFilters.push({ forSell: true });
    }
    if (filters.forGifts === 'true') {
      transactionFilters.push({ forGifts: true });
    }
    if (filters.forChanges === 'true') {
      transactionFilters.push({ forChanges: true });
    }

    // Si se seleccionó CUALQUIER filtro de transacción, se añaden al AND principal.
    // **IMPORTANTE**: Al usar AND, si se selecciona forGifts=true, solo devolverá
    // juguetes que sean (statusId=1 AND isActive=true AND forGifts=true).
    if (transactionFilters.length > 0) {
      // Si solo se selecciona uno (ej. forGifts), se aplica forGifts: true
      // Si se seleccionan múltiples, se aplicará OR si quieres que cumpla cualquiera,
      // pero si quieres que cumpla solo los marcados, los dejas como AND.
      // Ya que quieres solo los forGifts=true (si es el único marcado),
      // los añadimos al array AND. Si solo hay un elemento en transactionFilters,
      // se comportará como un filtro único.
      andConditions.push(...transactionFilters); 
    }
    
    // 4. Aplicar todas las condiciones acumuladas
    // Combina todas las condiciones de 'where' con las de 'andConditions'
    // La combinación de las condiciones fijas (`statusId`, `isActive`) con los filtros de búsqueda
    // y los filtros de tipo de transacción se hace aquí:
    
    // Aseguramos que la cláusula where principal contenga el AND de todas las sub-cláusulas.
    where.AND = [
        ...andConditions,
        { ...where } // Incluir los filtros de precio, categoría, condición que están fuera del array AND
    ].filter(Boolean); // Eliminar posibles entradas vacías

    // Consulta base
    const query = {
      where,
      include: { 
        media: true,
        category: {
          include: {
            translations: {
              where: {languageId: userLanguageCode, key: 'name'},
              select: {value: true}
            }
          }  
        }, 
        condition: {
          include: {
            translations: {
              where: {languageId: userLanguageCode, key: 'name' },
              select: {value: true}
            }
          }  
        }, 
        status: {
          include: {
            translations: {
              where: {languageId: userLanguageCode, key: 'name'},
              select: {value: true}
            }
          }  
        }, 
        favorites: true
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit
    }

    // Ejecutar consulta
    const [toys, totalCount] = await Promise.all([
      prisma.toy.findMany(query),
      prisma.toy.count({ where })
    ])
    
    // Filtro por ubicación (post-query por simplicidad)
    let filteredToys = toys
    if (filters.locationRadius) {
      filteredToys = toys.filter(toy => {
        const [lat, lng] = toy.location ? toy.location.split(',').map(Number) : [0,0]
        const distance = haversineDistance(
          filters.locationRadius!.lat,
          filters.locationRadius!.lng,
          lat,
          lng
        )
        return distance <= filters.locationRadius!.radius
      })
    }

    const processedToys = filteredToys
    .map(toy => {
      const {category, condition, status, ...toyData } = toy
      return {
        ...toyData,
        categoryName: category.name,
        categoryDescription: category.translations[0]?.value || category.name,
        conditionName: condition.name,
        conditionDescription: condition.translations[0]?.value || condition.name,
        statusName: status.name,
        statusDescription: status.translations[0]?.value || status.name,
        // Opcional: eliminar relaciones innecesarias
        translations: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        isActive: undefined,
        userId: undefined
      }})
    
    return NextResponse.json({
      success: true,
      data: processedToys, //filteredToys,
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.limit),
        currentPage: pagination.page,
        perPage: pagination.limit
      }
    })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: g("InvalidInputParams") }, { status: 400 });
  }
}

// POST create a new toy
export async function POST(request: Request): Promise<NextResponse<ToyResponseSuccess | ToyResponseError>> {
  const g = await getTranslations("General");
  const t = await getTranslations("Toy");


  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, error: g("Unauthorized") }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json(
      { 
        success: false, 
        error: g("UserNotFound") 
      },
      { status: 404 }
    )
  }

  const clonedRequest = request.clone();
  let formData: FormData;
  
  try {
    await ensureUploadsDirExists()

    formData = await clonedRequest.formData();

    const forSale = formData.get("forSale") === "true" ? true : false
    const forGift = formData.get("forGift") === "true" ? true : false
    const forChange = formData.get("forChange") === "true" ? true : false 
    
    
    // Validar con Zod
    const toyData = ToySchema.parse({
      title: formData.get('title'),
      description: formData.get('description'),
      location: formData.get('location'),
      price: Number(formData.get('price')),
      categoryId: Number(formData.get('categoryId')),
      conditionId: Number(formData.get('conditionId')),
      statusId: Number(formData.get('statusId')),
      forSell: forSale,
      forGifts: forGift,
      forChanges: forChange,
    })

    const files = formData.getAll('files') as Blob[]

    // Validar número de archivos
    if (files.length > MAX_FILES_PER_TOY) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Maximum ${MAX_FILES_PER_TOY} files allowed per post` 
        },
        { status: 400 }
      )
    }

    if (files.length < 1 ) {
      return NextResponse.json(
        { 
          success: false, 
          error: t("OneImageRequired") 
        },
        { status: 400 }
      )
    }

    const toy = await prisma.toy.create({
      data: {
        title: toyData.title,
        description: toyData.description,
        price: toyData.price,
        location:toyData.location,
        sellerId: user?.id,
        categoryId: toyData.categoryId,
        statusId: toyData.statusId,
        conditionId: toyData.conditionId,
        forSell: toyData.forSell,
        forGifts: toyData.forGifts,
        forChanges: toyData.forChanges,
        media: {
          create: [] // Inicializar array vacío
        }
      }
    })

    // Procesar cada archivo
    const mediaItems = []
    
    for (const file of files) {
      const mimeType = file.type;

      // Validar tipo permitido
      if (!isAllowedMimeType(mimeType)) {
        await prisma.toy.delete({ where: { id: toy.id } });
        return NextResponse.json(
          { success: false, error: `Unsupported file type: ${mimeType}` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      let filename: string;
      let finalBuffer: Buffer = buffer;

      // 🖼️ IMAGEN: optimizar con Sharp
      if (mimeType.startsWith('image/')) {
        if (buffer.length > MAX_IMAGE_SIZE) {
          await prisma.toy.delete({ where: { id: toy.id } });
          return NextResponse.json(
            { success: false, error: 'Image too large (max 10 MB)' },
            { status: 400 }
          );
        }

        try {
          const metadata = await sharp(buffer).metadata();
          if (!metadata.width || !metadata.height) {
            throw new Error('Invalid image');
          }

          finalBuffer = await sharp(buffer)
            .resize({
              width: 1200,
              height: 1200,
              fit: 'inside',
              withoutEnlargement: true,
            })
            .webp({ quality: 80 })
            .toBuffer();

          filename = `${uuidv4()}.webp`;
        } catch (err) {
          console.log(err);
          await prisma.toy.delete({ where: { id: toy.id } });
          return NextResponse.json(
            { success: false, error: 'Invalid or corrupted image file' },
            { status: 400 }
          );
        }
      }
      // 🎥 VIDEO: guardar tal cual (con límite de tamaño)
      else if (mimeType.startsWith('video/')) {
        if (buffer.length > MAX_VIDEO_SIZE) {
          await prisma.toy.delete({ where: { id: toy.id } });
          return NextResponse.json(
            { success: false, error: 'Video too large (max 50 MB)' },
            { status: 400 }
          );
        }

        const ext = mimeType === 'video/quicktime'
          ? 'mov'
          : mimeType.split('/')[1];

        filename = `${uuidv4()}.${ext}`;
      } else {
        await prisma.toy.delete({ where: { id: toy.id } });
        return NextResponse.json(
          { success: false, error: 'Unsupported file type' },
          { status: 400 }
        );
      }

      // Guardar archivo
      let fileUrl: string;
      
      if (STORAGE_TYPE === 'AWS' && s3Client) {
        // Guardar en S3
        const params = {
          Bucket: AWS_BUCKET_NAME,
          Key: filename,
          Body: new Uint8Array(finalBuffer),
          ContentType: mimeType,
        };
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        
        // URL pública a través de CloudFront
        fileUrl = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${filename}`;
      } else {
        // Guardar localmente
        const filePath = join(UPLOADS_DIR, filename);
        await writeFile(filePath, finalBuffer);
        fileUrl = `/en/api/uploads/${filename}`;
      }

      // Guardar en DB
      const media = await prisma.media.create({
        data: {
          fileUrl,
          type: mimeType.startsWith('image/') ? 'IMAGE' : 'VIDEO',
          toyId: toy.id,
        },
      });

      mediaItems.push(media);
    }

    // Obtener el post actualizado con los media
    const updatedPost = await prisma.toy.findUnique({
      where: { id: toy.id },
      include: { media: true, category: true, condition: true, status: true }
    })
      
    // Estructurar la respuesta para que coincida con PostResponse
    const responseData: ToyResponseSuccess = {
      success: true,
      data: {
        id: updatedPost!.id,
        title: updatedPost!.title,
        description: updatedPost!.description,
        price: updatedPost!.price,
        location: updatedPost!.location ?? "",
        createdAt: updatedPost!.createdAt,
        updatedAt: updatedPost!.updatedAt,
        sellerId: userId!,
        categoryId: updatedPost!.categoryId,
        categoryDescription: updatedPost!.category?.description ?? updatedPost!.category.name,
        statusDescription: updatedPost!.status?.description ?? updatedPost!.status.name,
        conditionId: updatedPost!.conditionId,
        conditionDescription: updatedPost!.condition?.description ?? updatedPost!.condition.name,
        forSell: updatedPost!.forSell,
        forGifts: updatedPost!.forGifts,
        forChanges: updatedPost!.forChanges,
        isActive: updatedPost!.isActive,
        isFavorite: false,
        favorites: [],
        media: updatedPost!.media.map(media => ({
          id: media.id,
          fileUrl: media.fileUrl,
          type: media.type,
          toyId: media.toyId
        }))
      }
    }    

    revalidatePath('/');

    return NextResponse.json(
      responseData,
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Error:', error)
    
    let errorMessage = 'InternalServerError'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage 
      },
      { status: 500 }
    )
  }
}