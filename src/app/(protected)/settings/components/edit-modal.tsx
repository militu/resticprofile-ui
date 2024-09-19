import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServerConfig } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ServerConfigFormData, serverConfigSchema } from "./schemas";

interface EditServerConfigModalProps {
  config?: ServerConfig;
  onClose: () => void;
  onSave: (config: ServerConfigFormData, id?: string) => void;
}

export default function EditServerConfigModal({
  config,
  onClose,
  onSave,
}: EditServerConfigModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServerConfigFormData>({
    resolver: zodResolver(serverConfigSchema),
    defaultValues: config || {
      name: "",
      workDir: "",
      host: "",
      port: 22,
      username: "",
      privateKeyPath: "",
    },
  });

  const onSubmit = async (data: ServerConfigFormData) => {
    setIsSubmitting(true);
    try {
      onSave(data, config?.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size={"large"}>
        <DialogHeader className="pb-10">
          <DialogTitle>
            {config
              ? "Edit Server Configuration"
              : "Add New Server Configuration"}
          </DialogTitle>
          <DialogDescription className="italic text-sm text-primary">
            All fields are required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    A <span className="text-warning font-bold">unique</span>{" "}
                    friendly name to identify this server configuration.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workDir"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Directory</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The directory on the server where operations will be
                    performed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The IP address or domain name of the server.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    The SSH port number (default is 22).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The username for SSH authentication.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privateKeyPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Private Key Path</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="/home/node/.ssh/your-key" />
                  </FormControl>
                  <FormDescription>
                    The full path to your SSH private key file on the local
                    machine.
                    <div className="mt-2 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-200">
                      <p className="flex items-center">
                        <InfoCircledIcon className="mr-2" /> On docker, path
                        must begin with{" "}
                        <code className="mx-1 px-1 py-0.5 bg-yellow-200 dark:bg-yellow-800 rounded-sm font-mono text-sm">
                          /home/node/.ssh
                        </code>
                      </p>
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
