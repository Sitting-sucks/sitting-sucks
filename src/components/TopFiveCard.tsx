/**
 * TopFiveCard — "Your Top 5" personalized exercise picks, scored from
 * onboarding answers. Each row opens a detail dialog with instructions,
 * video, and the variation dial (easier / standard / harder).
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ListOrdered, ChevronRight, Clock, Star } from 'lucide-react';
import { exercises as exerciseDatabase, Exercise } from '@/data/exercises';
import { getTopExercises } from '@/lib/personalization';
import { useOnboardingData } from '@/hooks/useOnboardingData';
import { VariationDial } from '@/components/VariationDial';

const Stars = ({ count }: { count: number }) => (
  <span className="flex items-center gap-0.5" aria-label={`${count} out of 5`}>
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
      />
    ))}
  </span>
);

export function TopFiveCard() {
  const { onboarding, loading } = useOnboardingData();
  const [selected, setSelected] = useState<Exercise | null>(null);

  const picks = useMemo(
    () => (onboarding ? getTopExercises(exerciseDatabase, onboarding, 5) : []),
    [onboarding]
  );

  if (loading || !onboarding || picks.length === 0) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-primary" />
            Your Top 5
          </CardTitle>
          <CardDescription>
            Picked for you from your onboarding answers — pain areas, goal, and equipment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {picks.map(({ exercise, reasons }, i) => (
            <button
              key={exercise.id}
              onClick={() => setSelected(exercise)}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
            >
              <span className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="flex-1 min-w-0">
                <span className="font-medium text-sm block truncate">{exercise.name}</span>
                {reasons[0] && (
                  <span className="text-xs text-muted-foreground block truncate">{reasons[0]}</span>
                )}
              </span>
              <Stars count={exercise.difficulty} />
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
          <Button variant="ghost" className="w-full" asChild>
            <Link to="/exercise-library" className="gap-1">
              Browse Full Library <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{selected.name}</DialogTitle>
              <DialogDescription>{selected.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {selected.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  Difficulty <Stars count={selected.difficulty} />
                </span>
                <span className="flex items-center gap-1.5">
                  Intensity <Stars count={selected.intensity} />
                </span>
              </div>

              {selected.hasVideo && selected.videoUrl && (
                <div className="aspect-video">
                  <iframe
                    src={selected.videoUrl}
                    title={`${selected.name} tutorial`}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
              )}

              <div>
                <h4 className="anatomy-label mb-2">Instructions</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selected.instructions}
                </p>
              </div>

              <VariationDial
                baseline={selected.baseline}
                progression={selected.progression}
                regression={selected.regression}
              />

              <div className="flex flex-wrap gap-1">
                {selected.equipment.map((e) => (
                  <Badge key={e} variant="secondary" className="text-xs">
                    {e}
                  </Badge>
                ))}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
