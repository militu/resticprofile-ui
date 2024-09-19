import { parseJsonOutput } from "./parseJsonOutput";

export interface UnitInfo {
  unit: string | null;
  load: string | null;
  active: string | null;
  sub: string | null;
  description: string | null;
}

export function parseUnitsOutput(result: string): UnitInfo | null {
  const data = parseJsonOutput(result);
  if (!Array.isArray(data)) {
    return null;
  }

  const mappedData = data.map(
    (item: any): UnitInfo => ({
      unit: item.next != null ? String(item.next) : null,
      load: item.left != null ? String(item.load) : null,
      active: item.last != null ? String(item.active) : null,
      sub: item.passed != null ? String(item.sub) : null,
      description: item.unit != null ? String(item.description) : null,
    })
  );
  return mappedData[0];
}
