import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, S as SCHOOLS } from "./router-YwqBu5ka.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { C as Card } from "./card-CBcrKIMI.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as School, a as Sparkles, T as TreeDeciduous, L as LoaderCircle } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-DzYfGTbU.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
const SCHOOL_META = {
  apple_tree: {
    icon: TreeDeciduous,
    gradient: "from-emerald-500 to-teal-600"
  },
  apple_play: {
    icon: Sparkles,
    gradient: "from-rose-500 to-orange-500"
  }
};
function LoginPage() {
  const {
    user,
    signIn,
    signUp,
    resetPassword,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [school, setSchool] = reactExports.useState(null);
  const [mode, setMode] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && user) navigate({
      to: "/"
    });
  }, [user, loading, navigate]);
  const handle = async (e) => {
    e.preventDefault();
    if (!school) return toast.error("Choose a school");
    setBusy(true);
    if (mode === "signin") {
      const {
        error
      } = await signIn(email, password);
      if (error) toast.error(error);
      else toast.success("Welcome back");
    } else if (mode === "signup") {
      const {
        error
      } = await signUp(email, password, school);
      if (error) toast.error(error);
      else toast.success("Check your email to verify your account.");
    } else {
      const {
        error
      } = await resetPassword(email);
      if (error) toast.error(error);
      else toast.success("Password reset link sent to your email.");
    }
    setBusy(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 opacity-50", style: {
      backgroundImage: "radial-gradient(60% 50% at 20% 10%, oklch(0.62 0.20 270 / 0.25), transparent 60%), radial-gradient(50% 40% at 90% 80%, oklch(0.48 0.18 265 / 0.20), transparent 60%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "w-full max-w-md p-8 shadow-elegant", children: !school ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant", children: /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "h-6 w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Choose your school" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Each school has its own private workspace." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: SCHOOLS.map((s) => {
        const Icon = SCHOOL_META[s.code].icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSchool(s.code), className: "group flex items-center gap-3 rounded-xl border bg-card p-4 text-left transition hover:border-primary/50 hover:shadow-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${SCHOOL_META[s.code].gradient} text-white shadow-elegant`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: s.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Tap to continue →" })
          ] })
        ] }, s.code);
      }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${SCHOOL_META[school].gradient} shadow-elegant`, children: (() => {
          const I = SCHOOL_META[school].icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(I, { className: "h-6 w-6 text-white" });
        })() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: SCHOOLS.find((s) => s.code === school).name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          mode === "signin" && "Admin sign in to continue",
          mode === "signup" && "Create the admin account",
          mode === "reset" && "Reset your password"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSchool(null), className: "mt-2 text-xs text-primary hover:underline", children: "← Change school" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handle, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "admin@school.com" })
        ] }),
        mode !== "reset" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: busy, className: "w-full bg-gradient-primary text-primary-foreground hover:opacity-95", children: [
          busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-between text-sm", children: mode === "signin" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-primary hover:underline", onClick: () => setMode("reset"), children: "Forgot password?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-muted-foreground hover:underline", onClick: () => setMode("signup"), children: "Create admin" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-primary hover:underline", onClick: () => setMode("signin"), children: "← Back to sign in" }) })
    ] }) })
  ] });
}
export {
  LoginPage as component
};
