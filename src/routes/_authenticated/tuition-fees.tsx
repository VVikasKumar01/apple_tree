import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Download, Save, Search, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseDataFile, normalizeRow } from "@/lib/import";
import { ExportButton } from "@/components/ExportButton";
import { toast } from "sonner";
import { inr } from "@/lib/types";
import { CLASS_OPTIONS, GENDER_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/lib/auth";
import { useAcademicYear } from "@/lib/academic-year";

export const Route = createFileRoute("/_authenticated/tuition-fees")({ component: TuitionPage });

type PayStatus = "all" | "fully" | "partial" | "unpaid";

function TuitionPage() {
  const qc = useQueryClient();
  const { school } = useAuth();
  const { year } = useAcademicYear();
  const [editing, setEditing] = useState<any | null>(null);
  const [q, setQ] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<PayStatus>("all");
  const importRef = useRef<HTMLInputElement>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["tuition", year, school],
    enabled: !!school,
    queryFn: async () => {
      const { data: students } = await supabase.from("students").select("id,admission_number,student_name,class_grade,section,gender").eq("academic_year", year).eq("school", school!);
      const { data: fees } = await supabase.from("tuition_fees").select("*").eq("academic_year", year).eq("school", school!);
      const fmap = new Map((fees ?? []).map((f: any) => [f.student_id, f]));
      return (students ?? []).map((s: any) => ({ student: s, fee: fmap.get(s.id) ?? null }));
    },
  });

  const computed = rows.map(r => {
    const f = r.fee || {};
    const finalized = Number(f.finalized_fee || 0) || (Number(f.term1_fee || 0) + Number(f.term2_fee || 0) + Number(f.term3_fee || 0));
    const paid = ["term1", "term2", "term3"].reduce((sum, t) => sum + (f[`${t}_status`] === "Paid" ? Number(f[`${t}_fee`] || 0) : 0), 0);
    let status: "fully" | "partial" | "unpaid" = "unpaid";
    if (finalized > 0 && paid >= finalized) status = "fully";
    else if (paid > 0) status = "partial";
    return { ...r, finalized, actual: Number(f.total_annual_fee || 0), paid, status };
  });

  const filtered = computed.filter(r => {
    if (classFilter !== "all" && r.student.class_grade !== classFilter) return false;
    if (genderFilter !== "all" && r.student.gender !== genderFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (q && !`${r.student.admission_number} ${r.student.student_name}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const save = async (form: any) => {
    if (!school) return toast.error("School not set on your account");
    const { student_name: _omit, ...rest } = form;
    const payload: any = { ...rest, academic_year: year, school };
    const { error } = form.id
      ? await supabase.from("tuition_fees").update(payload).eq("id", form.id)
      : await supabase.from("tuition_fees").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null);
    qc.invalidateQueries({ queryKey: ["tuition", year] });
  };

  const handleImport = async (file: File) => {
    if (!school) return toast.error("School not set on your account");
    try {
      const data = await parseDataFile(file);
      const { data: students } = await supabase.from("students").select("id,admission_number").eq("academic_year", year).eq("school", school!);
      const byAdm = new Map((students ?? []).map((s: any) => [String(s.admission_number).trim(), s.id]));
      const aliases: Record<string, string[]> = {
        admission_number: ["admission", "adm no", "adm#", "admission#"],
        total_annual_fee: ["actual fee", "list fee", "standard fee"],
        finalized_fee: ["finalized", "final fee", "agreed fee"],
        term1_fee: ["t1", "term1"], term2_fee: ["t2", "term2"], term3_fee: ["t3", "term3"],
        term1_status: [], term2_status: [], term3_status: [],
      };
      const mapped = data.map(r => {
        const row = normalizeRow(r, aliases);
        for (const k of ["term1_status", "term2_status", "term3_status"] as const) {
          if (row[k]) {
            const s = String(row[k]).trim().toLowerCase();
            if (s === "paid" || s === "p") {
              row[k] = "Paid";
            } else if (s === "unpaid" || s === "u") {
              row[k] = "Unpaid";
            }
          }
        }
        return row;
      });
      const payload: any[] = [];
      for (const m of mapped) {
        const sid = byAdm.get(String(m.admission_number).trim());
        if (!sid) continue;
        const { admission_number, ...rest } = m;
        payload.push({ ...rest, student_id: sid, academic_year: year, school });
      }
      if (!payload.length) return toast.error("No matching students by admission");
      const { error } = await supabase.from("tuition_fees").upsert(payload, { onConflict: "student_id,academic_year" });
      if (error) return toast.error(error.message);
      toast.success(`Imported ${payload.length} rows`);
      qc.invalidateQueries({ queryKey: ["tuition", year] });
    } catch (e: any) { toast.error(e.message ?? "Import failed"); }
  };

  const exportRows = filtered.map(r => ({
    "Admission": r.student.admission_number, Name: r.student.student_name, Class: r.student.class_grade,
    "Actual Fee": r.actual, "Finalized Fee": r.finalized, Paid: r.paid, Pending: r.finalized - r.paid, Status: r.status,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Tuition Fees</h1>
          <p className="text-sm text-muted-foreground">Academic Year {year} · tally is against the finalized fee</p>
        </div>
        <div className="flex gap-2">
          <input ref={importRef} type="file" accept=".csv,.xlsx,.xls,.json,.ods" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleImport(f); e.target.value = ""; }} />
          <Button variant="outline" onClick={() => importRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Import</Button>
          <ExportButton
            data={exportRows}
            filenamePrefix={`tuition-${year}`}
            title={`Tuition Fees - Academic Year ${year}`}
          />
        </div>
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or admission" value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All classes</SelectItem>{CLASS_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All genders</SelectItem>{GENDER_OPTIONS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="fully">Fully paid</SelectItem>
              <SelectItem value="partial">Partially paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto text-sm text-muted-foreground">{filtered.length} of {rows.length}</div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Adm</TableHead><TableHead>Name</TableHead><TableHead>Class</TableHead>
                <TableHead className="text-right">Actual Fee</TableHead>
                <TableHead className="text-right">Finalized Fee</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(({ student, fee, actual, finalized, paid, status }) => {
                const f = fee || {};
                return (
                  <TableRow key={student.id} className={status === "fully" ? "bg-success/5" : status === "unpaid" && finalized > 0 ? "bg-destructive/5" : ""}>
                    <TableCell className="font-mono text-xs">{student.admission_number}</TableCell>
                    <TableCell className="font-medium">{student.student_name}</TableCell>
                    <TableCell>{student.class_grade} {student.section}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{inr(actual)}</TableCell>
                    <TableCell className="text-right font-semibold">{inr(finalized)}</TableCell>
                    <TableCell className="text-right text-success">{inr(paid)}</TableCell>
                    <TableCell className="text-right text-destructive">{inr(Math.max(finalized - paid, 0))}</TableCell>
                    <TableCell>
                      <Badge variant={status === "fully" ? "default" : status === "partial" ? "secondary" : "destructive"} className="text-[10px]">
                        {status === "fully" ? "Fully Paid" : status === "partial" ? "Partially Paid" : "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell><Button size="sm" variant="ghost" onClick={() => setEditing({ student_id: student.id, ...f, student_name: student.student_name })}>Edit</Button></TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && <TableRow><TableCell colSpan={9} className="h-24 text-center text-muted-foreground">No records match your filters.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Fees — {editing?.student_name}</DialogTitle></DialogHeader>
          {editing && <FeeForm form={editing} setForm={setEditing} onSave={() => save(editing)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FeeForm({ form, setForm, onSave }: any) {
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Actual Fee (₹) — standard/list</Label><Input type="number" value={form.total_annual_fee ?? ""} onChange={e => set("total_annual_fee", e.target.value)} /></div>
        <div><Label className="text-xs">Finalized Fee (₹) — after discount</Label><Input type="number" value={form.finalized_fee ?? ""} onChange={e => set("finalized_fee", e.target.value)} /></div>
      </div>
      {(["term1", "term2", "term3"] as const).map((t, i) => (
        <div key={t} className="rounded-lg border bg-muted/30 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Term {i + 1}</div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><Label className="text-xs">Amount (₹)</Label><Input type="number" value={form[`${t}_fee`] ?? ""} onChange={e => set(`${t}_fee`, e.target.value)} /></div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form[`${t}_status`] ?? "Unpaid"} onValueChange={v => set(`${t}_status`, v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Unpaid">Unpaid</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Payment Mode</Label>
              <Select value={form[`${t}_payment_mode`] ?? ""} onValueChange={v => set(`${t}_payment_mode`, v)}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>{["Cash", "Card", "Cheque", "Online", "PhonePe", "Google Pay", "Paytm"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Payment Date</Label><Input type="date" value={form[`${t}_payment_date`] ?? ""} onChange={e => set(`${t}_payment_date`, e.target.value)} /></div>
            <div className="sm:col-span-2"><Label className="text-xs">UPI / Txn ID</Label><Input value={form[`${t}_txn_id`] ?? ""} onChange={e => set(`${t}_txn_id`, e.target.value)} /></div>
          </div>
        </div>
      ))}
      <div className="flex justify-end"><Button onClick={onSave} className="bg-gradient-primary text-primary-foreground"><Save className="mr-2 h-4 w-4" />Save</Button></div>
    </div>
  );
}
