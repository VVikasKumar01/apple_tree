import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DzYfGTbU.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { e as exportToExcel, T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, f as TableCell, p as parseDataFile, n as normalizeRow } from "./import-DQrtDw1S.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { c as currentAcademicYear } from "./types-OpNY14RF.mjs";
import { C as CLASS_OPTIONS } from "./constants-DQhKAzR-.mjs";
import { u as useAuth } from "./router-YwqBu5ka.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { h as Upload, D as Download, e as Search } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/xlsx.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
function OtherFeesPage() {
  const qc = useQueryClient();
  const {
    school
  } = useAuth();
  const year = currentAcademicYear();
  const [q, setQ] = reactExports.useState("");
  const [classFilter, setClassFilter] = reactExports.useState("all");
  const [booksFilter, setBooksFilter] = reactExports.useState("all");
  const [uniformFilter, setUniformFilter] = reactExports.useState("all");
  const importRef = reactExports.useRef(null);
  const {
    data: rows = []
  } = useQuery({
    queryKey: ["other-fees", year],
    queryFn: async () => {
      const {
        data: students
      } = await supabase.from("students").select("id,admission_number,student_name,class_grade");
      const {
        data: fees
      } = await supabase.from("other_fees").select("*").eq("academic_year", year);
      const m = new Map((fees ?? []).map((f) => [f.student_id, f]));
      return (students ?? []).map((s) => ({
        student: s,
        of: m.get(s.id) ?? null
      }));
    }
  });
  const filtered = rows.filter(({
    student,
    of
  }) => {
    if (classFilter !== "all" && student.class_grade !== classFilter) return false;
    const bs = of?.books_status ?? "Not Issued";
    const us = of?.uniform_status ?? "Not Issued";
    if (booksFilter !== "all" && bs !== booksFilter) return false;
    if (uniformFilter !== "all" && us !== uniformFilter) return false;
    if (q && !`${student.admission_number} ${student.student_name}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const upsert = async (student_id, patch) => {
    if (!school) return toast.error("School not set on your account");
    const {
      error
    } = await supabase.from("other_fees").upsert({
      student_id,
      academic_year: year,
      school,
      ...patch
    }, {
      onConflict: "student_id,academic_year"
    });
    if (error) return toast.error(error.message);
    qc.invalidateQueries({
      queryKey: ["other-fees", year]
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
        admission_number: ["admission", "adm no", "adm#"],
        books_allotted: ["books"],
        books_status: ["book status"],
        uniform_size: ["uniform"],
        uniform_status: [],
        notes: []
      };
      const payload = [];
      for (const r of data.map((x) => normalizeRow(x, aliases))) {
        const sid = byAdm.get(String(r.admission_number).trim());
        if (!sid) continue;
        const {
          admission_number,
          ...rest
        } = r;
        payload.push({
          ...rest,
          student_id: sid,
          academic_year: year,
          school
        });
      }
      if (!payload.length) return toast.error("No matching students");
      const {
        error
      } = await supabase.from("other_fees").upsert(payload, {
        onConflict: "student_id,academic_year"
      });
      if (error) return toast.error(error.message);
      toast.success(`Imported ${payload.length} rows`);
      qc.invalidateQueries({
        queryKey: ["other-fees", year]
      });
    } catch (e) {
      toast.error(e.message ?? "Import failed");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Other Fees" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Books & uniform issue tracking · ",
          year
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => exportToExcel(filtered.map((r) => ({
          "Admission #": r.student.admission_number,
          Name: r.student.student_name,
          Class: r.student.class_grade,
          Books: r.of?.books_allotted,
          "Books Status": r.of?.books_status ?? "Not Issued",
          "Uniform Size": r.of?.uniform_size,
          "Uniform Status": r.of?.uniform_status ?? "Not Issued"
        })), `other-fees-${year}.xlsx`), children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: booksFilter, onValueChange: setBooksFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Books" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Books (all)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Issued", children: "Books Issued" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Not Issued", children: "Books Not Issued" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: uniformFilter, onValueChange: setUniformFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Uniform" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Uniform (all)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Issued", children: "Uniform Issued" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Not Issued", children: "Uniform Not Issued" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto text-sm text-muted-foreground", children: [
          filtered.length,
          " of ",
          rows.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Adm #" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Books Allotted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Books Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Uniform Size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Uniform Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          filtered.map(({
            student,
            of
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs", children: student.admission_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: student.student_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { defaultValue: of?.books_allotted ?? "", onBlur: (e) => upsert(student.id, {
              books_allotted: e.target.value
            }), className: "h-8" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { defaultValue: of?.books_status ?? "Not Issued", onValueChange: (v) => upsert(student.id, {
              books_status: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Issued", children: "Issued" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Not Issued", children: "Not Issued" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { defaultValue: of?.uniform_size ?? "", onBlur: (e) => upsert(student.id, {
              uniform_size: e.target.value
            }), className: "h-8 w-20" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { defaultValue: of?.uniform_status ?? "Not Issued", onValueChange: (v) => upsert(student.id, {
              uniform_status: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Issued", children: "Issued" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Not Issued", children: "Not Issued" })
              ] })
            ] }) })
          ] }, student.id)),
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "h-24 text-center text-muted-foreground", children: "No records match." }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  OtherFeesPage as component
};
