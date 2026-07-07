import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMyClients } from "@/hooks/useMyClients";
import { useExercises } from "@/hooks/useExercises";
import { ClipboardList, Search, Plus, X, Loader2 } from "lucide-react";

interface SelectedExercise {
  exercise_id: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
  notes: string;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const SessionRecap = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { clients } = useMyClients();
  const [params] = useSearchParams();

  const [clientId, setClientId] = useState<string>(params.get("client") || "");
  const [sessionDate, setSessionDate] = useState<string>(todayStr());
  const [withTrainer, setWithTrainer] = useState<string>("yes");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<SelectedExercise[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const { exercises, loading: exLoading } = useExercises({ searchQuery: search || undefined });

  useEffect(() => {
    const c = params.get("client");
    if (c) setClientId(c);
  }, [params]);

  const addExercise = (id: string, name: string) => {
    if (selected.some((s) => s.exercise_id === id)) return;
    setSelected((prev) => [...prev, { exercise_id: id, name, sets: "", reps: "", weight: "", notes: "" }]);
    setSearch("");
  };

  const updateExercise = (id: string, field: keyof SelectedExercise, value: string) => {
    setSelected((prev) => prev.map((s) => (s.exercise_id === id ? { ...s, [field]: value } : s)));
  };

  const removeExercise = (id: string) => setSelected((prev) => prev.filter((s) => s.exercise_id !== id));

  const handleSave = async () => {
    if (!user || !clientId) {
      toast({ title: "Pick a client", description: "Choose who this session was with.", variant: "destructive" });
      return;
    }
    if (selected.length === 0) {
      toast({ title: "Add at least one exercise", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { data: session, error: sErr } = await supabase
        .from("training_sessions")
        .insert({
          trainer_id: user.id,
          client_id: clientId,
          session_date: sessionDate,
          with_trainer: withTrainer === "yes",
          title: title || null,
          notes: notes || null,
          source: "manual",
        })
        .select("id")
        .single();
      if (sErr) throw sErr;

      const logs = selected.map((e) => ({
        user_id: clientId,
        exercise_id: e.exercise_id,
        sets_completed: e.sets ? parseInt(e.sets, 10) : null,
        reps_completed: e.reps || null,
        weight_used: e.weight || null,
        notes: e.notes || null,
        session_id: session.id,
        source: "trainer",
        logged_at: new Date(sessionDate).toISOString(),
      }));
      const { error: lErr } = await supabase.from("workout_logs").insert(logs);
      if (lErr) throw lErr;

      toast({ title: "Session logged", description: "Saved to the client's log." });
      setSelected([]);
      setTitle("");
      setNotes("");
    } catch (err) {
      console.error(err);
      toast({ title: "Couldn't save the session", description: "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-1">
        <ClipboardList className="h-8 w-8" />
        Session Recap
      </h1>
      <p className="text-muted-foreground mb-8">Record what a client completed — it goes straight to their log.</p>

      <Card className="mb-6">
        <CardHeader><CardTitle>Session details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label>Date</Label>
              <Input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
            </div>
            <div>
              <Label>Trained with you?</Label>
              <Select value={withTrainer} onValueChange={setWithTrainer}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">With me (in person / virtual)</SelectItem>
                  <SelectItem value="no">On their own</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Title (optional)</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Lower body + mobility" />
            </div>
          </div>
          <div>
            <Label>Session notes (optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How it went, what to focus on next..." />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Exercises completed</CardTitle></CardHeader>
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

          {selected.length === 0 ? (
            <p className="text-sm text-muted-foreground">No exercises added yet.</p>
          ) : (
            <div className="space-y-3">
              {selected.map((e) => (
                <div key={e.exercise_id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{e.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeExercise(e.exercise_id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Input placeholder="Sets" inputMode="numeric" value={e.sets} onChange={(ev) => updateExercise(e.exercise_id, "sets", ev.target.value)} />
                    <Input placeholder="Reps" value={e.reps} onChange={(ev) => updateExercise(e.exercise_id, "reps", ev.target.value)} />
                    <Input placeholder="Weight" value={e.weight} onChange={(ev) => updateExercise(e.exercise_id, "weight", ev.target.value)} />
                    <Input placeholder="Notes" value={e.notes} onChange={(ev) => updateExercise(e.exercise_id, "notes", ev.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button size="lg" className="w-full" disabled={saving} onClick={handleSave}>
        {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : "Save Session"}
      </Button>
    </div>
  );
};

export default SessionRecap;
