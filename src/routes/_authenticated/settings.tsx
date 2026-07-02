import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DEFAULT_GRADING_SCALE } from "@/lib/constants";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({ component: SettingsPage });

function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await supabase.from("app_settings").select("*")).data ?? [],
  });
  const [fee, setFee] = useState({ paid: "#10b981", unpaid: "#ef4444" });
  const [cal, setCal] = useState({ holiday: "#ef4444", working: "#10b981", event: "#6366f1" });
  const [scale, setScale] = useState<{ minPercent: number; grade: string }[]>(DEFAULT_GRADING_SCALE);

  useEffect(() => {
    const f = data?.find((d: any) => d.key === "fee_colors")?.value as any;
    const c = data?.find((d: any) => d.key === "calendar_colors")?.value as any;
    const g = data?.find((d: any) => d.key === "grading_scale")?.value as any;
    if (f) setFee(f);
    if (c) setCal(c);
    if (g) setScale(g);
  }, [data]);

  const save = async (key: string, value: any) => {
    const { error } = await supabase.from("app_settings").upsert({ key, value });
    if (error) toast.error(error.message); else { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["settings"] }); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card className="p-5 space-y-4">
        <h2 className="font-semibold text-lg">Fee highlight colors</h2>
        <div className="flex gap-4">
          <Color label="Paid" value={fee.paid} onChange={v => setFee({ ...fee, paid: v })} />
          <Color label="Unpaid" value={fee.unpaid} onChange={v => setFee({ ...fee, unpaid: v })} />
        </div>
        <Button onClick={() => save("fee_colors", fee)} className="bg-gradient-primary text-primary-foreground">Save fee colors</Button>
      </Card>
      
      <Card className="p-5 space-y-4">
        <h2 className="font-semibold text-lg">Calendar colors</h2>
        <div className="flex gap-4">
          <Color label="Holiday" value={cal.holiday} onChange={v => setCal({ ...cal, holiday: v })} />
          <Color label="Working" value={cal.working} onChange={v => setCal({ ...cal, working: v })} />
          <Color label="Event" value={cal.event} onChange={v => setCal({ ...cal, event: v })} />
        </div>
        <Button onClick={() => save("calendar_colors", cal)} className="bg-gradient-primary text-primary-foreground">Save calendar colors</Button>
      </Card>

      <Card className="p-5 space-y-4">
        <h2 className="font-semibold text-lg">Grading Scale (for Report Card)</h2>
        <p className="text-xs text-muted-foreground">Define the minimum percentage required to achieve each grade. Report cards will compute grades based on this configuration.</p>
        
        <div className="space-y-3 max-w-xl">
          {scale.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex-1">
                <Label className="text-xs">Grade</Label>
                <Input 
                  value={step.grade} 
                  onChange={e => {
                    const newScale = [...scale];
                    newScale[idx] = { ...newScale[idx], grade: e.target.value };
                    setScale(newScale);
                  }}
                  placeholder="e.g. A+"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">Min Percentage (%)</Label>
                <Input 
                  type="number"
                  min="0"
                  max="100"
                  value={step.minPercent} 
                  onChange={e => {
                    const newScale = [...scale];
                    newScale[idx] = { ...newScale[idx], minPercent: Number(e.target.value) };
                    setScale(newScale);
                  }}
                  placeholder="e.g. 90"
                />
              </div>
              <div className="pt-5">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setScale(scale.filter((_, i) => i !== idx));
                  }}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            onClick={() => setScale([...scale, { minPercent: 0, grade: "" }])}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Grade Step
          </Button>
          <Button 
            onClick={() => {
              const invalid = scale.some(s => !s.grade.trim() || s.minPercent < 0 || s.minPercent > 100);
              if (invalid) {
                return toast.error("Please ensure all grades are filled and min percentage is between 0 and 100.");
              }
              const sorted = [...scale].sort((a, b) => b.minPercent - a.minPercent);
              setScale(sorted);
              save("grading_scale", sorted);
            }} 
            className="bg-gradient-primary text-primary-foreground"
          >
            Save Grading Scale
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Color({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="h-9 w-12 rounded border" />
        <code className="text-xs">{value}</code>
      </div>
    </div>
  );
}

