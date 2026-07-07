import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMyClients } from "@/hooks/useMyClients";
import { useExercises } from "@/hooks/useExercises";
import { CalendarPlus, Search, Plus, X, Loader2 } from "lucide-react";

interface PrescribedRow {
  exercise_id: string;
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const PrescribeExercises = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { clients } = useMyClients();
  const [params] = useSearchParams();

  const [clientId, setClientId] = useState<string>(params.get("client") || "");
  const [prescribedFor, setPrescribedFor] = useState<string>(todayStr());
  const [rows, setRows] = useState<PrescribedRow[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const { exercises, loading: exLoading } = useExercises({ searchQuery: search || undefined });

  useEffect(() => {
    const c = params.get("client");
    if (c) setClientId(c);
  }, [params]);

  const addExercise = (id: string, name: string) => {
    if (rows.some((r) => r.exercise_id === id)) return;
    setRows((prev) => [...prev, { exercise_id: id, name, sets: "", reps: "", notes: "" }]);
    setSearch("");
  };
  const updateRow = (id: string, field: keyof PrescribedRow, value: string) =>
    setRows((prev) => prev.map((r) => (r.exercise_id === id ? { ...r, [field]: value } : r)));
  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.exercise_id !== id));

  const handleSave = async () => {
    if (!user || !clientId) {
      toast({ title: "Pick a client", variant: "destructive" });
      return;
    }
    if (rows.length === 0) {
      toast({ title: "Add at least one exercise", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = rows.map((r, i) => ({
        client_id: clientId,
        trainer_id: user.id,
        exercise_id: r.exercise_id,
        prescribed_for: prescribedFor,
        sets: r.sets ? parseInt(r.sets, 10) : null,
        reps: r.reps || null,
        notes: r.notes || null,
        order_index: i,
      }));
      const { error } = await supabase.from("prescribed_exercises").insert(payload);
      if (error) throw error;
      toast({ title: "Prescribed", description: "It'll show up in their Today view." });
      setRows([]);
    } catch (err) {
      console.error(err);
      toast({ title: "Couldn't prescribe", description: "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-1">
        <CalendarPlus className="h-8 w-8" />
        Prescribe Exercises
      </h1>
      <p className="text-muted-foreground mb-8">Assign exercises to a client for a specific day. They'll see them under "Today".</p>

      <Card className="mb-6">
        <CardHeader><CardTitle>Who &amp; when</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.full_name || c.email || "Unnamed"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prescribe for</Label>
            <Input type="date" value={prescribedFor} onChange={(e) => setPrescribedFor(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Exercises</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search the exercise library to add..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            {search && (
              <div className="absolute z-10 mt-1 w-full bg-popover border rounded-md shadow-md max-h-60 overflow-y-auto">
                {exLoading ? (
                  <div className="p-3 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Searching...</div>
                ) : exercises.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">No matches</div>
                ) : (
                  exercises.slice(0, 12).map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => addExercise(ex.id, ex.name)}
                      className="w-full text-left px-3 py-2 hover:bg-accent flex items-center justify-between"
                    >
                      <span>{ex.name}</span>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No exercises added yet.</p>
          ) : (
            <div className="space-y-3">
              {rows.map((r) => (
                <div key={r.exercise_id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{r.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeRow(r.exercise_id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input placeholder="Sets" inputMode="numeric" value={r.sets} onChange={(ev) => updateRow(r.exercise_id, "sets", ev.target.value)} />
                    <Input placeholder="Reps (e.g. 8-12)" value={r.reps} onChange={(ev) => updateRow(r.exercise_id, "reps", ev.target.value)} />
                    <Input placeholder="Notes / cues" value={r.notes} onChange={(ev) => updateRow(r.exercise_id, "notes", ev.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button size="lg" className="w-full" disabled={saving} onClick={handleSave}>
        {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : "Prescribe"}
      </Button>
    </div>
  );
};

export default PrescribeExercises;
