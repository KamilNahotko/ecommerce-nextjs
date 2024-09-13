import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import { ICartItem, useCartStore } from "@/stores";
import Image from "next/image";

export const CartItem = ({ product }: { product: ICartItem }) => {
  const { removeFromCart } = useCartStore();
  const { name, image, id, variant, price } = product;

  const handleRemoveFromCart = () => removeFromCart(product);

  return (
    <div className="flex flex-col justify-between border-b border-gray-200 pb-6 last:border-b-0">
      <div className="flex gap-4">
        <Image
          className="rounded-md outline outline-1 outline-gray-200 p-1"
          src={image}
          alt={name}
          width={130}
          height={130}
        />
        <div className="flex flex-col justify-between w-full">
          <div className="flex justify-between w-full">
            <p className="font-medium">{name}</p>
            <p className="font-medium">${formatPrice(price)}</p>
          </div>
          <div className="flex justify-between w-full">
            <p className="text-sm text-gray-500">Quantity {variant.quantity}</p>
            <Button
              onClick={handleRemoveFromCart}
              variant="ghost"
              className="h-fit p-0 hover:bg-transparent hover:text-black/75">
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
