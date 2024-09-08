'use server';

import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server';
import {
  productVariants,
  products,
  variantImages,
  variantSizes,
  variantTags,
} from '@/server/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { VariantSchema } from '@/types';
import { algoliasearch } from 'algoliasearch';

const actionClient = createSafeActionClient();
const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

export const createVariant = actionClient
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        gender,
        editMode,
        id,
        productID,
        productType,
        tags,
        variantImages: newImgs,
        sizes,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({ gender, productType, updated: new Date() })
            .where(eq(productVariants.id, id))
            .returning();
          await db
            .delete(variantTags)
            .where(eq(variantTags.variantID, editVariant[0].id));
          await db
            .delete(variantSizes)
            .where(eq(variantSizes.variantID, editVariant[0].id));
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: editVariant[0].id,
            }))
          );
          await db.insert(variantSizes).values(
            sizes.map((size) => ({
              size,
              variantID: editVariant[0].id,
            }))
          );
          await db
            .delete(variantImages)
            .where(eq(variantImages.variantID, editVariant[0].id));
          await db.insert(variantImages).values(
            newImgs.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: editVariant[0].id,
              order: idx,
            }))
          );

          algoliaClient.partialUpdateObject({
            indexName: 'products',
            objectID: editVariant[0].id.toString(),
            attributesToUpdate: {
              id: editVariant[0].productID,
              productType: editVariant[0].productType,
              variantImages: newImgs[0].url,
              variantSizes: variantSizes,
            },
          });

          revalidatePath('/dashboard/products');
          return { success: `Edited ${productType}` };
        }
        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              gender,
              productType,
              productID,
            })
            .returning();
          const product = await db.query.products.findFirst({
            where: eq(products.id, productID),
          });
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: newVariant[0].id,
            }))
          );
          await db.insert(variantSizes).values(
            sizes.map((size) => ({
              size,
              variantID: newVariant[0].id,
            }))
          );
          await db.insert(variantImages).values(
            newImgs.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: newVariant[0].id,
              order: idx,
            }))
          );

          if (product) {
            algoliaClient.saveObject({
              indexName: 'products',
              body: {
                objectID: newVariant[0].id.toString(),
                id: newVariant[0].productID,
                title: product.title,
                price: product.price,
                productType: newVariant[0].productType,
                variantImages: newImgs[0].url,
                variantSizes: variantSizes,
              },
            });
          }

          revalidatePath('/dashboard/products');
          return { success: `Added ${productType}` };
        }
      } catch (error) {
        return { error: 'Failed to create variant' };
      }
    }
  );
