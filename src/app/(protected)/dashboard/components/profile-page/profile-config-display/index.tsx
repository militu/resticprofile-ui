import { fetchProfileConfig } from "@/actions/fetchProfileConfig";
import { ServerConfig } from "@/types";
import ProfileConfigDisplayAlert from "./alert";
import ProfileConfigDisplayClient from "./client";

interface ProfileConfigDisplayProps {
  serverConfig: ServerConfig;
  profileName: string;
}

export default async function ProfileConfigDisplay({
  serverConfig,
  profileName,
}: ProfileConfigDisplayProps) {
  const profileConfigResponse = await fetchProfileConfig(
    serverConfig,
    profileName
  );

  if (!profileConfigResponse.success) {
    return (
      <ProfileConfigDisplayAlert
        message={profileConfigResponse.error || "Unexpected error"}
        type="error"
      />
    );
  }
  if (!profileConfigResponse.data) {
    return (
      <ProfileConfigDisplayAlert
        message="No profile configuration available"
        type="warning"
      />
    );
  }
  return (
    <ProfileConfigDisplayClient profileConfig={profileConfigResponse.data} />
  );
}
