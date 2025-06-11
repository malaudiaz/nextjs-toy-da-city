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
  title: string
  description: string
  price: number
  location: string
  categoryId: number
  statusId: number
  conditionId: number
  forSell: boolean
  forGifts: boolean
  forChanges: boolean
  createdAt?: Date
  updatedAt?: Date
  userId: string
  isActive: boolean
  media: Media[]
  likes: ToyLikes[]
  comments: ToyComments[]
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
  description?: {
    contains: string
    mode: 'insensitive'
  }
  title?: {
    contains: string
    mode: 'insensitive'
  }
  forSell?: {
    contains: boolean
  }
  forGifts?: {
    contains: boolean
  }
  forChanges?: {
    contains: boolean
  }
  // Agrega otros campos según necesites
}