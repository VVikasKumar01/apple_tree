import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Download, Search, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToExcel } from "@/lib/excel";
import { parseDataFile, normalizeRow } from "@/lib/import";
import { CLASS_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useAcademicYear } from "@/lib/academic-year";

export const Route = createFileRoute("/_authenticated/other-fees")({ component: OtherFeesPage });

function OtherFeesPage() {
  const qc = useQueryClient();
  const { school } = useAuth();
  const { year } = useAcademicYear();
  const [q, setQ] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [booksFilter, setBooksFilter] = useState<string>("all");
  const [uniformFilter, setUniformFilter] = useState<string>("all");
  const importRef = useRef<HTMLInputElement>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["other-fees", year, school],
    enabled: !!school,
    queryFn: async () => {
      const { data: students } = await supabase.from("students").select("id,admission_number,student_name,class_grade").eq("academic_year", year).eq("school", school);
      const { data: fees } = await supabase.from("other_fees").select("*").eq("academic_year", year).eq("school", school);
      const m = new Map((fees ?? []).map((f: any) => [f.student_id, f]));
      return (students ?? []).map((s: any) => ({ student: s, of: m.get(s.id) ?? null }));
    },
  });

  const filtered = rows.filter(({ student, of }) => {
    if (classFilter !== "all" && student.class_grade !== classFilter) return false;
    const bs = of?.books_status ?? "Not Issued";
    const us = of?.uniform_status ?? "Not Issued";
    if (booksFilter !== "all" && bs !== booksFilter) return false;
    if (uniformFilter !== "all" && us !== uniformFilter) return false;
    if (q && !`${student.admission_number} ${student.student_name}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const upsert = async (student_id: string, patch: Record<string, any>) => {
    if (!school) return toast.error("School not set on your account");
    const { error } = await supabase.from("other_fees").upsert(
      { student_id, academic_year: year, school, ...patch },
      { onConflict: "student_id,academic_year" }
    );
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["other-fees", year] });
  };

  const handleImport = async (file: File) => {
    if (!school) return toast.error("School not set on your account");
    try {
      const data = await parseDataFile(file);
      const { data: students } = await supabase.from("students").select("id,admission_number");
      const byAdm = new Map((students ?? []).map((s: any) => [String(s.admission_number).trim(), s.id]));
      const aliases: Record<string, string[]> = {
        admission_number: ["admission", "adm no", "adm#"],
        books_allotted: ["books"], books_status: ["book status"],
        uniform_size: ["uniform"], uniform_status: [],
        notes: [],
      };
      const payload: any[] = [];
      for (const r of data.map(x => normalizeRow(x, aliases))) {
        const sid = byAdm.get(String(r.admission_number).trim());
        if (!sid) continue;
        const { admission_number, ...rest } = r;
        payload.push({ ...rest, student_id: sid, academic_year: year, school });
      }
      if (!payload.length) return toast.error("No matching students");
      const { error } = await supabase.from("other_fees").upsert(payload, { onConflict: "student_id,academic_year" });
      if (error) return toast.error(error.message);
      toast.success(`Imported ${payload.length} rows`);
      qc.invalidateQueries({ queryKey: ["other-fees", year] });
    } catch (e: any) { toast.error(e.message ?? "Import failed"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Other Fees</h1>
          <p className="text-sm text-muted-foreground">Books & uniform issue tracking · {year}</p>
        </div>
        <div className="flex gap-2">
          <input ref={importRef} type="file" accept=".csv,.xlsx,.xls,.json,.ods" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleImport(f); e.target.value = ""; }} />
          <Button variant="outline" onClick={() => importRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Import</Button>
          <Button variant="outline" onClick={() => exportToExcel(filtered.map(r => ({
            "Admission #": r.student.admission_number, Name: r.student.student_name, Class: r.student.class_grade,
            Books: r.of?.books_allotted, "Books Status": r.of?.books_status ?? "Not Issued",
            "Uniform Size": r.of?.uniform_size, "Uniform Status": r.of?.uniform_status ?? "Not Issued",
          })) as any, `other-fees-${year}.xlsx`)}>
            <Download className="mr-2 h-4 w-4" />Export
          </Button>
        </div>
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or admission #" value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All classes</SelectItem>{CLASS_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={booksFilter} onValueChange={setBooksFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Books" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Books (all)</SelectItem><SelectItem value="Issued">Books Issued</SelectItem><SelectItem value="Not Issued">Books Not Issued</SelectItem></SelectContent>
          </Select>
          <Select value={uniformFilter} onValueChange={setUniformFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Uniform" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Uniform (all)</SelectItem><SelectItem value="Issued">Uniform Issued</SelectItem><SelectItem value="Not Issued">Uniform Not Issued</SelectItem></SelectContent>
          </Select>
          <div className="ml-auto text-sm text-muted-foreground">{filtered.length} of {rows.length}</div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Adm #</TableHead><TableHead>Name</TableHead>
                <TableHead>Books Allotted</TableHead><TableHead>Books Status</TableHead>
                <TableHead>Uniform Size</TableHead><TableHead>Uniform Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(({ student, of }) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-xs">{student.admission_number}</TableCell>
                  <TableCell className="font-medium">{student.student_name}</TableCell>
                  <TableCell><Input defaultValue={of?.books_allotted ?? ""} onBlur={e => upsert(student.id, { books_allotted: e.target.value })} className="h-8" /></TableCell>
                  <TableCell>
                    <Select defaultValue={of?.books_status ?? "Not Issued"} onValueChange={v => upsert(student.id, { books_status: v })}>
                      <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Issued">Issued</SelectItem><SelectItem value="Not Issued">Not Issued</SelectItem></SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><Input defaultValue={of?.uniform_size ?? ""} onBlur={e => upsert(student.id, { uniform_size: e.target.value })} className="h-8 w-20" /></TableCell>
                  <TableCell>
                    <Select defaultValue={of?.uniform_status ?? "Not Issued"} onValueChange={v => upsert(student.id, { uniform_status: v })}>
                      <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Issued">Issued</SelectItem><SelectItem value="Not Issued">Not Issued</SelectItem></SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No records match.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
