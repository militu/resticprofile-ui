import { ServerConfig } from "@/types";
import { SSHCommandExecutionError, SSHError } from "@/types/errors";
import fs from "fs/promises";
import { Client, ClientChannel } from "ssh2";

interface ISSHExecutor {
  execute(command: string): Promise<string>;
}

class SSHConfig {
  constructor(private config: ServerConfig) {}

  async getPrivateKey(): Promise<string> {
    if (!this.config.privateKeyPath) {
      throw new SSHError(
        "Private key path is required for SSH connections",
        "MISSING_PRIVATE_KEY"
      );
    }

    try {
      return await fs.readFile(this.config.privateKeyPath, "utf8");
    } catch (error) {
      throw new SSHError(
        `Failed to read private key: ${
          error instanceof Error ? error.message : String(error)
        }`,
        "PRIVATE_KEY_READ_ERROR"
      );
    }
  }

  getConnectionConfig(privateKey: string): object {
    return {
      ...this.config,
      privateKey,
    };
  }
}

class SSHExecutorFactory {
  static async create(
    serverConfig: ServerConfig,
    timeout: number = 30000
  ): Promise<ISSHExecutor> {
    const config = new SSHConfig(serverConfig);
    const privateKey = await config.getPrivateKey();
    return new SSHExecutor(config, privateKey, timeout);
  }
}

class SSHExecutor implements ISSHExecutor {
  private conn: Client;

  constructor(
    private config: SSHConfig,
    private privateKey: string,
    private timeout: number
  ) {
    this.conn = new Client();
  }

  async execute(command: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const timeoutId = this.setupTimeout(reject);

      this.conn
        .on("ready", () =>
          this.handleReady(command, timeoutId, resolve, reject)
        )
        .on("error", (err) =>
          this.handleConnectionError(err, timeoutId, reject)
        )
        .connect(this.config.getConnectionConfig(this.privateKey));
    });
  }

  private setupTimeout(reject: (reason: any) => void): NodeJS.Timeout {
    return setTimeout(() => {
      this.conn.end();
      reject(
        new SSHError(`Command timed out after ${this.timeout}ms`, "TIMEOUT")
      );
    }, this.timeout);
  }

  private handleReady(
    command: string,
    timeoutId: NodeJS.Timeout,
    resolve: (result: string) => void,
    reject: (reason: any) => void
  ): void {
    this.conn.exec(command, (err, stream) => {
      if (err) {
        this.handleExecError(err, timeoutId, reject);
        return;
      }
      this.handleStream(stream, timeoutId, resolve, reject);
    });
  }

  private handleExecError(
    err: Error,
    timeoutId: NodeJS.Timeout,
    reject: (reason: any) => void
  ): void {
    clearTimeout(timeoutId);
    this.conn.end();
    reject(
      new SSHError(`SSH execution error: ${err.message}`, "EXECUTION_ERROR")
    );
  }

  private handleConnectionError(
    err: Error,
    timeoutId: NodeJS.Timeout,
    reject: (reason: any) => void
  ): void {
    clearTimeout(timeoutId);
    reject(
      new SSHError(`SSH connection error: ${err.message}`, "CONNECTION_ERROR")
    );
  }

  private handleStream(
    stream: ClientChannel,
    timeoutId: NodeJS.Timeout,
    resolve: (result: string) => void,
    reject: (reason: any) => void
  ): void {
    let output = "";
    let errorOutput = "";

    stream
      .on("close", (code: number) => {
        clearTimeout(timeoutId);
        this.conn.end();
        if (code !== 0) {
          reject(new SSHCommandExecutionError(code, errorOutput, output));
        } else {
          resolve(output);
        }
      })
      .on("data", (data: Buffer) => {
        output += data.toString();
      })
      .stderr.on("data", (data: Buffer) => {
        errorOutput += data.toString();
      });
  }
}

export async function SSHCommand(
  command: string,
  serverConfig: ServerConfig,
  options: { timeout?: number } = {}
): Promise<string> {
  const executor = await SSHExecutorFactory.create(
    serverConfig,
    options.timeout
  );
  return executor.execute(command);
}
