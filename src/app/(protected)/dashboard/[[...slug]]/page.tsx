import { notFound, redirect } from "next/navigation";

import { getServerConfigs } from "@/actions/serverConfig";
import { dashboardRoute } from "@/routes";
import AlertMessage from "../components/alert-message";
import ErrorLayout from "../components/layouts/error-layout";
import NormalLayout from "../components/layouts/normal-layout";
import MainContent from "../components/main-content";

interface DashboardPageProps {
  params: {
    slug?: string[];
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const [configSlug, profileName, snapshotId] = params.slug || [];

  const serverConfigsResponse = await getServerConfigs();

  if (!serverConfigsResponse.success || !serverConfigsResponse.data) {
    return (
      <ErrorLayout>
        <AlertMessage
          type="error"
          message={
            serverConfigsResponse.error ||
            "An unexpected error occurred while fetching server configurations"
          }
        />
      </ErrorLayout>
    );
  }

  if (!params.slug || params.slug.length === 0) {
    if (serverConfigsResponse.data.length === 0) {
      redirect("/settings");
    } else {
      redirect(`${dashboardRoute}/${serverConfigsResponse.data[0].slug}`);
    }
  }

  if (params.slug.length > 3) {
    notFound();
  }

  return (
    <NormalLayout
      serverConfigs={serverConfigsResponse.data}
      configSlug={configSlug}
    >
      <MainContent
        configSlug={configSlug}
        profileName={profileName}
        snapshotId={snapshotId}
      />
    </NormalLayout>
  );
}
