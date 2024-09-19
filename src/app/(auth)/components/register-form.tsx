import { registerUser } from "@/actions/register";
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
import { cn } from "@/lib/utils";
import { loginRoute } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { AuthWrapper } from "./auth-wrapper";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { RegisterFormValues, RegisterSchema } from "./schemas";

export function RegisterForm({
  className,
  callbackUrl,
  headerLabel = "Create an account",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  callbackUrl?: string;
  headerLabel?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      registerUser(values, callbackUrl).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        if (data.success) {
          // Redirect to the callback URL or default redirect
          window.location.href = data.callbackUrl;
        }
      });
    });
  };

  return (
    <AuthWrapper
      headerLabel={headerLabel}
      backButtonLabel="Already have an account?"
      backButtonHref={loginRoute}
    >
      <div
        className={cn("w-full max-w-md mx-auto space-y-8", className)}
        {...props}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="jhondoe"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="jhon.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="••••••••"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="••••••••"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-2 px-4 border"
            >
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </AuthWrapper>
  );
}
