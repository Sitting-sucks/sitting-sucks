/**
 * Program Templates — pre-built programs targeting pain conditions and goals.
 *
 * Exercise arrays filled with Ryan's exercise-to-condition mappings (July 2026).
 * One exercise can belong to multiple protocols. Exercises match names in the
 * Supabase `exercises` table (seed migration + new SMR/exercise migration).
 */

import type { BodyArea } from '@/data/exercises';

export interface ProgramTemplateExercise {
  /** Matches exercise name in DB */
  exerciseName: string;
  sets: number;
  reps: string;
  order: number;
  /** Which day of the week (1-7, 1 = Monday) */
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
  // ─── Lower Back Pain Protocol ──────────────────────────
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
    exercises: [
      // Day 1: Release + Mobility
      { exerciseName: 'SMR Glute Med/Min on Foam Roller', sets: 1, reps: '60s each side', order: 1, dayNumber: 1 },
      { exerciseName: 'SMR TFL Release', sets: 1, reps: '45s each side', order: 2, dayNumber: 1 },
      { exerciseName: 'SMR Rectus Femoris', sets: 1, reps: '45s each side', order: 3, dayNumber: 1 },
      { exerciseName: 'Foam Roller Adductor Squeeze', sets: 2, reps: '10 reps', order: 4, dayNumber: 1 },
      { exerciseName: 'Hip Hinge', sets: 2, reps: '10 reps', order: 5, dayNumber: 1 },
      { exerciseName: 'Couch Stretch', sets: 1, reps: '60s each side', order: 6, dayNumber: 1 },
      // Day 2: Strength + Control
      { exerciseName: 'SMR Vastus Medialis', sets: 1, reps: '45s each side', order: 1, dayNumber: 2 },
      { exerciseName: 'Squats', sets: 3, reps: '8-12 reps', order: 2, dayNumber: 2 },
      { exerciseName: 'Deadlift', sets: 3, reps: '8 reps', order: 3, dayNumber: 2 },
      { exerciseName: 'Step Ups', sets: 2, reps: '8 reps each side', order: 4, dayNumber: 2 },
      { exerciseName: 'Step Downs', sets: 2, reps: '8 reps each side', order: 5, dayNumber: 2 },
      // Day 3: Mobility + Core
      { exerciseName: 'SMR Glute Med/Min on Foam Roller', sets: 1, reps: '60s each side', order: 1, dayNumber: 3 },
      { exerciseName: 'SMR TFL Release', sets: 1, reps: '45s each side', order: 2, dayNumber: 3 },
      { exerciseName: 'Lunges', sets: 2, reps: '8 reps each side', order: 3, dayNumber: 3 },
      { exerciseName: 'Forearm Plank', sets: 3, reps: '30s hold', order: 4, dayNumber: 3 },
      { exerciseName: 'Calf & Hamstring Stretch on Heel Wedges', sets: 2, reps: '45s', order: 5, dayNumber: 3 },
      // Day 4: Strength
      { exerciseName: 'Squats', sets: 3, reps: '10-12 reps', order: 1, dayNumber: 4 },
      { exerciseName: 'Hip Hinge', sets: 3, reps: '10 reps', order: 2, dayNumber: 4 },
      { exerciseName: 'Step Ups', sets: 2, reps: '10 reps each side', order: 3, dayNumber: 4 },
      { exerciseName: 'Foam Roller Adductor Squeeze', sets: 2, reps: '12 reps', order: 4, dayNumber: 4 },
      // Day 5: Full Recovery Flow
      { exerciseName: 'SMR Glute Med/Min on Foam Roller', sets: 1, reps: '60s each side', order: 1, dayNumber: 5 },
      { exerciseName: 'SMR Rectus Femoris', sets: 1, reps: '45s each side', order: 2, dayNumber: 5 },
      { exerciseName: 'Couch Stretch', sets: 1, reps: '90s each side', order: 3, dayNumber: 5 },
      { exerciseName: 'Calf & Hamstring Stretch on Heel Wedges', sets: 2, reps: '60s', order: 4, dayNumber: 5 },
      { exerciseName: 'Hip Hinge', sets: 2, reps: '12 reps', order: 5, dayNumber: 5 },
    ],
  },

  // ─── Hip Pain Protocol ─────────────────────────────────
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
    exercises: [
      // Day 1: Release + Open
      { exerciseName: 'SMR Glute Med/Min on Foam Roller', sets: 1, reps: '60s each side', order: 1, dayNumber: 1 },
      { exerciseName: 'SMR TFL Release', sets: 1, reps: '45s each side', order: 2, dayNumber: 1 },
      { exerciseName: 'Couch Stretch', sets: 1, reps: '90s each side', order: 3, dayNumber: 1 },
      { exerciseName: 'Fire Hydrants', sets: 2, reps: '10 reps each side', order: 4, dayNumber: 1 },
      // Day 2: Strength
      { exerciseName: 'Squats', sets: 3, reps: '8-12 reps', order: 1, dayNumber: 2 },
      { exerciseName: 'Deadlift', sets: 3, reps: '8 reps', order: 2, dayNumber: 2 },
      { exerciseName: 'Standing Hip Abduction', sets: 2, reps: '12 reps each side', order: 3, dayNumber: 2 },
      { exerciseName: 'Single Leg Standing Hip Flexion', sets: 2, reps: '10 reps each side', order: 4, dayNumber: 2 },
      // Day 3: Mobility + Unilateral
      { exerciseName: 'Lunges', sets: 3, reps: '8 reps each side', order: 1, dayNumber: 3 },
      { exerciseName: 'Step Ups', sets: 2, reps: '8 reps each side', order: 2, dayNumber: 3 },
      { exerciseName: 'Step Downs', sets: 2, reps: '8 reps each side', order: 3, dayNumber: 3 },
      { exerciseName: 'Single Leg Hamstring Stretch', sets: 1, reps: '45s each side', order: 4, dayNumber: 3 },
      // Day 4: Posterior Chain
      { exerciseName: 'Hip Hinge', sets: 3, reps: '10 reps', order: 1, dayNumber: 4 },
      { exerciseName: 'Roman Chair Hip Extension', sets: 2, reps: '10 reps', order: 2, dayNumber: 4 },
      { exerciseName: 'Nordic Hamstring Curl', sets: 2, reps: '4-6 reps', order: 3, dayNumber: 4 },
      { exerciseName: 'Squats', sets: 2, reps: '10 reps', order: 4, dayNumber: 4 },
      // Day 5: Recovery Flow
      { exerciseName: 'SMR Glute Med/Min on Foam Roller', sets: 1, reps: '60s each side', order: 1, dayNumber: 5 },
      { exerciseName: 'Couch Stretch', sets: 1, reps: '90s each side', order: 2, dayNumber: 5 },
      { exerciseName: 'Single Leg Hamstring Stretch', sets: 1, reps: '60s each side', order: 3, dayNumber: 5 },
      { exerciseName: 'Fire Hydrants', sets: 2, reps: '10 reps each side', order: 4, dayNumber: 5 },
    ],
  },

  // ─── Neck Pain Protocol ────────────────────────────────
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
    exercises: [
      // Day 1: Release + Mobility
      { exerciseName: 'SMR Levator Scapulae', sets: 1, reps: '45s each side', order: 1, dayNumber: 1 },
      { exerciseName: 'SMR Scalene', sets: 1, reps: '30s each side', order: 2, dayNumber: 1 },
      { exerciseName: 'Cervical Flexion/Extension', sets: 2, reps: '8 reps each', order: 3, dayNumber: 1 },
      { exerciseName: 'Cervical Lateral Flexion', sets: 2, reps: '8 reps each side', order: 4, dayNumber: 1 },
      { exerciseName: 'Cervical Rotation', sets: 2, reps: '8 reps each side', order: 5, dayNumber: 1 },
      // Day 2: Upper Body + Posture
      { exerciseName: 'SMR Rhomboid', sets: 1, reps: '45s each side', order: 1, dayNumber: 2 },
      { exerciseName: 'Jesus Stretch (Chest Stretch)', sets: 1, reps: '60s', order: 2, dayNumber: 2 },
      { exerciseName: 'Reverse Fly', sets: 3, reps: '12 reps', order: 3, dayNumber: 2 },
      { exerciseName: 'Overhead Shoulder Flexion on Foam Roller (PVC Pipe)', sets: 2, reps: '10 reps', order: 4, dayNumber: 2 },
      // Day 3: Thoracic + Shoulder
      { exerciseName: 'SMR Longissimus Thoracis', sets: 1, reps: '60s', order: 1, dayNumber: 3 },
      { exerciseName: 'SMR Infraspinatus', sets: 1, reps: '45s each side', order: 2, dayNumber: 3 },
      { exerciseName: 'Banded External Rotation', sets: 2, reps: '12 reps each side', order: 3, dayNumber: 3 },
      { exerciseName: 'Arm Circles', sets: 2, reps: '10 each direction', order: 4, dayNumber: 3 },
      // Day 4: Strength
      { exerciseName: 'Rows', sets: 3, reps: '10 reps', order: 1, dayNumber: 4 },
      { exerciseName: 'Pull Down', sets: 3, reps: '10 reps', order: 2, dayNumber: 4 },
      { exerciseName: 'Lateral Raise', sets: 2, reps: '12 reps', order: 3, dayNumber: 4 },
      { exerciseName: 'Cervical Flexion/Extension', sets: 2, reps: '10 reps each', order: 4, dayNumber: 4 },
      // Day 5: Recovery + Maintenance
      { exerciseName: 'SMR Levator Scapulae', sets: 1, reps: '45s each side', order: 1, dayNumber: 5 },
      { exerciseName: 'SMR Scalene', sets: 1, reps: '30s each side', order: 2, dayNumber: 5 },
      { exerciseName: 'Cervical Rotation', sets: 2, reps: '10 reps each side', order: 3, dayNumber: 5 },
      { exerciseName: 'Jesus Stretch (Chest Stretch)', sets: 1, reps: '90s', order: 4, dayNumber: 5 },
      { exerciseName: 'Dead Hangs', sets: 1, reps: '30s', order: 5, dayNumber: 5 },
    ],
  },

  // ─── Upper Back & Shoulder Protocol ────────────────────
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
    exercises: [
      // Day 1: Release + Open
      { exerciseName: 'SMR Rhomboid', sets: 1, reps: '60s each side', order: 1, dayNumber: 1 },
      { exerciseName: 'SMR Teres Major/Minor', sets: 1, reps: '45s each side', order: 2, dayNumber: 1 },
      { exerciseName: 'SMR Latissimus Dorsi', sets: 1, reps: '60s each side', order: 3, dayNumber: 1 },
      { exerciseName: 'Jesus Stretch (Chest Stretch)', sets: 1, reps: '90s', order: 4, dayNumber: 1 },
      { exerciseName: 'Overhead Raise (Band/PVC)', sets: 2, reps: '10 reps', order: 5, dayNumber: 1 },
      // Day 2: Pulling Strength
      { exerciseName: 'Rows', sets: 3, reps: '10-12 reps', order: 1, dayNumber: 2 },
      { exerciseName: 'Pull Down', sets: 3, reps: '10-12 reps', order: 2, dayNumber: 2 },
      { exerciseName: 'Single Arm Row', sets: 2, reps: '10 reps each side', order: 3, dayNumber: 2 },
      { exerciseName: 'Reverse Fly', sets: 3, reps: '12 reps', order: 4, dayNumber: 2 },
      // Day 3: Pressing + Stability
      { exerciseName: 'Push-ups', sets: 3, reps: '8-12 reps', order: 1, dayNumber: 3 },
      { exerciseName: 'Chest Press', sets: 3, reps: '8-10 reps', order: 2, dayNumber: 3 },
      { exerciseName: 'Overhead Press', sets: 3, reps: '8-10 reps', order: 3, dayNumber: 3 },
      { exerciseName: 'Banded External Rotation', sets: 2, reps: '12 reps each side', order: 4, dayNumber: 3 },
      // Day 4: Rotator Cuff + Mobility
      { exerciseName: 'SMR Infraspinatus', sets: 1, reps: '45s each side', order: 1, dayNumber: 4 },
      { exerciseName: 'SMR Serratus Anterior', sets: 1, reps: '45s each side', order: 2, dayNumber: 4 },
      { exerciseName: 'Arm Circles', sets: 2, reps: '10 each direction', order: 3, dayNumber: 4 },
      { exerciseName: 'Dead Hangs', sets: 2, reps: '30s', order: 4, dayNumber: 4 },
      { exerciseName: 'Underhand Dead Hang', sets: 2, reps: '20s', order: 5, dayNumber: 4 },
      // Day 5: Full Shoulder Day
      { exerciseName: 'SMR Teres Major/Minor', sets: 1, reps: '45s each side', order: 1, dayNumber: 5 },
      { exerciseName: 'SMR Latissimus Dorsi', sets: 1, reps: '60s each side', order: 2, dayNumber: 5 },
      { exerciseName: 'Lateral Raise', sets: 3, reps: '12 reps', order: 3, dayNumber: 5 },
      { exerciseName: 'Single Arm Row', sets: 2, reps: '10 reps each side', order: 4, dayNumber: 5 },
      { exerciseName: 'Chest Press', sets: 2, reps: '10 reps', order: 5, dayNumber: 5 },
    ],
  },

  // ─── Knee Pain Protocol ────────────────────────────────
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
    exercises: [
      // Day 1: Release + Ankle
      { exerciseName: 'SMR Vastus Medialis', sets: 1, reps: '45s each side', order: 1, dayNumber: 1 },
      { exerciseName: 'SMR Rectus Femoris', sets: 1, reps: '45s each side', order: 2, dayNumber: 1 },
      { exerciseName: 'Foam Roller Adductor Squeeze', sets: 2, reps: '10 reps', order: 3, dayNumber: 1 },
      { exerciseName: 'Calf & Hamstring Stretch on Heel Wedges', sets: 2, reps: '45s', order: 4, dayNumber: 1 },
      { exerciseName: 'Ankle Inversion', sets: 2, reps: '10 reps each side', order: 5, dayNumber: 1 },
      { exerciseName: 'Ankle Eversion', sets: 2, reps: '10 reps each side', order: 6, dayNumber: 1 },
      // Day 2: Strength
      { exerciseName: 'Squats', sets: 3, reps: '8-10 reps', order: 1, dayNumber: 2 },
      { exerciseName: 'Step Ups', sets: 2, reps: '8 reps each side', order: 2, dayNumber: 2 },
      { exerciseName: 'Step Downs', sets: 2, reps: '8 reps each side', order: 3, dayNumber: 2 },
      { exerciseName: 'Standing Hip Abduction', sets: 2, reps: '12 reps each side', order: 4, dayNumber: 2 },
      // Day 3: Mobility + Control
      { exerciseName: 'SMR Glute Med/Min on Foam Roller', sets: 1, reps: '60s each side', order: 1, dayNumber: 3 },
      { exerciseName: 'SMR TFL Release', sets: 1, reps: '45s each side', order: 2, dayNumber: 3 },
      { exerciseName: 'Lunges', sets: 2, reps: '8 reps each side', order: 3, dayNumber: 3 },
      { exerciseName: 'Calf Raises', sets: 2, reps: '12 reps', order: 4, dayNumber: 3 },
      { exerciseName: 'Toe Extension Plank', sets: 1, reps: '30s', order: 5, dayNumber: 3 },
      // Day 4: Posterior Chain
      { exerciseName: 'Hip Hinge', sets: 3, reps: '10 reps', order: 1, dayNumber: 4 },
      { exerciseName: 'Deadlift', sets: 3, reps: '8 reps', order: 2, dayNumber: 4 },
      { exerciseName: 'Nordic Hamstring Curl', sets: 2, reps: '4-6 reps', order: 3, dayNumber: 4 },
      { exerciseName: 'Single Leg Hamstring Stretch', sets: 1, reps: '45s each side', order: 4, dayNumber: 4 },
      // Day 5: Recovery
      { exerciseName: 'SMR Vastus Medialis', sets: 1, reps: '45s each side', order: 1, dayNumber: 5 },
      { exerciseName: 'Foam Roller Adductor Squeeze', sets: 2, reps: '12 reps', order: 2, dayNumber: 5 },
      { exerciseName: 'Calf & Hamstring Stretch on Heel Wedges', sets: 2, reps: '60s', order: 3, dayNumber: 5 },
      { exerciseName: 'Step Downs', sets: 2, reps: '8 reps each side', order: 4, dayNumber: 5 },
    ],
  },

  // ─── Foundation Reset ──────────────────────────────────
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
    exercises: [
      // Day 1: Lower Body Focus
      { exerciseName: 'Squats', sets: 3, reps: '10 reps', order: 1, dayNumber: 1 },
      { exerciseName: 'Hip Hinge', sets: 2, reps: '10 reps', order: 2, dayNumber: 1 },
      { exerciseName: 'Lunges', sets: 2, reps: '8 reps each side', order: 3, dayNumber: 1 },
      { exerciseName: 'Calf Raises', sets: 2, reps: '12 reps', order: 4, dayNumber: 1 },
      { exerciseName: 'Calf & Hamstring Stretch on Heel Wedges', sets: 1, reps: '45s', order: 5, dayNumber: 1 },
      // Day 2: Upper Body Focus
      { exerciseName: 'Push-ups', sets: 3, reps: '8-10 reps', order: 1, dayNumber: 2 },
      { exerciseName: 'Rows', sets: 3, reps: '10 reps', order: 2, dayNumber: 2 },
      { exerciseName: 'Overhead Press', sets: 2, reps: '8-10 reps', order: 3, dayNumber: 2 },
      { exerciseName: 'Reverse Fly', sets: 2, reps: '12 reps', order: 4, dayNumber: 2 },
      { exerciseName: 'Jesus Stretch (Chest Stretch)', sets: 1, reps: '60s', order: 5, dayNumber: 2 },
      // Day 3: Core + Mobility
      { exerciseName: 'Forearm Plank', sets: 3, reps: '30s', order: 1, dayNumber: 3 },
      { exerciseName: 'Side Plank', sets: 2, reps: '20s each side', order: 2, dayNumber: 3 },
      { exerciseName: 'Dead Hangs', sets: 1, reps: '20s', order: 3, dayNumber: 3 },
      { exerciseName: 'Cervical Flexion/Extension', sets: 2, reps: '8 reps each', order: 4, dayNumber: 3 },
      { exerciseName: 'Cervical Rotation', sets: 2, reps: '8 reps each side', order: 5, dayNumber: 3 },
      // Day 4: Full Body
      { exerciseName: 'Squats', sets: 3, reps: '10 reps', order: 1, dayNumber: 4 },
      { exerciseName: 'Push-ups', sets: 2, reps: '10 reps', order: 2, dayNumber: 4 },
      { exerciseName: 'Rows', sets: 2, reps: '10 reps', order: 3, dayNumber: 4 },
      { exerciseName: 'Forearm Plank', sets: 2, reps: '30s', order: 4, dayNumber: 4 },
      { exerciseName: 'Lunges', sets: 2, reps: '8 reps each side', order: 5, dayNumber: 4 },
      // Day 5: Recovery + Stretch
      { exerciseName: 'Calf & Hamstring Stretch on Heel Wedges', sets: 2, reps: '45s', order: 1, dayNumber: 5 },
      { exerciseName: 'Couch Stretch', sets: 1, reps: '60s each side', order: 2, dayNumber: 5 },
      { exerciseName: 'Jesus Stretch (Chest Stretch)', sets: 1, reps: '60s', order: 3, dayNumber: 5 },
      { exerciseName: 'Cervical Lateral Flexion', sets: 2, reps: '8 reps each side', order: 4, dayNumber: 5 },
      { exerciseName: 'Arm Circles', sets: 2, reps: '10 each direction', order: 5, dayNumber: 5 },
    ],
  },

  // ─── Daily Mobility Protocol ────────────────────────────
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
    exercises: [
      { exerciseName: 'Cervical Flexion/Extension', sets: 1, reps: '8 reps each', order: 1, dayNumber: 1 },
      { exerciseName: 'Cervical Rotation', sets: 1, reps: '8 reps each side', order: 2, dayNumber: 1 },
      { exerciseName: 'Arm Circles', sets: 1, reps: '10 each direction', order: 3, dayNumber: 1 },
      { exerciseName: 'Overhead Raise (Band/PVC)', sets: 1, reps: '10 reps', order: 4, dayNumber: 1 },
      { exerciseName: 'Hip Hinge', sets: 1, reps: '10 reps', order: 5, dayNumber: 1 },
      { exerciseName: 'Calf & Hamstring Stretch on Heel Wedges', sets: 1, reps: '45s', order: 6, dayNumber: 1 },
      { exerciseName: 'Jesus Stretch (Chest Stretch)', sets: 1, reps: '60s', order: 7, dayNumber: 1 },
    ],
  },
];