import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Check,
  Play,
  Clock,
  Target,
  AlertTriangle,
  Dumbbell,
  ArrowRight,
  ChevronRight,
  Heart,
  Flame,
  Zap,
  BookOpen,
  Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FREE_GUIDE_EXERCISES } from '@/data/freeGuideExercises';

// Use the imported guide exercises data
const guideExercises = FREE_GUIDE_EXERCISES;

const AntiSittingGuide = () => {
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const toggleExercise = (id: number) => {
    setCompletedExercises(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const progress = (completedExercises.length / guideExercises.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-success/10 via-primary/5 to-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="relative max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Heart className="h-3.5 w-3.5 mr-1.5" />
              Free Guide
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              The Anti-Sitting Starter Guide
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              5 essential exercises to start reversing the damage from prolonged sitting.
              No equipment needed. Takes just 10-15 minutes.
            </p>

            {/* Progress */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Your Progress</span>
                <span className="font-medium">{completedExercises.length} / {guideExercises.length} completed</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {progress === 100 && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-success font-medium mb-1">
                  <Check className="h-5 w-5" />
                  Great job completing the guide!
                </div>
                <p className="text-sm text-muted-foreground">
                  Ready for more? Upgrade to access our full program library and tracking features.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Why This Matters */}
        <Card className="mb-8 border-destructive/20 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-lg">Why This Matters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Sitting for extended periods causes real, measurable damage to your body:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">1.</span>
                <span><strong>Hip flexors shorten</strong> - leading to lower back pain and anterior pelvic tilt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">2.</span>
                <span><strong>Glutes deactivate</strong> - causing hip and knee problems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">3.</span>
                <span><strong>Shoulders round forward</strong> - creating neck pain and headaches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">4.</span>
                <span><strong>Spine stiffens</strong> - reducing mobility and increasing injury risk</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              These 5 exercises target each of these problem areas. Do them daily for best results.
            </p>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            The 5 Essential Exercises
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {guideExercises.map((exercise, index) => (
              <AccordionItem key={exercise.id} value={`exercise-${exercise.id}`} className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-4 w-full">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExercise(exercise.id);
                      }}
                      className={`h-8 w-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        completedExercises.includes(exercise.id)
                          ? 'bg-success border-success text-white'
                          : 'border-muted-foreground/30 hover:border-primary'
                      }`}
                    >
                      {completedExercises.includes(exercise.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </button>
                    <div className="flex-1 text-left">
                      <p className={`font-medium ${completedExercises.includes(exercise.id) ? 'line-through text-muted-foreground' : ''}`}>
                        {exercise.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exercise.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {exercise.targetAreas.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="pl-12 space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">How to do it:</h4>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                        <Zap className="h-4 w-4 text-primary" />
                        Why it helps:
                      </h4>
                      <p className="text-sm text-muted-foreground">{exercise.whyItHelps}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Tips:</h4>
                      <ul className="space-y-1">
                        {exercise.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant={completedExercises.includes(exercise.id) ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleExercise(exercise.id)}
                    >
                      {completedExercises.includes(exercise.id) ? (
                        <>Mark Incomplete</>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Mark Complete
                        </>
                      )}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Upgrade CTA */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="py-8 text-center">
            <Flame className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Ready for the Full Experience?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Unlock workout tracking, streaks, achievements, and access to all our
              programs designed to transform your mobility and eliminate pain.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link to="/pricing">
                  Upgrade Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/exercise-library">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Exercises
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AntiSittingGuide;
