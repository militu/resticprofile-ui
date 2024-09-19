import { SSHCommand } from "@/lib/ssh";
import { ServerConfig } from "@/types";
import { BaseError, SSHCommandExecutionError } from "@/types/errors";
import { unstable_cache } from "next/cache";

export const COMMAND_EXECUTION_TAG = "command-execution";

// Interface for command execution
interface ISSHCommandExecutor {
  execute(command: string): Promise<string>;
}

// Parameter object for SSH command configuration
export interface SSHCommandConfig {
  serverConfig: ServerConfig;
}

// SSH Command Executor
export class SSHCommandExecutor implements ISSHCommandExecutor {
  protected serverConfig: ServerConfig;

  constructor({ serverConfig }: SSHCommandConfig) {
    this.serverConfig = serverConfig;
  }

  async execute(command: string): Promise<string> {
    try {
      const result = await SSHCommand(command, this.serverConfig);
      return result;
    } catch (error) {
      throw this.handleExecutionError(error);
    }
  }

  private handleExecutionError(error: unknown): Error {
    if (error instanceof BaseError) {
      return error;
    }
    return new SSHCommandExecutionError(
      1,
      error instanceof Error ? error.message : String(error),
      ""
    );
  }
}

// Parameter object for cached command configuration
export interface SSHCachedCommandConfig<T> {
  command: string;
  parser: (output: string) => T;
  cacheKey: string[];
  tags?: string[];
  revalidate?: number;
}

// Cached Command Executor
export class SSHCachedCommandExecutor extends SSHCommandExecutor {
  constructor(
    config: SSHCommandConfig,
    private defaultRevalidationTime: number = 3600
  ) {
    super(config);
  }

  async executeWithCache<T>({
    command,
    parser,
    cacheKey,
    tags = [],
    revalidate = this.defaultRevalidationTime,
  }: SSHCachedCommandConfig<T>): Promise<T> {
    const cacheFunction = unstable_cache(
      async (): Promise<T> => {
        const output = await this.execute(command);
        return parser(output);
      },
      cacheKey,
      { tags, revalidate }
    );

    return cacheFunction();
  }
}
