'use server';
import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';
import { db } from '@/server';
import { productVariants } from '@/server/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { algoliasearch } from 'algoliasearch';

const actionClient = createSafeActionClient();
const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

export const deleteVariant = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();
      revalidatePath('dashboard/products');

      algoliaClient.deleteObject({
        indexName: 'products',
        objectID: deletedVariant[0].id.toString(),
      });

      return { success: `Deleted ${deletedVariant[0].productType}` };
    } catch (error) {
      return { error: 'Failed to delete variant' };
    }
  });
