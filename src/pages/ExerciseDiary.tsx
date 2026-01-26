import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Calendar,
  Clock,
  Dumbbell,
  Plus,
  Search,
  Star,
  Flame,
  TrendingUp,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2,
  MoreVertical,
  Activity,
  BookOpen,
  Timer,
} from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { useUserStats } from '@/hooks/useUserStats';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns';
import { QuickLogModal } from '@/components/QuickLogModal';
import { toast } from 'sonner';

interface WorkoutLog {
  id: string;
  user_id: string;
  logged_at: string;
  workout_name: string | null;
  duration_minutes: number | null;
  rating: number | null;
  perceived_effort: number | null;
  muscle_groups_worked: string[] | null;
  notes: string | null;
  sets_completed: number | null;
  reps_completed: string | null;
  weight_used: string | null;
  source: string;
}

const ExerciseDiary = () => {
  const { user } = useAuth();
  const { gamification } = useGamification();
  const { stats, refetch: refetchStats } = useUserStats();
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Get streak and stats from hooks (matching Dashboard)
  const streak = gamification?.current_streak || 0;
  const longestStreak = gamification?.longest_streak || 0;
  const totalMinutes = stats?.total_duration_minutes || 0;
  const totalWorkouts = stats?.total_workouts || 0;

  // Fetch workout logs
  const fetchWorkoutLogs = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      setWorkoutLogs(data || []);
    } catch (error) {
      console.error('Error fetching workout logs:', error);
      toast.error('Failed to load workout history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutLogs();
  }, [user]);

  // Filter logs based on search and date
  useEffect(() => {
    let filtered = [...workoutLogs];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.workout_name?.toLowerCase().includes(query) ||
          log.notes?.toLowerCase().includes(query) ||
          log.muscle_groups_worked?.some((mg) => mg.toLowerCase().includes(query))
      );
    }

    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter((log) =>
        isSameDay(parseISO(log.logged_at), selectedDate)
      );
    }

    setFilteredLogs(filtered);
  }, [workoutLogs, searchQuery, selectedDate]);

  // Delete workout log
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workout_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWorkoutLogs((prev) => prev.filter((log) => log.id !== id));
      toast.success('Workout deleted');
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast.error('Failed to delete workout');
    }
  };

  // Get dates with workouts for calendar
  const getDatesWithWorkouts = () => {
    const dates = new Set<string>();
    workoutLogs.forEach((log) => {
      dates.add(format(parseISO(log.logged_at), 'yyyy-MM-dd'));
    });
    return dates;
  };

  // Calendar days for current month
  const calendarDays = eachDayOfInterval({
    start: startOfMonth(filterMonth),
    end: endOfMonth(filterMonth),
  });

  const datesWithWorkouts = getDatesWithWorkouts();

  // Stats for the month
  const monthlyStats = {
    totalWorkouts: workoutLogs.filter(
      (log) =>
        parseISO(log.logged_at) >= startOfMonth(filterMonth) &&
        parseISO(log.logged_at) <= endOfMonth(filterMonth)
    ).length,
    totalMinutes: workoutLogs
      .filter(
        (log) =>
          parseISO(log.logged_at) >= startOfMonth(filterMonth) &&
          parseISO(log.logged_at) <= endOfMonth(filterMonth)
      )
      .reduce((sum, log) => sum + (log.duration_minutes || 0), 0),
  };

  const handleQuickLogClose = (open: boolean) => {
    setShowQuickLog(open);
    if (!open) {
      // Refresh logs and stats when modal closes
      fetchWorkoutLogs();
      refetchStats();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Quick Log Modal */}
      <QuickLogModal open={showQuickLog} onOpenChange={handleQuickLogClose} />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Exercise Diary</h1>
              </div>
              <p className="text-muted-foreground">
                Track your workouts and see your fitness journey
              </p>
            </div>
            <Button size="lg" className="gap-2" onClick={() => setShowQuickLog(true)}>
              <Plus className="h-5 w-5" />
              Log Workout
            </Button>
          </div>

          {/* Stats - Matching Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {/* Current Streak - Matching Dashboard */}
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-orange-500 animate-streak-fire" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-streak">{streak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Time - From user_stats */}
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                    <Timer className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalMinutes}</p>
                    <p className="text-xs text-muted-foreground">Total Minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Workouts - From user_stats */}
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalWorkouts}</p>
                    <p className="text-xs text-muted-foreground">Total Workouts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* This Month */}
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{monthlyStats.totalWorkouts}</p>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workouts, notes, or muscle groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'calendar' | 'list')}>
              <TabsList>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
            </Tabs>
            {selectedDate && (
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(null)}>
                Clear Date Filter
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setFilterMonth(new Date(filterMonth.getFullYear(), filterMonth.getMonth() - 1))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">{format(filterMonth, 'MMMM yyyy')}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setFilterMonth(new Date(filterMonth.getFullYear(), filterMonth.getMonth() + 1))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before the first of the month */}
                {Array.from({ length: startOfMonth(filterMonth).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {calendarDays.map((day) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const hasWorkout = datesWithWorkouts.has(dateStr);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(isSelected ? null : day)}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors relative ${
                        isToday(day) ? 'bg-primary/10 font-bold' : ''
                      } ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                      {format(day, 'd')}
                      {hasWorkout && (
                        <div
                          className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                            isSelected ? 'bg-primary-foreground' : 'bg-primary'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Workout Entries */}
          <div className="lg:col-span-2">
            {loading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading your diary...</p>
                </CardContent>
              </Card>
            ) : filteredLogs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium mb-2">
                    {searchQuery || selectedDate
                      ? 'No matching entries found'
                      : 'Your diary is empty'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchQuery || selectedDate
                      ? 'Try adjusting your search or date filter'
                      : 'Start tracking your workouts to see them here'}
                  </p>
                  {!searchQuery && !selectedDate && (
                    <Button onClick={() => setShowQuickLog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Log Your First Workout
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <Card key={log.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Activity className="h-6 w-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">
                                {log.workout_name || 'Workout'}
                              </h3>
                              {log.rating && (
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3.5 w-3.5 ${
                                        i < log.rating!
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {format(parseISO(log.logged_at), 'EEEE, MMMM d, yyyy • h:mm a')}
                            </p>

                            {/* Stats Row */}
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              {log.duration_minutes && (
                                <Badge variant="secondary" className="gap-1">
                                  <Clock className="h-3 w-3" />
                                  {log.duration_minutes} min
                                </Badge>
                              )}
                              {log.sets_completed && (
                                <Badge variant="outline" className="gap-1">
                                  {log.sets_completed} sets
                                </Badge>
                              )}
                              {log.perceived_effort && (
                                <Badge variant="outline" className="gap-1">
                                  RPE {log.perceived_effort}/10
                                </Badge>
                              )}
                            </div>

                            {/* Muscle Groups */}
                            {log.muscle_groups_worked && log.muscle_groups_worked.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {log.muscle_groups_worked.map((mg) => (
                                  <Badge key={mg} variant="outline" className="text-xs">
                                    {mg}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Notes */}
                            {log.notes && (
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                "{log.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="flex-shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteConfirmId(log.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workout Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workout entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExerciseDiary;
