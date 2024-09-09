import { DataTable, Columns } from "@/modules/dashboard";
import { db } from "@/server";
import placeholder from "@/public/placeholder.png";

const ProductsPage = async () => {
  const products = await db.query.products.findMany({
    with: {
      productVariants: {
        with: { variantImages: true, variantTags: true, variantSizes: true }
      }
    },
    orderBy: (products, { desc }) => [desc(products.id)]
  });

  if (!products) throw new Error("No products found");

  const dataTable = products.map((product) => {
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: placeholder.src,
        variants: []
      };
    }
    const image = product.productVariants[0].variantImages[0].url;
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: product.productVariants,
      image
    };
  });

  if (!dataTable) throw new Error("no data found");

  return <DataTable data={dataTable} columns={Columns} />;
};

export default ProductsPage;
