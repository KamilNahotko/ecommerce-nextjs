import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from "drizzle-orm";
import * as schema from "@/server/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type VariantIncludedRelations = InferResultType<
  "productVariants",
  { variantImages: true; variantTags: true; variantSizes: true }
>;

export type ProductsWithVariants = InferResultType<
  "products",
  { productVariants: true; reviews: true }
>;

export type VariantsWithProduct = InferResultType<
  "productVariants",
  { variantImages: true; variantTags: true; product: true; variantSizes: true }
>;
