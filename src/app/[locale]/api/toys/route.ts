import prisma from "@/lib/prisma";
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { writeFile, mkdir } from 'fs/promises'
import { PaginationSchema, ToyFilterSchema, ToySchema} from "@/lib/schemas/toy";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { ToyResponseSuccess, ToyResponseError, ToyWhereInput } from "@/types/toy";

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

  const t = await getTranslations("Toy.errors");

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
      locationRadius: searchParams.get('lat') && searchParams.get('lng') && searchParams.get('radius')
        ? {
            lat: Number(searchParams.get('lat')),
            lng: Number(searchParams.get('lng')),
            radius: Number(searchParams.get('radius'))
          }
        : undefined,
      search: searchParams.get('search') || undefined,
    })

    // Construir query de filtrado
    const where: ToyWhereInput = {isActive: true}

    // Filtro por precio
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {
        gte: filters.minPrice,
        lte: filters.maxPrice
      }
    }

    // Filtro por texto (búsqueda)
    if (filters.search) {
      where.description = {
        contains: filters.search,
        mode: 'insensitive'
      }
    }

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
        const [lat, lng] = toy.location.split(',').map(Number)
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
    return NextResponse.json({ error: t("InvalidParams") }, { status: 400 });
  }
}

// POST create a new toy
export async function POST(request: Request): Promise<NextResponse<ToyResponseSuccess | ToyResponseError>> {
  const { success, userId, error, code } = await getAuthUserFromRequest(request);

  if (!success && !userId) {
    return NextResponse.json(
        { 
          success: success, 
          error: error 
        },
        { status: code }
      )    
  }

  //const t = await getTranslations("Toy.errors");
  const clonedRequest = request.clone();
  let formData: FormData;
  
  try {
    await ensureUploadsDirExists()

    // const userId = "user_2wY8ZRoOrheojD7zQXtwk9fg00x"

    formData = await clonedRequest.formData();

    console.log("Valor de location:", formData.get('location'));
    
    // Validar con Zod
    const toyData = ToySchema.parse({
      title: formData.get('title'),
      description: formData.get('description'),
      location: formData.get('location'),
      price: Number(formData.get('price')),
      categoryId: Number(formData.get('categoryId')),
      conditionId: Number(formData.get('conditionId')),
      forSell: formData.get("forSell"),
      forGifts: formData.get("forGifts"),
      forChanges: formData.get("forChanges"),
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
          error: `You must upload at least one image per post.` 
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
          error: `StatusNotFound.` 
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
        sellerId: userId!,
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
          fileUrl: `/uploads/${filename}`,
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
        location: updatedPost!.location,
        createdAt: updatedPost!.createdAt,
        updatedAt: updatedPost!.updatedAt,
        userId: userId!,
        categoryId: updatedPost!.categoryId,
        categoryDescription: updatedPost!.category?.description ?? updatedPost!.category.name,
        statusId: updatedPost!.statusId,
        statusDescription: updatedPost!.status?.description ?? updatedPost!.status.name,
        conditionId: updatedPost!.conditionId,
        conditionDescription: updatedPost!.condition?.description ?? updatedPost!.condition.name,
        forSell: updatedPost!.forSell,
        forGifts: updatedPost!.forGifts,
        forChanges: updatedPost!.forChanges,
        isActive: updatedPost!.isActive,
        media: updatedPost!.media.map(media => ({
          id: media.id,
          fileUrl: media.fileUrl,
          type: media.type,
          toyId: media.toyId
        })),
        likes: [],
        comments: [],
      }
    }    

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