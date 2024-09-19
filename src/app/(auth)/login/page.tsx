"use client";

import { checkIsFirstUser } from "@/lib/users";
import { DEFAULT_LOGIN_REDIRECT, signUpRoute } from "@/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LoginForm } from "../components/login-form";

function WrappedLoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkFirstUser = async () => {
      try {
        const isFirstUser = await checkIsFirstUser().catch((error) => {
          console.error("Error calling checkIsFirstUser:", error);
          return undefined;
        });
        if (isFirstUser) {
          const signUpUrl = new URL(signUpRoute, window.location.origin);
          signUpUrl.searchParams.set("callbackUrl", callbackUrl);
          signUpUrl.searchParams.set("firstUser", "true");
          router.push(signUpUrl.toString());
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking first user:", error);
        setIsLoading(false);
      }
    };

    checkFirstUser();
  }, [router, callbackUrl]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <LoginForm callbackUrl={callbackUrl} />;
}

export default function LogIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WrappedLoginForm />
    </Suspense>
  );
}
