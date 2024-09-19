import Header from "@/app/(protected)/components/header";
import { RefreshButton } from "@/app/(protected)/components/refresh-button";
import ServerConfigDropdown from "@/app/(protected)/components/server-config-dropdown";
import siteConfig from "@/config";
import { ServerConfig } from "@/types";
import { ReactNode } from "react";

interface NormalLayoutProps {
  children: ReactNode;
  serverConfigs: ServerConfig[];
  configSlug: string;
}

export default function NormalLayout({
  children,
  serverConfigs,
  configSlug,
}: NormalLayoutProps) {
  const selectedConfigId = serverConfigs.find(
    (config) => config.slug === configSlug
  )?.id;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={siteConfig.title}>
        <div className="flex items-center space-x-4">
          <ServerConfigDropdown
            serverConfigs={serverConfigs}
            selectedConfigId={selectedConfigId}
          />
          <RefreshButton />
        </div>
      </Header>
      <main className="flex flex-1">{children}</main>
    </div>
  );
}
