"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServerConfig } from "@/types";
import { useRouter } from "next/navigation";

type ServerConfigDropdownProps = {
  serverConfigs: ServerConfig[];
  selectedConfigId: string | undefined;
};

export default function ServerConfigDropdown({
  serverConfigs,
  selectedConfigId,
}: ServerConfigDropdownProps) {
  const router = useRouter();

  const handleSelectChange = (configId: string) => {
    const newConfig = serverConfigs.find((config) => config.id === configId);
    if (newConfig) {
      router.push(`/dashboard/${newConfig.slug}`);
    }
  };

  return (
    <Select
      value={selectedConfigId}
      onValueChange={handleSelectChange}
      disabled={serverConfigs.length === 0}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a server" />
      </SelectTrigger>
      <SelectContent>
        {serverConfigs.map((config) => (
          <SelectItem key={config.id} value={config.id}>
            {config.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
