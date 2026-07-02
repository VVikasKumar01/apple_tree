import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Users, Wallet, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inr } from "@/lib/types";
import { ACADEMIC_YEARS } from "@/lib/constants";
import { useAcademicYear } from "@/lib/academic-year";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function Dashboard() {
  const { school } = useAuth();
  const { year, setYear } = useAcademicYear();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogEvent, setDialogEvent] = useState<any | null>(null);

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", year, school],
    enabled: !!school,
    queryFn: async () => {
      const startY = Number(year.split("-")[0]);
      const endY = startY + 1;
      const startDate = `${startY}-04-01`;
      const endDate = `${endY}-03-31`;
      const [s, t, e] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }).eq("academic_year", year).eq("school", school!),
        supabase.from("tuition_fees").select("term1_fee,term2_fee,term3_fee,term1_status,term2_status,term3_status,finalized_fee").eq("academic_year", year).eq("school", school!),
        supabase.from("calendar_events").select("*").eq("school", school!).gte("event_date", startDate).lte("event_date", endDate).order("event_date", { ascending: true }),
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

  const modifiers = useMemo(() => {
    const toDate = (d: string) => { const [y, m, day] = d.split("-").map(Number); return new Date(y, m - 1, day); };
    const evs = stats?.events ?? [];
    return {
      holiday: evs.filter((e: any) => e.event_type === "holiday").map((e: any) => toDate(e.event_date)),
      working: evs.filter((e: any) => e.event_type === "working").map((e: any) => toDate(e.event_date)),
      event: evs.filter((e: any) => e.event_type === "event").map((e: any) => toDate(e.event_date)),
    };
  }, [stats?.events]);

  const modifiersClassNames = {
    holiday: "bg-destructive/20 text-destructive font-semibold rounded-md",
    working: "bg-success/20 text-success font-semibold rounded-md",
    event: "bg-primary/20 text-primary font-semibold rounded-md",
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const evs = stats?.events ?? [];
      const match = evs.find((e: any) => {
        const [y, m, day] = e.event_date.split("-").map(Number);
        return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === day;
      });
      if (match) {
        setDialogEvent(match);
      }
    }
  };

  const colorFor = (t: string) => t === "holiday" ? "bg-destructive/10 text-destructive" : t === "working" ? "bg-success/10 text-success" : "bg-primary/10 text-primary";

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
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
            className="rounded-md border mx-auto"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
          <div className="mt-3 space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Upcoming</div>
            {(stats?.events ?? []).slice(0, 5).map((e: any) => (
              <button
                key={e.id}
                onClick={() => setDialogEvent(e)}
                className="flex w-full items-center justify-between text-sm py-1 px-1.5 rounded hover:bg-muted/50 text-left transition"
              >
                <span className="truncate font-medium">{e.title}</span>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">{e.event_date}</span>
              </button>
            ))}
            {(stats?.events?.length ?? 0) === 0 && (
              <div className="text-xs text-muted-foreground">No events yet. Add one in Calendar.</div>
            )}
          </div>
        </Card>
      </div>

      <Dialog open={!!dialogEvent} onOpenChange={(o) => !o && setDialogEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorFor(dialogEvent?.event_type ?? "")}`}>
                {dialogEvent?.event_type}
              </span>
              <span>{dialogEvent?.title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs font-mono pt-1">
              Event Date: {dialogEvent?.event_date}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground bg-muted/30 p-3 rounded-lg border">
              {dialogEvent?.description || "No description provided."}
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setDialogEvent(null)} variant="outline" size="sm">Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
