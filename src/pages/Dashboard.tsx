import { useEffect, useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Library,
  ShoppingCart,
  Target,
  TrendingUp,
  Clock,
  Zap,
  Award,
  Heart,
  ArrowRight,
  Flame,
  Dumbbell,
  Calendar,
  Play,
  Trophy,
  BarChart3,
  Activity,
  ChevronRight,
  Sparkles,
  Timer,
  Weight,
  Repeat,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "@/hooks/useGamification";
import { useUserStats, ACHIEVEMENTS } from "@/hooks/useUserStats";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useSubscription } from "@/hooks/useSubscription";
import { StreakCelebration } from "@/components/StreakCelebration";
import { StatsChart } from "@/components/StatsChart";
import { AchievementCard } from "@/components/AchievementCard";
import { QuickLogModal } from "@/components/QuickLogModal";
import { useToast } from "@/hooks/use-toast";
import { PersonalizedProgramCard } from "@/components/PersonalizedProgramCard";
import { BodyMap, buildMuscleHeatmap } from "@/components/BodyMap";
import type { HighlightConfig } from "@/components/BodyMap";
import { exercises as exerciseDatabase } from "@/data/exercises";
import { useOnboardingData } from "@/hooks/useOnboardingData";
import { buildPainHighlights, mergeHighlights } from "@/lib/personalization";
import { TopFiveCard } from "@/components/TopFiveCard";

// Heatmap intensity (1-4) → color, cool amber to hot red
const HEAT_COLORS: Record<number, string> = {
  1: '#fcd34d',
  2: '#fbbf24',
  3: '#f97316',
  4: '#ef4444',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { gamification, processSignIn, levelInfo, progressToNextLevel } = useGamification();
  const { stats, achievements, recentWorkouts, getTopMuscleGroups } = useUserStats();
  const { recommendation, recommendedExercises, context, acceptRecommendation } = useRecommendations();
  const { subscribed, subscriptionTier } = useSubscription();

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<any>(null);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [statsPeriod, setStatsPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [isStartingWorkout, setIsStartingWorkout] = useState(false);

  // Process sign-in and check for streak celebrations
  useEffect(() => {
    const handleSignIn = async () => {
      const result = await processSignIn();
      if (result) {
        // Check for streak milestones
        if (result.newStreak === 7 || result.newStreak === 30 || result.newStreak === 100) {
          setCelebrationData({
            type: 'streak',
            streak: result.newStreak,
            points: result.bonusPoints,
          });
          setShowCelebration(true);
        }
      }
    };

    if (user) {
      handleSignIn();
    }
  }, [user]);

  const streak = gamification?.current_streak || 0;
  const longestStreak = gamification?.longest_streak || 0;
  const totalPoints = gamification?.total_points || 0;

  // Calculate weekly progress
  const weeklyGoal = 5;
  const weeklyCompleted = stats?.weekly_workouts || 0;
  const weeklyProgress = Math.min((weeklyCompleted / weeklyGoal) * 100, 100);

  // Top muscle groups for chart
  const topMuscleGroups = getTopMuscleGroups(5);

  // "Your Body Today" heatmap — muscles worked recently, mapped to highlight
  // colors, overlaid with the pain areas reported during onboarding (deep red).
  // Keyed on a stable string so the map doesn't redraw on unrelated re-renders.
  const { onboarding } = useOnboardingData();
  const bodyGender = onboarding?.bodyModel === 'female' ? 'female' as const : 'male' as const;
  const painAreas = useMemo(
    () => (onboarding?.painAreas ?? []).filter((p) => p !== 'none'),
    [onboarding]
  );
  const heatmapKey =
    topMuscleGroups.map((mg) => `${mg.name}:${mg.count}`).join('|') +
    '::' +
    painAreas.join(',');
  const bodyHeatmap: HighlightConfig[] = useMemo(() => {
    const logged = topMuscleGroups.map((mg) => ({
      targetMuscles: [mg.name],
      count: mg.count,
    }));
    const heat = buildMuscleHeatmap(logged)
      .filter(([, intensity]) => intensity > 0)
      .map(([muscle, intensity]) => ({
        muscle,
        color: HEAT_COLORS[intensity] ?? HEAT_COLORS[1],
        opacity: 0.4 + intensity * 0.15,
      }));
    return mergeHighlights(heat, buildPainHighlights(painAreas));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heatmapKey]);

  const handleStartRecommendedWorkout = useCallback(async () => {
    if (isStartingWorkout) return;

    setIsStartingWorkout(true);
    try {
      await acceptRecommendation();
      navigate('/log-workout', { state: { exercises: recommendedExercises } });
    } catch (error) {
      console.error('Error starting recommended workout:', error);
      toast({
        title: "Error",
        description: "Failed to start workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStartingWorkout(false);
    }
  }, [acceptRecommendation, navigate, recommendedExercises, toast, isStartingWorkout]);

  return (
    <div className="min-h-screen bg-background">
      {/* Streak Celebration Modal */}
      {showCelebration && celebrationData && (
        <StreakCelebration
          data={celebrationData}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {/* Quick Log Modal */}
      <QuickLogModal open={showQuickLog} onOpenChange={setShowQuickLog} />

      {/* Hero Section with Streak */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent opacity-95" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Welcome & Streak */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
                </h1>
                {streak > 0 && (
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Flame className="h-5 w-5 text-orange-300 animate-streak-fire" />
                    <span className="font-bold text-lg">{streak}</span>
                    <span className="text-sm opacity-90">day streak</span>
                  </div>
                )}
              </div>
              <p className="text-white/80 text-lg">
                {context?.daysSinceLastWorkout === 0
                  ? "You've already worked out today. Great job!"
                  : context?.daysSinceLastWorkout === 1
                  ? "Keep the momentum going with today's workout!"
                  : context?.daysSinceLastWorkout && context.daysSinceLastWorkout < 999
                  ? `It's been ${context.daysSinceLastWorkout} days. Let's get moving!`
                  : "Ready to start your first workout? Let's go!"}
              </p>

              {/* Level Progress */}
              <div className="mt-4 max-w-sm">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="h-4 w-4" />
                    Level {levelInfo.level}: {levelInfo.name}
                  </span>
                  <span>{totalPoints} pts</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${progressToNextLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              {subscribed ? (
                <>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="gap-2 shadow-lg hover:shadow-xl transition-all animate-pulse-ring"
                    onClick={handleStartRecommendedWorkout}
                    disabled={isStartingWorkout}
                  >
                    <Play className="h-5 w-5" />
                    {isStartingWorkout ? 'Starting...' : "Start Today's Workout"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-white/30 text-white hover:bg-white/20"
                    onClick={() => setShowQuickLog(true)}
                  >
                    <Plus className="h-5 w-5" />
                    Quick Log
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="gap-2 shadow-lg hover:shadow-xl transition-all animate-pulse-ring"
                    onClick={handleStartRecommendedWorkout}
                    disabled={isStartingWorkout}
                  >
                    <Play className="h-5 w-5" />
                    {isStartingWorkout ? 'Starting...' : "Start Today's Workout"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-white/30 text-white hover:bg-white/20"
                    onClick={() => setShowQuickLog(true)}
                  >
                    <Plus className="h-5 w-5" />
                    Quick Log
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="card-hover stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Weekly Progress</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">{weeklyCompleted}</span>
                    <span className="text-muted-foreground">/ {weeklyGoal}</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
              <Progress value={weeklyProgress} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="card-hover stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-streak">{streak}</span>
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-500 animate-streak-fire" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Best: {longestStreak} days
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Workouts</p>
                  <span className="text-3xl font-bold">{stats?.total_workouts || 0}</span>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-success" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats?.total_duration_minutes || 0} total minutes
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                  <span className="text-3xl font-bold">{achievements?.length || 0}</span>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-accent" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {Object.keys(ACHIEVEMENTS).length - (achievements?.length || 0)} remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Recommendations & Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Your Body Today — heatmap of recently worked muscles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Your Body Today
                </CardTitle>
                <CardDescription>
                  {painAreas.length > 0
                    ? 'Deep red marks the areas you told us about. Warmer colors are muscles you\'ve trained recently. Tap one to find exercises.'
                    : bodyHeatmap.length > 0
                    ? 'Muscles you\'ve worked recently — hotter color means more volume. Tap one to find exercises.'
                    : 'Log workouts to light up your body map. Tap a muscle to find exercises for it.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BodyMap
                  exercises={exerciseDatabase}
                  side="front"
                  gender={bodyGender}
                  height="20rem"
                  initialHighlights={bodyHeatmap}
                  onMuscleClick={(info) =>
                    navigate(`/exercise-library?area=${encodeURIComponent(info.bodyArea)}`)
                  }
                />
              </CardContent>
            </Card>

            {/* Your Program — generated from onboarding */}
            <PersonalizedProgramCard compact onStartWorkout={handleStartRecommendedWorkout} />

            {/* Your Top 5 — personalized exercise picks */}
            <TopFiveCard />

            {/* Today's Recommendation */}
            {recommendation && recommendedExercises.length > 0 && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Recommended for Today</CardTitle>
                        <CardDescription>{recommendation.recommendation_reason}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="hidden sm:flex">
                      {recommendedExercises.length} exercises
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    {recommendedExercises.slice(0, 4).map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-background/80 border"
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{exercise.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {exercise.muscle_groups?.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 gap-2"
                      onClick={handleStartRecommendedWorkout}
                      disabled={isStartingWorkout}
                    >
                      <Play className="h-4 w-4" />
                      {isStartingWorkout ? 'Starting...' : 'Start Workout'}
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/exercise-library">Browse All</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comprehensive Stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Your Stats
                  </CardTitle>
                  <Tabs value={statsPeriod} onValueChange={(v) => setStatsPeriod(v as any)}>
                    <TabsList className="h-8">
                      <TabsTrigger value="week" className="text-xs px-3">Week</TabsTrigger>
                      <TabsTrigger value="month" className="text-xs px-3">Month</TabsTrigger>
                      <TabsTrigger value="all" className="text-xs px-3">All Time</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Dumbbell className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">
                      {statsPeriod === 'week' ? stats?.weekly_workouts : statsPeriod === 'month' ? stats?.monthly_workouts : stats?.total_workouts || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Workouts</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Repeat className="h-5 w-5 mx-auto mb-2 text-success" />
                    <p className="text-2xl font-bold">
                      {statsPeriod === 'week' ? stats?.weekly_sets : statsPeriod === 'month' ? stats?.monthly_sets : stats?.total_sets || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Sets</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Weight className="h-5 w-5 mx-auto mb-2 text-accent" />
                    <p className="text-2xl font-bold">
                      {Math.round((statsPeriod === 'week' ? stats?.weekly_weight : statsPeriod === 'month' ? stats?.monthly_weight : stats?.total_weight_lifted) || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">lbs Lifted</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Timer className="h-5 w-5 mx-auto mb-2 text-info" />
                    <p className="text-2xl font-bold">
                      {statsPeriod === 'week' ? stats?.weekly_duration_minutes : statsPeriod === 'month' ? stats?.monthly_duration_minutes : stats?.total_duration_minutes || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                  </div>
                </div>

                {/* Muscle Groups Chart */}
                {topMuscleGroups.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Most Trained Muscle Groups</h4>
                    <div className="space-y-2">
                      {topMuscleGroups.map((mg, i) => (
                        <div key={mg.name} className="flex items-center gap-3">
                          <span className="text-sm w-24 truncate">{mg.name}</span>
                          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${(mg.count / topMuscleGroups[0].count) * 100}%`,
                                backgroundColor: `hsl(var(--chart-${(i % 5) + 1}))`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{mg.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/progress" className="gap-1">
                      View All <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentWorkouts && recentWorkouts.length > 0 ? (
                  <div className="space-y-3">
                    {recentWorkouts.slice(0, 5).map((workout) => (
                      <div
                        key={workout.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {workout.workout_name || 'Workout'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(workout.logged_at).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                            {workout.duration_minutes && ` • ${workout.duration_minutes} min`}
                          </p>
                        </div>
                        {workout.rating && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: workout.rating }).map((_, i) => (
                              <span key={i} className="text-yellow-500">★</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No workouts logged yet</p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                      <Button onClick={() => setShowQuickLog(true)}>
                        Log Your First Workout
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/exercise-diary">View Diary</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Achievements & Quick Links */}
          <div className="space-y-6">
            {/* Streak Card */}
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-4">
                    <Flame className="h-10 w-10 text-white animate-streak-fire" />
                  </div>
                  <h3 className="text-4xl font-bold mb-1">{streak}</h3>
                  <p className="text-muted-foreground mb-4">Day Streak</p>
                  <div className="flex justify-center gap-4 text-sm">
                    <div>
                      <p className="font-bold">{longestStreak}</p>
                      <p className="text-muted-foreground">Best</p>
                    </div>
                    <div className="w-px bg-border" />
                    <div>
                      <p className="font-bold">{7 - (streak % 7)}</p>
                      <p className="text-muted-foreground">To Next Bonus</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements && achievements.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.slice(0, 4).map((achievement) => (
                      <AchievementCard key={achievement.id} achievement={achievement} compact />
                    ))}
                    {achievements.length > 4 && (
                      <Button variant="ghost" className="w-full" asChild>
                        <Link to="/achievements">
                          View All {achievements.length} Achievements
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Award className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Complete workouts to earn achievements!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <Link to="/exercise-library">
                    <Library className="h-6 w-6" />
                    <span className="text-xs">Exercises</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <Link to="/my-programs">
                    <Calendar className="h-6 w-6" />
                    <span className="text-xs">Programs</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <Link to="/progress">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-xs">Progress</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <Link to="/store">
                    <ShoppingCart className="h-6 w-6" />
                    <span className="text-xs">Store</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Free Trial CTA */}
            {!subscribed && (
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <Zap className="h-10 w-10 mx-auto text-primary mb-3" />
                  <h3 className="font-bold mb-2">You're on Your Free Trial</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore everything — all programs, exercises, and tracking. Subscribe to keep access after your trial.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/pricing">View Plans</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
