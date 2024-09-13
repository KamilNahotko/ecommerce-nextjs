"use client";

import { useCartStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

export const CartButton = () => {
  const { setIsCartOpen, cartItems } = useCartStore();
  const totalItems = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.variant.quantity, 0),
    [cartItems]
  );

  return (
    <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className="relative">
      <ShoppingBag size={24} />
      {cartItems.length > 0 && (
        <Badge className="absolute -top-1 -right-1 px-2 text-xs hover:bg-primary">
          {totalItems}
        </Badge>
      )}
    </Button>
  );
};
