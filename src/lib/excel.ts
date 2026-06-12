import * as XLSX from "xlsx";

export function exportToExcel(rows: Record<string, unknown>[], filename: string, sheet = "Sheet1") {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheet);
  XLSX.writeFile(wb, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
}

export function exportMultiSheet(sheets: { name: string; rows: Record<string, unknown>[] }[], filename: string) {
  const wb = XLSX.utils.book_new();
  for (const s of sheets) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(s.rows), s.name);
  }
  XLSX.writeFile(wb, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
}
