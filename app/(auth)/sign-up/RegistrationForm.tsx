"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegistrationSchema } from "./registration.schema";
import { set, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Loader2 } from "lucide-react";

import { registration } from "./registration.action";
import { FormError } from "./registration-form-error";
import { FormSucess} from "./registration-form-sucess";

type RegistrationFormValues = z.infer<typeof RegistrationSchema>;

export default function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");
   const [sucess, setSucess] = useState<string | undefined>("");

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegistrationFormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    registration(data).then((data) => {
      setError(data.error);
      setSucess(data.success);
    });

    setIsLoading(false);
    // Here you would typically handle the registration logic
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Registration</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={isLoading}
                      type="text"
                    />
                  </FormControl>
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
                      placeholder="Enter your email"
                      {...field}
                      disabled={isLoading}
                      type="email"
                    />
                  </FormControl>
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
                      disabled={isLoading}
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display error message */}
            <FormError message={error} />
            {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
            <FormSucess message={sucess} />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export { RegistrationForm };
