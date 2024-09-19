import { ActionResponse, ServerConfig } from "@/types";
import { ServerConfigFormData } from "./schemas";
import ServerConfigItem from "./server-config-item";

interface ServerConfigListProps {
  serverConfigs: ServerConfig[];
  onUpdateConfig: (
    id: string,
    data: ServerConfigFormData
  ) => Promise<ActionResponse<ServerConfig>>;
  onDeleteConfig: (id: string) => Promise<ActionResponse<void>>;
}

export default function ServerConfigList({
  serverConfigs,
  onUpdateConfig,
  onDeleteConfig,
}: ServerConfigListProps) {
  return (
    <div>
      {serverConfigs.map((config) => (
        <ServerConfigItem
          key={config.id}
          serverConfig={config}
          onUpdate={onUpdateConfig}
          onDelete={onDeleteConfig}
        />
      ))}
    </div>
  );
}
