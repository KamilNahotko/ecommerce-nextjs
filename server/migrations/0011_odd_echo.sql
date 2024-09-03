CREATE TABLE IF NOT EXISTS "variantImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"color" real NOT NULL,
	"name" text NOT NULL,
	"order" real NOT NULL,
	"variantID" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variantTags" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"variantID" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantImages" ADD CONSTRAINT "variantImages_variantID_products_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantTags" ADD CONSTRAINT "variantTags_variantID_products_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
