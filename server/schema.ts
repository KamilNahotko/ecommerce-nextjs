import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  pgEnum,
  serial,
  real,
} from 'drizzle-orm/pg-core';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { AdapterAccountType } from 'next-auth/adapters';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

const connectionString = 'postgres://postgres:postgres@localhost:5432/drizzle';
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

export const RoleEnum = pgEnum('roles', ['user', 'admin']);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'),
  twoFactorEnabled: boolean('twoFactorEnabled').default(false),
  role: RoleEnum('roles').default('user'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verificationTokens = pgTable(
  'verificationToken',
  {
    id: text('identifier')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

export const passwordResetTokens = pgTable(
  'password_reset_token',
  {
    id: text('identifier')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
  },
  (passwordToken) => ({
    compositePk: primaryKey({
      columns: [passwordToken.id, passwordToken.token],
    }),
  })
);

export const twoFactorTokens = pgTable(
  'two_factor_token',
  {
    id: text('identifier')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
    userId: text('userID').references(() => users.id, { onDelete: 'cascade' }),
  },
  (twoFactorToken) => ({
    compositePk: primaryKey({
      columns: [twoFactorToken.id, twoFactorToken.token],
    }),
  })
);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  title: text('title').notNull(),
  created: timestamp('crated').defaultNow(),
  price: real('price').notNull(),
});

export const productVariants = pgTable('productVariants', {
  id: serial('id').primaryKey(),
  color: text('color').notNull(),
  productType: text('productType').notNull(),
  updated: timestamp('updated').defaultNow(),
  productID: serial('productID')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
});

export const variantSizes = pgTable('variantSizes', {
  id: serial('id').primaryKey(),
  size: real('size').notNull(),
  variantID: serial('variantID')
    .notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
});

export const variantImages = pgTable('variantImages', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  size: real('size').notNull(),
  name: text('name').notNull(),
  order: real('order').notNull(),
  variantID: serial('variantID')
    .notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
});

export const variantTags = pgTable('variantTags', {
  id: serial('id').primaryKey(),
  tag: text('tag').notNull(),
  variantID: serial('variantID')
    .notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
});

export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: 'productVariants' }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ many, one }) => ({
    product: one(products, {
      fields: [productVariants.productID],
      references: [products.id],
      relationName: 'productVariants',
    }),
    variantImages: many(variantImages, { relationName: 'variantImages' }),
    variantTags: many(variantTags, { relationName: 'variantTags' }),
    variantSizes: many(variantSizes, { relationName: 'variantSizes' }),
  })
);

export const variantSizesRelations = relations(variantSizes, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantSizes.variantID],
    references: [productVariants.id],
    relationName: 'variantSizes',
  }),
}));

export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantImages.variantID],
    references: [productVariants.id],
    relationName: 'variantImages',
  }),
}));

export const variantTagsRelations = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantTags.variantID],
    references: [productVariants.id],
    relationName: 'variantTags',
  }),
}));
