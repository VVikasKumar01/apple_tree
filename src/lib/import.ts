import * as XLSX from "xlsx";

/** Parse CSV/XLSX/XLS/JSON files into an array of row objects. */
export async function parseDataFile(file: File): Promise<Record<string, any>[]> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".json")) {
    const text = await file.text();
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [data];
  }
  // xlsx handles csv, xlsx, xls, ods, etc.
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, { defval: null, raw: false });
}

/** Map arbitrary header keys to canonical keys via case-insensitive aliases. */
export function normalizeRow(row: Record<string, any>, aliases: Record<string, string[]>) {
  const out: Record<string, any> = {};
  const lower: Record<string, any> = {};
  for (const k of Object.keys(row)) lower[k.toLowerCase().trim().replace(/[\s_-]+/g, " ")] = row[k];
  for (const [canonical, alts] of Object.entries(aliases)) {
    for (const a of [canonical, ...alts]) {
      const key = a.toLowerCase().trim().replace(/[\s_-]+/g, " ");
      if (lower[key] !== undefined && lower[key] !== null && lower[key] !== "") {
        out[canonical] = lower[key];
        break;
      }
    }
  }
  return out;
}
