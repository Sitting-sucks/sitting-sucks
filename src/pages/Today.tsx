import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { CheckCircle2, Circle, CalendarDays, Dumbbell, ArrowRight, Loader2, PartyPopper, Lock, Crown, Check } from "lucide-react";

// Free users see this many exercises in full before the paywall
const FREE_PREVIEW_COUNT = 2;

interface TodayItem {
  id: string;
  exercise_id: string;
  sets: number | null;
  reps: string | null;
  notes: string | null;
  completed_at: string | null;
  exercises: { name: string; video_url: string | null } | null;
}

interface ActiveProgram {
  id: string;
  program_id: string;
  programs: { name: string } | null;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const Today = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subscribed } = useSubscription();
  const [items, setItems] = useState<TodayItem[]>([]);
  const [programs, setPrograms] = useState<ActiveProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchToday = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: presc } = await supabase
        .from("prescribed_exercises")
        .select("id, exercise_id, sets, reps, notes, completed_at, exercises(name, video_url)")
        .eq("client_id", user.id)
        .eq("prescribed_for", todayStr())
        .order("order_index");
      setItems((presc as unknown as TodayItem[]) || []);

      const { data: cp } = await supabase
        .from("client_programs")
        .select("id, program_id, programs(name)")
        .eq("client_id", user.id)
        .eq("status", "active");
      setPrograms((cp as unknown as ActiveProgram[]) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  const markDone = async (item: TodayItem) => {
    if (!user) return;
    setBusyId(item.id);
    try {
      const { data: log, error: logErr } = await supabase
        .from("workout_logs")
        .insert({
          user_id: user.id,
          exercise_id: item.exercise_id,
          sets_completed: item.sets,
          reps_completed: item.reps,
          notes: item.notes,
          source: "prescription",
          logged_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (logErr) throw logErr;

      const { error: updErr } = await supabase
        .from("prescribed_exercises")
        .update({ completed_at: new Date().toISOString(), workout_log_id: log.id })
        .eq("id", item.id);
      if (updErr) throw updErr;

      toast({ title: "Logged!", description: `${item.exercises?.name || "Exercise"} marked done.` });
      await fetchToday();
    } catch (err) {
      console.error(err);
      toast({ title: "Couldn't log that", description: "Please try again.", variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const remaining = items.filter((i) => !i.completed_at).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-1">
        <CalendarDays className="h-8 w-8" />
        Today
      </h1>
      <p className="text-muted-foreground mb-8">
        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        {items.length > 0 && ` · ${remaining} to go`}
      </p>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : (
        <div className="space-y-8">
          {/* Prescribed for today */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Prescribed for you</h2>
            {items.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nothing prescribed for today.</CardContent></Card>
            ) : remaining === 0 ? (
              <Card className="border-green-500/40 bg-green-500/5">
                <CardContent className="py-8 text-center">
                  <PartyPopper className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <p className="font-medium">All done for today. Nice work.</p>
                </CardContent>
              </Card>
            ) : null}

            <div className="space-y-3 mt-3">
              {items.map((item, index) => {
                const done = !!item.completed_at;

                // Free users: exercises past the preview show as locked cards
                if (!subscribed && index >= FREE_PREVIEW_COUNT) {
                  return (
                    <Card key={item.id} className="relative overflow-hidden">
                      <CardContent className="pt-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Lock className="h-6 w-6 text-muted-foreground shrink-0" />
                          <div>
                            <div className="font-medium blur-sm select-none">
                              {item.exercises?.name || "Exercise"}
                            </div>
                            <div className="text-sm text-muted-foreground">Premium content</div>
                          </div>
                        </div>
                      </CardContent>
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-background/20 flex items-center justify-center">
                        <Button size="sm" onClick={() => navigate('/pricing')}>Unlock</Button>
                      </div>
                    </Card>
                  );
                }

                return (
                  <Card key={item.id} className={done ? "opacity-60" : ""}>
                    <CardContent className="pt-6 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {done ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground mt-0.5 shrink-0" />
                        )}
                        <div>
                          <div className={`font-medium ${done ? "line-through" : ""}`}>
                            {item.exercises?.name || "Exercise"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {[item.sets ? `${item.sets} sets` : null, item.reps ? `${item.reps} reps` : null]
                              .filter(Boolean)
                              .join(" · ") || "As prescribed"}
                          </div>
                          {item.notes && <div className="text-sm text-muted-foreground mt-1 italic">"{item.notes}"</div>}
                          {item.exercises?.video_url && (
                            <a
                              href={item.exercises.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary inline-flex items-center gap-1 mt-1"
                            >
                              Watch demo <ArrowRight className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      {!done && (
                        <Button size="sm" disabled={busyId === item.id} onClick={() => markDone(item)}>
                          {busyId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark done"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Active programs */}
          {programs.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">Your programs</h2>
              <div className="space-y-3">
                {programs.map((p) => (
                  <Card key={p.id}>
                    <CardContent className="pt-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Dumbbell className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{p.programs?.name || "Program"}</div>
                          <div className="text-sm text-muted-foreground">Open today's workout</div>
                        </div>
                      </div>
                      <Link to={`/log-workout?program=${p.program_id}&day=1`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          Start <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {items.length === 0 && programs.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Badge variant="outline" className="mb-3">Nothing scheduled</Badge>
                <p>No prescriptions or programs for today. Check the <Link to="/exercise-library" className="text-primary">exercise library</Link> or your <Link to="/exercise-diary" className="text-primary">diary</Link>.</p>
              </CardContent>
            </Card>
          )}

          {/* Freemium CTA */}
          {!subscribed && (
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="py-8 text-center">
                <Crown className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h3 className="text-xl font-bold mb-2">Unlock Your Full Workout</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Get complete exercise details, guided set tracking, AI-adjusted recommendations, and personalized programs.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 max-w-md mx-auto mb-6 text-left">
                  {[
                    'Full exercise details & videos',
                    'Guided sets/reps tracking',
                    'Progress logging & analytics',
                    'AI-adjusted recommendations',
                  ].map((perk) => (
                    <div key={perk} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" onClick={() => navigate('/pricing')}>
                    Start 14-Day Free Trial
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/exercise-library">Browse Free Exercises</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Today;
