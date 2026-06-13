import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DzYfGTbU.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { e as exportToExcel, T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, f as TableCell, p as parseDataFile, n as normalizeRow } from "./import-DQrtDw1S.mjs";
import { D as Dialog, d as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-jh833e_s.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as CLASS_OPTIONS, G as GENDER_OPTIONS } from "./constants-DQhKAzR-.mjs";
import { u as useAuth } from "./router-YwqBu5ka.mjs";
import { h as Upload, D as Download, j as Plus, e as Search, k as Pencil, l as Trash2, m as Copy } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/xlsx.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
const emptyStudent = {
  admission_number: "",
  student_name: "",
  gender: "Male",
  class_grade: "Nursery",
  section: "A",
  academic_year: "2025-26"
};
function StudentsPage() {
  const qc = useQueryClient();
  const {
    school
  } = useAuth();
  const [q, setQ] = reactExports.useState("");
  const [classFilter, setClassFilter] = reactExports.useState("all");
  const [genderFilter, setGenderFilter] = reactExports.useState("all");
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(emptyStudent);
  const importRef = reactExports.useRef(null);
  const {
    data: students = []
  } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("students").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const filtered = students.filter((s) => {
    if (classFilter !== "all" && s.class_grade !== classFilter) return false;
    if (genderFilter !== "all" && s.gender !== genderFilter) return false;
    if (q && ![s.admission_number, s.student_name, s.class_grade, s.section, s.father_name, s.primary_mobile].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const save = async () => {
    if (!form.admission_number || !form.student_name) return toast.error("Admission # and name are required");
    if (!school) return toast.error("School not set on your account");
    const digits = (v) => String(v ?? "").replace(/\D/g, "");
    for (const [label, v] of [["Student Aadhaar", form.student_aadhaar], ["Father Aadhaar", form.father_aadhaar], ["Mother Aadhaar", form.mother_aadhaar]]) if (v && digits(v).length !== 12) return toast.error(`${label} must be exactly 12 digits`);
    for (const [label, v] of [["Father Mobile", form.father_mobile], ["Mother Mobile", form.mother_mobile], ["Primary Mobile", form.primary_mobile], ["Emergency Contact", form.emergency_contact]]) if (v && digits(v).length !== 10) return toast.error(`${label} must be exactly 10 digits`);
    const payload = {
      ...form,
      school
    };
    const {
      error
    } = form.id ? await supabase.from("students").update(payload).eq("id", form.id) : await supabase.from("students").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Updated" : "Student registered");
    setOpen(false);
    setForm(emptyStudent);
    qc.invalidateQueries({
      queryKey: ["students"]
    });
  };
  const remove = async (id) => {
    if (!confirm("Delete this student? This will remove all linked records.")) return;
    const {
      error
    } = await supabase.from("students").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({
      queryKey: ["students"]
    });
  };
  const handleImport = async (file) => {
    if (!school) return toast.error("School not set on your account");
    try {
      const rows = await parseDataFile(file);
      const aliases = {
        admission_number: ["admission", "admission no", "adm no", "adm#", "admission#", "roll"],
        student_name: ["name", "student", "full name"],
        student_aadhaar: ["aadhaar", "aadhar", "student aadhar"],
        gender: ["sex"],
        date_of_birth: ["dob", "birth date"],
        blood_group: ["blood"],
        nationality: [],
        religion: [],
        caste: [],
        class_grade: ["class", "grade"],
        section: [],
        academic_year: ["year", "ay"],
        father_name: ["father"],
        father_aadhaar: ["father aadhar"],
        father_mobile: ["father phone", "father mobile no"],
        father_occupation: [],
        mother_name: ["mother"],
        mother_aadhaar: ["mother aadhar"],
        mother_mobile: ["mother phone"],
        mother_occupation: [],
        primary_mobile: ["mobile", "phone", "contact"],
        emergency_contact: ["emergency"],
        email: ["e-mail"],
        permanent_address: ["address", "permanent"],
        correspondence_address: ["correspondence", "current address"]
      };
      const mapped = rows.map((r) => normalizeRow(r, aliases)).filter((r) => r.admission_number && r.student_name);
      if (!mapped.length) return toast.error("No valid rows. Need admission number and name.");
      const payload = mapped.map((r) => ({
        ...r,
        school
      }));
      const {
        error
      } = await supabase.from("students").upsert(payload, {
        onConflict: "admission_number"
      });
      if (error) return toast.error(error.message);
      toast.success(`Imported ${mapped.length} students`);
      qc.invalidateQueries({
        queryKey: ["students"]
      });
    } catch (e) {
      toast.error(e.message ?? "Import failed");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Students" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Personal details only — fees & academics live in their own modules." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: importRef, type: "file", accept: ".csv,.xlsx,.xls,.json,.ods", className: "hidden", onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) handleImport(f);
          e.target.value = "";
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => importRef.current?.click(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
          "Import"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => exportToExcel(filtered, "students.xlsx", "Students"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
          "Export"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: (o) => {
          setOpen(o);
          if (!o) setForm(emptyStudent);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gradient-primary text-primary-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Register Student"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[85vh] overflow-y-auto sm:max-w-3xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: form.id ? "Edit student" : "Register student" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StudentForm, { form, setForm, onSave: save })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name, admission #, parent…", value: q, onChange: (e) => setQ(e.target.value), className: "max-w-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: classFilter, onValueChange: setClassFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Class" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All classes" }),
            CLASS_OPTIONS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: genderFilter, onValueChange: setGenderFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Gender" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All genders" }),
            GENDER_OPTIONS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g, children: g }, g))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto text-sm text-muted-foreground", children: [
          filtered.length,
          " of ",
          students.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Photo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Admission #" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Gender" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Father" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Mobile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          filtered.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: s.photo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.photo_url, alt: s.student_name, className: "h-9 w-9 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium", children: s.student_name?.[0] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs", children: s.admission_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/students/$id", params: {
              id: s.id
            }, className: "hover:text-primary hover:underline", children: s.student_name }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
              s.class_grade,
              " ",
              s.section && `· ${s.section}`
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: s.gender }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: s.father_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: s.primary_mobile }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
                setForm(s);
                setOpen(true);
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(s.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
            ] })
          ] }, s.id)),
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 8, className: "h-32 text-center text-muted-foreground", children: "No students match your filters." }) })
        ] })
      ] }) })
    ] })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-muted/30 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: title }),
    children
  ] });
}
function Field({
  label,
  k,
  type = "text",
  form,
  setForm,
  maxLength,
  digitsOnly
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type, inputMode: digitsOnly ? "numeric" : void 0, maxLength, value: form[k] ?? "", onChange: (e) => {
      let v = e.target.value;
      if (digitsOnly) v = v.replace(/\D/g, "").slice(0, maxLength ?? 20);
      setForm({
        ...form,
        [k]: v
      });
    } })
  ] });
}
function StudentForm({
  form,
  setForm,
  onSave
}) {
  const set = (k, v) => setForm({
    ...form,
    [k]: v
  });
  const [uploading, setUploading] = reactExports.useState(false);
  const handlePhoto = async (file) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${form.admission_number || crypto.randomUUID()}-${Date.now()}.${ext}`;
      const {
        error
      } = await supabase.storage.from("student-photos").upload(path, file, {
        upsert: true
      });
      if (error) throw error;
      const {
        data
      } = await supabase.storage.from("student-photos").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
      set("photo_url", data?.signedUrl ?? null);
      toast.success("Photo uploaded");
    } catch (e) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };
  const copyAddress = () => set("correspondence_address", form.permanent_address ?? "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Photo", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      form.photo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: form.photo_url, alt: "Student", className: "h-24 w-24 rounded-lg object-cover border" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-24 w-24 items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground", children: "No photo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Upload passport-size photo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "file", accept: "image/*", disabled: uploading, onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) handlePhoto(f);
        } }),
        uploading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: "Uploading…" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Identity", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Admission Number*", k: "admission_number" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Student Name as per Aadhaar*", k: "student_name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Student Aadhaar Number", k: "student_aadhaar", digitsOnly: true, maxLength: 12 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Gender" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 py-2", children: GENDER_OPTIONS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", checked: form.gender === g, onChange: () => set("gender", g) }),
          g
        ] }, g)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Date of Birth", k: "date_of_birth", type: "date" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Blood Group", k: "blood_group" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Nationality", k: "nationality" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Religion", k: "religion" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Caste", k: "caste" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Class" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.class_grade ?? "", onValueChange: (v) => set("class_grade", v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select class" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CLASS_OPTIONS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Section", k: "section" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Academic Year", k: "academic_year" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Height (cm)", k: "height_cm", type: "number" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Weight (kg)", k: "weight_kg", type: "number" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Father", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Father Name as per Aadhaar", k: "father_name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Aadhaar (12 digits)", k: "father_aadhaar", digitsOnly: true, maxLength: 12 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Mobile (10 digits)", k: "father_mobile", digitsOnly: true, maxLength: 10 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Occupation", k: "father_occupation" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Mother", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Mother Name as per Aadhaar", k: "mother_name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Aadhaar (12 digits)", k: "mother_aadhaar", digitsOnly: true, maxLength: 12 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Mobile (10 digits)", k: "mother_mobile", digitsOnly: true, maxLength: 10 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Occupation", k: "mother_occupation" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Contact", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Primary Mobile (10 digits)", k: "primary_mobile", digitsOnly: true, maxLength: 10 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Emergency Contact (10 digits)", k: "emergency_contact", digitsOnly: true, maxLength: 10 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Email", k: "email", type: "email" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { form, setForm, label: "Permanent Address", k: "permanent_address" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Correspondence Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: copyAddress, className: "flex items-center gap-1 text-[11px] text-primary hover:underline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }),
            "Same as permanent"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.correspondence_address ?? "", onChange: (e) => set("correspondence_address", e.target.value) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onSave, className: "bg-gradient-primary text-primary-foreground", children: form.id ? "Save changes" : "Register student" }) })
  ] });
}
export {
  StudentsPage as component
};
