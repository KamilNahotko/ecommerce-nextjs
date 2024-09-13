import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IVariant {
  variantID: number;
  quantity: number;
}

export interface ICartItem {
  name: string;
  image: string;
  id: number;
  variant: IVariant;
  price: number;
}

interface ICartStore {
  isCartOpen: boolean;
  setIsCartOpen: (isCartOpen: boolean) => void;
  cartItems: ICartItem[];
  addToCart: (cartItem: ICartItem) => void;
  removeFromCart: (cartItem: ICartItem) => void;
  clearCart: () => void;
}

export const useCartStore = create<ICartStore>()(
  persist(
    (set) => ({
      isCartOpen: false,
      setIsCartOpen: (isCartOpen) => set({ isCartOpen }),
      cartItems: [],
      addToCart: (newCartItem) =>
        set((state) => {
          const existingCartItem = state.cartItems.find(
            (item) => item.variant.variantID === newCartItem.variant.variantID
          );

          if (existingCartItem) {
            const updatedCartItems = state.cartItems.map((cartItem) =>
              cartItem.variant.variantID === newCartItem.variant.variantID
                ? {
                    ...cartItem,
                    variant: {
                      ...cartItem.variant,
                      quantity: cartItem.variant.quantity + newCartItem.variant.quantity
                    }
                  }
                : cartItem
            );

            return { cartItems: updatedCartItems };
          }
          return { cartItems: [...state.cartItems, newCartItem] };
        }),
      removeFromCart: (newCartItem) =>
        set((state) => {
          const updatedCartItems = state.cartItems.map((cartItem) => {
            if (cartItem.variant.variantID === newCartItem.variant.variantID) {
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity: cartItem.variant.quantity - 1
                }
              };
            }
            return cartItem;
          });
          return {
            cartItems: updatedCartItems.filter((cartItem) => cartItem.variant.quantity > 0)
          };
        }),
      clearCart: () => set({ cartItems: [] })
    }),
    { name: "cart-store" }
  )
);
