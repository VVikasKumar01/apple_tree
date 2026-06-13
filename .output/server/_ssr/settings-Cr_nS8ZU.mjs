import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DzYfGTbU.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { t as toast } from "../_libs/sonner.mjs";

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
function SettingsPage() {
  const qc = useQueryClient();
  const {
    data
  } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await supabase.from("app_settings").select("*")).data ?? []
  });
  const [fee, setFee] = reactExports.useState({
    paid: "#10b981",
    unpaid: "#ef4444"
  });
  const [cal, setCal] = reactExports.useState({
    holiday: "#ef4444",
    working: "#10b981",
    event: "#6366f1"
  });
  reactExports.useEffect(() => {
    const f = data?.find((d) => d.key === "fee_colors")?.value;
    const c = data?.find((d) => d.key === "calendar_colors")?.value;
    if (f) setFee(f);
    if (c) setCal(c);
  }, [data]);
  const save = async (key, value) => {
    const {
      error
    } = await supabase.from("app_settings").upsert({
      key,
      value
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Saved");
      qc.invalidateQueries({
        queryKey: ["settings"]
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Fee highlight colors" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Color, { label: "Paid", value: fee.paid, onChange: (v) => setFee({
          ...fee,
          paid: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Color, { label: "Unpaid", value: fee.unpaid, onChange: (v) => setFee({
          ...fee,
          unpaid: v
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => save("fee_colors", fee), className: "bg-gradient-primary text-primary-foreground", children: "Save fee colors" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Calendar colors" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Color, { label: "Holiday", value: cal.holiday, onChange: (v) => setCal({
          ...cal,
          holiday: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Color, { label: "Working", value: cal.working, onChange: (v) => setCal({
          ...cal,
          working: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Color, { label: "Event", value: cal.event, onChange: (v) => setCal({
          ...cal,
          event: v
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => save("calendar_colors", cal), className: "bg-gradient-primary text-primary-foreground", children: "Save calendar colors" })
    ] })
  ] });
}
function Color({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value, onChange: (e) => onChange(e.target.value), className: "h-9 w-12 rounded border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs", children: value })
    ] })
  ] });
}
export {
  SettingsPage as component
};
