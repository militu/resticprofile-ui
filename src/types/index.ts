export interface ServerConfig {
  id: string;
  name: string;
  slug: string;
  workDir: string;
  host: string;
  port: number;
  username: string;
  privateKeyPath: string;
}

export type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  errorName?: string;
  errorStack?: string;
  statusCode?: number;
};
