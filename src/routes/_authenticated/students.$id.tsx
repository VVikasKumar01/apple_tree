import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { Student } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/students/$id")({
  component: StudentDashboard,
});

function StudentDashboard() {
  const { id } = Route.useParams();

  const { data } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const [s, marks, att, fees] = await Promise.all([
        supabase.from("students").select("*").eq("id", id).single(),
        supabase.from("academic_marks").select("*, subjects(name)").eq("student_id", id),
        supabase.from("attendance_summary").select("*").eq("student_id", id).maybeSingle(),
        supabase.from("tuition_fees").select("*").eq("student_id", id).maybeSingle(),
      ]);
      return {
        student: s.data as Student | null,
        marks: marks.data ?? [],
        attendance: att.data,
        fees: fees.data,
      };
    },
  });

  if (!data?.student) return <div className="text-muted-foreground">Loading…</div>;
  const s = data.student;
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
      <Button asChild variant="ghost" size="sm"><Link to="/students"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-primary text-2xl font-bold text-primary-foreground shadow-elegant">
              {s.student_name?.[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{s.student_name}</h1>
              <div className="text-sm text-muted-foreground">Roll: {s.admission_number} · {s.class_grade} {s.section}</div>
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
