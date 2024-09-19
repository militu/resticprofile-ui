import { ResourceNotFoundError } from "@/types/errors";
import {
  parseProfileConfigOutput,
  ProfileConfig,
} from "./parsers/parseProfileConfigOutput";
import { parseProfilesOutput, Profile } from "./parsers/parseProfilesOutput";
import {
  parseSnapshotFilesOutput,
  SnapshotFile,
} from "./parsers/parseSnapshotFilesOutput";
import { parseSnapshotsOutput, Snapshot } from "./parsers/parseSnapshotsOutput";
import {
  COMMAND_EXECUTION_TAG,
  SSHCachedCommandExecutor,
  SSHCommandConfig,
} from "./sshExecutor";

export class ResticprofileCommandExecutor extends SSHCachedCommandExecutor {
  constructor(
    config: SSHCommandConfig,
    defaultRevalidationTime: number = 3600
  ) {
    super(config, defaultRevalidationTime);
  }

  private buildResticprofileCommand(resticprofileCommand: string): string {
    return `cd ${this.serverConfig.workDir}; ${resticprofileCommand}`;
  }

  async checkProfileExists(profileName: string): Promise<void> {
    const profiles = await this.fetchProfiles();
    const exists = profiles.some((profile) => profile.name === profileName);
    if (!exists) {
      throw new ResourceNotFoundError("Profile", profileName);
    }
  }

  async checkSnapshotExists(
    profileName: string,
    snapshotId: string
  ): Promise<void> {
    await this.checkProfileExists(profileName);
    const snapshots = await this.fetchSnapshots(profileName);
    const exists = snapshots.some(
      (snapshot: any) => snapshot.id === snapshotId
    );
    if (!exists) {
      throw new ResourceNotFoundError("Snapshot", snapshotId);
    }
  }

  async fetchProfiles(): Promise<Profile[]> {
    return this.executeWithCache({
      command: this.buildResticprofileCommand("resticprofile profiles"),
      parser: parseProfilesOutput,
      cacheKey: ["fetchProfiles", this.serverConfig.slug],
      tags: [COMMAND_EXECUTION_TAG],
    });
  }

  async fetchProfileConfig(profileName: string): Promise<ProfileConfig> {
    await this.checkProfileExists(profileName);

    return this.executeWithCache({
      command: this.buildResticprofileCommand(
        `resticprofile -n ${profileName} show --json`
      ),
      parser: parseProfileConfigOutput,
      cacheKey: ["fetchProfileConfig", this.serverConfig.slug, profileName],
      tags: [COMMAND_EXECUTION_TAG],
    });
  }

  async fetchSnapshots(profileName: string): Promise<Snapshot[]> {
    await this.checkProfileExists(profileName);

    return this.executeWithCache({
      command: this.buildResticprofileCommand(
        `resticprofile -n ${profileName} snapshots --json`
      ),
      parser: parseSnapshotsOutput,
      cacheKey: ["fetchSnapshots", this.serverConfig.slug, profileName],
      tags: [COMMAND_EXECUTION_TAG],
    });
  }

  async fetchSnapshotFiles(
    profileName: string,
    snapshotId: string
  ): Promise<SnapshotFile[]> {
    await this.checkSnapshotExists(profileName, snapshotId);

    return this.executeWithCache({
      command: this.buildResticprofileCommand(
        `resticprofile -n ${profileName} ls ${snapshotId} --long --recursive --json`
      ),
      parser: parseSnapshotFilesOutput,
      cacheKey: [
        "fetchSnapshotFiles",
        this.serverConfig.slug,
        profileName,
        snapshotId,
      ],
      tags: [COMMAND_EXECUTION_TAG],
    });
  }
}
