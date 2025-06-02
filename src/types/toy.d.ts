export interface Media {
  id: string
  fileUrl: string
  type: 'IMAGE' | 'VIDEO'
  toyId: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Toy {
  id: string
  description: string
  price: number
  location: string
  categoryId: number
  statusId: number
  recommendedAge: number
  createdAt?: Date
  updatedAt?: Date
  userId: string
  isActive: boolean
  media: Media[]
}


export interface ToyResponseSuccess {
  success: boolean
  data: Toy
}

export interface ToyResponseError {
  success: boolean
  error: string
  details?: unknown
}

interface ToyWhereInput {
  isActive?: boolean
  price?: {
    gte?: number
    lte?: number
  }
  recommendedAge?: {
    gte?: number
    lte?: number
  }
  description?: {
    contains: string
    mode: 'insensitive'
  }
  // Agrega otros campos según necesites
}