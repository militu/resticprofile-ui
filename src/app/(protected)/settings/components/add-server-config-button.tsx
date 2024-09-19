"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ActionResponse, ServerConfig } from "@/types";
import { DuplicateSlugError } from "@/types/errors";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditServerConfigModal from "./edit-modal";
import { ServerConfigFormData } from "./schemas";

interface AddServerConfigButtonProps {
  onAddConfig: (
    data: ServerConfigFormData
  ) => Promise<ActionResponse<ServerConfig>>;
}

export default function AddServerConfigButton({
  onAddConfig,
}: AddServerConfigButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = async (data: ServerConfigFormData) => {
    const addConfigResponse = await onAddConfig(data);
    if (!addConfigResponse.success) {
      let errorMessage: string;

      if (addConfigResponse.errorName === DuplicateSlugError.name) {
        errorMessage =
          "A config with this name already exists. Please choose a different name.";
      } else {
        errorMessage = `An error occurred while adding the server config: ${addConfigResponse.errorName}: ${addConfigResponse.error}`;
      }

      console.error(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return; // Early return on error
    }

    // Success case
    setIsModalOpen(false);
    router.refresh();

    toast({
      title: "Server configuration added successfully!",
      description: "You can now access the dashboard to manage your backups.",
      action: (
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      ),
    });
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Server Config
      </Button>
      {isModalOpen && (
        <EditServerConfigModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
