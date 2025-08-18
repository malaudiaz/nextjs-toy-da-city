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