"use client";

import { Button } from "@/components/ui/button";
import { ProductsWithVariants, VariantIncludedRelations } from "@/lib/infer-types";
import { cn } from "@/lib/utils";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export const ProductDetails = ({
  product,
  sizes,
  variants,
  variantId
}: {
  product: ProductsWithVariants;
  sizes: VariantIncludedRelations["variantSizes"];
  variants: VariantIncludedRelations[];
  variantId: number;
}) => {
  const { title, price, description } = product;
  const [selectedVariant, setSelectedVariant] = useState(variantId);

  const params = useSearchParams();
  const selectedSize = params.get("size");

  return (
    <div>
      <div className="sticky top-10 space-y-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-xl">${price}</p>
        <div
          dangerouslySetInnerHTML={{ __html: description }}
          className="text-lg text-muted-foreground"
        />

        <div className="flex items-center space-x-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">(4.0) 128 reviews</span>
        </div>

        <div className="flex space-x-4">
          {variants.map(({ variantImages, id }) => (
            <Link href={`/product/${id}`} key={id}>
              <Button
                onClick={() => setSelectedVariant(id)}
                className={cn(
                  "relative aspect-square w-20 h-20 rounded-none overflow-hidden",
                  selectedVariant === id ? "ring-2 ring-primary" : ""
                )}>
                <Image
                  fill
                  src={variantImages[0].url}
                  alt={`Product variant ${id}`}
                  className="w-full h-full object-cover"
                />
              </Button>
            </Link>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Size</h3>

          {sizes.map((size) => (
            <Link key={size.id} href={`/product/${variantId}?size=${size.size}`}>
              <Button
                variant={Number(selectedSize) === size.size ? "default" : "outline"}
                className="w-12 h-12 mr-2">
                {size.size}
              </Button>
            </Link>
          ))}
        </div>

        <Button size="lg" className="w-full rounded-none">
          <ShoppingCart className="mr-2 h-4 w-4 " /> Add to Cart
        </Button>
      </div>
    </div>
  );
};
