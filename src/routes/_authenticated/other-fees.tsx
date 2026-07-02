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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { parseDataFile, normalizeRow } from "@/lib/import";
import { ExportButton } from "@/components/ExportButton";
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
  const [booksPayFilter, setBooksPayFilter] = useState<string>("all");
  const [booksIssueFilter, setBooksIssueFilter] = useState<string>("all");
  const [uniformPayFilter, setUniformPayFilter] = useState<string>("all");
  const [uniformIssueFilter, setUniformIssueFilter] = useState<string>("all");
  const importRef = useRef<HTMLInputElement>(null);

  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    
    const bi = of?.books_status ?? "Not Issued";
    const bp = of?.books_payment_status ?? "Unpaid";
    if (booksIssueFilter !== "all" && bi !== booksIssueFilter) return false;
    if (booksPayFilter !== "all" && bp !== booksPayFilter) return false;

    const ui = of?.uniform_status ?? "Not Issued";
    const up = of?.uniform_payment_status ?? "Unpaid";
    if (uniformIssueFilter !== "all" && ui !== uniformIssueFilter) return false;
    if (uniformPayFilter !== "all" && up !== uniformPayFilter) return false;

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
        books_actual_fee: ["books actual", "books fee", "book cost"],
        uniform_size: ["uniform"], uniform_status: [],
        uniform_actual_fee: ["uniform actual", "uniform fee", "uniform cost"],
        due_fee: ["due", "due fee", "due amount"],
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

  const getStatusBadge = (status: string) => {
    if (status === "Issued" || status === "Paid") return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">{status}</Badge>;
    if (status === "Not Issued" || status === "Unpaid") return <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20">{status}</Badge>;
    if (status === "Partially Paid") return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">{status}</Badge>;
    return <Badge variant="outline">{status}</Badge>;
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
          <ExportButton
            data={() => filtered.map(r => ({
              "Admission #": r.student.admission_number,
              Name: r.student.student_name,
              Class: r.student.class_grade,
              "Books Allotted": r.of?.books_allotted || "",
              "Books Actual Fee": r.of?.books_actual_fee || 0,
              "Books Paid": r.of?.books_amount_paid || 0,
              "Books Pending": Math.max((r.of?.books_actual_fee || 0) - (r.of?.books_amount_paid || 0), 0),
              "Books Pay Status": r.of?.books_payment_status ?? "Unpaid",
              "Books Issue": r.of?.books_status ?? "Not Issued",
              "Uniform Size": r.of?.uniform_size || "",
              "Uniform Actual Fee": r.of?.uniform_actual_fee || 0,
              "Uniform Paid": r.of?.uniform_amount_paid || 0,
              "Uniform Pending": Math.max((r.of?.uniform_actual_fee || 0) - (r.of?.uniform_amount_paid || 0), 0),
              "Uniform Pay Status": r.of?.uniform_payment_status ?? "Unpaid",
              "Uniform Issue": r.of?.uniform_status ?? "Not Issued",
            }))}
            filenamePrefix={`other-fees-${year}`}
            title={`Other Fees (Books & Uniforms) - Academic Year ${year}`}
          />
        </div>
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or admission #" value={q} onChange={e => setQ(e.target.value)} className="w-[250px] pl-8" />
          </div>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All classes</SelectItem>{CLASS_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={booksPayFilter} onValueChange={setBooksPayFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Books Pay" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Books Pay (all)</SelectItem><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Unpaid">Unpaid</SelectItem><SelectItem value="Partially Paid">Partially Paid</SelectItem></SelectContent>
          </Select>
          <Select value={booksIssueFilter} onValueChange={setBooksIssueFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Books Issue" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Books Issue (all)</SelectItem><SelectItem value="Issued">Issued</SelectItem><SelectItem value="Not Issued">Not Issued</SelectItem></SelectContent>
          </Select>
          <Select value={uniformPayFilter} onValueChange={setUniformPayFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Uniform Pay" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Uniform Pay (all)</SelectItem><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Unpaid">Unpaid</SelectItem><SelectItem value="Partially Paid">Partially Paid</SelectItem></SelectContent>
          </Select>
          <Select value={uniformIssueFilter} onValueChange={setUniformIssueFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Uniform Issue" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Uniform Issue (all)</SelectItem><SelectItem value="Issued">Issued</SelectItem><SelectItem value="Not Issued">Not Issued</SelectItem></SelectContent>
          </Select>
          <div className="ml-auto text-sm text-muted-foreground">{filtered.length} of {rows.length}</div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Adm #</TableHead><TableHead>Name</TableHead>
                <TableHead>Books Allotted</TableHead>
                <TableHead>Books Fee (Actual/Paid/Pending)</TableHead>
                <TableHead>Books Status</TableHead>
                <TableHead>Books Issue</TableHead>
                <TableHead>Uniform Size</TableHead>
                <TableHead>Uniform Fee (Actual/Paid/Pending)</TableHead>
                <TableHead>Uniform Status</TableHead>
                <TableHead>Uniform Issue</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(({ student, of }) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-xs">{student.admission_number}</TableCell>
                  <TableCell className="font-medium">{student.student_name}</TableCell>
                  <TableCell>{of?.books_allotted || "—"}</TableCell>
                  <TableCell>
                    <div className="text-xs space-y-0.5">
                      <div>Actual: ₹{of?.books_actual_fee || 0}</div>
                      <div className="text-emerald-600">Paid: ₹{of?.books_amount_paid || 0}</div>
                      <div className="text-rose-600 font-semibold">Pending: ₹{Math.max((of?.books_actual_fee || 0) - (of?.books_amount_paid || 0), 0)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(of?.books_payment_status ?? "Unpaid")}</TableCell>
                  <TableCell>{getStatusBadge(of?.books_status ?? "Not Issued")}</TableCell>
                  
                  <TableCell>{of?.uniform_size || "—"}</TableCell>
                  <TableCell>
                    <div className="text-xs space-y-0.5">
                      <div>Actual: ₹{of?.uniform_actual_fee || 0}</div>
                      <div className="text-emerald-600">Paid: ₹{of?.uniform_amount_paid || 0}</div>
                      <div className="text-rose-600 font-semibold">Pending: ₹{Math.max((of?.uniform_actual_fee || 0) - (of?.uniform_amount_paid || 0), 0)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(of?.uniform_payment_status ?? "Unpaid")}</TableCell>
                  <TableCell>{getStatusBadge(of?.uniform_status ?? "Not Issued")}</TableCell>
                  
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedRow({ student, of }); setIsModalOpen(true); }}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={11} className="h-24 text-center text-muted-foreground">No records match.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedRow && (
        <EditFeeModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          student={selectedRow.student} 
          initialData={selectedRow.of} 
          onSave={(data) => {
            upsert(selectedRow.student.id, data);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function EditFeeModal({ isOpen, onClose, student, initialData, onSave }: { isOpen: boolean, onClose: () => void, student: any, initialData: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    books_allotted: initialData?.books_allotted || "",
    books_status: initialData?.books_status || "Not Issued",
    books_payment_status: initialData?.books_payment_status || "Unpaid",
    books_actual_fee: initialData?.books_actual_fee || "",
    books_amount_paid: initialData?.books_amount_paid || "",
    books_payment_mode: initialData?.books_payment_mode || "",
    books_payment_date: initialData?.books_payment_date || "",
    books_txn_id: initialData?.books_txn_id || "",
    
    uniform_size: initialData?.uniform_size || "",
    uniform_status: initialData?.uniform_status || "Not Issued",
    uniform_payment_status: initialData?.uniform_payment_status || "Unpaid",
    uniform_actual_fee: initialData?.uniform_actual_fee || "",
    uniform_amount_paid: initialData?.uniform_amount_paid || "",
    uniform_payment_mode: initialData?.uniform_payment_mode || "",
    uniform_payment_date: initialData?.uniform_payment_date || "",
    uniform_txn_id: initialData?.uniform_txn_id || "",

    notes: initialData?.notes || "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Other Fees — {student?.student_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Books Details */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">Books Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Books Allotted</Label>
                <Input value={formData.books_allotted} onChange={e => handleChange("books_allotted", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Issue Status</Label>
                <Select value={formData.books_status} onValueChange={v => handleChange("books_status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Issued">Issued</SelectItem><SelectItem value="Not Issued">Not Issued</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Actual Fee (₹)</Label>
                <Input type="number" value={formData.books_actual_fee} onChange={e => handleChange("books_actual_fee", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Amount Paid (₹)</Label>
                <Input type="number" value={formData.books_amount_paid} onChange={e => handleChange("books_amount_paid", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select value={formData.books_payment_status} onValueChange={v => handleChange("books_payment_status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select value={formData.books_payment_mode} onValueChange={v => handleChange("books_payment_mode", v)}>
                  <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input type="date" value={formData.books_payment_date} onChange={e => handleChange("books_payment_date", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>UPI / Txn ID</Label>
                <Input value={formData.books_txn_id} onChange={e => handleChange("books_txn_id", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Uniform Details */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">Uniform Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Uniform Size</Label>
                <Input value={formData.uniform_size} onChange={e => handleChange("uniform_size", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Issue Status</Label>
                <Select value={formData.uniform_status} onValueChange={v => handleChange("uniform_status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Issued">Issued</SelectItem><SelectItem value="Not Issued">Not Issued</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Actual Fee (₹)</Label>
                <Input type="number" value={formData.uniform_actual_fee} onChange={e => handleChange("uniform_actual_fee", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Amount Paid (₹)</Label>
                <Input type="number" value={formData.uniform_amount_paid} onChange={e => handleChange("uniform_amount_paid", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select value={formData.uniform_payment_status} onValueChange={v => handleChange("uniform_payment_status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select value={formData.uniform_payment_mode} onValueChange={v => handleChange("uniform_payment_mode", v)}>
                  <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input type="date" value={formData.uniform_payment_date} onChange={e => handleChange("uniform_payment_date", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>UPI / Txn ID</Label>
                <Input value={formData.uniform_txn_id} onChange={e => handleChange("uniform_txn_id", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input value={formData.notes} onChange={e => handleChange("notes", e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => {
            const patch = { ...formData };
            patch.books_actual_fee = patch.books_actual_fee ? Number(patch.books_actual_fee) : 0;
            patch.books_amount_paid = patch.books_amount_paid ? Number(patch.books_amount_paid) : 0;
            patch.uniform_actual_fee = patch.uniform_actual_fee ? Number(patch.uniform_actual_fee) : 0;
            patch.uniform_amount_paid = patch.uniform_amount_paid ? Number(patch.uniform_amount_paid) : 0;
            onSave(patch);
          }}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
