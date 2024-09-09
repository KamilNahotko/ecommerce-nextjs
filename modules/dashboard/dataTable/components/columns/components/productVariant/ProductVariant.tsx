"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { forwardRef, useEffect, useState } from "react";
import { VariantSchema } from "@/types";
import { VariantIncludedRelations } from "@/lib/infer-types";
import { createVariant, deleteVariant } from "@/server/actions";
import { InputTags, VariantImages } from "./components";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type VariantProps = {
  children: React.ReactNode;
  editMode: boolean;
  productID?: number;
  variant?: VariantIncludedRelations;
};

export const ProductVariant = forwardRef<HTMLDivElement, VariantProps>(
  ({ children, editMode, productID, variant }, ref) => {
    const form = useForm<z.infer<typeof VariantSchema>>({
      resolver: zodResolver(VariantSchema),
      defaultValues: {
        tags: [],
        sizes: [],
        variantImages: [],
        gender: "unisex",
        editMode,
        id: undefined,
        productID,
        productType: "Black Notebook"
      }
    });

    const [open, setOpen] = useState(false);
    let loadingToastId: string | number | undefined;

    const setEdit = () => {
      if (!editMode) {
        form.reset();
        return;
      }
      if (editMode && variant) {
        form.setValue("editMode", true);
        form.setValue("id", variant.id);
        form.setValue("productID", variant.productID);
        form.setValue("productType", variant.productType);
        form.setValue("gender", variant.gender);
        form.setValue(
          "tags",
          variant.variantTags.map((tag) => tag.tag)
        );
        form.setValue(
          "sizes",
          variant.variantSizes.map((size) => size.size)
        );
        form.setValue(
          "variantImages",
          variant.variantImages.map((img) => ({
            name: img.name,
            size: img.size,
            url: img.url
          }))
        );
      }
    };

    useEffect(() => {
      setEdit();
    }, [variant]);

    const { execute, status } = useAction(createVariant, {
      onExecute() {
        loadingToastId = toast.loading("Creating variant", { duration: 1 });
        setOpen(false);
      },
      onSuccess({ data }) {
        toast.dismiss(loadingToastId);

        if (data?.error) {
          toast.error(data.error);
        }
        if (data?.success) {
          toast.success(data.success);
        }
      }
    });

    const variantAction = useAction(deleteVariant, {
      onExecute() {
        toast.loading("Deleting variant", { duration: 1 });
        setOpen(false);
      },
      onSuccess({ data }) {
        if (data?.error) {
          toast.error(data.error);
        }
        if (data?.success) {
          toast.success(data.success);
        }
      }
    });

    const onSubmit = (values: z.infer<typeof VariantSchema>) => execute(values);

    const availableSizes = Array.from({ length: 15 }, (_, i) => i + 35);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[860px]">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit" : "Create"} your variant</DialogTitle>
            <DialogDescription>
              Manage your product variants here. You can add tags, images, and more.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Pick a title for your variant" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="unisex">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => {
                  const toggleSize = (size: number) => {
                    const updatedSizes = field.value.includes(size)
                      ? field.value.filter((s) => s !== size)
                      : [...field.value, size];

                    field.onChange(updatedSizes);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Variant Sizes</FormLabel>
                      <FormControl>
                        <div className="flex gap-1">
                          {availableSizes.map((size) => (
                            <Badge
                              className={cn(
                                "cursor-pointer",
                                field.value.includes(size)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-primary/25"
                              )}
                              onClick={() => toggleSize(size)}
                              key={size}>
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <InputTags {...field} onChange={(e) => field.onChange(e)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <VariantImages />
              <div className="flex gap-4 items-center justify-center">
                {editMode && variant && (
                  <Button
                    variant={"destructive"}
                    type="button"
                    disabled={variantAction.status === "executing"}
                    onClick={(e) => {
                      e.preventDefault();
                      variantAction.execute({ id: variant.id });
                    }}>
                    Delete Variant
                  </Button>
                )}
                <Button
                  disabled={
                    status === "executing" || !form.formState.isValid || !form.formState.isDirty
                  }
                  type="submit">
                  {editMode ? "Update Variant" : "Create Variant"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);

ProductVariant.displayName = "ProductVariant";
