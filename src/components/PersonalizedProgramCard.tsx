/**
 * PersonalizedProgramCard — shows the program generated from onboarding:
 * matched template, why it was selected, and modifications to apply.
 * Reads profiles.program_personalization; renders nothing if absent.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, ChevronRight, Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PROGRAM_TEMPLATES } from '@/data/program-templates';

interface ProgramPersonalization {
  templateId: string | null;
  notes: string;
  modifications: string[];
}

export function PersonalizedProgramCard({
  onStartWorkout,
  compact = false,
}: {
  /** Optional workout-start handler (Dashboard passes its existing one) */
  onStartWorkout?: () => void;
  /** Compact hides the modification list behind a count */
  compact?: boolean;
}) {
  const { user } = useAuth();
  const [personalization, setPersonalization] = useState<ProgramPersonalization | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from('profiles')
      .select('program_personalization')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        const p = (data as unknown as { program_personalization?: ProgramPersonalization } | null)
          ?.program_personalization;
        if (p?.templateId) setPersonalization(p);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!personalization) return null;

  const template = PROGRAM_TEMPLATES.find((t) => t.id === personalization.templateId);
  if (!template) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription>Your personalized program</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{template.description}</p>

        {personalization.notes && (
          <p className="text-sm">
            <span className="font-medium">Why this program: </span>
            <span className="text-muted-foreground">{personalization.notes}</span>
          </p>
        )}

        {personalization.modifications.length > 0 && (
          compact ? (
            <Badge variant="secondary" className="gap-1">
              <Wrench className="h-3 w-3" />
              {personalization.modifications.length} personalization{personalization.modifications.length !== 1 ? 's' : ''} applied
            </Badge>
          ) : (
            <div>
              <h4 className="anatomy-label mb-2">Your adjustments</h4>
              <ul className="space-y-1.5">
                {personalization.modifications.map((m) => (
                  <li key={m} className="text-sm text-muted-foreground flex gap-2">
                    <Wrench className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )
        )}

        {template.exercises.length === 0 && (
          <Badge variant="outline">Exercises being added — check back soon</Badge>
        )}

        <div className="flex flex-wrap gap-3">
          {onStartWorkout && (
            <Button className="gap-2" onClick={onStartWorkout}>
              <Play className="h-4 w-4" />
              Start Today's Workout
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link to="/my-programs" className="gap-1">
              View Full Program <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
