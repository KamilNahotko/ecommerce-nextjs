"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import Link from "next/link";
import { z } from "zod";
import { RegisterSchema } from "@/types";
import { emailRegister } from "@/server/actions";
import { FormStatusMessage } from "@/components/formStatusMessage";

export const RegisterForm = () => {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    }
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { execute, status } = useAction(emailRegister, {
    onSuccess({ data }) {
      console.log("data:", data);
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    }
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Create an account 🎉"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account?"
      showSocials>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="your username" type="text" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="*********"
                        type="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormStatusMessage message={success} type="success" />
              <FormStatusMessage message={error} type="error" />
              <Button size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset">Forgot your password</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn("w-full", status === "executing" ? "animate-pulse" : "")}>
              Register
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
