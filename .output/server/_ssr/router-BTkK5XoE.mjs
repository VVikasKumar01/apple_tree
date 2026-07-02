import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-DzYfGTbU.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";



import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
const SCHOOLS = [
  { code: "apple_tree", name: "Apple Tree School", short: "Apple Tree" },
  { code: "apple_play", name: "Apple Play School", short: "Apple Play" }
];
const schoolName = (c) => SCHOOLS.find((s) => s.code === c)?.name ?? "—";
const AuthContext = reactExports.createContext(void 0);
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [user, setUser] = reactExports.useState(null);
  const [school, setSchool] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const loadSchool = async (uid) => {
    if (!uid) {
      setSchool(null);
      return;
    }
    const { data } = await supabase.from("user_roles").select("school").eq("user_id", uid).maybeSingle();
    setSchool(data?.school ?? null);
  };
  reactExports.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      loadSchool(s?.user?.id);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      loadSchool(data.session?.user?.id).finally(() => setLoading(false));
    });
    return () => subscription.unsubscribe();
  }, []);
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };
  const signUp = async (email, password, school2) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/`, data: { school: school2 } }
    });
    return { error: error?.message ?? null };
  };
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { error: error?.message ?? null };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: { user, session, school, loading, signIn, signUp, signOut, resetPassword }, children });
}
function useAuth() {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const appCss = "/assets/styles-P_BSv9ci.css";
const Route$c = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Little Scholars — School Management" },
      { name: "description", content: "Modern ERP for pre-primary schools: students, fees, academics, calendar." }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootShell,
  component: RootComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$c.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] }) });
}
const $$splitComponentImporter$b = () => import("./reset-password-Byk07Pvt.mjs");
const Route$b = createFileRoute("/reset-password")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./login-DZg-m58Q.mjs");
const Route$a = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("../_authenticated-M9H5mF3I.mjs");
const Route$9 = createFileRoute("/_authenticated")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./index-CcFVDF_w.mjs");
const Route$8 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./tuition-fees-DUvcIGmt.mjs");
const Route$7 = createFileRoute("/_authenticated/tuition-fees")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./students-C2e7_RgG.mjs");
const Route$6 = createFileRoute("/_authenticated/students")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./settings-Cr_nS8ZU.mjs");
const Route$5 = createFileRoute("/_authenticated/settings")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./other-fees-CwDmBbg7.mjs");
const Route$4 = createFileRoute("/_authenticated/other-fees")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./dashboard-DjMUFMmp.mjs");
const Route$3 = createFileRoute("/_authenticated/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./calendar-Dph6rivJ.mjs");
const Route$2 = createFileRoute("/_authenticated/calendar")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./academics-CCOV0AAg.mjs");
const Route$1 = createFileRoute("/_authenticated/academics")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./students._id-Bv4Y05WI.mjs");
const Route = createFileRoute("/_authenticated/students/$id")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ResetPasswordRoute = Route$b.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$c
});
const LoginRoute = Route$a.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$c
});
const AuthenticatedRoute = Route$9.update({
  id: "/_authenticated",
  getParentRoute: () => Route$c
});
const IndexRoute = Route$8.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$c
});
const AuthenticatedTuitionFeesRoute = Route$7.update({
  id: "/tuition-fees",
  path: "/tuition-fees",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedStudentsRoute = Route$6.update({
  id: "/students",
  path: "/students",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedSettingsRoute = Route$5.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedOtherFeesRoute = Route$4.update({
  id: "/other-fees",
  path: "/other-fees",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardRoute = Route$3.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedCalendarRoute = Route$2.update({
  id: "/calendar",
  path: "/calendar",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedAcademicsRoute = Route$1.update({
  id: "/academics",
  path: "/academics",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedStudentsIdRoute = Route.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AuthenticatedStudentsRoute
});
const AuthenticatedStudentsRouteChildren = {
  AuthenticatedStudentsIdRoute
};
const AuthenticatedStudentsRouteWithChildren = AuthenticatedStudentsRoute._addFileChildren(
  AuthenticatedStudentsRouteChildren
);
const AuthenticatedRouteChildren = {
  AuthenticatedAcademicsRoute,
  AuthenticatedCalendarRoute,
  AuthenticatedDashboardRoute,
  AuthenticatedOtherFeesRoute,
  AuthenticatedSettingsRoute,
  AuthenticatedStudentsRoute: AuthenticatedStudentsRouteWithChildren,
  AuthenticatedTuitionFeesRoute
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  LoginRoute,
  ResetPasswordRoute
};
const routeTree = Route$c._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route as R,
  SCHOOLS as S,
  router as r,
  schoolName as s,
  useAuth as u
};
