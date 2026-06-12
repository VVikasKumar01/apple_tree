import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { School, Loader2, TreeDeciduous, Sparkles } from "lucide-react";
import { useAuth, SCHOOLS, type SchoolCode } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const SCHOOL_META: Record<SchoolCode, { icon: typeof School; gradient: string }> = {
  apple_tree: { icon: TreeDeciduous, gradient: "from-emerald-500 to-teal-600" },
  apple_play: { icon: Sparkles, gradient: "from-rose-500 to-orange-500" },
};

function LoginPage() {
  const { user, signIn, signUp, resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const [school, setSchool] = useState<SchoolCode | null>(null);
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) navigate({ to: "/" }); }, [user, loading, navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return toast.error("Choose a school");
    setBusy(true);
    if (mode === "signin") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error); else toast.success("Welcome back");
    } else if (mode === "signup") {
      const { error } = await signUp(email, password, school);
      if (error) toast.error(error);
      else toast.success("Check your email to verify your account.");
    } else {
      const { error } = await resetPassword(email);
      if (error) toast.error(error);
      else toast.success("Password reset link sent to your email.");
    }
    setBusy(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 -z-10 opacity-50"
        style={{ backgroundImage: "radial-gradient(60% 50% at 20% 10%, oklch(0.62 0.20 270 / 0.25), transparent 60%), radial-gradient(50% 40% at 90% 80%, oklch(0.48 0.18 265 / 0.20), transparent 60%)" }} />
      <Card className="w-full max-w-md p-8 shadow-elegant">
        {!school ? (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant">
                <School className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Choose your school</h1>
              <p className="mt-1 text-sm text-muted-foreground">Each school has its own private workspace.</p>
            </div>
            <div className="grid gap-3">
              {SCHOOLS.map(s => {
                const Icon = SCHOOL_META[s.code].icon;
                return (
                  <button key={s.code} onClick={() => setSchool(s.code)}
                    className="group flex items-center gap-3 rounded-xl border bg-card p-4 text-left transition hover:border-primary/50 hover:shadow-card">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${SCHOOL_META[s.code].gradient} text-white shadow-elegant`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-muted-foreground">Tap to continue →</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${SCHOOL_META[school].gradient} shadow-elegant`}>
                {(() => { const I = SCHOOL_META[school].icon; return <I className="h-6 w-6 text-white" />; })()}
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{SCHOOLS.find(s => s.code === school)!.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "signin" && "Admin sign in to continue"}
                {mode === "signup" && "Create the admin account"}
                {mode === "reset" && "Reset your password"}
              </p>
              <button onClick={() => setSchool(null)} className="mt-2 text-xs text-primary hover:underline">← Change school</button>
            </div>
            <form onSubmit={handle} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@school.com" />
              </div>
              {mode !== "reset" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
              )}
              <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-95">
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
              </Button>
            </form>
            <div className="mt-6 flex justify-between text-sm">
              {mode === "signin" ? (
                <>
                  <button className="text-primary hover:underline" onClick={() => setMode("reset")}>Forgot password?</button>
                  <button className="text-muted-foreground hover:underline" onClick={() => setMode("signup")}>Create admin</button>
                </>
              ) : (
                <button className="text-primary hover:underline" onClick={() => setMode("signin")}>← Back to sign in</button>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
