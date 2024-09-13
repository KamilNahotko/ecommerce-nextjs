"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores";
import { CartItem } from "./components";
import { useMemo } from "react";

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems } = useCartStore();

  const totalPrice = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.variant.quantity, 0),
    [cartItems]
  );

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-screen sm:max-w-[300px] md:max-w-[500px] flex flex-col p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="text-xl">Your Shopping Cart</SheetTitle>
          <SheetDescription>
            <p>
              You can add multiple items to your cart. Click on the item to remove it from your
              cart.
            </p>
          </SheetDescription>
        </SheetHeader>
        <div className="p-6 flex flex-col gap-6 overflow-auto">
          {cartItems.map((product, index) => (
            <CartItem key={index} product={product} />
          ))}
        </div>

        <SheetFooter className="border-t border-gray-200 mt-auto">
          <div className="flex flex-col gap-2 w-full p-6">
            <div className="flex justify-between">
              <p className="font-medium">Subtotal</p>
              <p className="font-semibold">${totalPrice}</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">Shipping and taxes calculated at checkout</p>
            <SheetClose asChild>
              <Button className="w-full" type="submit">
                Checkout
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button className="w-full" type="submit">
                Go to cart
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
