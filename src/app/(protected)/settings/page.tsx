import {
  addServerConfig,
  deleteServerConfig,
  getServerConfigs,
  updateServerConfig,
} from "@/actions/serverConfig";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AlertMessage from "../dashboard/components/alert-message";
import AddServerConfigButton from "./components/add-server-config-button";
import ServerConfigList from "./components/server-config-list";

export default async function ServerSettingsPage() {
  const serverConfigs = await getServerConfigs();

  if (!serverConfigs.success) {
    return (
      <div className="container mx-auto p-5">
        <AlertMessage
          type="error"
          message={
            serverConfigs.error ||
            "An error occurred while fetching server configurations."
          }
        />
      </div>
    );
  }

  const hasConfigs = serverConfigs.data && serverConfigs.data.length > 0;

  return (
    <div className="container mx-auto p-5 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold">Server Settings</h1>
        </div>
        <AddServerConfigButton onAddConfig={addServerConfig} />
      </div>
      {hasConfigs && (
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      )}
      {!hasConfigs ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="mb-4">Welcome to resticprofile-ui</CardTitle>
            <CardDescription>
              Let&apos;s get you started with your first server configuration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To use the dashboard and manage your backups, you&apos;ll need to
              add at least one server configuration. This will allow
              resticprofile-ui to connect to your server and manage your backup
              profiles.
            </p>
            <p>
              Click the &quot;Add Server Config&quot; button above to set up
              your first server. Once you&apos;ve added a configuration,
              you&apos;ll be able to access the dashboard and start managing
              your backups.
            </p>
          </CardContent>
        </Card>
      ) : (
        serverConfigs.data && (
          <ServerConfigList
            serverConfigs={serverConfigs.data}
            onUpdateConfig={updateServerConfig}
            onDeleteConfig={deleteServerConfig}
          />
        )
      )}
    </div>
  );
}
