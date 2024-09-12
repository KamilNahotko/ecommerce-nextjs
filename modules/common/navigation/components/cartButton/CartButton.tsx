"use client";

import { useCartStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export const CartButton = () => {
  const { setIsCartOpen } = useCartStore();

  return (
    <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
      <ShoppingBag size={24} />
    </Button>
  );
};
