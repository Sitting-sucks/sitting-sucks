/**
 * MuscleInfoPanel — Displays muscle info when a user clicks on the body map.
 *
 * Used by Landing, Dashboard, and ExerciseLibrary pages.
 * Three display modes: modal (default), sidebar, dropdown.
 *
 * Usage:
 *   <MuscleInfoPanel
 *     muscle={selectedMuscle}
 *     mode="modal"
 *     onClose={() => setSelectedMuscle(null)}
 *   />
 *
 *   <MuscleInfoPanel
 *     muscle={filterMuscle}
 *     mode="sidebar"
 *     onClose={() => setFilterMuscle(null)}
 *   />
 */

import { X, Dumbbell, ChevronRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PAIN_CONDITION_COLORS } from '@/components/BodyMap';
import type { MuscleClickInfo } from '@/components/BodyMap';

export type MusclePanelMode = 'modal' | 'sidebar';

export interface MuscleInfoPanelProps {
  /** The muscle info from BodyMap's onMuscleClick */
  muscle: MuscleClickInfo | null;
  /** Display mode */
  mode?: MusclePanelMode;
  /** Called when panel is closed/dismissed */
  onClose: () => void;
  /** Called when user clicks an exercise */
  onExerciseClick?: (exerciseId: string) => void;
  /** Called when user clicks the pain protocol link */
  onPainProtocolClick?: (condition: string) => void;
  /** Show the pain protocol link */
  showPainLink?: boolean;
}

// ─── Difficulty badges ──────────────────────────────────────

function DifficultyBadge({ level }: { level: number }) {
  const colors: Record<number, string> = {
    1: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    2: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    3: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    4: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    5: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  const labels: Record<number, string> = {
    1: 'Beginner',
    2: 'Easy',
    3: 'Intermediate',
    4: 'Hard',
    5: 'Advanced',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[level] ?? ''}`}>
      {labels[level] ?? level}
    </span>
  );
}

// ─── Exercise List ──────────────────────────────────────────

function ExerciseList({
  exercises,
  onExerciseClick,
}: {
  exercises: MuscleClickInfo['exercises'];
  onExerciseClick?: (id: string) => void;
}) {
  if (exercises.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No exercises found for this area. Try flipping to the back view or selecting a different muscle.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Dumbbell className="h-3.5 w-3.5" />
        Related Exercises ({exercises.length})
      </h4>
      <div className="space-y-1.5">
        {exercises.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => onExerciseClick?.(ex.id)}
            className="w-full text-left px-3 py-2 rounded-lg border border-border hover:border-primary/30 hover:bg-accent/5 transition-colors group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                {ex.name}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <DifficultyBadge level={ex.difficulty} />
              {ex.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {cat}
                </span>
              ))}
            </div>
            {ex.duration && (
              <p className="text-xs text-muted-foreground mt-1">{ex.duration}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Muscle Description ─────────────────────────────────────

function MuscleDescription({ description }: { description: string }) {
  return (
    <p className="text-sm text-muted-foreground leading-relaxed">
      {description}
    </p>
  );
}

// ─── Pain Protocol Link ─────────────────────────────────────

function PainProtocolLink({
  painCondition,
  painConditionPath,
  onClick,
}: {
  painCondition: string;
  painConditionPath?: string;
  onClick?: (condition: string) => void;
}) {
  const color = PAIN_CONDITION_COLORS[painCondition] ?? '#6b7280';

  return (
    <button
      type="button"
      onClick={() => onClick?.(painCondition)}
      className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
      style={{ color }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      Full {painCondition} Protocol
      <ExternalLink className="h-3 w-3" />
    </button>
  );
}

// ─── Main Component ─────────────────────────────────────────

export function MuscleInfoPanel({
  muscle,
  mode = 'modal',
  onClose,
  onExerciseClick,
  onPainProtocolClick,
  showPainLink = true,
}: MuscleInfoPanelProps) {
  if (!muscle) return null;

  const panelContent = (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold">{muscle.label}</h3>
          {muscle.isSubgroup && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              Sub-group
            </Badge>
          )}
        </div>
        <Badge variant="secondary" className="text-xs">
          {muscle.bodyArea}
        </Badge>
      </div>

      {/* Pain protocol link */}
      {showPainLink && muscle.painCondition && (
        <PainProtocolLink
          painCondition={muscle.painCondition}
          painConditionPath={muscle.painConditionPath}
          onClick={onPainProtocolClick}
        />
      )}

      {/* Description */}
      <MuscleDescription description={muscle.description} />

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Exercise list */}
      <ScrollArea className="max-h-64">
        <ExerciseList
          exercises={muscle.exercises}
          onExerciseClick={onExerciseClick}
        />
      </ScrollArea>
    </div>
  );

  if (mode === 'sidebar') {
    return (
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-xl z-50 transition-transform duration-300 ${
          muscle ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Muscle Details
          </span>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          {panelContent}
        </div>
      </div>
    );
  }

  // Modal mode (default)
  return (
    <Dialog open={!!muscle} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">{muscle.label}</DialogTitle>
        </DialogHeader>
        {panelContent}
      </DialogContent>
    </Dialog>
  );
}

// ─── Quick Stats Card ───────────────────────────────────────

/**
 * Compact muscle stat card for Dashboard grid.
 * Shows today's muscle group status at a glance.
 */
export function MuscleStatCard({
  label,
  condition,
  exerciseCount,
  onClick,
}: {
  label: string;
  condition?: string;
  exerciseCount: number;
  onClick?: () => void;
}) {
  const color = condition
    ? PAIN_CONDITION_COLORS[condition] ?? '#6b7280'
    : '#6b7280';

  return (
    <Card
      className="cursor-pointer hover:border-primary/30 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{label}</p>
          <p className="text-xs text-muted-foreground">
            {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}