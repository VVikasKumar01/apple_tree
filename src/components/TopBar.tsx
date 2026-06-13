import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Moon, Sun, Bell, CalendarDays } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAcademicYear } from "@/lib/academic-year";
import { ACADEMIC_YEARS } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const features = [
  { label: "Dashboard overview", path: "/", hint: "Home / KPIs / calendar" },
  { label: "Students list", path: "/students", hint: "All student personal details" },
  { label: "Add new student", path: "/students?new=1", hint: "Students › New" },
  { label: "Tuition fees", path: "/tuition-fees", hint: "Set term fees and mark paid" },
  { label: "Other fees · books & uniform", path: "/other-fees", hint: "Issue tracking" },
  { label: "Academics & marks", path: "/academics", hint: "Subject-wise marks per term" },
  { label: "Subjects management", path: "/academics?tab=subjects", hint: "Academics › Subjects" },
  { label: "Calendar & events", path: "/calendar", hint: "Holidays / working days / events" },
  { label: "Color & app settings", path: "/settings", hint: "Settings › Customize highlight colors" },
];

export function TopBar() {
  const [open, setOpen] = useState(false);
  const { year, setYear } = useAcademicYear();
  const toggleDark = () => document.documentElement.classList.toggle("dark");

  const { data: students = [] } = useQuery({
    queryKey: ["search-students", year],
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("id, student_name, admission_number, class_grade, section")
        .eq("academic_year", year)
        .order("student_name");
      return data ?? [];
    },
  });

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <button
        onClick={() => setOpen(true)}
        className="group flex h-9 w-9 md:w-full md:max-w-md items-center justify-center md:justify-start gap-2 rounded-md border bg-background p-0 md:px-3 text-sm text-muted-foreground transition hover:border-primary/50 shrink-0"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Search features, students, modules…</span>
        <kbd className="ml-auto hidden md:inline-flex rounded border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>
      
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="h-8 w-28 border bg-background px-2 text-xs font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEARS.map(y => (
                <SelectItem key={y} value={y} className="text-xs">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Notifications" className="h-8 w-8">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle theme" className="h-8 w-8">
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="hidden h-4 w-4 dark:block" />
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0">
          <Command>
            <CommandInput placeholder="Search a feature…" />
            <CommandList>
              <CommandEmpty>No matches.</CommandEmpty>
              <CommandGroup heading="Features">
                {features.map(f => (
                  <CommandItem key={f.path} asChild value={f.label + " " + f.hint}>
                    <Link to={f.path.split("?")[0]} onClick={() => setOpen(false)} className="flex flex-col items-start gap-0.5">
                      <span className="font-medium">{f.label}</span>
                      <span className="text-xs text-muted-foreground">{f.hint}</span>
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
              {students.length > 0 && (
                <CommandGroup heading="Students">
                  {students.map(s => (
                    <CommandItem key={s.id} asChild value={`${s.student_name} ${s.admission_number} ${s.class_grade}`}>
                      <Link to="/students/$id" params={{ id: s.id }} onClick={() => setOpen(false)} className="flex flex-col items-start gap-0.5">
                        <span className="font-medium">{s.student_name}</span>
                        <span className="text-xs text-muted-foreground">
                          Adm #{s.admission_number} · {s.class_grade} {s.section ?? ""}
                        </span>
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </header>
  );
}
