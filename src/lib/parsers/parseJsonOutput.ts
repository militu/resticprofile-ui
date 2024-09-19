import { ParseError } from "@/types/errors";

export function parseJsonOutput(output: string): any {
  try {
    // First, try to parse the entire output as a single JSON object
    const result = JSON.parse(output);
    return JSON.parse(output);
  } catch (initialError) {
    // If parsing the entire output fails, fall back to the original method
    try {
      // Regular expression to match individual JSON objects or arrays
      const jsonRegex = /(\{[^{}]*\}|\[[^\[\]]*\])/g;
      const matches = output.match(jsonRegex);
      if (!matches) {
        throw new ParseError(
          "No JSON objects or arrays found in the output",
          output
        );
      }

      const parsedData = matches
        .map((jsonString) => {
          try {
            return JSON.parse(jsonString);
          } catch (error) {
            throw new ParseError(
              "Failed to parse any valid JSON objects or arrays",
              output
            );
          }
        })
        .filter((item) => item !== null);

      if (parsedData.length === 0) {
        throw new ParseError(
          "Failed to parse any valid JSON objects or arrays",
          output
        );
      }
      const result = parsedData.length === 1 ? parsedData[0] : parsedData;
      return result;
    } catch (error) {
      if (error instanceof ParseError) {
        throw error;
      }
      throw new ParseError(
        `Failed to parse JSON: ${
          error instanceof Error ? error.message : String(error)
        }`,
        output
      );
    }
  }
}
