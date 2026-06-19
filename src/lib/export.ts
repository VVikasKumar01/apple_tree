import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

// Helper to convert Blob to base64 Data URL
const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export async function downloadOrShareFile(blob: Blob, filename: string) {
  // Check if we are on a mobile device to prioritize sharing
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile && navigator.canShare) {
    try {
      const file = new File([blob], filename, { type: blob.type });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: filename,
        });
        return; // Successfully shared/saved
      }
    } catch (error) {
      console.error("Error sharing file:", error);
      // Fall through to traditional download if share is cancelled or fails
    }
  }

  try {
    // For better WebView compatibility, use a Data URL instead of a Blob URL
    // Standard WebViews often fail to download blob: URIs natively.
    const dataUrl = await blobToDataURL(blob);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Data URL download failed, falling back to Blob:", error);
    // Ultimate fallback to standard web download (a tag)
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
}

export async function exportToExcel(rows: Record<string, unknown>[], filename: string, sheet = "Sheet1") {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheet);
  
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
  const finalFilename = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  await downloadOrShareFile(blob, finalFilename);
}

export async function exportMultiSheet(sheets: { name: string; rows: Record<string, unknown>[] }[], filename: string) {
  const wb = XLSX.utils.book_new();
  for (const s of sheets) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(s.rows), s.name);
  }
  
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
  const finalFilename = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  await downloadOrShareFile(blob, finalFilename);
}

export async function exportToCSV(rows: Record<string, unknown>[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(","),
    ...rows.map(row =>
      headers
        .map(fieldName => {
          const value = row[fieldName] ?? "";
          const stringified = typeof value === "object" ? JSON.stringify(value) : String(value);
          const escaped = stringified.replace(/"/g, '""');
          if (escaped.includes(",") || escaped.includes('"') || escaped.includes("\n")) {
            return `"${escaped}"`;
          }
          return escaped;
        })
        .join(",")
    ),
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const finalFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  await downloadOrShareFile(blob, finalFilename);
}

export async function exportToWord(rows: Record<string, unknown>[], filename: string, title = "Exported Document") {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  
  const tableHeaders = headers.map(h => `<th style="background-color: #4f46e5; color: white; padding: 10px; border: 1px solid #d1d5db; text-align: left;">${h}</th>`).join("");
  const tableRows = rows.map(row => {
    return `<tr>${headers.map(h => `<td style="padding: 8px; border: 1px solid #d1d5db;">${row[h] !== null && row[h] !== undefined ? String(row[h]) : ""}</td>`).join("")}</tr>`;
  }).join("");

  const html = `
    <html xmlns='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>${title}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 15px; }
        h2 { color: #4f46e5; margin-bottom: 5px; }
        .meta { color: #6b7280; font-size: 12px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <h2>${title}</h2>
      <div class="meta">Generated on: ${new Date().toLocaleDateString()}</div>
      <table>
        <thead>
          <tr>${tableHeaders}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff" + html], { type: "application/msword" });
  const finalFilename = filename.endsWith(".doc") ? filename : `${filename}.doc`;
  await downloadOrShareFile(blob, finalFilename);
}

export async function exportToPDF(rows: Record<string, unknown>[], filename: string, title = "Exported Report") {
  if (rows.length === 0) return;
  const doc = new jsPDF("l", "mm", "a4");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

  const headers = Object.keys(rows[0]);
  const body = rows.map(row => headers.map(h => {
    const val = row[h];
    return val !== null && val !== undefined ? String(val) : "";
  }));

  autoTable(doc, {
    startY: 28,
    head: [headers],
    body: body,
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229] },
    styles: { fontSize: 8, cellPadding: 2.5 },
  });

  const blob = doc.output("blob");
  const finalFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  await downloadOrShareFile(blob, finalFilename);
}
