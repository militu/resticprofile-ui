import { login } from "@/actions/login";
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
import { DEFAULT_LOGIN_REDIRECT, signUpRoute } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { AuthWrapper } from "./auth-wrapper";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { LoginFormValues, LoginSchema } from "./schemas";

export function LoginForm({
  className,
  callbackUrl,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  callbackUrl?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        const data = await login(values, callbackUrl);
        if (data.error) {
          setError(data.error);
        } else if (data.success) {
          setSuccess(data.success);
          window.location.href = data.callbackUrl || DEFAULT_LOGIN_REDIRECT;
        }
      } catch (err) {
        console.error("Client-side: Login error:", err);
        setError("An unexpected error occurred during login");
      }
    });
  };

  return (
    <AuthWrapper
      headerLabel="Welcome back"
      backButtonLabel="Need an account?"
      backButtonHref={signUpRoute}
    >
      <div
        className={cn("w-full max-w-md mx-auto space-y-8", className)}
        {...props}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      placeholder="name@example.com"
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
