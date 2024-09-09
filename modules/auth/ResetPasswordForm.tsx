"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthCard } from "./common";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResetPasswordSchema } from "@/types";
import { resetPassword } from "@/server/actions";
import { FormStatusMessage } from "@/components/formStatusMessage";

export const ResetPasswordForm = () => {
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(resetPassword, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error);
      if (data?.success) {
        setSuccess(data.success);
      }
    }
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Forgot your password? "
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocials>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="your address email"
                        type="email"
                        disabled={status === "executing"}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormStatusMessage message={success} type="success" />
              <FormStatusMessage message={error} type="error" />
            </div>
            <Button
              type="submit"
              className={cn("w-full", status === "executing" ? "animate-pulse" : "")}>
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
