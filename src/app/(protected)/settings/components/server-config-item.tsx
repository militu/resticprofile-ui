"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ActionResponse, ServerConfig } from "@/types";
import { DuplicateSlugError } from "@/types/errors";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditServerConfigModal from "./edit-modal";
import { ServerConfigFormData } from "./schemas";

interface ServerConfigItemProps {
  serverConfig: ServerConfig;
  onUpdate: (
    id: string,
    config: ServerConfigFormData
  ) => Promise<ActionResponse<ServerConfig>>;
  onDelete: (id: string) => Promise<ActionResponse<void>>;
}

export default function ServerConfigItem({
  serverConfig,
  onUpdate,
  onDelete,
}: ServerConfigItemProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [editingConfig, setEditingConfig] = useState<ServerConfig | null>(null);

  const handleUpdate = async (config: ServerConfigFormData) => {
    const updateResponse = await onUpdate(serverConfig.id, config);
    if (!updateResponse.success) {
      let errorMessage: string;

      if (updateResponse.errorName === DuplicateSlugError.name) {
        errorMessage =
          "A config with this name already exists. Please choose a different name.";
      } else {
        errorMessage = `An error occurred while updating the server config: ${updateResponse.errorName}: ${updateResponse.error}`;
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
    setEditingConfig(null);
    router.refresh();

    toast({
      title: "Server configuration updated successfully!",
      description: "Your changes have been saved.",
    });
  };

  const handleEdit = (config: ServerConfig) => {
    setEditingConfig(config);
  };

  const handleDelete = async (id: string) => {
    const deleteResponse = await onDelete(id);
    if (!deleteResponse.success) {
      const errorMessage = `An error occurred while deleting the server config: ${deleteResponse.errorName}: ${deleteResponse.error}`;
      console.error(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    // Success case
    router.refresh();
    toast({
      title: "Server configuration deleted successfully!",
      description: "The configuration has been removed.",
    });
  };

  return (
    <>
      <Card className="shadow-sm m-3">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold">{serverConfig.name}</h3>
            <p className="text-sm text-gray-500">
              {serverConfig.host}:{serverConfig.port} • {serverConfig.workDir}
            </p>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleEdit(serverConfig)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the server configuration.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(serverConfig.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
      {editingConfig && (
        <EditServerConfigModal
          config={editingConfig}
          onClose={() => setEditingConfig(null)}
          onSave={handleUpdate}
        />
      )}
    </>
  );
}
