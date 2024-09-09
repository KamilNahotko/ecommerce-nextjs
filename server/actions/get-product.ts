"use server";

import { eq } from "drizzle-orm";
import { db } from "@/server";
import { products } from "@/server/schema";

export const getProduct = async (id: number) => {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id)
    });
    if (!product) throw new Error("Product not found");
    return { success: product };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: "Failed to get product" };
  }
};
