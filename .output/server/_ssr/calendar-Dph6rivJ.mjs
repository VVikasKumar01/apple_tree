import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DzYfGTbU.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { B as Button, c as cn } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { C as Calendar } from "./calendar-CveHY8mc.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth } from "./router-BTkK5XoE.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogDescription } from "./dialog-CZ3oge5o.mjs";
import { D as Download, n as Plus, T as Trash2 } from "../_libs/lucide-react.mjs";

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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
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
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
function CalendarPage() {
  const qc = useQueryClient();
  const {
    school
  } = useAuth();
  const [form, setForm] = reactExports.useState({
    title: "",
    event_date: "",
    event_type: "event",
    description: ""
  });
  const [month, setMonth] = reactExports.useState(/* @__PURE__ */ new Date());
  const [selectedDate, setSelectedDate] = reactExports.useState(/* @__PURE__ */ new Date());
  const [dialogEvent, setDialogEvent] = reactExports.useState(null);
  const {
    data: events = []
  } = useQuery({
    queryKey: ["events", school],
    enabled: !!school,
    queryFn: async () => (await supabase.from("calendar_events").select("*").eq("school", school).order("event_date")).data ?? []
  });
  const modifiers = reactExports.useMemo(() => {
    const toDate = (d) => {
      const [y, m, day] = d.split("-").map(Number);
      return new Date(y, m - 1, day);
    };
    return {
      holiday: events.filter((e) => e.event_type === "holiday").map((e) => toDate(e.event_date)),
      working: events.filter((e) => e.event_type === "working").map((e) => toDate(e.event_date)),
      event: events.filter((e) => e.event_type === "event").map((e) => toDate(e.event_date))
    };
  }, [events]);
  const modifiersClassNames = {
    holiday: "bg-destructive/20 text-destructive font-semibold rounded-md",
    working: "bg-success/20 text-success font-semibold rounded-md",
    event: "bg-primary/20 text-primary font-semibold rounded-md"
  };
  const add = async () => {
    if (!form.title || !form.event_date) return toast.error("Title and date required");
    if (!school) return toast.error("School not set on your account");
    const {
      data,
      error
    } = await supabase.from("calendar_events").insert({
      ...form,
      school
    }).select().single();
    if (error) toast.error(error.message);
    else {
      setForm({
        title: "",
        event_date: "",
        event_type: "event",
        description: ""
      });
      qc.invalidateQueries({
        queryKey: ["events"]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard-stats"]
      });
      toast.success("Event added successfully!");
      if (data) setDialogEvent(data);
    }
  };
  const del = async (id) => {
    await supabase.from("calendar_events").delete().eq("id", id);
    qc.invalidateQueries({
      queryKey: ["events"]
    });
    qc.invalidateQueries({
      queryKey: ["dashboard-stats"]
    });
  };
  const colorFor = (t) => t === "holiday" ? "bg-destructive/10 text-destructive" : t === "working" ? "bg-success/10 text-success" : "bg-primary/10 text-primary";
  const exportICS = () => {
    const fmt = (d) => d.replaceAll("-", "");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//School Calendar//EN", ...events.flatMap((e) => ["BEGIN:VEVENT", `UID:${e.id}@school`, `SUMMARY:${(e.title || "").replace(/\n/g, " ")}`, `DESCRIPTION:${((e.description || "") + " [" + e.event_type + "]").replace(/\n/g, " ")}`, `DTSTART;VALUE=DATE:${fmt(e.event_date)}`, `DTEND;VALUE=DATE:${fmt(e.event_date)}`, "END:VEVENT"]), "END:VCALENDAR"];
    const blob = new Blob([lines.join("\r\n")], {
      type: "text/calendar"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "school-calendar.ics";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    if (date) {
      const match = events.find((e) => {
        const [y, m, day] = e.event_date.split("-").map(Number);
        return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === day;
      });
      if (match) {
        setDialogEvent(match);
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Calendar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: exportICS, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
        "Export .ics (Google / Apple)"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { mode: "single", month, onMonthChange: setMonth, selected: selectedDate, onSelect: handleSelectDate, className: "mx-auto", modifiers, modifiersClassNames }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-3 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded bg-destructive/30" }),
            "Holiday"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded bg-success/30" }),
            "Working day"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded bg-primary/30" }),
            "Event"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Add to calendar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.title, onChange: (e) => setForm({
          ...form,
          title: e.target.value
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: form.event_date, onChange: (e) => setForm({
          ...form,
          event_date: e.target.value
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.event_type, onValueChange: (v) => setForm({
          ...form,
          event_type: v
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "holiday", children: "Holiday" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "working", children: "Working day" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "event", children: "Event" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: form.description, onChange: (e) => setForm({
          ...form,
          description: e.target.value
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: add, className: "w-full bg-gradient-primary text-primary-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Add"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-semibold", children: "All entries" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        events.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-md border p-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-2 py-0.5 text-xs font-medium ${colorFor(e.event_type)}`, children: e.event_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: e.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: e.event_date })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => del(e.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
        ] }, e.id)),
        events.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6 text-center text-sm text-muted-foreground", children: "No events yet." })
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
  CalendarPage as component
};
