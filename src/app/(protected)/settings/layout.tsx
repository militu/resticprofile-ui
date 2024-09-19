import siteConfig from "@/config";
import Header from "../components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title={siteConfig.title} />
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
