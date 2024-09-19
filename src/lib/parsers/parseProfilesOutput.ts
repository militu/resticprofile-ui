import { ParseError } from "@/types/errors";

export interface Profile {
  name: string;
}

export function parseProfilesOutput(output: string): Profile[] {
  // Check if the output is empty or not a string
  if (!output || typeof output !== "string") {
    throw new ParseError("Failed to parse Profiles: Invalid input", output);
  }

  // Look for the "Profiles available" section
  const profilesMatch = output.match(/Profiles available[\s\S]*?(?:\n\n|$)/);
  if (!profilesMatch) {
    throw new ParseError(
      "Failed to parse Profiles: 'Profiles available' section not found",
      output
    );
  }

  // Extract profile names
  const profileLines = profilesMatch[0].split("\n").slice(1); // Skip the "Profiles available" line
  const profiles: Profile[] = [];

  for (const line of profileLines) {
    const match = line.match(/^\s*(\w+):/);
    if (match && match[1]) {
      profiles.push({ name: match[1] });
    }
  }

  return profiles;
}
