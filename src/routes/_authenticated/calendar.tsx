import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/calendar")({ component: CalendarPage });

type EventRow = { id: string; title: string; event_date: string; event_type: string; description: string | null };

function CalendarPage() {
  const qc = useQueryClient();
  const { school } = useAuth();
  const [form, setForm] = useState({ title: "", event_date: "", event_type: "event", description: "" });
  const [month, setMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogEvent, setDialogEvent] = useState<EventRow | null>(null);

  const { data: events = [] } = useQuery({
    queryKey: ["events", school],
    enabled: !!school,
    queryFn: async () => ((await supabase.from("calendar_events").select("*").eq("school", school!).order("event_date")).data ?? []) as EventRow[],
  });

  const modifiers = useMemo(() => {
    const toDate = (d: string) => { const [y, m, day] = d.split("-").map(Number); return new Date(y, m - 1, day); };
    return {
      holiday: events.filter(e => e.event_type === "holiday").map(e => toDate(e.event_date)),
      working: events.filter(e => e.event_type === "working").map(e => toDate(e.event_date)),
      event: events.filter(e => e.event_type === "event").map(e => toDate(e.event_date)),
    };
  }, [events]);

  const modifiersClassNames = {
    holiday: "bg-destructive/20 text-destructive font-semibold rounded-md",
    working: "bg-success/20 text-success font-semibold rounded-md",
    event: "bg-primary/20 text-primary font-semibold rounded-md",
  };

  const add = async () => {
    if (!form.title || !form.event_date) return toast.error("Title and date required");
    if (!school) return toast.error("School not set on your account");
    const { data, error } = await supabase.from("calendar_events").insert({ ...form, school }).select().single();
    if (error) toast.error(error.message);
    else {
      setForm({ title: "", event_date: "", event_type: "event", description: "" });
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Event added successfully!");
      if (data) setDialogEvent(data as EventRow);
    }
  };
  const del = async (id: string) => {
    await supabase.from("calendar_events").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["events"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
  };

  const colorFor = (t: string) => t === "holiday" ? "bg-destructive/10 text-destructive" : t === "working" ? "bg-success/10 text-success" : "bg-primary/10 text-primary";

  const exportICS = () => {
    const fmt = (d: string) => d.replaceAll("-", "");
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//School Calendar//EN",
      ...events.flatMap(e => [
        "BEGIN:VEVENT",
        `UID:${e.id}@school`,
        `SUMMARY:${(e.title || "").replace(/\n/g, " ")}`,
        `DESCRIPTION:${((e.description || "") + " [" + e.event_type + "]").replace(/\n/g, " ")}`,
        `DTSTART;VALUE=DATE:${fmt(e.event_date)}`,
        `DTEND;VALUE=DATE:${fmt(e.event_date)}`,
        "END:VEVENT",
      ]),
      "END:VCALENDAR",
    ];
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "school-calendar.ics"; a.click(); URL.revokeObjectURL(url);
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const match = events.find(e => {
        const [y, m, day] = e.event_date.split("-").map(Number);
        return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === day;
      });
      if (match) {
        setDialogEvent(match);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button variant="outline" onClick={exportICS}><Download className="mr-2 h-4 w-4" />Export .ics (Google / Apple)</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <Calendar
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={selectedDate}
            onSelect={handleSelectDate}
            className="mx-auto"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-destructive/30" />Holiday</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-success/30" />Working day</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary/30" />Event</span>
          </div>
        </Card>
        <Card className="p-5 space-y-3">
          <h2 className="font-semibold">Add to calendar</h2>
          <Label className="text-xs">Title</Label>
          <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Label className="text-xs">Date</Label>
          <Input type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} />
          <Label className="text-xs">Type</Label>
          <Select value={form.event_type} onValueChange={v => setForm({ ...form, event_type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="holiday">Holiday</SelectItem>
              <SelectItem value="working">Working day</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
          <Label className="text-xs">Description</Label>
          <Textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <Button onClick={add} className="w-full bg-gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" />Add</Button>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="mb-3 font-semibold">All entries</h2>
        <div className="space-y-1.5">
          {events.map(e => (
            <div key={e.id} className="flex items-center justify-between rounded-md border p-2">
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorFor(e.event_type)}`}>{e.event_type}</span>
                <span className="font-medium">{e.title}</span>
                <span className="text-sm text-muted-foreground">{e.event_date}</span>
              </div>
              <Button size="icon" variant="ghost" onClick={() => del(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
          {events.length === 0 && <div className="py-6 text-center text-sm text-muted-foreground">No events yet.</div>}
        </div>
      </Card>

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
