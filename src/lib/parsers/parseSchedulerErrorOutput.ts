import { parseJsonOutput } from "./parseJsonOutput";

export interface SchedulerError {
  unit: string | null;
  message: string | null;
  hostname: string | null;
  timestamp: number | null;
}

export function parseSchedulerErrorOutput(result: string): SchedulerError[] {
  if (!result) {
    return [];
  }
  const data = parseJsonOutput(result);
  if (!Array.isArray(data)) {
    return [];
  }

  return data.reverse().map(
    (item: any): SchedulerError => ({
      unit: item.USER_UNIT != null ? String(item.USER_UNIT) : null,
      message: item.MESSAGE != null ? String(item.MESSAGE) : null,
      hostname: item._HOSTNAME != null ? String(item._HOSTNAME) : null,
      timestamp:
        item.__REALTIME_TIMESTAMP != null
          ? Number(item.__REALTIME_TIMESTAMP)
          : null,
    })
  );
}
