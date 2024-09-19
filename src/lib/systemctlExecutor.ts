import {
  parseSchedulerErrorOutput,
  SchedulerError,
} from "./parsers/parseSchedulerErrorOutput";
import { parseTimersOutput, TimerInfo } from "./parsers/parseTimersOutput";
import { parseUnitsOutput, UnitInfo } from "./parsers/parseUnitsOutput";
import {
  COMMAND_EXECUTION_TAG,
  SSHCachedCommandExecutor,
  SSHCommandConfig,
} from "./sshExecutor";

export interface SchedulerStatus {
  timers: TimerInfo | null;
  units: UnitInfo | null;
  errors: SchedulerError[];
}

export class SystemctlCommandExecutor extends SSHCachedCommandExecutor {
  constructor(
    config: SSHCommandConfig,
    defaultRevalidationTime: number = 3600
  ) {
    super(config, defaultRevalidationTime);
  }

  private buildSudoPrefix = `
  if [ "$EUID" -eq 0 ]; then
    SUDO="sudo "
  else
    SUDO=""
  fi
  
  if [ "$EUID" -ne 0 ]; then
    USER_FLAG="--user"
  else
    USER_FLAG=""
  fi
  `;

  private buildSystemctlCommand(
    type: string,
    action: string,
    profileName: string
  ): string {
    return `${this.buildSudoPrefix}
    $SUDO systemctl $USER_FLAG ${action} resticprofile-${type}@profile-${profileName}.timer --all --output=json
    `;
  }

  private buildJournalctlCommand(type: string, profileName: string): string {
    return `${this.buildSudoPrefix}
    $SUDO journalctl $USER_FLAG -u resticprofile-${type}@profile-${profileName} -p warning..err --since "1 month ago" --no-pager --output=json
    `;
  }

  async fetchSchedulerStatus(
    profileName: string,
    type: string
  ): Promise<SchedulerStatus> {
    try {
      const listTimersCommand = this.buildSystemctlCommand(
        type,
        "list-timers",
        profileName
      );
      const statusCommand = this.buildSystemctlCommand(
        type,
        "list-units",
        profileName
      );
      const errorLogsCommand = this.buildJournalctlCommand(type, profileName);

      const [timerResult, unitResult, listErrorResult] = await Promise.all([
        this.executeWithCache({
          command: listTimersCommand,
          parser: parseTimersOutput,
          cacheKey: ["list-timers", this.serverConfig.slug, profileName, type],
          tags: [COMMAND_EXECUTION_TAG],
        }),
        this.executeWithCache({
          command: statusCommand,
          parser: parseUnitsOutput,
          cacheKey: ["list-units", this.serverConfig.slug, profileName, type],
          tags: [COMMAND_EXECUTION_TAG],
        }),
        this.executeWithCache({
          command: errorLogsCommand,
          parser: parseSchedulerErrorOutput,
          cacheKey: ["list-errors", this.serverConfig.slug, profileName, type],
          tags: [COMMAND_EXECUTION_TAG],
        }),
      ]);

      return {
        timers: timerResult,
        units: unitResult,
        errors: listErrorResult,
      };
    } catch (err) {
      throw err;
    }
  }
}
