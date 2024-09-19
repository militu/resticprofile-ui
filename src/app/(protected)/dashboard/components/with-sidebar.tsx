import { fetchProfiles } from "@/actions/fetchProfiles";
import { ServerConfig } from "@/types";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import AlertMessage from "./alert-message";
import Sidebar from "./sidebar";

interface WithSidebarProps {
  serverConfig: ServerConfig;
  profileName?: string;
  children: ReactNode;
}

export default async function WithSidebar({
  serverConfig,
  profileName,
  children,
}: WithSidebarProps) {
  const profilesResult = await fetchProfiles(serverConfig);

  const handleProfileSelect = async (selectedProfile: string) => {
    "use server";
    redirect(`/dashboard/${serverConfig.slug}/${selectedProfile}`);
  };

  return (
    <>
      <Sidebar
        profiles={profilesResult.data || []}
        handleProfileSelect={handleProfileSelect}
        selectedProfile={profileName}
      />
      {!profilesResult.success || !profilesResult.data ? (
        <div className="flex-grow">
          <AlertMessage
            type="error"
            message={
              profilesResult.error ||
              "An unexpected error occurred while fetching profiles."
            }
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-8">{children}</div>
      )}
    </>
  );
}
