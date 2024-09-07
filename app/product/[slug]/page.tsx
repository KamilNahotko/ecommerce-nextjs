import {
  ProductDetails,
  ProductGallery,
  ProductReviews,
} from '@/modules/ProductPage';
import { db } from '@/server';
import { productVariants } from '@/server/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const data = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      variantSizes: true,
      variantImages: true,
      product: {
        with: {
          productVariants: {
            with: {
              variantImages: true,
              variantTags: true,
              variantSizes: true,
            },
          },
        },
      },
    },
  });

  if (!data?.product) return notFound();

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      <div className='space-y-12'>
        <ProductGallery images={data.variantImages} />
        <ProductReviews />
      </div>
      <ProductDetails
        variantId={data.id}
        product={data.product}
        sizes={data.variantSizes}
        variants={data.product.productVariants}
      />
    </div>
  );
};

export default ProductPage;
