

export type Condition = {
  id: number;
  name: string;
  description: string;
  userId: string;
  isActive: boolean;
};

export type User = {
   id: string;
   name: string;
   email: string;
   phone: string;
   clerkId: string;
   role: string;
   stripeAccountId: string;
   onboardingUrl: string;
   reputation: number;
   isActive: boolean;
}

export type Toy = {
   id: string
    title: string
    description: string
    price: number
    location: string
    conditionId: number
    categoryId: number
    forSell: boolean
    forGifts: boolean
    forChanges: boolean
    createdAt?: Date
    updatedAt?: Date
    sellerId: string
    isActive: boolean
    isFavorite: boolean
    media: Media[]
    categoryDescription: string
    conditionDescription: string
    statusDescription: string
}

export type Media = {
    id: string
  fileUrl: string
  type: 'IMAGE' | 'VIDEO'
  toyId: string
  createdAt?: Date
  updatedAt?: Date
}

export type Order = {
  id: string;
  cartId: string;
  paymentIntentId: string;
  chargeId: string;
  buyerId: string;
  sellerId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  buyer: Negotiator;
  seller: Negotiator;
}

export type OrderItem = {
  id: string;
  orderId: string;
  toyId: string;
  priceAtPurchase: number;
  toy: Toy;
}

export type Negotiator = {
  id: string;
  name: string;
  email: string;
}

export type Sale = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  categoryId: number;
  conditionId: number;
  sellerId: string;
  forSell: boolean;
  forGifts: boolean;
  forChanges: boolean;
  media: Media[];
  category: Category;
  condition: Condition;
  status : Status;
}
export type Status = {
  id: number;
  name: string;
  description: string;
  userId: string;
  isActive: boolean;
}

export type Category ={
  id: number;
  name: string;
  description: string;
  userId: string;
  isActive: boolean;
}

