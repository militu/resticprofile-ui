import { z } from "zod";

export const serverConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  workDir: z.string().min(1, "Work directory is required"),
  host: z.string().min(1, "Host is required"),
  port: z.number().min(1, "Port is required"),
  username: z.string().min(1, "Username is required"),
  privateKeyPath: z.string().min(1, "Private key path is required"),
});

export type ServerConfigFormData = z.infer<typeof serverConfigSchema>;
