import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { Plus, Trash2, Download, Search, Upload, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { exportToExcel } from "@/lib/excel";
import { parseDataFile, normalizeRow } from "@/lib/import";
import { CLASS_OPTIONS, GENDER_OPTIONS } from "@/lib/constants";
import { useAuth, schoolName } from "@/lib/auth";
import { toast } from "sonner";
import appleTreeLogo from "@/assets/apple-tree-logo.jpg";
import applePlayLogo from "@/assets/apple-play-logo.jpg";
import { useAcademicYear } from "@/lib/academic-year";

export const Route = createFileRoute("/_authenticated/academics")({ component: AcademicsPage });

function AcademicsPage() {
  const { year } = useAcademicYear();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Academics</h1>
        <p className="text-sm text-muted-foreground">Marks · attendance · subjects · report card · {year}</p>
      </div>
      <Tabs defaultValue="marks">
        <TabsList>
          <TabsTrigger value="marks">Marks</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="report">Report Card</TabsTrigger>
        </TabsList>
        <TabsContent value="marks"><MarksTab year={year} /></TabsContent>
        <TabsContent value="attendance"><AttendanceTab year={year} /></TabsContent>
        <TabsContent value="subjects"><SubjectsTab /></TabsContent>
        <TabsContent value="report"><ReportCardTab year={year} /></TabsContent>
      </Tabs>
    </div>
  );
}

function useStudents(year: string) {
  const { school } = useAuth();
  return useQuery({
    queryKey: ["students-list-full", year, school],
    enabled: !!school,
    queryFn: async () => (await supabase.from("students").select("*").eq("academic_year", year).eq("school", school).order("student_name")).data ?? [],
  });
}

function MarksTab({ year }: { year: string }) {
  const qc = useQueryClient();
  const { school } = useAuth();
  const [studentId, setStudentId] = useState<string>("");
  const [q, setQ] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const importRef = useRef<HTMLInputElement>(null);

  const { data: students = [] } = useStudents(year);
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => (await supabase.from("subjects").select("*").order("name")).data ?? [],
  });
  const { data: marks = [] } = useQuery({
    queryKey: ["marks", studentId, year], enabled: !!studentId,
    queryFn: async () => (await supabase.from("academic_marks").select("*").eq("student_id", studentId).eq("academic_year", year)).data ?? [],
  });

  const filteredStudents = (students as any[]).filter(s => {
    if (classFilter !== "all" && s.class_grade !== classFilter) return false;
    if (genderFilter !== "all" && s.gender !== genderFilter) return false;
    if (q && !`${s.admission_number} ${s.student_name}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  // If selected student is filtered out, clear selection so UI stays consistent
  if (studentId && !filteredStudents.some((s: any) => s.id === studentId)) {
    setTimeout(() => setStudentId(""), 0);
  }

  const selectedStudent: any = (students as any[]).find(s => s.id === studentId);

  const setMark = async (subject_id: string, patch: any) => {
    if (!school) return toast.error("School not set on your account");
    const { error } = await supabase.from("academic_marks").upsert(
      { student_id: studentId, academic_year: year, subject_id, school, ...patch },
      { onConflict: "student_id,academic_year,subject_id" }
    );
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["marks", studentId, year] });
  };
  const mmap = new Map((marks as any[]).map(m => [m.subject_id, m]));

  const handleImport = async (file: File) => {
    if (!school) return toast.error("School not set");
    try {
      const data = await parseDataFile(file);
      const byAdm = new Map((students as any[]).map(s => [String(s.admission_number).trim(), s.id]));
      const subjByName = new Map((subjects as any[]).map(s => [String(s.name).toLowerCase().trim(), s.id]));
      const aliases: Record<string, string[]> = {
        admission_number: ["admission", "adm no"],
        subject: ["subject name"],
        term1_marks: ["t1", "term1"], term2_marks: ["t2", "term2"], term3_marks: ["t3", "term3"],
        max_marks: ["max", "out of"],
      };
      const payload: any[] = [];
      for (const r of data.map(x => normalizeRow(x, aliases))) {
        const sid = byAdm.get(String(r.admission_number).trim());
        const subjId = subjByName.get(String(r.subject ?? "").toLowerCase().trim());
        if (!sid || !subjId) continue;
        payload.push({
          student_id: sid, subject_id: subjId, academic_year: year, school,
          term1_marks: r.term1_marks != null ? Number(r.term1_marks) : null,
          term2_marks: r.term2_marks != null ? Number(r.term2_marks) : null,
          term3_marks: r.term3_marks != null ? Number(r.term3_marks) : null,
          max_marks: r.max_marks != null ? Number(r.max_marks) : 100,
        });
      }
      if (!payload.length) return toast.error("No rows matched students + subjects");
      const { error } = await supabase.from("academic_marks").upsert(payload, { onConflict: "student_id,academic_year,subject_id" });
      if (error) return toast.error(error.message);
      toast.success(`Imported ${payload.length} marks`);
      qc.invalidateQueries({ queryKey: ["marks", studentId, year] });
    } catch (e: any) { toast.error(e.message ?? "Import failed"); }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search student name / admission #" value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
        <Select value={classFilter} onValueChange={v => { setClassFilter(v); setStudentId(""); }}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All classes</SelectItem>{CLASS_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={genderFilter} onValueChange={v => { setGenderFilter(v); setStudentId(""); }}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All genders</SelectItem>{GENDER_OPTIONS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
        </Select>
        <input ref={importRef} type="file" accept=".csv,.xlsx,.xls,.json,.ods" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleImport(f); e.target.value = ""; }} />
        <Button variant="outline" size="sm" onClick={() => importRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Import</Button>
        <Button variant="outline" size="sm" disabled={!studentId} onClick={() => exportToExcel(
          (subjects as any[]).map(sub => { const m: any = mmap.get(sub.id) ?? {}; return { Subject: sub.name, Term1: m.term1_marks, Term2: m.term2_marks, Term3: m.term3_marks }; }),
          `marks-${year}.xlsx`)}><Download className="mr-2 h-4 w-4" />Export</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="rounded-md border max-h-[420px] overflow-y-auto">
          <div className="sticky top-0 bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
            {filteredStudents.length} student{filteredStudents.length === 1 ? "" : "s"}
          </div>
          {filteredStudents.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No students match your filters.</div>
          ) : filteredStudents.map((s: any) => (
            <button key={s.id} onClick={() => setStudentId(s.id)}
              className={`block w-full border-t px-3 py-2 text-left text-sm hover:bg-muted/50 ${studentId === s.id ? "bg-primary/10 font-semibold" : ""}`}>
              <div>{s.student_name}</div>
              <div className="text-xs text-muted-foreground">{s.admission_number} · {s.class_grade} {s.section ?? ""}</div>
            </button>
          ))}
        </div>

        <div>
          {!studentId ? (
            <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">Select a student from the list to enter or view marks.</div>
          ) : (
            <>
              <div className="mb-4 rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center gap-3">
                  {selectedStudent?.photo_url ? (
                    <img src={selectedStudent.photo_url} alt={selectedStudent.student_name} className="h-12 w-12 rounded-lg object-cover border" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-lg font-bold text-primary-foreground shadow-sm">
                      {selectedStudent?.student_name?.[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate text-base">{selectedStudent?.student_name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      Adm #{selectedStudent?.admission_number} · {selectedStudent?.class_grade} {selectedStudent?.section ?? ""}
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-xs border-t pt-2 border-border sm:grid-cols-2">
                  <div><span className="text-muted-foreground">Father: </span><span className="font-medium">{selectedStudent?.father_name || "—"}</span></div>
                  <div><span className="text-muted-foreground">Mother: </span><span className="font-medium">{selectedStudent?.mother_name || "—"}</span></div>
                  <div><span className="text-muted-foreground">Contact: </span><span className="font-medium">{selectedStudent?.primary_mobile || "—"}</span></div>
                  <div><span className="text-muted-foreground">DOB: </span><span className="font-medium">{selectedStudent?.date_of_birth || "—"}</span></div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Term 1</TableHead><TableHead>Term 2</TableHead><TableHead>Term 3</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {(subjects as any[]).map(sub => {
                      const m: any = mmap.get(sub.id) ?? {};
                      return (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.name}</TableCell>
                          {(["term1_marks", "term2_marks", "term3_marks"] as const).map(k => (
                            <TableCell key={k}><Input type="number" key={`${studentId}-${k}-${m[k] ?? ""}`} defaultValue={m[k] ?? ""} className="h-8 w-24" onBlur={e => setMark(sub.id, { [k]: e.target.value ? Number(e.target.value) : null })} /></TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function AttendanceTab({ year }: { year: string }) {
  const qc = useQueryClient();
  const { school } = useAuth();
  const [q, setQ] = useState("");
  const { data: rows = [] } = useQuery({
    queryKey: ["attendance", year, school],
    enabled: !!school,
    queryFn: async () => {
      const { data: s } = await supabase.from("students").select("id,admission_number,student_name").eq("academic_year", year).eq("school", school);
      const { data: a } = await supabase.from("attendance_summary").select("*").eq("academic_year", year).eq("school", school);
      const m = new Map((a ?? []).map((x: any) => [x.student_id, x]));
      return (s ?? []).map(st => ({ student: st, att: m.get(st.id) }));
    },
  });
  const filtered = rows.filter(({ student }: any) =>
    !q || `${student.admission_number} ${student.student_name}`.toLowerCase().includes(q.toLowerCase()));
  const save = async (student_id: string, patch: any) => {
    if (!school) return toast.error("School not set on your account");
    const { error } = await supabase.from("attendance_summary").upsert(
      { student_id, academic_year: year, school, ...patch },
      { onConflict: "student_id,academic_year" }
    );
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["attendance", year] });
  };
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or admission #" value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Adm #</TableHead><TableHead>Name</TableHead><TableHead>Working Days</TableHead><TableHead>Present</TableHead><TableHead>%</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(({ student, att }: any) => {
              const tot = att?.total_working_days ?? 0, p = att?.days_present ?? 0;
              const pct = tot ? Math.round((p / tot) * 100) : 0;
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-xs">{student.admission_number}</TableCell>
                  <TableCell className="font-medium">{student.student_name}</TableCell>
                  <TableCell><Input type="number" defaultValue={tot} className="h-8 w-24" onBlur={e => save(student.id, { total_working_days: Number(e.target.value || 0), days_present: p })} /></TableCell>
                  <TableCell><Input type="number" defaultValue={p} className="h-8 w-24" onBlur={e => save(student.id, { total_working_days: tot, days_present: Number(e.target.value || 0) })} /></TableCell>
                  <TableCell><span className="font-semibold">{pct}%</span></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

function SubjectsTab() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => (await supabase.from("subjects").select("*").order("name")).data ?? [],
  });
  const add = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from("subjects").insert({ name: name.trim() });
    if (error) toast.error(error.message); else { setName(""); qc.invalidateQueries({ queryKey: ["subjects"] }); }
  };
  const del = async (id: string) => {
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["subjects"] });
  };
  return (
    <Card className="p-4 space-y-3">
      <div className="flex gap-2">
        <Input placeholder="New subject…" value={name} onChange={e => setName(e.target.value)} className="max-w-xs" />
        <Button onClick={add} className="bg-gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" />Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(subjects as any[]).map(s => (
          <div key={s.id} className="flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1 text-sm">
            {s.name}
            <button onClick={() => del(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ReportCardTab({ year }: { year: string }) {
  const { data: students = [] } = useStudents(year);
  const { school } = useAuth();
  const [studentId, setStudentId] = useState("");
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [termFilter, setTermFilter] = useState<"all" | "term1" | "term2" | "term3">("all");

  const { data: marks = [] } = useQuery({
    queryKey: ["report-marks", studentId, year], enabled: !!studentId,
    queryFn: async () => (await supabase.from("academic_marks").select("*, subjects(name)").eq("student_id", studentId).eq("academic_year", year)).data ?? [],
  });
  const { data: att } = useQuery({
    queryKey: ["report-att", studentId, year], enabled: !!studentId,
    queryFn: async () => (await supabase.from("attendance_summary").select("*").eq("student_id", studentId).eq("academic_year", year).maybeSingle()).data,
  });
  const student: any = (students as any[]).find(s => s.id === studentId);
  const filtered = (students as any[]).filter((s: any) => {
    if (classFilter !== "all" && s.class_grade !== classFilter) return false;
    if (q && !`${s.admission_number} ${s.student_name}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <Card className="p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search name / admission #" value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All classes</SelectItem>{CLASS_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={termFilter} onValueChange={v => setTermFilter(v as any)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All terms</SelectItem>
            <SelectItem value="term1">Term 1 only</SelectItem>
            <SelectItem value="term2">Term 2 only</SelectItem>
            <SelectItem value="term3">Term 3 only</SelectItem>
          </SelectContent>
        </Select>
        <Button disabled={!studentId} onClick={() => setOpen(true)} className="bg-gradient-primary text-primary-foreground">
          <Printer className="mr-2 h-4 w-4" />Preview / Print
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-[280px_1fr]">
        <div className="rounded-md border max-h-[360px] overflow-y-auto">
          <div className="sticky top-0 bg-muted/50 px-3 py-2 text-xs text-muted-foreground">{filtered.length} student{filtered.length === 1 ? "" : "s"}</div>
          {filtered.map((s: any) => (
            <button key={s.id} onClick={() => setStudentId(s.id)}
              className={`block w-full border-t px-3 py-2 text-left text-sm hover:bg-muted/50 ${studentId === s.id ? "bg-primary/10 font-semibold" : ""}`}>
              <div>{s.student_name}</div>
              <div className="text-xs text-muted-foreground">{s.admission_number} · {s.class_grade}</div>
            </button>
          ))}
          {filtered.length === 0 && <div className="p-4 text-sm text-muted-foreground">No students.</div>}
        </div>
        <div className="rounded-md border p-4 text-sm">
          {student ? (
            <>
              <div className="text-lg font-semibold">{student.student_name}</div>
              <div className="text-muted-foreground">Adm #{student.admission_number} · {student.class_grade} {student.section}</div>
              <div className="mt-2">Father: <b>{student.father_name ?? "—"}</b> · Mother: <b>{student.mother_name ?? "—"}</b></div>
              <div className="mt-1 text-xs text-muted-foreground">Click <b>Preview / Print</b> to open the report card.</div>
            </>
          ) : <div className="text-muted-foreground">Select a student to preview the report card.</div>}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {student && <ReportCard student={student} marks={marks as any[]} att={att as any} year={year} schoolLabel={schoolName(school)} schoolCode={school} termFilter={termFilter} />}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function ReportCard({ student, marks, att, year, schoolLabel, schoolCode, termFilter }: { student: any; marks: any[]; att: any; year: string; schoolLabel: string; schoolCode: string | null; termFilter: "all" | "term1" | "term2" | "term3" }) {
  const showT1 = termFilter === "all" || termFilter === "term1";
  const showT2 = termFilter === "all" || termFilter === "term2";
  const showT3 = termFilter === "all" || termFilter === "term3";
  const termCount = [showT1, showT2, showT3].filter(Boolean).length;

  const totals = useMemo(() => {
    const t = { term1: 0, term2: 0, term3: 0, max: 0 };
    for (const m of marks) {
      if (showT1) t.term1 += Number(m.term1_marks || 0);
      if (showT2) t.term2 += Number(m.term2_marks || 0);
      if (showT3) t.term3 += Number(m.term3_marks || 0);
      t.max += Number(m.max_marks || 100);
    }
    return t;
  }, [marks, showT1, showT2, showT3]);
  const grandTotal = totals.term1 + totals.term2 + totals.term3;
  const grandMax = totals.max * termCount;
  const percent = grandMax > 0 ? (grandTotal / grandMax) * 100 : 0;
  const grade = percent >= 90 ? "A+" : percent >= 80 ? "A" : percent >= 70 ? "B+" : percent >= 60 ? "B" : percent >= 50 ? "C" : percent >= 35 ? "D" : "E";
  const remarks = percent >= 80 ? "Excellent performance." : percent >= 60 ? "Good progress, keep it up." : percent >= 40 ? "Needs improvement." : "Requires significant support.";
  const attPct = att?.total_working_days ? Math.round(((att.days_present ?? 0) / att.total_working_days) * 100) : 0;
  const logoUrl = schoolCode === "apple_tree" ? appleTreeLogo : schoolCode === "apple_play" ? applePlayLogo : null;
  const termLabel = termFilter === "all" ? "Term-wise" : termFilter === "term1" ? "Term 1" : termFilter === "term2" ? "Term 2" : "Term 3";

  return (
    <div className="bg-white text-black">
      <style>{`@media print {
        body * { visibility: hidden; }
        #report-card, #report-card * { visibility: visible; }
        #report-card { position: absolute; left: 0; top: 0; width: 100%; padding: 24px; }
        .no-print { display: none !important; }
      }`}</style>
      <div id="report-card" className="p-8 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            {logoUrl && <img src={logoUrl} alt={schoolLabel} className="h-16 w-16 object-contain" />}
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-500">{schoolLabel}</div>
              <h1 className="text-2xl font-bold">{termLabel} Report Card</h1>
              <div className="text-sm text-gray-600">Academic Year: {year}</div>
            </div>
          </div>
          {student.photo_url ? (
            <img src={student.photo_url} alt={student.student_name} className="h-24 w-24 rounded border object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded border bg-gray-100 text-xs text-gray-400">No photo</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <div><span className="text-gray-500">Name:</span> <b>{student.student_name}</b></div>
          <div><span className="text-gray-500">Admission #:</span> <b>{student.admission_number}</b></div>
          <div><span className="text-gray-500">Class:</span> <b>{student.class_grade} {student.section}</b></div>
          <div><span className="text-gray-500">Gender:</span> <b>{student.gender}</b></div>
          <div><span className="text-gray-500">Father:</span> <b>{student.father_name ?? "—"}</b></div>
          <div><span className="text-gray-500">Mother:</span> <b>{student.mother_name ?? "—"}</b></div>
          <div><span className="text-gray-500">DOB:</span> <b>{student.date_of_birth ?? "—"}</b></div>
          <div><span className="text-gray-500">Contact:</span> <b>{student.primary_mobile ?? "—"}</b></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Subject</th>
                {showT1 && <th className="border p-2 text-right">Term 1</th>}
                {showT2 && <th className="border p-2 text-right">Term 2</th>}
                {showT3 && <th className="border p-2 text-right">Term 3</th>}
                <th className="border p-2 text-right">Total</th>
                <th className="border p-2 text-right">Max</th>
              </tr>
            </thead>
            <tbody>
              {marks.map(m => {
                const tot = (showT1 ? Number(m.term1_marks || 0) : 0) + (showT2 ? Number(m.term2_marks || 0) : 0) + (showT3 ? Number(m.term3_marks || 0) : 0);
                const max = Number(m.max_marks || 100) * termCount;
                return (
                  <tr key={m.id}>
                    <td className="border p-2">{m.subjects?.name}</td>
                    {showT1 && <td className="border p-2 text-right">{m.term1_marks ?? "—"}</td>}
                    {showT2 && <td className="border p-2 text-right">{m.term2_marks ?? "—"}</td>}
                    {showT3 && <td className="border p-2 text-right">{m.term3_marks ?? "—"}</td>}
                    <td className="border p-2 text-right font-semibold">{tot}</td>
                    <td className="border p-2 text-right text-gray-500">{max}</td>
                  </tr>
                );
              })}
              {marks.length === 0 && <tr><td colSpan={3 + termCount} className="border p-4 text-center text-gray-500">No marks recorded.</td></tr>}
              {marks.length > 0 && (
                <tr className="bg-gray-50 font-semibold">
                  <td className="border p-2">Grand Total</td>
                  {showT1 && <td className="border p-2 text-right">{totals.term1}</td>}
                  {showT2 && <td className="border p-2 text-right">{totals.term2}</td>}
                  {showT3 && <td className="border p-2 text-right">{totals.term3}</td>}
                  <td className="border p-2 text-right">{grandTotal}</td>
                  <td className="border p-2 text-right">{grandMax}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded border p-3"><div className="text-gray-500 text-xs">Percentage</div><div className="text-xl font-bold">{percent.toFixed(1)}%</div></div>
          <div className="rounded border p-3"><div className="text-gray-500 text-xs">Grade</div><div className="text-xl font-bold">{grade}</div></div>
          <div className="rounded border p-3"><div className="text-gray-500 text-xs">Attendance</div><div className="text-xl font-bold">{attPct}% <span className="text-xs text-gray-500">({att?.days_present ?? 0}/{att?.total_working_days ?? 0})</span></div></div>
        </div>

        <div className="rounded border p-3 text-sm"><span className="text-gray-500">Remarks: </span>{remarks}</div>

        <div className="grid grid-cols-2 gap-8 pt-12 text-sm">
          <div className="border-t pt-1 text-center text-gray-600">Class Teacher</div>
          <div className="border-t pt-1 text-center text-gray-600">Principal</div>
        </div>

        <div className="no-print flex justify-end pt-2">
          <Button onClick={() => window.print()} className="bg-gradient-primary text-primary-foreground"><Printer className="mr-2 h-4 w-4" />Print</Button>
        </div>
      </div>
    </div>
  );
}
