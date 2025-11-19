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

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/webm'
]

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')
const MAX_FILES_PER_TOY = 10 // Límite de archivos por post
const EARTH_RADIUS_KM = 6371


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
  const s = await getTranslations("Status");
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

    // Crear el primer toy
    // const userId = 'user_2wY8ZRoOrheojD7zQXtwk9fg00x'

    const statusAvailable = await prisma.status.findUnique({ where: { name: "available" } });
    if (!statusAvailable) {
      return NextResponse.json(
        { 
          success: false, 
          error: s("NotFound") 
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
        statusId: statusAvailable.id,
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
      // Validar tipo de archivo
      if (!ALLOWED_TYPES.includes(file.type)) {
        await prisma.toy.delete({ where: { id: toy.id } }) // Rollback
        return NextResponse.json(
          { success: false, error: `Unsupported file type: ${file.type}` },
          { status: 400 }
        )
      }

      // Generar nombre único
      const extension = file.type.split('/')[1]
      const filename = `${uuidv4()}.${extension}`
      const filePath = join(UPLOADS_DIR, filename)

      // Guardar archivo
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filePath, buffer)

      // Crear media asociada al toy
      const media = await prisma.media.create({
        data: {
          fileUrl: `/en/api/uploads/${filename}`,
          type: file.type.startsWith('image') ? 'IMAGE' : 'VIDEO',
          toyId: toy.id
        }
      })
      
      mediaItems.push(media)
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