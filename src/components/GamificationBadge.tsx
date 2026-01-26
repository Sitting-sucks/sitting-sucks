import { useState, useEffect } from "react";
import { useGamification, LEVELS } from "@/hooks/useGamification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Star, Trophy, Zap, Award, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const GamificationBadge = () => {
  const { toast } = useToast();
  const {
    gamification,
    pointHistory,
    loading,
    levelInfo,
    nextLevelInfo,
    progressToNextLevel,
    processSignIn,
  } = useGamification();

  const [hasProcessedSignIn, setHasProcessedSignIn] = useState(false);

  // Process sign-in on mount
  useEffect(() => {
    const handleSignIn = async () => {
      if (!gamification || hasProcessedSignIn) return;

      const result = await processSignIn();
      setHasProcessedSignIn(true);

      if (result) {
        // Show toast for daily sign-in
        toast({
          title: `+${result.dailyPoints} Points!`,
          description: `Daily sign-in reward. Streak: ${result.newStreak} day${result.newStreak > 1 ? 's' : ''}`,
        });

        // Show bonus toast if applicable
        if (result.bonusPoints > 0) {
          setTimeout(() => {
            toast({
              title: `+${result.bonusPoints} Bonus Points!`,
              description: result.bonusReason,
            });
          }, 1500);
        }

        // Show level up toast
        if (result.levelUp) {
          setTimeout(() => {
            toast({
              title: "Level Up!",
              description: `You're now Level ${result.newLevel.level}: ${result.newLevel.name}`,
            });
          }, 3000);
        }
      }
    };

    handleSignIn();
  }, [gamification, hasProcessedSignIn, processSignIn, toast]);

  if (loading || !gamification) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{gamification.total_points}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Lv.{levelInfo.level}
          </Badge>
          {gamification.current_streak > 0 && (
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="h-4 w-4 fill-orange-500" />
              <span className="text-xs font-medium">{gamification.current_streak}</span>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Progress
          </DialogTitle>
          <DialogDescription>
            Keep training to earn points and level up!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Level & Points */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    Level {levelInfo.level}
                  </div>
                  <div className="text-sm text-muted-foreground">{levelInfo.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-500">
                    {gamification.total_points}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>
              </div>

              {nextLevelInfo && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level {nextLevelInfo.level}</span>
                    <span>{nextLevelInfo.minPoints - gamification.total_points} pts needed</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <Flame className="h-8 w-8 mx-auto text-orange-500 fill-orange-500 mb-2" />
                <div className="text-2xl font-bold">{gamification.current_streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
                <div className="text-2xl font-bold">{gamification.longest_streak}</div>
                <div className="text-xs text-muted-foreground">Best Streak</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <Zap className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <div className="text-2xl font-bold">{gamification.workouts_completed}</div>
                <div className="text-xs text-muted-foreground">Workouts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <Star className="h-8 w-8 mx-auto text-yellow-500 fill-yellow-500 mb-2" />
                <div className="text-2xl font-bold">{gamification.exercises_logged}</div>
                <div className="text-xs text-muted-foreground">Exercises</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Points */}
          {pointHistory.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Recent Activity
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {pointHistory.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex justify-between items-center text-sm p-2 bg-muted rounded"
                  >
                    <span>{entry.reason}</span>
                    <Badge variant="secondary" className="text-green-600">
                      +{entry.points}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level Guide */}
          <div className="text-xs text-muted-foreground">
            <details>
              <summary className="cursor-pointer hover:text-foreground">View all levels</summary>
              <div className="mt-2 space-y-1">
                {LEVELS.map((level) => (
                  <div
                    key={level.level}
                    className={`flex justify-between ${
                      level.level === levelInfo.level ? "font-bold text-primary" : ""
                    }`}
                  >
                    <span>Lv.{level.level} {level.name}</span>
                    <span>{level.minPoints}+ pts</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GamificationBadge;
