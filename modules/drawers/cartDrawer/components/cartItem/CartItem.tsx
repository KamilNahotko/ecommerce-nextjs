import { Button } from "@/components/ui/button";
import Image from "next/image";

export const CartItem = () => {
  return (
    <div className="flex flex-col justify-between border-b border-gray-200 pb-6 last:border-b-0">
      <div className="flex gap-4">
        <Image
          className="rounded-md outline outline-1 outline-gray-200 p-1"
          src="/placeholder.png"
          alt="Product"
          width={130}
          height={130}
        />
        <div className="flex flex-col justify-between w-full">
          <div className="flex justify-between w-full">
            <p className="font-medium">Product Name</p>
            <p className="font-medium">40$</p>
          </div>
          <div className="flex justify-between w-full">
            <p className="text-sm text-gray-500">Quantity 1</p>
            <Button variant="ghost" className="h-fit p-0 hover:bg-transparent hover:text-black/75">
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
