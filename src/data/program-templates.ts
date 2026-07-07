/**
 * Program Templates — pre-built programs targeting pain conditions and goals.
 *
 * NOTE: Exercise arrays are intentionally empty for now. Ryan provides the
 * exercise-to-condition mappings; UI must handle empty arrays gracefully
 * ("Exercises being added").
 */

import type { BodyArea } from '@/data/exercises';

export interface ProgramTemplateExercise {
  /** Matches exercise name in DB */
  exerciseName: string;
  sets: number;
  reps: string;
  order: number;
  /** Which day of the week */
  dayNumber: number;
  notes?: string;
}

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  category: 'pain_relief' | 'mobility' | 'strength' | 'daily' | 'posture';
  targetConditions: string[];
  targetBodyAreas: BodyArea[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** 0 = ongoing */
  durationWeeks: number;
  daysPerWeek: number;
  exercises: ProgramTemplateExercise[];
}

export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  {
    id: 'tpl-lower-back',
    name: 'Lower Back Pain Protocol',
    description:
      'Targets the common contributors to lower back discomfort: tight hip flexors, underactive glutes, and limited core stability. Progresses from gentle mobility to functional strength.',
    category: 'pain_relief',
    targetConditions: ['lower_back'],
    targetBodyAreas: ['L Spine', 'Hip', 'Foot/Ankle'],
    difficulty: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 5,
    exercises: [],
  },
  {
    id: 'tpl-hip-pain',
    name: 'Hip Pain Protocol',
    description:
      'Opens tight hip flexors, strengthens underactive glutes, and improves hip joint mobility. Addresses both the hip and the ankle/knee that feed into it.',
    category: 'pain_relief',
    targetConditions: ['hips'],
    targetBodyAreas: ['Hip', 'Foot/Ankle', 'Knee'],
    difficulty: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 5,
    exercises: [],
  },
  {
    id: 'tpl-neck-pain',
    name: 'Neck Pain Protocol',
    description:
      'Releases tight upper traps and suboccipitals, strengthens deep neck flexors, and restores thoracic mobility. Addresses forward head posture.',
    category: 'pain_relief',
    targetConditions: ['neck'],
    targetBodyAreas: ['C Spine', 'T Spine', 'Shoulder'],
    difficulty: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 5,
    exercises: [],
  },
  {
    id: 'tpl-upper-back',
    name: 'Upper Back & Shoulder Protocol',
    description:
      'Opens tight chests, strengthens rhomboids and lower traps, and restores shoulder mobility. Counters rounded shoulders from desk work.',
    category: 'pain_relief',
    targetConditions: ['upper_back'],
    targetBodyAreas: ['T Spine', 'Shoulder'],
    difficulty: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 5,
    exercises: [],
  },
  {
    id: 'tpl-knee-pain',
    name: 'Knee Pain Protocol',
    description:
      'Knee discomfort is rarely just a knee problem. This protocol addresses the ankle mobility and hip strength that feed into knee dysfunction.',
    category: 'pain_relief',
    targetConditions: ['knees'],
    targetBodyAreas: ['Knee', 'Foot/Ankle', 'Hip'],
    difficulty: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 5,
    exercises: [],
  },
  {
    id: 'tpl-foundation',
    name: 'Foundation Reset',
    description:
      'A 4-week program for heavy sitters. Full body mobility, core stability, and foundational strength. The starting point for most users.',
    category: 'daily',
    targetConditions: [],
    targetBodyAreas: ['Foot/Ankle', 'Knee', 'Hip', 'L Spine', 'T Spine', 'C Spine', 'Shoulder'],
    difficulty: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 5,
    exercises: [],
  },
  {
    id: 'tpl-daily-mobility',
    name: 'Daily Mobility Protocol',
    description:
      'A quick daily routine (10-15 min) covering all major joints. Perfect for maintenance and prevention.',
    category: 'mobility',
    targetConditions: [],
    targetBodyAreas: ['Foot/Ankle', 'Knee', 'Hip', 'L Spine', 'T Spine', 'C Spine', 'Shoulder'],
    difficulty: 'beginner',
    durationWeeks: 0,
    daysPerWeek: 7,
    exercises: [],
  },
];
