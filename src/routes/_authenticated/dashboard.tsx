import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Users, Wallet, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inr, currentAcademicYear } from "@/lib/types";
import { ACADEMIC_YEARS } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function Dashboard() {
  const [year, setYear] = useState<string>(currentAcademicYear());

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", year],
    queryFn: async () => {
      const [s, t, e] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }).eq("academic_year", year),
        supabase.from("tuition_fees").select("term1_fee,term2_fee,term3_fee,term1_status,term2_status,term3_status,finalized_fee").eq("academic_year", year),
        supabase.from("calendar_events").select("*").order("event_date", { ascending: true }).limit(10),
      ]);
      let pending = 0, collected = 0;
      for (const r of t.data ?? []) {
        const t1 = Number(r.term1_fee || 0), t2 = Number(r.term2_fee || 0), t3 = Number(r.term3_fee || 0);
        if (r.term1_status === "Paid") collected += t1; else pending += t1;
        if (r.term2_status === "Paid") collected += t2; else pending += t2;
        if (r.term3_status === "Paid") collected += t3; else pending += t3;
      }
      return { students: s.count ?? 0, pending, collected, events: e.data ?? [] };
    },
  });

  const cards = [
    { label: "Total Students", value: stats?.students ?? 0, icon: Users, accent: "from-indigo-500 to-violet-500" },
    { label: "Pending Fees", value: inr(stats?.pending ?? 0), icon: AlertCircle, accent: "from-rose-500 to-red-500" },
    { label: "Collected (Year)", value: inr(stats?.collected ?? 0), icon: TrendingUp, accent: "from-emerald-500 to-teal-500" },
    { label: "Active Modules", value: 6, icon: Wallet, accent: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back 👋</h1>
          <p className="text-muted-foreground">Tracking data for academic year <b>{year}</b>.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Academic Year:</span>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(c => (
          <Card key={c.label} className="overflow-hidden p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{c.label}</div>
                <div className="mt-1 text-2xl font-bold">{c.value}</div>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent} text-white shadow-elegant`}>
                <c.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">Quick actions</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link to="/students" className="rounded-lg border p-4 transition hover:border-primary/50 hover:shadow-card">
              <Users className="mb-2 h-5 w-5 text-primary" />
              <div className="font-medium">Manage students</div>
              <div className="text-xs text-muted-foreground">Personal details</div>
            </Link>
            <Link to="/tuition-fees" className="rounded-lg border p-4 transition hover:border-primary/50 hover:shadow-card">
              <Wallet className="mb-2 h-5 w-5 text-primary" />
              <div className="font-medium">Record fees</div>
              <div className="text-xs text-muted-foreground">Term-wise payments</div>
            </Link>
            <Link to="/academics" className="rounded-lg border p-4 transition hover:border-primary/50 hover:shadow-card">
              <TrendingUp className="mb-2 h-5 w-5 text-primary" />
              <div className="font-medium">Enter marks</div>
              <div className="text-xs text-muted-foreground">Subject-wise per term</div>
            </Link>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 text-lg font-semibold">Calendar</h2>
          <Calendar mode="single" className="rounded-md border" />
          <div className="mt-3 space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Upcoming</div>
            {(stats?.events ?? []).slice(0, 5).map((e: any) => (
              <div key={e.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{e.title}</span>
                <span className="text-xs text-muted-foreground">{e.event_date}</span>
              </div>
            ))}
            {(stats?.events?.length ?? 0) === 0 && (
              <div className="text-xs text-muted-foreground">No events yet. Add one in Calendar.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
