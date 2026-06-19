import { Download, FileSpreadsheet, FileText, FileDown, File } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToExcel, exportToCSV, exportToWord, exportToPDF } from "@/lib/export";
import { toast } from "sonner";

interface ExportButtonProps {
  data: Record<string, unknown>[] | (() => Record<string, unknown>[]);
  filenamePrefix: string;
  title: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  disabled?: boolean;
}

export function ExportButton({
  data,
  filenamePrefix,
  title,
  variant = "outline",
  size = "default",
  className,
  disabled = false,
}: ExportButtonProps) {
  const getRows = (): Record<string, unknown>[] => {
    try {
      return typeof data === "function" ? data() : data;
    } catch (e) {
      console.error(e);
      toast.error("Failed to prepare data for export");
      return [];
    }
  };

  const handleExport = async (type: "excel" | "csv" | "word" | "pdf") => {
    const rows = getRows();
    if (!rows || rows.length === 0) {
      toast.error("No data available to export");
      return;
    }

    try {
      const now = new Date().toISOString().split("T")[0];
      const filename = `${filenamePrefix}_${now}`;

      switch (type) {
        case "excel":
          await exportToExcel(rows, `${filename}.xlsx`, title.slice(0, 30));
          toast.success("Exported to Excel successfully");
          break;
        case "csv":
          await exportToCSV(rows, `${filename}.csv`);
          toast.success("Exported to CSV successfully");
          break;
        case "word":
          await exportToWord(rows, `${filename}.doc`, title);
          toast.success("Exported to Word successfully");
          break;
        case "pdf":
          await exportToPDF(rows, `${filename}.pdf`, title);
          toast.success("Exported to PDF successfully");
          break;
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`Export failed: ${error.message || error}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={disabled}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border border-slate-200 shadow-elegant rounded-lg p-1">
        <DropdownMenuItem
          onClick={() => handleExport("excel")}
          className="flex items-center gap-2 cursor-pointer py-2 px-3 text-sm text-slate-700 hover:bg-slate-50 rounded"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
          <span>Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("csv")}
          className="flex items-center gap-2 cursor-pointer py-2 px-3 text-sm text-slate-700 hover:bg-slate-50 rounded"
        >
          <FileText className="h-4 w-4 text-blue-600" />
          <span>CSV (.csv)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("word")}
          className="flex items-center gap-2 cursor-pointer py-2 px-3 text-sm text-slate-700 hover:bg-slate-50 rounded"
        >
          <File className="h-4 w-4 text-indigo-600" />
          <span>Word (.doc)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          className="flex items-center gap-2 cursor-pointer py-2 px-3 text-sm text-slate-700 hover:bg-slate-50 rounded"
        >
          <FileDown className="h-4 w-4 text-rose-600" />
          <span>PDF (.pdf)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
