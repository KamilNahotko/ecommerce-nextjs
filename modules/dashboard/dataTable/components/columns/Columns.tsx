"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteProduct } from "@/server/actions";
import { VariantIncludedRelations } from "@/lib/inferTypes";
import { ProductVariant } from "./components";

interface IProductColumn {
  title: string;
  price: number;
  image: string;
  variants: VariantIncludedRelations[];
  id: number;
}

const ActionCell = ({ row }: { row: Row<IProductColumn> }) => {
  const { status, execute } = useAction(deleteProduct, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data.success);
      }
    },
    onExecute: () => {
      toast.loading("Deleting Product");
    }
  });
  const product = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
          <Link href={`/dashboard/add-product?id=${product.id}`}>Edit Product</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => execute({ id: product.id })}
          className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer">
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Columns: ColumnDef<IProductColumn>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "title",
    header: "Title"
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue("variants") as VariantIncludedRelations[];
      return (
        <div className="flex gap-2 items-center">
          {variants.map((variant) => (
            <div key={variant.id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ProductVariant productID={variant.productID} variant={variant} editMode={true}>
                      <Image
                        src={variant.variantImages[0].url}
                        alt={variant.variantImages[0].name}
                        width={35}
                        height={35}
                        className="rounded-md"
                      />
                    </ProductVariant>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{variant.productType}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <ProductVariant productID={row.original.id} editMode={false}>
                    <PlusCircle className="h-5 w-5" />
                  </ProductVariant>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new product variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency"
      }).format(price);
      return <div className="font-medium text-xs">{formatted}</div>;
    }
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const cellImage = row.getValue("image") as string;
      const cellTitle = row.getValue("title") as string;
      return (
        <div className="">
          <Image src={cellImage} alt={cellTitle} width={50} height={50} className="rounded-md" />
        </div>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ActionCell
  }
];
