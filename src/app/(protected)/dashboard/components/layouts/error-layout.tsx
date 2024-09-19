import Header from "@/app/(protected)/components/header";
import siteConfig from "@/config";
import { ReactNode } from "react";

interface ErrorLayoutProps {
  children: ReactNode;
}

export default function ErrorLayout({ children }: ErrorLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title={siteConfig.title} />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
