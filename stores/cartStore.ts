import { create } from "zustand";

interface CartStore {
  isCartOpen: boolean;
  setIsCartOpen: (isCartOpen: boolean) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  isCartOpen: false,
  setIsCartOpen: (isCartOpen) => set({ isCartOpen })
}));
