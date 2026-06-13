import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DzYfGTbU.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { R as Route } from "./router-YwqBu5ka.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, X as XAxis, Y as YAxis, T as Tooltip, a as Bar } from "../_libs/recharts.mjs";

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
import "../_libs/lodash.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function StudentDashboard() {
  const {
    id
  } = Route.useParams();
  const {
    data
  } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const [s2, marks, att2, fees] = await Promise.all([supabase.from("students").select("*").eq("id", id).single(), supabase.from("academic_marks").select("*, subjects(name)").eq("student_id", id), supabase.from("attendance_summary").select("*").eq("student_id", id).maybeSingle(), supabase.from("tuition_fees").select("*").eq("student_id", id).maybeSingle()]);
      return {
        student: s2.data,
        marks: marks.data ?? [],
        attendance: att2.data,
        fees: fees.data
      };
    }
  });
  if (!data?.student) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Loading…" });
  const s = data.student;
  const chartData = (data.marks ?? []).map((m) => ({
    subject: m.subjects?.name ?? "—",
    Term1: Number(m.term1_marks ?? 0),
    Term2: Number(m.term2_marks ?? 0),
    Term3: Number(m.term3_marks ?? 0)
  }));
  const att = data.attendance;
  const pct = att && att.total_working_days ? Math.round((att.days_present ?? 0) / att.total_working_days * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/students", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
      "Back"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-5 lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-primary text-2xl font-bold text-primary-foreground shadow-elegant", children: s.student_name?.[0] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: s.student_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
            "Roll: ",
            s.admission_number,
            " · ",
            s.class_grade,
            " ",
            s.section
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid gap-2 text-sm sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "DOB", v: s.date_of_birth }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Gender", v: s.gender }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Father", v: s.father_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Mother", v: s.mother_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Mobile", v: s.primary_mobile }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Email", v: s.email })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Attendance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-4xl font-bold text-gradient-primary", children: [
          pct,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          att?.days_present ?? 0,
          " / ",
          att?.total_working_days ?? 0,
          " days"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-semibold", children: "Subject performance" }),
      chartData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-muted-foreground text-sm", children: "No marks recorded yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: chartData, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "subject", tick: {
          fontSize: 12
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
          fontSize: 12
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "Term1", fill: "oklch(0.48 0.18 265)", radius: [4, 4, 0, 0] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "Term2", fill: "oklch(0.62 0.20 270)", radius: [4, 4, 0, 0] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "Term3", fill: "oklch(0.78 0.16 75)", radius: [4, 4, 0, 0] })
      ] }) }) })
    ] })
  ] });
}
function Info({
  label,
  v
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
      label,
      ": "
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: v || "—" })
  ] });
}
export {
  StudentDashboard as component
};
