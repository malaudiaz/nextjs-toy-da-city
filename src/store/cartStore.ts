import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Media {
  fileUrl: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  media: Media[];
  sellerId: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        set({
          items: existingItem
            ? get().items
            : [
                ...get().items,
                {
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  media: item.media,
                  sellerId: item.sellerId,
                },
              ],
        });
        if (existingItem) {
          toast.error("Item already in cart")
        } else {
          toast.success("Item added to cart")
        }
      },
      removeFromCart: (id) => {
        set({
            items: get().items.filter((item) => item.id !== id )
        })
      }
    }),
    {
      name: "cart-store",
    }
  )
);
