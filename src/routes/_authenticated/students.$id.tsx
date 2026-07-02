import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { Student } from "@/lib/types";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/students/$id")({
  component: StudentDashboard,
});

function StudentDashboard() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { school } = useAuth();

  const { data } = useQuery({
    queryKey: ["student-full-history", id, school],
    enabled: !!school,
    queryFn: async () => {
      // 1. Fetch current student record
      const sRes = await supabase.from("students").select("*").eq("id", id).eq("school", school!).single();
      const s = sRes.data as Student | null;
      if (!s) return null;

      // 2. Fetch other student records with same admission_number and school
      const [historyRes, marks, att, fees] = await Promise.all([
        supabase
          .from("students")
          .select("id, academic_year, class_grade")
          .eq("admission_number", s.admission_number)
          .eq("school", school!)
          .order("academic_year", { ascending: false }),
        supabase.from("academic_marks").select("*, subjects(name)").eq("student_id", id),
        supabase.from("attendance_summary").select("*").eq("student_id", id).maybeSingle(),
        supabase.from("tuition_fees").select("*").eq("student_id", id).maybeSingle(),
      ]);

      return {
        student: s,
        history: (historyRes.data ?? []) as { id: string; academic_year: string; class_grade: string }[],
        marks: marks.data ?? [],
        attendance: att.data,
        fees: fees.data,
      };
    },
  });

  if (!data?.student) return <div className="text-muted-foreground p-6">Loading…</div>;
  const s = data.student;
  const history = data.history ?? [];
  const chartData = (data.marks ?? []).map((m: any) => ({
    subject: m.subjects?.name ?? "—",
    Term1: Number(m.term1_marks ?? 0),
    Term2: Number(m.term2_marks ?? 0),
    Term3: Number(m.term3_marks ?? 0),
  }));
  const att = data.attendance;
  const pct = att && att.total_working_days ? Math.round(((att.days_present ?? 0) / att.total_working_days) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm"><Link to="/students"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>

        {history.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" /> History:
            </span>
            <Select value={id} onValueChange={(val) => navigate({ to: "/students/$id", params: { id: val } })}>
              <SelectTrigger className="h-8 w-44 text-xs font-semibold">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {history.map(item => (
                  <SelectItem key={item.id} value={item.id} className="text-xs">
                    {item.academic_year} ({item.class_grade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-start gap-4">
            {s.photo_url ? (
              <img src={s.photo_url} alt={s.student_name} className="h-16 w-16 rounded-xl object-cover border shadow-elegant" />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-2xl font-bold text-primary-foreground shadow-elegant">
                {s.student_name?.[0]}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{s.student_name}</h1>
              <div className="text-sm text-muted-foreground">Roll: {s.admission_number} · {s.class_grade} {s.section} · {s.academic_year}</div>
              <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                <Info label="DOB" v={s.date_of_birth} />
                <Info label="Gender" v={s.gender} />
                <Info label="Father" v={s.father_name} />
                <Info label="Mother" v={s.mother_name} />
                <Info label="Mobile" v={s.primary_mobile} />
                <Info label="Email" v={s.email} />
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-muted-foreground">Attendance</div>
          <div className="mt-2 text-4xl font-bold text-gradient-primary">{pct}%</div>
          <div className="text-xs text-muted-foreground">{att?.days_present ?? 0} / {att?.total_working_days ?? 0} days</div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="mb-3 font-semibold">Subject performance</h2>
        {chartData.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm">No marks recorded yet.</div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="Term1" fill="oklch(0.48 0.18 265)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Term2" fill="oklch(0.62 0.20 270)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Term3" fill="oklch(0.78 0.16 75)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}

function Info({ label, v }: { label: string; v: any }) {
  return <div><span className="text-muted-foreground">{label}: </span><span className="font-medium">{v || "—"}</span></div>;
}
