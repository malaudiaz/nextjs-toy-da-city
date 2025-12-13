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
};

export type Toy = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  conditionId: number;
  categoryId: number;
  forSell: boolean;
  forGifts: boolean;
  forChanges: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  sellerId: string;
  isActive: boolean;
  isFavorite: boolean;
  media: Media[];
  categoryDescription: string;
  conditionDescription: string;
  statusDescription: string;
};

export type Media = {
  id: string;
  fileUrl: string;
  type: "IMAGE" | "VIDEO";
  toyId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

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
};

export type OrderItem = {
  id: string;
  orderId: string;
  toyId: string;
  priceAtPurchase: number;
  toy: ToyWithSeller;
};

export type ToyWithSeller = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  conditionId: number;
  categoryId: number;
  forSell: boolean;
  forGifts: boolean;
  forChanges: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  sellerId: string;
  isActive: boolean;
  isFavorite: boolean;
  media: Media[];
  categoryDescription: string;
  conditionDescription: string;
  statusDescription: string;
  seller: {
    id: string;
    name: string;
    email: string;
    isEligibleForReview: boolean;
  };
};

export type Negotiator = {
  id: string;
  name: string;
  email: string;
};

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
  status: Status;
  categoryDescription?: string;
  conditionDescription?: string;
  statusDescription?: string;
  orderItems: SaleOrderItems[];
};
export type Status = {
  id: number;
  name: string;
  description: string;
  userId: string;
  isActive: boolean;
};

export type Category = {
  id: number;
  name: string;
  description: string;
  userId: string;
  isActive: boolean;
};

export type SellerProfile = {
  id: string;
  name: string;
  imageUrl?: string;
  clerkId: string;
  role: string;
  reputation: number | null;
  createdAt: string;
  averageRating: number | null;
  totalReviews: number;
  toysForSale: ToysForSale[];
  reviewsReceived: Review[];
};

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  order: { id: string } | null;
};

export type ToysForSale = {
  id: string;
  title: string;
  price: number;
  category: { name: string };
  primaryImageUrl: string | null;
};

export type ReviewEligibility = {
  canReview: boolean;
  orderId: string | null;
  message?: string;
};

export type SaleOrderItems = {
  id: string;
  orderId: string;
  toyId: string;
  priceAtPurchase: number;
  order: {
    id: string;
    cartId: string;
    paymentIntentId: string;
    chargeId: null;
    buyerId: string;
    sellerId: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
    confirmedAt: Date;
    canceledAt: Date;
    transferredAt: Date;
    reembursedAt: Date;
    buyer: {
      id: string;
      name: string;
      email: string;
    };
  };
};
