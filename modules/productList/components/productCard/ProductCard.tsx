'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VariantsWithProduct } from '@/lib/infer-types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

export const ProductCard = ({ data }: { data: VariantsWithProduct }) => {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <Card
      key={data.id}
      className='flex flex-col border-none rounded-none shadow-md'
      onMouseEnter={() => setHoveredProduct(data.product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      <CardHeader className='p-0'>
        <Image
          src={data.variantImages[0].url}
          alt={data.variantImages[0].name}
          width={500}
          height={200}
          quality={100}
          className='h-48 object-cover'
        />
      </CardHeader>
      <CardContent className='flex-grow p-0 relative overflow-hidden'>
        <div className='p-4'>
          <CardTitle className='text-xl mb-2'>{data.product.title}</CardTitle>
          <div
            className='w-[12px] h-[12px] rounded-lg mb-2'
            style={{ backgroundColor: data.color }}
          />
          <p className='font-bold text-lg mb-2'>
            ${data.product.price.toFixed(2)}
          </p>
          <div className='flex flex-wrap gap-2 mb-2'>
            {data.variantTags.map((tag) => (
              <Badge key={tag.id} variant='secondary'>
                {tag.tag}
              </Badge>
            ))}
          </div>
        </div>
        <div
          className={cn(
            'absolute bottom-0 bg-background/95 flex flex-col items-center justify-center p-4 transition-all duration-300 ease-in-out w-full h-full overflow-auto',
            hoveredProduct === data.product.id
              ? 'translate-y-0'
              : '-translate-y-full'
          )}
        >
          <h3 className='text-lg font-semibold mb-2'>Available Sizes</h3>
          <div className='flex gap-2 flex-wrap'>
            {data.variantSizes.map((size) => (
              <Button key={size.id} variant='outline' className='w-12 h-12'>
                {size.size}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
