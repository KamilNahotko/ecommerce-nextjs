CREATE TABLE IF NOT EXISTS "productVariants" (
	"id" serial PRIMARY KEY NOT NULL,
	"color" text NOT NULL,
	"productType" text NOT NULL,
	"updated" timestamp DEFAULT now(),
	"productID" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "variantImages" RENAME COLUMN "color" TO "size";--> statement-breakpoint
ALTER TABLE "variantTags" RENAME COLUMN "url" TO "tag";--> statement-breakpoint
ALTER TABLE "variantImages" DROP CONSTRAINT "variantImages_variantID_products_id_fk";
--> statement-breakpoint
ALTER TABLE "variantTags" DROP CONSTRAINT "variantTags_variantID_products_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariants" ADD CONSTRAINT "productVariants_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantImages" ADD CONSTRAINT "variantImages_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantTags" ADD CONSTRAINT "variantTags_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
