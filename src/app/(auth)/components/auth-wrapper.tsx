import Link from "next/link";

interface AuthWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}) => {
  return (
    <div className="force-light-mode text-foreground">
      <div className="flex flex-col text-center">
        <h1 className="text-2xl font-semibold tracking-tight pb-5">
          {headerLabel}
        </h1>
      </div>
      {children}
      <div className="flex flex-col text-center mt-5">
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href={backButtonHref}
            className="underline underline-offset-4 hover:text-primary"
          >
            {backButtonLabel}
          </Link>
        </p>
      </div>
    </div>
  );
};
