import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Moon, Sun, Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const toggleDark = () => document.documentElement.classList.toggle("dark");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <button
        onClick={() => setOpen(true)}
        className="group flex h-9 w-full max-w-md items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground transition hover:border-primary/50"
      >
        <Search className="h-4 w-4" />
        Search features, students, modules…
        <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle theme">
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="hidden h-4 w-4 dark:block" />
        </Button>
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
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </header>
  );
}
