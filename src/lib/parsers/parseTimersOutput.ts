import { parseJsonOutput } from "./parseJsonOutput";

export interface TimerInfo {
  next: number | null;
  left: number | null;
  last: number | null;
  passed: number | null;
  unit: string | null;
  activates: string | null;
}

export function parseTimersOutput(result: string): TimerInfo | null {
  const data = parseJsonOutput(result);
  if (!Array.isArray(data)) {
    return null;
  }
  const mappedData = data.map(
    (item: any): TimerInfo => ({
      next: item.next != null ? Number(item.next) : null,
      left: item.left != null ? Number(item.left) : null,
      last: item.last != null ? Number(item.last) : null,
      passed: item.passed != null ? Number(item.passed) : null,
      unit: item.unit != null ? String(item.unit) : null,
      activates: item.activates != null ? String(item.activates) : null,
    })
  );
  return mappedData[0];
}
