import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Plus, Download, Search, Pencil, Trash2, Upload, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseDataFile, normalizeRow } from "@/lib/import";
import { ExportButton } from "@/components/ExportButton";
import { toast } from "sonner";
import type { Student } from "@/lib/types";
import { CLASS_OPTIONS, GENDER_OPTIONS, ACADEMIC_YEARS } from "@/lib/constants";
import { useAuth } from "@/lib/auth";
import { useAcademicYear } from "@/lib/academic-year";

export const Route = createFileRoute("/_authenticated/students")({ component: StudentsPage });

const getEmptyStudent = (y: string): Partial<Student> => ({
  admission_number: "", student_name: "", gender: "Male", class_grade: "Nursery", section: "A", academic_year: y,
});

function StudentsPage() {
  const qc = useQueryClient();
  const { school } = useAuth();
  const { year, setYear } = useAcademicYear();
  const [q, setQ] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Student>>(() => getEmptyStudent(year));
  const importRef = useRef<HTMLInputElement>(null);

  const { data: students = [] } = useQuery({
    queryKey: ["students", year, school],
    enabled: !!school,
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*").eq("academic_year", year).eq("school", school!).order("created_at", { ascending: false });
      if (error) throw error;
      return data as Student[];
    },
  });

  const filtered = students.filter(s => {
    if (classFilter !== "all" && s.class_grade !== classFilter) return false;
    if (genderFilter !== "all" && s.gender !== genderFilter) return false;
    if (q && !([s.admission_number, s.student_name, s.class_grade, s.section, s.father_name, s.primary_mobile]
      .filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const save = async () => {
    if (!form.admission_number || !form.student_name) return toast.error("Admission and name are required");
    if (!school) return toast.error("School not set on your account");
    const digits = (v: any) => String(v ?? "").replace(/\D/g, "");
    for (const [label, v] of [["Student Aadhaar", form.student_aadhaar], ["Father Aadhaar", form.father_aadhaar], ["Mother Aadhaar", form.mother_aadhaar]] as [string, any][])
      if (v && digits(v).length !== 12) return toast.error(`${label} must be exactly 12 digits`);
    for (const [label, v] of [["Father Mobile", form.father_mobile], ["Mother Mobile", form.mother_mobile], ["Primary Mobile", form.primary_mobile], ["Emergency Contact", form.emergency_contact]] as [string, any][])
      if (v && digits(v).length !== 10) return toast.error(`${label} must be exactly 10 digits`);

    const payload: any = { ...form, school };
    const { error } = form.id
      ? await supabase.from("students").update(payload).eq("id", form.id)
      : await supabase.from("students").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Updated" : "Student registered");
    setOpen(false); setForm(getEmptyStudent(year));
    qc.invalidateQueries({ queryKey: ["students", year] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this student? This will remove all linked records.")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["students", year] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
  };

  const handleImport = async (file: File) => {
    if (!school) return toast.error("School not set on your account");
    try {
      const rows = await parseDataFile(file);
      const aliases: Record<string, string[]> = {
        admission_number: ["admission #", "admission", "admission no", "adm no", "adm#", "admission#", "roll"],
        student_name: ["name", "student", "full name", "student name"],
        student_aadhaar: ["aadhaar", "aadhar", "student aadhar", "student aadhaar"],
        gender: ["sex"],
        date_of_birth: ["date of birth", "dob", "birth date"],
        blood_group: ["blood group", "blood"],
        nationality: [], religion: [], caste: [],
        class_grade: ["class", "grade"],
        section: [],
        academic_year: ["academic year", "year", "ay"],
        father_name: ["father's name", "father name", "father"],
        father_aadhaar: ["father's aadhaar", "father aadhar", "father aadhaar"],
        father_mobile: ["father's mobile", "father mobile", "father phone", "father mobile no"],
        father_occupation: ["father's occupation", "father occupation"],
        mother_name: ["mother's name", "mother name", "mother"],
        mother_aadhaar: ["mother's aadhaar", "mother aadhar", "mother aadhaar"],
        mother_mobile: ["mother's mobile", "mother mobile", "mother phone"],
        mother_occupation: ["mother's occupation", "mother occupation"],
        primary_mobile: ["primary mobile", "mobile", "phone", "contact"],
        emergency_contact: ["emergency contact", "emergency"],
        email: ["email", "e-mail"],
        permanent_address: ["address", "permanent address", "permanent"],
        correspondence_address: ["correspondence address", "correspondence", "current address"],
      };
      const mapped = rows.map(r => {
        const row = normalizeRow(r, aliases);
        if (row.gender) {
          const g = String(row.gender).trim().toLowerCase();
          if (g === "male" || g === "m") {
            row.gender = "Male";
          } else if (g === "female" || g === "f") {
            row.gender = "Female";
          }
        }
        return row;
      }).filter(r => r.admission_number && r.student_name);
      if (!mapped.length) return toast.error("No valid rows. Need admission number and name.");
      const payload = mapped.map(r => ({ academic_year: year, ...r, school }));
      const { error } = await supabase.from("students").upsert(payload as any, { onConflict: "school,academic_year,admission_number" });
      if (error) return toast.error(error.message);
      toast.success(`Imported ${mapped.length} students`);
      qc.invalidateQueries({ queryKey: ["students", year] });
    } catch (e: any) { toast.error(e.message ?? "Import failed"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-sm text-muted-foreground">Personal details only — fees & academics live in their own modules.</p>
        </div>
        <div className="flex gap-2">
          <input ref={importRef} type="file" accept=".csv,.xlsx,.xls,.json,.ods" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleImport(f); e.target.value = ""; }} />
          <Button variant="outline" onClick={() => importRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Import</Button>
          <ExportButton
            data={() => filtered.map(s => ({
              "Admission": s.admission_number,
              "Name": s.student_name,
              "Class": s.class_grade,
              "Section": s.section || "",
              "Gender": s.gender,
              "Date of Birth": s.date_of_birth || "",
              "Blood Group": s.blood_group || "",
              "Father's Name": s.father_name || "",
              "Father's Mobile": s.father_mobile || "",
              "Mother's Name": s.mother_name || "",
              "Mother's Mobile": s.mother_mobile || "",
              "Primary Mobile": s.primary_mobile || "",
              "Emergency Contact": s.emergency_contact || "",
              "Email": s.email || "",
              "Address": s.permanent_address || "",
            }))}
            filenamePrefix="students"
            title="Students List"
          />
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm(getEmptyStudent(year)); }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" />Register Student</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
              <DialogHeader><DialogTitle>{form.id ? "Edit student" : "Register student"}</DialogTitle></DialogHeader>
              <StudentForm form={form} setForm={setForm} onSave={save} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, admission, parent…" value={q} onChange={e => setQ(e.target.value)} className="max-w-sm" />
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Academic Year" /></SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Class" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {CLASS_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All genders</SelectItem>
              {GENDER_OPTIONS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="ml-auto text-sm text-muted-foreground">{filtered.length} of {students.length}</div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Admission</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Father</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell>
                    {s.photo_url ? (
                      <img src={s.photo_url} alt={s.student_name} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium">{s.student_name?.[0]}</div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{s.admission_number}</TableCell>
                  <TableCell className="font-medium">
                    <Link to="/students/$id" params={{ id: s.id }} className="hover:text-primary hover:underline">{s.student_name}</Link>
                  </TableCell>
                  <TableCell>{s.class_grade} {s.section && `· ${s.section}`}</TableCell>
                  <TableCell>{s.gender}</TableCell>
                  <TableCell>{s.father_name}</TableCell>
                  <TableCell>{s.primary_mobile}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => { setForm(s); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="h-32 text-center text-muted-foreground">No students match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, k, type = "text", form, setForm, maxLength, digitsOnly }:
  { label: string; k: keyof Student; type?: string; form: Partial<Student>; setForm: (s: Partial<Student>) => void; maxLength?: number; digitsOnly?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        type={type}
        inputMode={digitsOnly ? "numeric" : undefined}
        maxLength={maxLength}
        value={(form as any)[k] ?? ""}
        onChange={e => {
          let v = e.target.value;
          if (digitsOnly) v = v.replace(/\D/g, "").slice(0, maxLength ?? 20);
          setForm({ ...form, [k]: v });
        }}
      />
    </div>
  );
}

/** Compress any image format (JPEG, PNG, WebP, BMP, GIF, HEIC…) to JPEG ≤ maxBytes using Canvas. */
async function compressImage(file: File, maxBytes = 10240): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      // Cap dimensions at 200×200 for passport-size photos
      const MAX_DIM = 200;
      let { width, height } = img;
      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      // Fill white background first so PNG transparency becomes white (not black) in JPEG
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Iteratively reduce JPEG quality until ≤ maxBytes
      let quality = 0.9;
      const tryEncode = () => {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const byteLen = Math.round((dataUrl.length * 3) / 4);
        if (byteLen <= maxBytes || quality <= 0.05) {
          // Convert data URL → Blob → File
          const binary = atob(dataUrl.split(",")[1]);
          const arr = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
          const blob = new Blob([arr], { type: "image/jpeg" });
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
        } else {
          quality = Math.max(0.05, quality - 0.1);
          tryEncode();
        }
      };
      tryEncode();
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image. Please try a different file.")) };
    img.src = url;
  });
}

function StudentForm({ form, setForm, onSave }: { form: Partial<Student>; setForm: (s: Partial<Student>) => void; onSave: () => void }) {
  const set = (k: keyof Student, v: any) => setForm({ ...form, [k]: v });
  const [uploading, setUploading] = useState(false);
  const { school } = useAuth();

  const handlePhoto = async (file: File) => {
    if (!school) return toast.error("School not set on your account");
    setUploading(true);
    try {
      // Compress to ≤ 10 KB before uploading
      const compressed = await compressImage(file, 10240);
      const filename = `${form.admission_number || crypto.randomUUID()}-${Date.now()}.jpg`;
      const path = `${school}/${filename}`;
      const { error } = await supabase.storage.from("student-photos").upload(path, compressed, { upsert: true, contentType: "image/jpeg" });
      if (error) throw error;
      const { data } = await supabase.storage.from("student-photos").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
      set("photo_url", data?.signedUrl ?? null);
      const kb = (compressed.size / 1024).toFixed(1);
      toast.success(`Photo uploaded (${kb} KB)`);
    } catch (e: any) { toast.error(e.message ?? "Upload failed"); }
    finally { setUploading(false); }
  };

  const copyAddress = () => set("correspondence_address", form.permanent_address ?? "");

  return (
    <div className="space-y-5">
      <Section title="Photo">
        <div className="flex items-center gap-4">
          {form.photo_url ? (
            <img src={form.photo_url} alt="Student" className="h-24 w-24 rounded-lg object-cover border" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground">No photo</div>
          )}
          <div>
            <Label className="text-xs">Upload passport-size photo</Label>
            <Input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp,image/gif,image/tiff,image/heic,image/heif,image/*"
              disabled={uploading}
              onChange={e => { const f = e.target.files?.[0]; if (f) handlePhoto(f); }}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Accepted: JPEG, PNG, WebP, BMP, GIF, HEIC · Auto-compressed to ≤ 10 KB</p>
            {uploading && <div className="mt-1 text-xs text-muted-foreground">Uploading…</div>}
          </div>
        </div>
      </Section>

      <Section title="Identity">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field form={form} setForm={setForm} label="Admission Number*" k="admission_number" />
          <Field form={form} setForm={setForm} label="Student Name as per Aadhaar*" k="student_name" />
          <Field form={form} setForm={setForm} label="Student Aadhaar Number" k="student_aadhaar" digitsOnly maxLength={12} />
          <div className="space-y-1.5">
            <Label className="text-xs">Gender</Label>
            <div className="flex gap-3 py-2">
              {GENDER_OPTIONS.map(g => (
                <label key={g} className="flex items-center gap-1.5 text-sm">
                  <input type="radio" checked={form.gender === g} onChange={() => set("gender", g)} />{g}
                </label>
              ))}
            </div>
          </div>
          <Field form={form} setForm={setForm} label="Date of Birth" k="date_of_birth" type="date" />
          <Field form={form} setForm={setForm} label="Blood Group" k="blood_group" />
          <Field form={form} setForm={setForm} label="Nationality" k="nationality" />
          <Field form={form} setForm={setForm} label="Religion" k="religion" />
          <Field form={form} setForm={setForm} label="Caste" k="caste" />
          <div className="space-y-1.5">
            <Label className="text-xs">Class</Label>
            <Select value={(form.class_grade as string) ?? ""} onValueChange={v => set("class_grade", v)}>
              <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
              <SelectContent>
                {CLASS_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Field form={form} setForm={setForm} label="Section" k="section" />
          <div className="space-y-1.5">
            <Label className="text-xs">Academic Year*</Label>
            <Select value={(form.academic_year as string) ?? ""} onValueChange={v => set("academic_year", v)}>
              <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>
                {ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Field form={form} setForm={setForm} label="Height (cm)" k="height_cm" type="number" />
          <Field form={form} setForm={setForm} label="Weight (kg)" k="weight_kg" type="number" />
        </div>
      </Section>

      <Section title="Father">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field form={form} setForm={setForm} label="Father Name as per Aadhaar" k="father_name" />
          <Field form={form} setForm={setForm} label="Aadhaar (12 digits)" k="father_aadhaar" digitsOnly maxLength={12} />
          <Field form={form} setForm={setForm} label="Mobile (10 digits)" k="father_mobile" digitsOnly maxLength={10} />
          <Field form={form} setForm={setForm} label="Occupation" k="father_occupation" />
        </div>
      </Section>

      <Section title="Mother">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field form={form} setForm={setForm} label="Mother Name as per Aadhaar" k="mother_name" />
          <Field form={form} setForm={setForm} label="Aadhaar (12 digits)" k="mother_aadhaar" digitsOnly maxLength={12} />
          <Field form={form} setForm={setForm} label="Mobile (10 digits)" k="mother_mobile" digitsOnly maxLength={10} />
          <Field form={form} setForm={setForm} label="Occupation" k="mother_occupation" />
        </div>
      </Section>

      <Section title="Contact">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field form={form} setForm={setForm} label="Primary Mobile (10 digits)" k="primary_mobile" digitsOnly maxLength={10} />
          <Field form={form} setForm={setForm} label="Emergency Contact (10 digits)" k="emergency_contact" digitsOnly maxLength={10} />
          <Field form={form} setForm={setForm} label="Email" k="email" type="email" />
          <div />
          <Field form={form} setForm={setForm} label="Permanent Address" k="permanent_address" />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Correspondence Address</Label>
              <button type="button" onClick={copyAddress} className="flex items-center gap-1 text-[11px] text-primary hover:underline">
                <Copy className="h-3 w-3" />Same as permanent
              </button>
            </div>
            <Input value={form.correspondence_address ?? ""} onChange={e => set("correspondence_address", e.target.value)} />
          </div>
        </div>
      </Section>

      <div className="flex justify-end gap-2">
        <Button onClick={onSave} className="bg-gradient-primary text-primary-foreground">{form.id ? "Save changes" : "Register student"}</Button>
      </div>
    </div>
  );
}
