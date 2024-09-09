import { ProductForm } from "@/modules/dashboard";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

const AddProductPage = async () => {
  const session = await auth();

  if (session?.user.role !== "admin") redirect("/dashboard/settings");
  return <ProductForm />;
};

export default AddProductPage;
