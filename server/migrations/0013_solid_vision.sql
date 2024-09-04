CREATE TABLE IF NOT EXISTS "variantSizes" (
	"id" serial PRIMARY KEY NOT NULL,
	"size" text NOT NULL,
	"variantID" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantSizes" ADD CONSTRAINT "variantSizes_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
