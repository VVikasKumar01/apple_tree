import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DzYfGTbU.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { c as cn, B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { e as exportToExcel, T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, f as TableCell, p as parseDataFile, n as normalizeRow } from "./import-DQrtDw1S.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { D as Dialog, a as DialogContent } from "./dialog-jh833e_s.mjs";
import { c as currentAcademicYear } from "./types-OpNY14RF.mjs";
import { C as CLASS_OPTIONS, G as GENDER_OPTIONS } from "./constants-DQhKAzR-.mjs";
import { u as useAuth, s as schoolName } from "./router-YwqBu5ka.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as Search, h as Upload, D as Download, j as Plus, l as Trash2, s as Printer } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";


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
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/xlsx.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
function AcademicsPage() {
  const year = currentAcademicYear();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Academics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Marks · attendance · subjects · report card · ",
        year
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "marks", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "marks", children: "Marks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "attendance", children: "Attendance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "subjects", children: "Subjects" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "report", children: "Report Card" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "marks", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarksTab, { year }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "attendance", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AttendanceTab, { year }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "subjects", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SubjectsTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "report", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReportCardTab, { year }) })
    ] })
  ] });
}
function useStudents() {
  return useQuery({
    queryKey: ["students-list-full"],
    queryFn: async () => (await supabase.from("students").select("*").order("student_name")).data ?? []
  });
}
function MarksTab({
  year
}) {
  const qc = useQueryClient();
  const {
    school
  } = useAuth();
  const [studentId, setStudentId] = reactExports.useState("");
  const [q, setQ] = reactExports.useState("");
  const [classFilter, setClassFilter] = reactExports.useState("all");
  const [genderFilter, setGenderFilter] = reactExports.useState("all");
  const importRef = reactExports.useRef(null);
  const {
    data: students = []
  } = useStudents();
  const {
    data: subjects = []
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => (await supabase.from("subjects").select("*").order("name")).data ?? []
  });
  const {
    data: marks = []
  } = useQuery({
    queryKey: ["marks", studentId, year],
    enabled: !!studentId,
    queryFn: async () => (await supabase.from("academic_marks").select("*").eq("student_id", studentId).eq("academic_year", year)).data ?? []
  });
  const filteredStudents = students.filter((s) => {
    if (classFilter !== "all" && s.class_grade !== classFilter) return false;
    if (genderFilter !== "all" && s.gender !== genderFilter) return false;
    if (q && !`${s.admission_number} ${s.student_name}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const setMark = async (subject_id, patch) => {
    if (!school) return toast.error("School not set on your account");
    const {
      error
    } = await supabase.from("academic_marks").upsert({
      student_id: studentId,
      academic_year: year,
      subject_id,
      school,
      ...patch
    }, {
      onConflict: "student_id,academic_year,subject_id"
    });
    if (error) toast.error(error.message);
    else qc.invalidateQueries({
      queryKey: ["marks", studentId, year]
    });
  };
  const mmap = new Map(marks.map((m) => [m.subject_id, m]));
  const handleImport = async (file) => {
    if (!school) return toast.error("School not set");
    try {
      const data = await parseDataFile(file);
      const byAdm = new Map(students.map((s) => [String(s.admission_number).trim(), s.id]));
      const subjByName = new Map(subjects.map((s) => [String(s.name).toLowerCase().trim(), s.id]));
      const aliases = {
        admission_number: ["admission", "adm no"],
        subject: ["subject name"],
        term1_marks: ["t1", "term1"],
        term2_marks: ["t2", "term2"],
        term3_marks: ["t3", "term3"],
        max_marks: ["max", "out of"]
      };
      const payload = [];
      for (const r of data.map((x) => normalizeRow(x, aliases))) {
        const sid = byAdm.get(String(r.admission_number).trim());
        const subjId = subjByName.get(String(r.subject ?? "").toLowerCase().trim());
        if (!sid || !subjId) continue;
        payload.push({
          student_id: sid,
          subject_id: subjId,
          academic_year: year,
          school,
          term1_marks: r.term1_marks != null ? Number(r.term1_marks) : null,
          term2_marks: r.term2_marks != null ? Number(r.term2_marks) : null,
          term3_marks: r.term3_marks != null ? Number(r.term3_marks) : null,
          max_marks: r.max_marks != null ? Number(r.max_marks) : 100
        });
      }
      if (!payload.length) return toast.error("No rows matched students + subjects");
      const {
        error
      } = await supabase.from("academic_marks").upsert(payload, {
        onConflict: "student_id,academic_year,subject_id"
      });
      if (error) return toast.error(error.message);
      toast.success(`Imported ${payload.length} marks`);
      qc.invalidateQueries({
        queryKey: ["marks", studentId, year]
      });
    } catch (e) {
      toast.error(e.message ?? "Import failed");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search student name / admission #", value: q, onChange: (e) => setQ(e.target.value), className: "max-w-xs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: classFilter, onValueChange: setClassFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All classes" }),
          CLASS_OPTIONS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: genderFilter, onValueChange: setGenderFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All genders" }),
          GENDER_OPTIONS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g, children: g }, g))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: studentId, onValueChange: setStudentId, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select student" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: filteredStudents.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
          s.student_name,
          " (",
          s.admission_number,
          ")"
        ] }, s.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: importRef, type: "file", accept: ".csv,.xlsx,.xls,.json,.ods", className: "hidden", onChange: (e) => {
        const f = e.target.files?.[0];
        if (f) handleImport(f);
        e.target.value = "";
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => importRef.current?.click(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
        "Import"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", disabled: !studentId, onClick: () => exportToExcel(subjects.map((sub) => {
        const m = mmap.get(sub.id) ?? {};
        return {
          Subject: sub.name,
          Term1: m.term1_marks,
          Term2: m.term2_marks,
          Term3: m.term3_marks
        };
      }), `marks-${year}.xlsx`), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
        "Export"
      ] })
    ] }),
    studentId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Term 1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Term 2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Term 3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: subjects.map((sub) => {
        const m = mmap.get(sub.id) ?? {};
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: sub.name }),
          ["term1_marks", "term2_marks", "term3_marks"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", defaultValue: m[k] ?? "", className: "h-8 w-24", onBlur: (e) => setMark(sub.id, {
            [k]: e.target.value ? Number(e.target.value) : null
          }) }) }, k))
        ] }, sub.id);
      }) })
    ] })
  ] });
}
function AttendanceTab({
  year
}) {
  const qc = useQueryClient();
  const {
    school
  } = useAuth();
  const [q, setQ] = reactExports.useState("");
  const {
    data: rows = []
  } = useQuery({
    queryKey: ["attendance", year],
    queryFn: async () => {
      const {
        data: s
      } = await supabase.from("students").select("id,admission_number,student_name");
      const {
        data: a
      } = await supabase.from("attendance_summary").select("*").eq("academic_year", year);
      const m = new Map((a ?? []).map((x) => [x.student_id, x]));
      return (s ?? []).map((st) => ({
        student: st,
        att: m.get(st.id)
      }));
    }
  });
  const filtered = rows.filter(({
    student
  }) => !q || `${student.admission_number} ${student.student_name}`.toLowerCase().includes(q.toLowerCase()));
  const save = async (student_id, patch) => {
    if (!school) return toast.error("School not set on your account");
    const {
      error
    } = await supabase.from("attendance_summary").upsert({
      student_id,
      academic_year: year,
      school,
      ...patch
    }, {
      onConflict: "student_id,academic_year"
    });
    if (error) toast.error(error.message);
    else qc.invalidateQueries({
      queryKey: ["attendance", year]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name or admission #", value: q, onChange: (e) => setQ(e.target.value), className: "max-w-xs" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Adm #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Working Days" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Present" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "%" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map(({
        student,
        att
      }) => {
        const tot = att?.total_working_days ?? 0, p = att?.days_present ?? 0;
        const pct = tot ? Math.round(p / tot * 100) : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs", children: student.admission_number }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: student.student_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", defaultValue: tot, className: "h-8 w-24", onBlur: (e) => save(student.id, {
            total_working_days: Number(e.target.value || 0),
            days_present: p
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", defaultValue: p, className: "h-8 w-24", onBlur: (e) => save(student.id, {
            total_working_days: tot,
            days_present: Number(e.target.value || 0)
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
            pct,
            "%"
          ] }) })
        ] }, student.id);
      }) })
    ] })
  ] });
}
function SubjectsTab() {
  const qc = useQueryClient();
  const [name, setName] = reactExports.useState("");
  const {
    data: subjects = []
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => (await supabase.from("subjects").select("*").order("name")).data ?? []
  });
  const add = async () => {
    if (!name.trim()) return;
    const {
      error
    } = await supabase.from("subjects").insert({
      name: name.trim()
    });
    if (error) toast.error(error.message);
    else {
      setName("");
      qc.invalidateQueries({
        queryKey: ["subjects"]
      });
    }
  };
  const del = async (id) => {
    const {
      error
    } = await supabase.from("subjects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({
      queryKey: ["subjects"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "New subject…", value: name, onChange: (e) => setName(e.target.value), className: "max-w-xs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: add, className: "bg-gradient-primary text-primary-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Add"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: subjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1 text-sm", children: [
      s.name,
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => del(s.id), className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
    ] }, s.id)) })
  ] });
}
function ReportCardTab({
  year
}) {
  const {
    data: students = []
  } = useStudents();
  const {
    school
  } = useAuth();
  const [studentId, setStudentId] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const {
    data: marks = []
  } = useQuery({
    queryKey: ["report-marks", studentId, year],
    enabled: !!studentId,
    queryFn: async () => (await supabase.from("academic_marks").select("*, subjects(name)").eq("student_id", studentId).eq("academic_year", year)).data ?? []
  });
  const {
    data: att
  } = useQuery({
    queryKey: ["report-att", studentId, year],
    enabled: !!studentId,
    queryFn: async () => (await supabase.from("attendance_summary").select("*").eq("student_id", studentId).eq("academic_year", year).maybeSingle()).data
  });
  const student = students.find((s) => s.id === studentId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: studentId, onValueChange: setStudentId, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select student" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: students.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
          s.student_name,
          " (",
          s.admission_number,
          ")"
        ] }, s.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: !studentId, onClick: () => setOpen(true), className: "bg-gradient-primary text-primary-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "mr-2 h-4 w-4" }),
        "Preview / Print"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Generates a printable term-wise report card with marks and attendance." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto p-0", children: student && /* @__PURE__ */ jsxRuntimeExports.jsx(ReportCard, { student, marks, att, year, schoolLabel: schoolName(school) }) }) })
  ] });
}
function ReportCard({
  student,
  marks,
  att,
  year,
  schoolLabel
}) {
  const totals = reactExports.useMemo(() => {
    const t = {
      term1: 0,
      term2: 0,
      term3: 0,
      max: 0
    };
    for (const m of marks) {
      t.term1 += Number(m.term1_marks || 0);
      t.term2 += Number(m.term2_marks || 0);
      t.term3 += Number(m.term3_marks || 0);
      t.max += Number(m.max_marks || 100);
    }
    return t;
  }, [marks]);
  const grandTotal = totals.term1 + totals.term2 + totals.term3;
  const grandMax = totals.max * 3;
  const percent = grandMax > 0 ? grandTotal / grandMax * 100 : 0;
  const grade = percent >= 90 ? "A+" : percent >= 80 ? "A" : percent >= 70 ? "B+" : percent >= 60 ? "B" : percent >= 50 ? "C" : percent >= 35 ? "D" : "E";
  const remarks = percent >= 80 ? "Excellent performance." : percent >= 60 ? "Good progress, keep it up." : percent >= 40 ? "Needs improvement." : "Requires significant support.";
  const attPct = att?.total_working_days ? Math.round((att.days_present ?? 0) / att.total_working_days * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white text-black", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@media print {
        body * { visibility: hidden; }
        #report-card, #report-card * { visibility: visible; }
        #report-card { position: absolute; left: 0; top: 0; width: 100%; padding: 24px; }
        .no-print { display: none !important; }
      }` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "report-card", className: "p-8 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-gray-500", children: schoolLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Term-wise Report Card" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600", children: [
            "Academic Year: ",
            year
          ] })
        ] }),
        student.photo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: student.photo_url, alt: student.student_name, className: "h-24 w-24 rounded border object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-24 w-24 items-center justify-center rounded border bg-gray-100 text-xs text-gray-400", children: "No photo" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-6 gap-y-1 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Name:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: student.student_name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Admission #:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: student.admission_number })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Class:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
            student.class_grade,
            " ",
            student.section
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Gender:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: student.gender })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Father:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: student.father_name ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Mother:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: student.mother_name ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "DOB:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: student.date_of_birth ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Contact:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: student.primary_mobile ?? "—" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border p-2 text-left", children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border p-2 text-right", children: "Term 1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border p-2 text-right", children: "Term 2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border p-2 text-right", children: "Term 3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border p-2 text-right", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border p-2 text-right", children: "Max" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          marks.map((m) => {
            const tot = Number(m.term1_marks || 0) + Number(m.term2_marks || 0) + Number(m.term3_marks || 0);
            const max = Number(m.max_marks || 100) * 3;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border p-2", children: m.subjects?.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border p-2 text-right", children: m.term1_marks ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border p-2 text-right", children: m.term2_marks ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border p-2 text-right", children: m.term3_marks ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border p-2 text-right font-semibold", children: tot }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border p-2 text-right text-gray-500", children: max })
            ] }, m.id);
          }),
          marks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "border p-4 text-center text-gray-500", children: "No marks recorded." }) }),
          marks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50 font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border p-2", children: "Grand Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border p-2 text-right", children: totals.term1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border p-2 text-right", children: totals.term2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border p-2 text-right", children: totals.term3 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border p-2 text-right", children: grandTotal }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border p-2 text-right", children: grandMax })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-500 text-xs", children: "Percentage" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-bold", children: [
            percent.toFixed(1),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-500 text-xs", children: "Grade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold", children: grade })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-500 text-xs", children: "Attendance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-bold", children: [
            attPct,
            "% ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500", children: [
              "(",
              att?.days_present ?? 0,
              "/",
              att?.total_working_days ?? 0,
              ")"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border p-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Remarks: " }),
        remarks
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-8 pt-12 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t pt-1 text-center text-gray-600", children: "Class Teacher" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t pt-1 text-center text-gray-600", children: "Principal" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "no-print flex justify-end pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => window.print(), className: "bg-gradient-primary text-primary-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "mr-2 h-4 w-4" }),
        "Print"
      ] }) })
    ] })
  ] });
}
export {
  AcademicsPage as component
};
