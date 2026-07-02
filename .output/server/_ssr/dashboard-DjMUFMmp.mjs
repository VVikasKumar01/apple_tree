import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DzYfGTbU.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { C as Calendar } from "./calendar-CveHY8mc.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { u as useAcademicYear, i as inr, a as ACADEMIC_YEARS } from "./constants-C7cxSjft.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogDescription } from "./dialog-CZ3oge5o.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { u as useAuth } from "./router-BTkK5XoE.mjs";
import "../_libs/sonner.mjs";
import { U as Users, q as CircleAlert, r as TrendingUp, W as Wallet } from "../_libs/lucide-react.mjs";

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
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function Dashboard() {
  const {
    school
  } = useAuth();
  const {
    year,
    setYear
  } = useAcademicYear();
  const [selectedDate, setSelectedDate] = reactExports.useState(/* @__PURE__ */ new Date());
  const [dialogEvent, setDialogEvent] = reactExports.useState(null);
  const {
    data: stats
  } = useQuery({
    queryKey: ["dashboard-stats", year, school],
    enabled: !!school,
    queryFn: async () => {
      const [startY, endY] = year.split("-").map(Number);
      const startDate = `${startY}-04-01`;
      const endDate = `${endY}-03-31`;
      const [s, t, e] = await Promise.all([supabase.from("students").select("id", {
        count: "exact",
        head: true
      }).eq("academic_year", year).eq("school", school), supabase.from("tuition_fees").select("term1_fee,term2_fee,term3_fee,term1_status,term2_status,term3_status,finalized_fee").eq("academic_year", year).eq("school", school), supabase.from("calendar_events").select("*").eq("school", school).gte("event_date", startDate).lte("event_date", endDate).order("event_date", {
        ascending: true
      })]);
      let pending = 0, collected = 0;
      for (const r of t.data ?? []) {
        const t1 = Number(r.term1_fee || 0), t2 = Number(r.term2_fee || 0), t3 = Number(r.term3_fee || 0);
        if (r.term1_status === "Paid") collected += t1;
        else pending += t1;
        if (r.term2_status === "Paid") collected += t2;
        else pending += t2;
        if (r.term3_status === "Paid") collected += t3;
        else pending += t3;
      }
      return {
        students: s.count ?? 0,
        pending,
        collected,
        events: e.data ?? []
      };
    }
  });
  const modifiers = reactExports.useMemo(() => {
    const toDate = (d) => {
      const [y, m, day] = d.split("-").map(Number);
      return new Date(y, m - 1, day);
    };
    const evs = stats?.events ?? [];
    return {
      holiday: evs.filter((e) => e.event_type === "holiday").map((e) => toDate(e.event_date)),
      working: evs.filter((e) => e.event_type === "working").map((e) => toDate(e.event_date)),
      event: evs.filter((e) => e.event_type === "event").map((e) => toDate(e.event_date))
    };
  }, [stats?.events]);
  const modifiersClassNames = {
    holiday: "bg-destructive/20 text-destructive font-semibold rounded-md",
    working: "bg-success/20 text-success font-semibold rounded-md",
    event: "bg-primary/20 text-primary font-semibold rounded-md"
  };
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    if (date) {
      const evs = stats?.events ?? [];
      const match = evs.find((e) => {
        const [y, m, day] = e.event_date.split("-").map(Number);
        return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === day;
      });
      if (match) {
        setDialogEvent(match);
      }
    }
  };
  const colorFor = (t) => t === "holiday" ? "bg-destructive/10 text-destructive" : t === "working" ? "bg-success/10 text-success" : "bg-primary/10 text-primary";
  const cards = [{
    label: "Total Students",
    value: stats?.students ?? 0,
    icon: Users,
    accent: "from-indigo-500 to-violet-500"
  }, {
    label: "Pending Fees",
    value: inr(stats?.pending ?? 0),
    icon: CircleAlert,
    accent: "from-rose-500 to-red-500"
  }, {
    label: "Collected (Year)",
    value: inr(stats?.collected ?? 0),
    icon: TrendingUp,
    accent: "from-emerald-500 to-teal-500"
  }, {
    label: "Active Modules",
    value: 6,
    icon: Wallet,
    accent: "from-amber-500 to-orange-500"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Welcome back 👋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          "Tracking data for academic year ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: year }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Academic Year:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: year, onValueChange: setYear, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ACADEMIC_YEARS.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: y, children: y }, y)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: c.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-2xl font-bold", children: c.value })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent} text-white shadow-elegant`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-5 w-5" }) })
    ] }) }, c.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-lg font-semibold", children: "Quick actions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/students", className: "rounded-lg border p-4 transition hover:border-primary/50 hover:shadow-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mb-2 h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Manage students" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Personal details" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/tuition-fees", className: "rounded-lg border p-4 transition hover:border-primary/50 hover:shadow-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "mb-2 h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Record fees" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Term-wise payments" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/academics", className: "rounded-lg border p-4 transition hover:border-primary/50 hover:shadow-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "mb-2 h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Enter marks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Subject-wise per term" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-lg font-semibold", children: "Calendar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { mode: "single", selected: selectedDate, onSelect: handleSelectDate, className: "rounded-md border mx-auto", modifiers, modifiersClassNames }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-muted-foreground", children: "Upcoming" }),
          (stats?.events ?? []).slice(0, 5).map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setDialogEvent(e), className: "flex w-full items-center justify-between text-sm py-1 px-1.5 rounded hover:bg-muted/50 text-left transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-medium", children: e.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0 ml-2", children: e.event_date })
          ] }, e.id)),
          (stats?.events?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "No events yet. Add one in Calendar." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!dialogEvent, onOpenChange: (o) => !o && setDialogEvent(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorFor(dialogEvent?.event_type ?? "")}`, children: dialogEvent?.event_type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: dialogEvent?.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-xs font-mono pt-1", children: [
          "Event Date: ",
          dialogEvent?.event_date
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground bg-muted/30 p-3 rounded-lg border", children: dialogEvent?.description || "No description provided." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setDialogEvent(null), variant: "outline", size: "sm", children: "Close" }) })
      ] })
    ] }) })
  ] });
}
export {
  Dashboard as component
};
