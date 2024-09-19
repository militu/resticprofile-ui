import { ParseError } from "@/types/errors";

export interface ProfileConfig {
  config: string;
}

export function parseProfileConfigOutput(output: string): ProfileConfig {
  if (!output || typeof output !== "string") {
    throw new ParseError(
      "Failed to parse ProfileConfig: Invalid input",
      output
    );
  }
  return { config: output };
}
