import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({ component: SettingsPage });

function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await supabase.from("app_settings").select("*")).data ?? [],
  });
  const [fee, setFee] = useState({ paid: "#10b981", unpaid: "#ef4444" });
  const [cal, setCal] = useState({ holiday: "#ef4444", working: "#10b981", event: "#6366f1" });

  useEffect(() => {
    const f = data?.find((d: any) => d.key === "fee_colors")?.value as any;
    const c = data?.find((d: any) => d.key === "calendar_colors")?.value as any;
    if (f) setFee(f); if (c) setCal(c);
  }, [data]);

  const save = async (key: string, value: any) => {
    const { error } = await supabase.from("app_settings").upsert({ key, value });
    if (error) toast.error(error.message); else { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["settings"] }); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card className="p-5 space-y-4">
        <h2 className="font-semibold">Fee highlight colors</h2>
        <div className="flex gap-4">
          <Color label="Paid" value={fee.paid} onChange={v => setFee({ ...fee, paid: v })} />
          <Color label="Unpaid" value={fee.unpaid} onChange={v => setFee({ ...fee, unpaid: v })} />
        </div>
        <Button onClick={() => save("fee_colors", fee)} className="bg-gradient-primary text-primary-foreground">Save fee colors</Button>
      </Card>
      <Card className="p-5 space-y-4">
        <h2 className="font-semibold">Calendar colors</h2>
        <div className="flex gap-4">
          <Color label="Holiday" value={cal.holiday} onChange={v => setCal({ ...cal, holiday: v })} />
          <Color label="Working" value={cal.working} onChange={v => setCal({ ...cal, working: v })} />
          <Color label="Event" value={cal.event} onChange={v => setCal({ ...cal, event: v })} />
        </div>
        <Button onClick={() => save("calendar_colors", cal)} className="bg-gradient-primary text-primary-foreground">Save calendar colors</Button>
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
