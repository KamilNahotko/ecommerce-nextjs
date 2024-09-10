"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { reviewSchema } from "@/types";
import { useAction } from "next-safe-action/hooks";
import { addReview } from "@/server/actions";
import { toast } from "sonner";

export const ReviewForm = ({ productID }: { productID: number }) => {
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      productID
    }
  });

  const { execute, status } = useAction(addReview, {
    onSuccess({ data }) {
      if (data?.error) {
        console.log(data.error);
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success("Review Added 👌");
        form.reset();
      }
    }
  });

  function onSubmit(values: z.infer<typeof reviewSchema>) {
    execute({
      comment: values.comment,
      rating: values.rating,
      productID
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your review</FormLabel>
                  <FormControl>
                    <Textarea placeholder="How would you describe this product?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your Rating</FormLabel>
                  <FormControl>
                    <Input type="hidden" placeholder="Star Rating" {...field} />
                  </FormControl>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((value) => {
                      return (
                        <motion.div
                          className="relative cursor-pointer"
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                          key={value}>
                          <Star
                            key={value}
                            onClick={() => {
                              form.setValue("rating", value, {
                                shouldValidate: true
                              });
                            }}
                            className={cn(
                              "text-gray-300 bg-transparent transition-all duration-300 ease-in-out",
                              form.getValues("rating") >= value
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted"
                            )}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />
            <Button disabled={status === "executing"} className="w-full" type="submit">
              {status === "executing" ? "Adding Review..." : "Add Review"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
