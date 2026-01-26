import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Loader2, Lock, TrendingUp, Calendar, Dumbbell, Award, Flame } from "lucide-react";

interface WorkoutLog {
  id: string;
  logged_at: string;
  sets_completed: number | null;
  reps_completed: string | null;
  weight_used: string | null;
  notes: string | null;
  exercises: {
    name: string;
  } | null;
  programs: {
    name: string;
  } | null;
}

interface DailyStats {
  date: string;
  workouts: number;
  exercises: number;
}

const ProgressHistory = () => {
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");
  const [selectedExercise, setSelectedExercise] = useState("all");

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeRange));

        const { data, error } = await supabase
          .from("workout_logs")
          .select(`
            id,
            logged_at,
            sets_completed,
            reps_completed,
            weight_used,
            notes,
            exercises (name),
            programs (name)
          `)
          .eq("user_id", user.id)
          .gte("logged_at", startDate.toISOString())
          .order("logged_at", { ascending: false });

        if (error) throw error;
        setLogs(data || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user, timeRange]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalWorkouts = new Set(logs.map((l) => l.logged_at.split("T")[0])).size;
    const totalExercises = logs.length;
    const uniqueExercises = new Set(logs.map((l) => l.exercises?.name)).size;

    // Calculate streak
    const sortedDates = [...new Set(logs.map((l) => l.logged_at.split("T")[0]))].sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split("T")[0];

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expected = expectedDate.toISOString().split("T")[0];

      if (sortedDates[i] === expected || (i === 0 && sortedDates[i] === today)) {
        streak++;
      } else {
        break;
      }
    }

    return { totalWorkouts, totalExercises, uniqueExercises, streak };
  }, [logs]);

  // Get unique exercises for filter
  const exerciseNames = useMemo(() => {
    return [...new Set(logs.map((l) => l.exercises?.name).filter(Boolean))] as string[];
  }, [logs]);

  // Daily stats for chart
  const dailyStats = useMemo(() => {
    const statsMap = new Map<string, DailyStats>();

    logs.forEach((log) => {
      const date = log.logged_at.split("T")[0];
      const existing = statsMap.get(date) || { date, workouts: 0, exercises: 0 };
      existing.exercises++;
      statsMap.set(date, existing);
    });

    // Mark workout days
    statsMap.forEach((value) => {
      value.workouts = 1;
    });

    return Array.from(statsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [logs]);

  // Filter logs by exercise
  const filteredLogs = useMemo(() => {
    if (selectedExercise === "all") return logs;
    return logs.filter((l) => l.exercises?.name === selectedExercise);
  }, [logs, selectedExercise]);

  // Safe parsing utilities
  const safeParseFloat = (value: string | null | undefined): number => {
    if (!value) return 0;
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const safeParseInt = (value: string | null | undefined): number => {
    if (!value) return 0;
    // Handle ranges like "10-12" by taking the first number
    const firstNumber = value.split("-")[0]?.trim();
    if (!firstNumber) return 0;
    const parsed = parseInt(firstNumber, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Exercise progress data for chart
  const exerciseProgress = useMemo(() => {
    if (selectedExercise === "all") return [];

    return filteredLogs
      .filter((l) => l.weight_used)
      .map((l) => ({
        date: new Date(l.logged_at).toLocaleDateString(),
        weight: safeParseFloat(l.weight_used),
        sets: l.sets_completed || 0,
        reps: safeParseInt(l.reps_completed),
      }))
      .reverse();
  }, [filteredLogs, selectedExercise]);

  if (!subscribed) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="text-center py-12">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Subscriber Feature</h2>
            <p className="text-muted-foreground mb-6">
              Progress tracking is available for subscribers.
            </p>
            <Link to="/pricing">
              <Button>Subscribe Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            Progress History
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your workout progress and see your gains
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
                    <div className="text-sm text-muted-foreground">Workout Days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{stats.totalExercises}</div>
                    <div className="text-sm text-muted-foreground">Exercises Logged</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{stats.uniqueExercises}</div>
                    <div className="text-sm text-muted-foreground">Different Exercises</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.streak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workout Frequency Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Workout Frequency</CardTitle>
              <CardDescription>Number of exercises logged per day</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyStats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No workout data for this period
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="exercises" fill="hsl(var(--primary))" name="Exercises" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exercise Progress */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Exercise Progress</CardTitle>
                  <CardDescription>Track weight progression for specific exercises</CardDescription>
                </div>
                <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exercises</SelectItem>
                    {exerciseNames.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {selectedExercise === "all" ? (
                <div className="text-center py-8 text-muted-foreground">
                  Select an exercise to view progress
                </div>
              ) : exerciseProgress.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No weight data logged for this exercise
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={exerciseProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Weight (lbs)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Workout History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your logged exercises</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No workouts logged yet. Start by logging a workout from My Programs!
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{log.exercises?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(log.logged_at).toLocaleDateString()} -{" "}
                          {log.programs?.name || "Unknown Program"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {log.sets_completed} sets x {log.reps_completed}
                        </div>
                        {log.weight_used && (
                          <Badge variant="secondary">{log.weight_used}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProgressHistory;
