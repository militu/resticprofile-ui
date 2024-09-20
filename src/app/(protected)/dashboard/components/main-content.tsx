import { checkProfileExists } from "@/actions/checkProfileExits";
import { checkSnapshotExits } from "@/actions/checkSnapshotExits";
import { getServerConfigBySlug } from "@/actions/serverConfig";
import { ServerConfig } from "@/types";
import { ResourceNotFoundError } from "@/types/errors";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import AlertMessage from "./alert-message";
import { DataTableSkeleton } from "./common/data-table-skeleton";
import renderErrorCard from "./error-cards";
import { ProfilePage } from "./profile-page";
import { ProfilePageSkeleton } from "./profile-page/skeleton";
import renderProfileSelectionPrompt from "./profile-selection-prompt";
import { SidebarSkeleton } from "./sidebar/sidebar-skeleton";
import SnapshotFiles from "./snapshot-files.tsx";
import WithSidebar from "./with-sidebar";

interface MainContentPageProps {
  configSlug: string;
  profileName?: string;
  snapshotId?: string;
}

interface ContentParams {
  serverConfig: ServerConfig;
  profileName?: string;
  snapshotId?: string;
}

interface ContentRenderer {
  render(): Promise<ReactNode>;
}

class ProfileSelectionRenderer implements ContentRenderer {
  async render() {
    return renderProfileSelectionPrompt();
  }
}

class ProfilePageRenderer implements ContentRenderer {
  constructor(private params: ContentParams) {}

  async render() {
    return (
      <Suspense fallback={<ProfilePageSkeleton />}>
        <ProfilePage
          serverConfig={this.params.serverConfig}
          profileName={this.params.profileName!}
        />
      </Suspense>
    );
  }
}

class SnapshotFilesRenderer implements ContentRenderer {
  constructor(private params: ContentParams) {}

  async render() {
    return (
      <>
        <BackToProfileLink
          serverConfig={this.params.serverConfig}
          profileName={this.params.profileName!}
        />
        <Suspense fallback={<DataTableSkeleton />}>
          <SnapshotFiles
            serverConfig={this.params.serverConfig}
            profileName={this.params.profileName!}
            snapshotId={this.params.snapshotId!}
          />
        </Suspense>
      </>
    );
  }
}

const BackToProfileLink: React.FC<{
  serverConfig: ServerConfig;
  profileName: string;
}> = ({ serverConfig, profileName }) => (
  <Link
    href={`/dashboard/${serverConfig.slug}/${profileName}`}
    className="inline-flex items-center text-sm pt-3 pb-8 font-medium text-foreground/50 hover:text-foreground/80 hover:underline transition-colors duration-150"
  >
    <ChevronLeft className="w-5 h-5 mr-2" /> Back to profile page
  </Link>
);

async function handleResourceNotFound(
  response: { statusCode?: number; error?: string },
  title: string,
  message: string,
  instruction: React.ReactNode
) {
  if (response.statusCode === ResourceNotFoundError.statusCode) {
    return renderErrorCard(title, message, instruction);
  }
  return (
    <AlertMessage
      type="error"
      message={response.error || "An error occurred while fetching data"}
    />
  );
}

function createContentRenderer(params: ContentParams): ContentRenderer {
  if (!params.profileName) {
    return new ProfileSelectionRenderer();
  }
  if (!params.snapshotId) {
    return new ProfilePageRenderer(params);
  }
  return new SnapshotFilesRenderer(params);
}

async function renderContent(params: ContentParams): Promise<ReactNode> {
  const renderer = createContentRenderer(params);
  return renderer.render();
}

export default async function MainContent({
  configSlug,
  profileName,
  snapshotId,
}: MainContentPageProps) {
  const serverConfigResponse = await getServerConfigBySlug(configSlug);

  if (!serverConfigResponse.success || !serverConfigResponse.data) {
    return handleResourceNotFound(
      serverConfigResponse,
      `The requested server config "${configSlug}" doesn't exist.`,
      "Config not found",
      <p>Please select a valid server from the dropdown.</p>
    );
  }

  const serverConfig = serverConfigResponse.data as ServerConfig;

  if (profileName) {
    const profileExistsResponse = await checkProfileExists(
      serverConfig,
      profileName
    );
    if (!profileExistsResponse.success || !profileExistsResponse.data) {
      return (
        <WithSidebar serverConfig={serverConfig} profileName={profileName}>
          {handleResourceNotFound(
            profileExistsResponse,
            `The requested profile name "${profileName}" doesn't exist.`,
            "Profile not found",
            <p>Please select a valid profile from the sidebar.</p>
          )}
        </WithSidebar>
      );
    }
  }

  if (snapshotId && profileName) {
    const snapshotExistsResponse = await checkSnapshotExits(
      serverConfig,
      profileName,
      snapshotId
    );
    if (!snapshotExistsResponse.success || !snapshotExistsResponse.data) {
      return (
        <WithSidebar serverConfig={serverConfig} profileName={profileName}>
          {handleResourceNotFound(
            snapshotExistsResponse,
            `The requested snapshot "${snapshotId}" doesn't exist.`,
            "Snapshot not found",
            <div className="space-y-4">
              <p>
                The snapshot you&apos;re looking for couldn&apos;t be found.
                Please select a valid snapshot from the previous page.
              </p>
              <BackToProfileLink
                serverConfig={serverConfig}
                profileName={profileName}
              />
            </div>
          )}
        </WithSidebar>
      );
    }
  }

  const contentParams: ContentParams = {
    serverConfig,
    profileName,
    snapshotId,
  };

  return (
    <Suspense fallback={<SidebarSkeleton />}>
      <WithSidebar serverConfig={serverConfig} profileName={profileName}>
        {await renderContent(contentParams)}
      </WithSidebar>
    </Suspense>
  );
}
