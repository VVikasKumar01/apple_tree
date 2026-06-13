import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DzYfGTbU.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { B as Button, c as cn } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { e as exportToExcel, T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, f as TableCell, p as parseDataFile, n as normalizeRow } from "./import-DQrtDw1S.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-jh833e_s.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as currentAcademicYear, i as inr } from "./types-OpNY14RF.mjs";
import { C as CLASS_OPTIONS, G as GENDER_OPTIONS } from "./constants-DQhKAzR-.mjs";
import { u as useAuth } from "./router-YwqBu5ka.mjs";
import { h as Upload, D as Download, e as Search, i as Save } from "../_libs/lucide-react.mjs";

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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/xlsx.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
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
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
function TuitionPage() {
  const qc = useQueryClient();
  const {
    school
  } = useAuth();
  const year = currentAcademicYear();
  const [editing, setEditing] = reactExports.useState(null);
  const [q, setQ] = reactExports.useState("");
  const [classFilter, setClassFilter] = reactExports.useState("all");
  const [genderFilter, setGenderFilter] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const importRef = reactExports.useRef(null);
  const {
    data: rows = []
  } = useQuery({
    queryKey: ["tuition", year],
    queryFn: async () => {
      const {
        data: students
      } = await supabase.from("students").select("id,admission_number,student_name,class_grade,section,gender");
      const {
        data: fees
      } = await supabase.from("tuition_fees").select("*").eq("academic_year", year);
      const fmap = new Map((fees ?? []).map((f) => [f.student_id, f]));
      return (students ?? []).map((s) => ({
        student: s,
        fee: fmap.get(s.id) ?? null
      }));
    }
  });
  const computed = rows.map((r) => {
    const f = r.fee || {};
    const finalized = Number(f.finalized_fee || 0) || Number(f.term1_fee || 0) + Number(f.term2_fee || 0) + Number(f.term3_fee || 0);
    const paid = ["term1", "term2", "term3"].reduce((sum, t) => sum + (f[`${t}_status`] === "Paid" ? Number(f[`${t}_fee`] || 0) : 0), 0);
    let status = "unpaid";
    if (finalized > 0 && paid >= finalized) status = "fully";
    else if (paid > 0) status = "partial";
    return {
      ...r,
      finalized,
      actual: Number(f.total_annual_fee || 0),
      paid,
      status
    };
  });
  const filtered = computed.filter((r) => {
    if (classFilter !== "all" && r.student.class_grade !== classFilter) return false;
    if (genderFilter !== "all" && r.student.gender !== genderFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (q && !`${r.student.admission_number} ${r.student.student_name}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const save = async (form) => {
    if (!school) return toast.error("School not set on your account");
    const {
      student_name: _omit,
      ...rest
    } = form;
    const payload = {
      ...rest,
      academic_year: year,
      school
    };
    const {
      error
    } = form.id ? await supabase.from("tuition_fees").update(payload).eq("id", form.id) : await supabase.from("tuition_fees").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({
      queryKey: ["tuition", year]
    });
  };
  const handleImport = async (file) => {
    if (!school) return toast.error("School not set on your account");
    try {
      const data = await parseDataFile(file);
      const {
        data: students
      } = await supabase.from("students").select("id,admission_number");
      const byAdm = new Map((students ?? []).map((s) => [String(s.admission_number).trim(), s.id]));
      const aliases = {
        admission_number: ["admission", "adm no", "adm#", "admission#"],
        total_annual_fee: ["actual fee", "list fee", "standard fee"],
        finalized_fee: ["finalized", "final fee", "agreed fee"],
        term1_fee: ["t1", "term1"],
        term2_fee: ["t2", "term2"],
        term3_fee: ["t3", "term3"],
        term1_status: [],
        term2_status: [],
        term3_status: []
      };
      const mapped = data.map((r) => normalizeRow(r, aliases));
      const payload = [];
      for (const m of mapped) {
        const sid = byAdm.get(String(m.admission_number).trim());
        if (!sid) continue;
        const {
          admission_number,
          ...rest
        } = m;
        payload.push({
          ...rest,
          student_id: sid,
          academic_year: year,
          school
        });
      }
      if (!payload.length) return toast.error("No matching students by admission #");
      const {
        error
      } = await supabase.from("tuition_fees").upsert(payload, {
        onConflict: "student_id,academic_year"
      });
      if (error) return toast.error(error.message);
      toast.success(`Imported ${payload.length} rows`);
      qc.invalidateQueries({
        queryKey: ["tuition", year]
      });
    } catch (e) {
      toast.error(e.message ?? "Import failed");
    }
  };
  const exportRows = filtered.map((r) => ({
    "Admission #": r.student.admission_number,
    Name: r.student.student_name,
    Class: r.student.class_grade,
    "Actual Fee": r.actual,
    "Finalized Fee": r.finalized,
    Paid: r.paid,
    Pending: r.finalized - r.paid,
    Status: r.status
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Tuition Fees" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Academic Year ",
          year,
          " · tally is against the finalized fee"
        ] })
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => exportToExcel(exportRows, `tuition-${year}.xlsx`, "Tuition"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
          "Export"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name or admission #", value: q, onChange: (e) => setQ(e.target.value), className: "max-w-xs" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: (v) => setStatusFilter(v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All statuses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fully", children: "Fully paid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "partial", children: "Partially paid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unpaid", children: "Unpaid" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto text-sm text-muted-foreground", children: [
          filtered.length,
          " of ",
          rows.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Adm #" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actual Fee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Finalized Fee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Paid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {})
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          filtered.map(({
            student,
            fee,
            actual,
            finalized,
            paid,
            status
          }) => {
            const f = fee || {};
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: status === "fully" ? "bg-success/5" : status === "unpaid" && finalized > 0 ? "bg-destructive/5" : "", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs", children: student.admission_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: student.student_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
                student.class_grade,
                " ",
                student.section
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-muted-foreground", children: inr(actual) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-semibold", children: inr(finalized) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-success", children: inr(paid) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-destructive", children: inr(Math.max(finalized - paid, 0)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: status === "fully" ? "default" : status === "partial" ? "secondary" : "destructive", className: "text-[10px]", children: status === "fully" ? "Fully Paid" : status === "partial" ? "Partially Paid" : "Unpaid" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => setEditing({
                student_id: student.id,
                ...f,
                student_name: student.student_name
              }), children: "Edit" }) })
            ] }, student.id);
          }),
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 9, className: "h-24 text-center text-muted-foreground", children: "No records match your filters." }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (o) => !o && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[85vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Fees — ",
        editing?.student_name
      ] }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsx(FeeForm, { form: editing, setForm: setEditing, onSave: () => save(editing) })
    ] }) })
  ] });
}
function FeeForm({
  form,
  setForm,
  onSave
}) {
  const set = (k, v) => setForm({
    ...form,
    [k]: v
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Actual Fee (₹) — standard/list" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.total_annual_fee ?? "", onChange: (e) => set("total_annual_fee", e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Finalized Fee (₹) — after discount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.finalized_fee ?? "", onChange: (e) => set("finalized_fee", e.target.value) })
      ] })
    ] }),
    ["term1", "term2", "term3"].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-muted/30 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
        "Term ",
        i + 1
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Amount (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form[`${t}_fee`] ?? "", onChange: (e) => set(`${t}_fee`, e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form[`${t}_status`] ?? "Unpaid", onValueChange: (v) => set(`${t}_status`, v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Paid", children: "Paid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Unpaid", children: "Unpaid" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Payment Mode" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form[`${t}_payment_mode`] ?? "", onValueChange: (v) => set(`${t}_payment_mode`, v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["Cash", "Card", "Cheque", "Online", "PhonePe", "Google Pay", "Paytm"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: m }, m)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Payment Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: form[`${t}_payment_date`] ?? "", onChange: (e) => set(`${t}_payment_date`, e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "UPI / Txn ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form[`${t}_txn_id`] ?? "", onChange: (e) => set(`${t}_txn_id`, e.target.value) })
        ] })
      ] })
    ] }, t)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onSave, className: "bg-gradient-primary text-primary-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
      "Save"
    ] }) })
  ] });
}
export {
  TuitionPage as component
};
