import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-DzYfGTbU.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as LoaderCircle } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function Reset() {
  const navigate = useNavigate();
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [ready, setReady] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash.includes("type=recovery")) setReady(true);
    else setReady(true);
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const {
      error
    } = await supabase.auth.updateUser({
      password
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated. Please sign in.");
      navigate({
        to: "/login"
      });
    }
  };
  if (!ready) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Set a new password" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "New password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", minLength: 6, required: true, value: password, onChange: (e) => setPassword(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: busy, className: "w-full bg-gradient-primary text-primary-foreground", children: [
        busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
        "Update password"
      ] })
    ] })
  ] }) });
}
export {
  Reset as component
};
