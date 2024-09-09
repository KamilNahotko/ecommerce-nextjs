import { db } from "@/server";
import { ProductCard } from "./components";

export const ProductList = async () => {
  const productsData = await db.query.productVariants.findMany({
    with: {
      variantSizes: true,
      variantImages: true,
      variantTags: true,
      product: true
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)]
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Featured Shoes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsData.map((product) => (
          <ProductCard data={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};
