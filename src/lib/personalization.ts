/**
 * Personalization engine — turns onboarding answers into visible product value:
 * pain-area highlights for the BodyMap and a scored "Top 5 for you" exercise list.
 */

import type { Muscle } from '@/lib/MuscleMapJS/src/index';
import type { HighlightConfig } from '@/components/BodyMap';
import type { BodyArea, Exercise } from '@/data/exercises';
import type { OnboardingData } from '@/lib/program-generator';

// Onboarding pain-area keys → muscles to flag on the body map
const PAIN_AREA_MUSCLES: Record<string, Muscle[]> = {
  lower_back: ['lower-back', 'gluteal', 'hip-flexors'],
  upper_back: ['upper-back', 'rhomboids', 'upper-trapezius'],
  neck: ['neck', 'upper-trapezius'],
  hips: ['hip-flexors', 'gluteal', 'adductors'],
  knees: ['knees', 'quadriceps', 'hamstring'],
  wrists: ['forearm', 'hands'],
};

// Onboarding pain-area keys → body areas used for exercise matching
const PAIN_AREA_BODY_AREAS: Record<string, BodyArea[]> = {
  lower_back: ['L Spine', 'Hip'],
  upper_back: ['T Spine', 'Shoulder'],
  neck: ['C Spine'],
  hips: ['Hip'],
  knees: ['Knee'],
  wrists: ['Wrist', 'Elbow'],
};

const PAIN_LABELS: Record<string, string> = {
  lower_back: 'lower back',
  upper_back: 'upper back',
  neck: 'neck',
  hips: 'hip',
  knees: 'knee',
  wrists: 'wrist',
};

/**
 * The classic sitting pattern (upper/lower crossed syndrome), shared by the
 * Landing hero and Auth panel. Red = overworked and tight; grey = dormant
 * and weak.
 */
export const SITTING_PATTERN_HIGHLIGHTS: HighlightConfig[] = [
  // Overworked / tight
  { muscle: 'calves', color: '#ef4444', opacity: 0.6 },
  { muscle: 'hip-flexors', color: '#ef4444', opacity: 0.6 },
  { muscle: 'upper-trapezius', color: '#ef4444', opacity: 0.6 },
  { muscle: 'chest', color: '#ef4444', opacity: 0.55 },
  { muscle: 'lower-back', color: '#ef4444', opacity: 0.55 },
  // Dormant / weak
  { muscle: 'gluteal', color: '#6b7280', opacity: 0.45 },
  { muscle: 'abs', color: '#6b7280', opacity: 0.45 },
  { muscle: 'rhomboids', color: '#6b7280', opacity: 0.45 },
  { muscle: 'lower-trapezius', color: '#6b7280', opacity: 0.45 },
];

/** Deep-red overlay for the muscles behind the user's reported pain areas. */
export function buildPainHighlights(painAreas: string[]): HighlightConfig[] {
  const muscles = new Set<Muscle>();
  for (const area of painAreas) {
    for (const m of PAIN_AREA_MUSCLES[area] ?? []) muscles.add(m);
  }
  return Array.from(muscles).map((muscle) => ({
    muscle,
    color: '#dc2626',
    opacity: 0.55,
  }));
}

/**
 * Merge workout heat with pain overlays. Pain wins on collision —
 * the point is drawing attention to the problem area.
 */
export function mergeHighlights(
  heat: HighlightConfig[],
  pain: HighlightConfig[]
): HighlightConfig[] {
  const painMuscles = new Set(pain.map((p) => p.muscle));
  return [...heat.filter((h) => !painMuscles.has(h.muscle)), ...pain];
}

export interface ScoredExercise {
  exercise: Exercise;
  score: number;
  reasons: string[];
}

/**
 * Score the exercise library against onboarding answers and return the
 * top picks with human-readable reasons. Pure function, no fetch.
 */
export function getTopExercises(
  exercises: Exercise[],
  data: Partial<OnboardingData>,
  limit = 5
): ScoredExercise[] {
  const painAreas = (data.painAreas ?? []).filter((p) => p !== 'none');
  const userEquipment = data.equipment ?? [];
  const hasEquipment = userEquipment.length > 0 && !userEquipment.includes('none');

  const scored = exercises.map((exercise) => {
    let score = 0;
    const reasons: string[] = [];

    // Pain-area match is the strongest signal
    for (const area of painAreas) {
      const targets = PAIN_AREA_BODY_AREAS[area] ?? [];
      if (exercise.bodyAreas.some((ba) => targets.includes(ba))) {
        score += 3;
        reasons.push(`Addresses your ${PAIN_LABELS[area] ?? area} concerns`);
      }
    }

    // Goal alignment
    if (data.goal === 'mobility' && exercise.categories.includes('mobility')) {
      score += 2;
      reasons.push('Matches your mobility goal');
    } else if (data.goal === 'strength' && exercise.categories.includes('strength')) {
      score += 2;
      reasons.push('Matches your strength goal');
    } else if (data.goal === 'pain' && exercise.categories.includes('mobility')) {
      score += 2;
      reasons.push('Mobility-first for pain relief');
    }

    // Posture patterns → upper-body postural work
    const postural = data.posturePatterns ?? [];
    if (
      (postural.includes('forward_head') || postural.includes('rounded_shoulders')) &&
      exercise.bodyAreas.some((ba) => ba === 'C Spine' || ba === 'T Spine' || ba === 'Shoulder')
    ) {
      score += 1;
      reasons.push('Counters your posture pattern');
    }

    // Fitness level vs difficulty
    if (data.fitnessLevel === 'beginner') {
      if (exercise.difficulty <= 2) {
        score += 1;
        reasons.push('Beginner-friendly');
      } else if (exercise.difficulty >= 4) {
        score -= 2;
      }
    } else if (data.fitnessLevel === 'advanced' && exercise.difficulty >= 3) {
      score += 1;
    }

    // Equipment feasibility
    const needsOnlyBodyweight = exercise.equipment.every(
      (e) => e === 'None' || e.includes('optional')
    );
    if (needsOnlyBodyweight) {
      score += 1;
      if (!hasEquipment) reasons.push('No equipment needed');
    } else if (!hasEquipment) {
      score -= 2;
    }

    return { exercise, score, reasons: reasons.slice(0, 2) };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Fetch shape stored in profiles.onboarding_data (loose — old users may lack fields). */
export type StoredOnboarding = Partial<OnboardingData> | null;
