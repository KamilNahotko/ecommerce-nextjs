"use client";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { VariantIncludedRelations } from "@/lib/inferTypes";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export const ProductGallery = ({
  images
}: {
  images: VariantIncludedRelations["variantImages"];
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => setCurrentIndex(api.selectedScrollSnap());

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const goToSlide = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="space-y-4">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <Image width={1280} height={600} quality={100} src={image.url} alt={image.name} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex space-x-4">
        {images.map((image, index) => (
          <Button
            key={index}
            variant="outline"
            size="icon"
            className={`w-16 h-16 p-0 ${currentIndex === index ? "ring-2 ring-primary" : ""}`}
            onClick={() => goToSlide(index)}>
            <Image
              src={image.url}
              alt={image.name}
              width={64}
              height={64}
              className="w-full h-full object-cover rounded"
            />
            <span className="sr-only">Go to slide {index + 1}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
