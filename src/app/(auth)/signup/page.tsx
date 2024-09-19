"use client";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { RegisterForm } from "../components/register-form";

function WrappedRegisterForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;
  const isFirstUser = searchParams.get("firstUser") === "true";

  const headerLabel = isFirstUser
    ? "Welcome! Create your first account"
    : "Create an account";

  return <RegisterForm callbackUrl={callbackUrl} headerLabel={headerLabel} />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WrappedRegisterForm />
    </Suspense>
  );
}
