"use server";

import { ProductSchema } from "@/types";
import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { products } from "@/server/schema";

const actionClient = createSafeActionClient();

export const createProduct = actionClient
  .schema(ProductSchema)
  .action(async ({ parsedInput: { description, price, title, id } }) => {
    try {
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id)
        });
        if (!currentProduct) return { error: "Product not found" };

        const editedProduct = await db
          .update(products)
          .set({ description, price, title })
          .where(eq(products.id, id))
          .returning();

        return { success: `Product ${editedProduct[0].title} has been edited` };
      }
      if (!id) {
        const newProduct = await db
          .insert(products)
          .values({ description, price, title })
          .returning();

        return { success: `Product ${newProduct[0].title} has been created` };
      }
    } catch (err) {
      return { error: JSON.stringify(err) };
    }
  });
