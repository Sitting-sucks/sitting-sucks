import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscription } from "@/hooks/useSubscription";
import { useMyPrograms } from "@/hooks/usePrograms";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Dumbbell, Loader2, Lock, Play, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PersonalizedProgramCard } from "@/components/PersonalizedProgramCard";

interface ProgramExerciseDetail {
  id: string;
  day_number: number;
  order_index: number;
  sets: number | null;
  reps: string | null;
  notes: string | null;
  exercises: {
    id: string;
    name: string;
    description: string | null;
    difficulty: string;
    intensity: string;
    video_url: string | null;
  } | null;
}

const MyPrograms = () => {
  const { subscribed, subscriptionTier } = useSubscription();
  const { myPrograms, premadePrograms, loading } = useMyPrograms();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [programDetails, setProgramDetails] = useState<ProgramExerciseDetail[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);

  const isTier2 = subscriptionTier === "coaching";

  const fetchProgramDetails = async (programId: string) => {
    try {
      setLoadingDetails(true);
      const { data, error } = await supabase
        .from("program_exercises")
        .select(`
          id,
          day_number,
          order_index,
          sets,
          reps,
          notes,
          exercises (
            id,
            name,
            description,
            difficulty,
            intensity,
            video_url
          )
        `)
        .eq("program_id", programId)
        .order("day_number")
        .order("order_index");

      if (error) throw error;
      setProgramDetails(data || []);

      // Set to first available day
      if (data && data.length > 0) {
        const days = [...new Set(data.map((d) => d.day_number))];
        setSelectedDay(Math.min(...days));
      }
    } catch (error) {
      console.error("Error fetching program details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectProgram = (programId: string) => {
    setSelectedProgramId(programId);
    fetchProgramDetails(programId);
  };

  // Get unique days from program details
  const availableDays = [...new Set(programDetails.map((pe) => pe.day_number))].sort((a, b) => a - b);
  const currentDayExercises = programDetails.filter((pe) => pe.day_number === selectedDay);

  // Combine all available programs
  const allPrograms = [
    ...premadePrograms.map((p) => ({ ...p, type: "premade" as const })),
    ...myPrograms.filter((mp) => mp.programs).map((mp) => ({ ...mp.programs!, type: "assigned" as const })),
  ];

  if (!subscribed) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="text-center py-12">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Subscribe to Access Programs</h2>
            <p className="text-muted-foreground mb-6">
              Get access to the Anti-Sitting Protocol and our full exercise library.
            </p>
            <Link to="/pricing">
              <Button>View Pricing</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          My Programs
        </h1>
        <p className="text-muted-foreground mt-1">
          {isTier2
            ? "View your assigned workout programs and pre-made protocols"
            : "Access the Anti-Sitting Protocol and pre-made workout programs"}
        </p>
      </div>

      {/* Personalized program from onboarding */}
      <div className="mb-8">
        <PersonalizedProgramCard />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Program List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold">Available Programs</h2>

            {allPrograms.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No programs available yet.</p>
                </CardContent>
              </Card>
            ) : (
              allPrograms.map((program) => (
                <Card
                  key={program.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedProgramId === program.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleSelectProgram(program.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{program.name}</h3>
                          {program.type === "premade" ? (
                            <Badge variant="secondary">Pre-made</Badge>
                          ) : (
                            <Badge variant="default">Custom</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {program.description || "No description"}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {!isTier2 && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4" />
                    <span className="font-medium">Custom Programs</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upgrade to Tier 2 for personalized workout programs designed just for you.
                  </p>
                  <Link to="/pricing">
                    <Button variant="outline" size="sm">Upgrade</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Program Details */}
          <div className="lg:col-span-2">
            {!selectedProgramId ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Select a program to view its exercises
                  </p>
                </CardContent>
              </Card>
            ) : loadingDetails ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : programDetails.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No exercises in this program yet. Check back soon!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Day Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {availableDays.map((day) => (
                    <Button
                      key={day}
                      variant={selectedDay === day ? "default" : "outline"}
                      onClick={() => setSelectedDay(day)}
                      className="flex-shrink-0"
                    >
                      Day {day}
                    </Button>
                  ))}
                </div>

                {/* Exercises for Selected Day */}
                <div className="space-y-3">
                  {currentDayExercises.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">Rest day or no exercises scheduled</p>
                      </CardContent>
                    </Card>
                  ) : (
                    currentDayExercises.map((pe, index) => (
                      <Card key={pe.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">{pe.exercises?.name || "Unknown Exercise"}</h3>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{pe.exercises?.difficulty}</Badge>
                                  <Badge variant="secondary">{pe.exercises?.intensity}</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {pe.exercises?.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="font-medium">
                                  {pe.sets} sets x {pe.reps} reps
                                </span>
                                {pe.notes && (
                                  <span className="text-muted-foreground">
                                    Note: {pe.notes}
                                  </span>
                                )}
                              </div>
                              {pe.exercises?.video_url && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="mt-3">
                                      <Play className="h-4 w-4 mr-1" />
                                      Watch Video
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                      <DialogTitle>{pe.exercises.name}</DialogTitle>
                                    </DialogHeader>
                                    <div className="aspect-video">
                                      <iframe
                                        src={pe.exercises.video_url}
                                        title={pe.exercises.name}
                                        className="w-full h-full rounded-lg"
                                        allowFullScreen
                                        sandbox="allow-scripts allow-same-origin allow-presentation"
                                        referrerPolicy="no-referrer"
                                        loading="lazy"
                                      />
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Log Workout Button (Tier 2 only) */}
                {isTier2 && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Ready to work out?</h4>
                          <p className="text-sm text-muted-foreground">
                            Log your progress and track your gains
                          </p>
                        </div>
                        <Link to={`/log-workout?program=${selectedProgramId}&day=${selectedDay}`}>
                          <Button>
                            <Play className="h-4 w-4 mr-1" />
                            Start Workout
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPrograms;
