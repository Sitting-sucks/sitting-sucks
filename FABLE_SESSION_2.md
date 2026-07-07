# Sitting Sucks — Fable Session 2: Fixes, Funnel & Programs

**Author:** Hermes (AI teammate)
**Date:** July 7, 2026
**Purpose:** Post-overhaul fixes + freemium funnel + programs system + onboarding expansion + AI program generator

---

## Context from Session 1 (Completed)

Session 1 built:
- Anatomy-themed UI redesign (Landing, Dashboard, ExerciseLibrary)
- BodyMap component (MuscleMapJS wrapper) with muscle click → exercise filter
- MuscleInfoPanel component
- muscle-mapping.ts (36 muscles mapped to body areas, pain conditions, exercise keywords)
- Today page (prescribed exercises, program tracking)
- Trainer admin pages (MyClients, PrescribeExercises, SessionRecap)
- MuscleMapJS git submodule
- Dashboard with body heatmap, stats, achievements, streak system
- Supabase migration for prescribed_exercises + training_sessions

---

## Session 2 Scope — 4 Focus Areas

This session is broken into 4 focused tasks. Complete them in order.

---

### TASK 1: Fix Body Map → Exercise Filter (BUG)

**Problem:** Clicking a muscle on the body map does NOT filter exercises. The filter logic has a field mismatch.

**Root Cause:**
- Local exercise data (`src/data/exercises.ts`) uses fields: `bodyAreas`, `targetMuscles` — 25 exercises
- Supabase DB exercises use fields: `muscle_groups` (string[]), `joint_movements` (string[]) — NO `bodyAreas` or `targetMuscles` field
- `getExercisesForMuscle()` in `src/data/muscle-mapping.ts` filters using `bodyAreas` + `targetMuscles` (local fields)
- ExerciseLibrary.tsx then tries to match by exercise NAME between local results and Supabase results
- If DB exercise names don't match local data exactly, the filter returns nothing

**Fix Required:**

1. **Add a `bodyAreas` computed property to Supabase exercises** — derive it from `joint_movements` using the existing `jointMovementToBodyAreas` mapping in `src/data/exercises.ts`. Create a utility function:

```typescript
// src/lib/exercise-utils.ts
import { jointMovementToBodyAreas, BodyArea } from '@/data/exercises';

export function computeBodyAreas(jointMovements: string[]): BodyArea[] {
  const areas = new Set<BodyArea>();
  for (const jm of jointMovements) {
    // Try exact match first, then case-insensitive
    const mapped = jointMovementToBodyAreas[jm]
      || jointMovementToBodyAreas[jm.toLowerCase()];
    if (mapped) mapped.forEach(a => areas.add(a));
  }
  return Array.from(areas);
}
```

2. **Fix `getExercisesForMuscle()` to work with Supabase exercise shape** — the function should accept exercises with `muscle_groups` (string[]) and `joint_movements` (string[]) and derive body areas + keyword matches from those fields:

```typescript
export function getExercisesForMuscle(
  exercises: { id: string; muscle_groups?: string[]; joint_movements?: string[]; bodyAreas?: BodyArea[]; targetMuscles?: string[] }[],
  muscle: Muscle
): Exercise[] {
  const entry = MUSCLE_MAP_BY_SLUG[muscle];
  if (!entry) return [];

  const seen = new Set<string>();
  const lowerKeywords = entry.targetKeywords.map(k => k.toLowerCase());

  for (const ex of exercises) {
    // Method 1: Check bodyAreas (local data) or compute from joint_movements (Supabase)
    const bodyAreas = ex.bodyAreas || computeBodyAreas(ex.joint_movements || []);
    if (bodyAreas.includes(entry.bodyArea)) {
      seen.add(ex.id);
      continue;
    }

    // Method 2: Check muscle_groups (Supabase) or targetMuscles (local)
    const muscleGroups = ex.muscle_groups || ex.targetMuscles || [];
    if (muscleGroups.some(mg => lowerKeywords.some(kw => mg.toLowerCase().includes(kw)))) {
      seen.add(ex.id);
    }
  }

  return exercises.filter(ex => seen.has(ex.id));
}
```

3. **Fix `displayedExercises` in ExerciseLibrary.tsx** — stop going through local data as a middleman. Instead of matching by name, directly filter the Supabase exercises using `getExercisesForMuscle()` with the Supabase exercise shape:

```typescript
const displayedExercises = useMemo(() => {
  if (!activeMuscle) return areaFilteredExercises;
  // Pass Supabase exercises directly to the muscle filter
  const matchingIds = new Set(
    getExercisesForMuscle(
      areaFilteredExercises.map(ex => ({
        id: ex.id,
        muscle_groups: ex.muscle_groups,
        joint_movements: ex.joint_movements,
      })),
      activeMuscle.muscle
    ).map(e => e.id)
  );
  return areaFilteredExercises.filter(ex => matchingIds.has(ex.id));
}, [areaFilteredExercises, activeMuscle]);
```

4. **Also fix the Dashboard body map click** — `onMuscleClick` navigates to `/exercise-library?area=X` but the area label may not match. Use the raw `BodyArea` value (e.g. `"L Spine"`) not the display label (e.g. `"Lower Back"`):

```typescript
onMuscleClick={(info) =>
  navigate(`/exercise-library?area=${encodeURIComponent(info.bodyArea)}`)
}
```

Wait — `info.bodyArea` is already set to `bodyAreaLabels[entry.bodyArea]` in BodyMap.tsx (line 203). That's the display label. The ExerciseLibrary reads `?area=` and tries to match against both raw values and display labels (lines 38-44). This should work, but verify the label mapping is correct for all 9 body areas.

**Files to modify:**
- `src/lib/exercise-utils.ts` (NEW)
- `src/data/muscle-mapping.ts` (fix `getExercisesForMuscle`)
- `src/pages/ExerciseLibrary.tsx` (fix `displayedExercises` useMemo)
- `src/components/BodyMap.tsx` (verify `bodyArea` in MuscleClickInfo uses raw value, not label)

**Verification:**
- Click "Calves" on body map → exercises for Foot/Ankle should appear
- Click "Glutes" → hip exercises should appear
- Click "Lower Back" → L Spine exercises should appear
- Clear muscle filter → all exercises return

---

### TASK 2: Freemium Workout Funnel (Paywall Fix)

**Problem:** "Start Today's Workout" button works the same for free and paid users. Free users hit a paywall with no preview of what they're missing.

**Required Flow:**

1. **Dashboard** — Both free and paid users see "Start Today's Workout" button. No change here.

2. **Today page** (`src/pages/Today.tsx`) — Restructure for freemium:
   - If user IS subscribed: show full workout list, mark done buttons, program details (current behavior)
   - If user is NOT subscribed: show a **preview** of today's recommended workout:
     - Display first 2-3 exercises (name, sets/reps, video link if available)
     - Remaining exercises are shown as **blurred/locked cards** with exercise name only (no details)
     - Below the preview, show a prominent CTA: "Unlock Your Full Workout" with "Start 14-Day Free Trial" button → links to `/pricing`
     - Show a "What you'll get" section: full exercise details, guided sets/reps tracking, progress logging, AI-adjusted recommendations

3. **Add `useSubscription` to Today page:**

```typescript
import { useSubscription } from '@/hooks/useSubscription';

const Today = () => {
  const { subscribed } = useSubscription();
  // ... existing code
```

4. **Preview card for locked exercises:**

```tsx
{/* Locked exercise preview */}
{!subscribed && index >= 2 && (
  <Card className="relative overflow-hidden">
    <CardContent className="pt-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Lock className="h-6 w-6 text-muted-foreground" />
        <div>
          <div className="font-medium blur-sm">{item.exercises?.name || "Exercise"}</div>
          <div className="text-sm text-muted-foreground">Premium content</div>
        </div>
      </div>
    </CardContent>
    <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-background/20 flex items-center justify-center">
      <Button onClick={() => navigate('/pricing')}>Unlock</Button>
    </div>
  </Card>
)}
```

5. **CTA section at bottom of Today page for non-subscribers:**

```tsx
{!subscribed && (
  <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
    <CardContent className="py-8 text-center">
      <Crown className="h-10 w-10 mx-auto mb-3 text-primary" />
      <h3 className="text-xl font-bold mb-2">Unlock Your Full Workout</h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        Get complete exercise details, guided set tracking, AI-adjusted recommendations, and personalized programs.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" onClick={() => navigate('/pricing')}>
          Start 14-Day Free Trial
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/exercise-library">Browse Free Exercises</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

**Files to modify:**
- `src/pages/Today.tsx` (add subscription check, preview/locked state, CTA)

**Verification:**
- Free user sees first 2-3 exercises, rest locked, CTA at bottom
- Paid user sees full workout
- "Start 14-Day Free Trial" links to `/pricing`
- Quick Log still works for free users (mark any exercise done manually)

---

### TASK 3: Expand Onboarding

**Current:** 8 steps (Welcome, Sitting Hours, Pain Areas, Fitness Level, Activity Level, Goals, Equipment, Program Recommendation)

**Required:** Add these steps BEFORE the Program Recommendation step:

**New Step: Pain Severity** (after Pain Areas)
- Only shown if user selected at least one pain area (not "none")
- "On a scale of 1-10, how much does this pain affect your daily life?"
- Radio options: 1-3 (Mild), 4-6 (Moderate), 7-8 (Significant), 9-10 (Severe)

**New Step: Pain Duration** (after Pain Severity)
- Only shown if user selected at least one pain area
- "How long have you been dealing with this?"
- Radio options: Less than 1 month, 1-3 months, 3-6 months, 6-12 months, Over 1 year, Over 5 years

**New Step: Movement History** (after Activity Level)
- "What's your experience with these movement practices?"
- Checkbox options (select all that apply):
  - Weight training
  - Yoga / Pilates
  - Sports (any kind)
  - Dance / Martial arts
  - Physical therapy
  - No prior movement experience

**New Step: Posture Awareness** (after Movement History)
- "Do you notice any of these postural patterns?"
- Checkbox options:
  - Forward head posture (head juts forward)
  - Rounded shoulders
  - Anterior pelvic tilt (butt sticks out, lower back arches)
  - Posterior pelvic tilt (tucked pelvis, flat lower back)
  - Uneven hips (one side higher)
  - Flat feet / fallen arches
  - Knock knees / bow legs
  - Not sure / haven't noticed

**New Step: Time Commitment** (after Goals, before Equipment)
- "How much time can you dedicate daily?"
- Radio options:
  - 5-10 minutes (just the essentials)
  - 15-20 minutes (quick routine)
  - 30-45 minutes (full session)
  - 60+ minutes (comprehensive)

**New Step: Work Setup** (after Time Commitment, before Equipment)
- "What's your work setup like?"
- Radio options:
  - Desk job, laptop only
  - Desk job with external monitor(s)
  - Standing desk (partial sitting)
  - Standing desk (mostly standing)
  - On my feet most of the day
  - Mixed / varies

**Updated Interface:**

```typescript
interface OnboardingData {
  sittingHours: string;
  painAreas: string[];
  painSeverity: string;      // NEW
  painDuration: string;      // NEW
  fitnessLevel: string;
  activityLevel: string;
  movementHistory: string[]; // NEW
  posturePatterns: string[]; // NEW
  goal: string;
  timeCommitment: string;    // NEW
  workSetup: string;         // NEW
  equipment: string[];
}
```

**Updated STEPS array:**
```typescript
const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'sitting', title: 'Your Habits' },
  { id: 'pain', title: 'Pain Points' },
  { id: 'painSeverity', title: 'Pain Severity' },      // NEW (conditional)
  { id: 'painDuration', title: 'Pain Duration' },      // NEW (conditional)
  { id: 'fitness', title: 'Fitness Level' },
  { id: 'activity', title: 'Activity Level' },
  { id: 'movementHistory', title: 'Movement History' }, // NEW
  { id: 'posture', title: 'Posture Check' },            // NEW
  { id: 'goals', title: 'Your Goals' },
  { id: 'time', title: 'Time Commitment' },             // NEW
  { id: 'workSetup', title: 'Work Setup' },             // NEW
  { id: 'equipment', title: 'Equipment' },
  { id: 'program', title: 'Your Program' },
];
```

**Conditional steps:** If user selects "No pain currently", skip Pain Severity and Pain Duration steps. Use step index math that accounts for skipped steps (don't just use array index — track which steps are visible).

**Updated program recommendation logic:**
```typescript
function getRecommendedProgram(data: OnboardingData): { name: string; description: string } {
  // Severe pain → pain relief protocol targeting their specific areas
  if (data.painSeverity === '9-10' || data.painSeverity === '7-8') {
    return {
      name: 'Targeted Pain Relief Protocol',
      description: `Focused protocol targeting your ${data.painAreas.join(', ').toLowerCase()} pain. Starts with gentle mobility and progressively builds strength in the affected areas.`,
    };
  }
  // Long-term chronic pain → slower progression
  if (data.painDuration === 'Over 1 year' || data.painDuration === 'Over 5 years') {
    return {
      name: 'Chronic Pain Reset',
      description: 'A gradual, progressive protocol designed for long-standing pain. Emphasizes gentle mobility, neural mobilization, and careful strengthening over 8 weeks.',
    };
  }
  // Beginner + heavy sitter → foundation
  if (data.fitnessLevel === 'beginner' || data.sittingHours === '8+') {
    return {
      name: 'Foundation Reset',
      description: 'A 4-week program designed to undo the damage from prolonged sitting. Focuses on mobility, posture correction, and building a movement habit.',
    };
  }
  // Strength goal + intermediate/advanced
  if (data.goal === 'strength' || data.fitnessLevel === 'advanced') {
    return {
      name: 'Strength & Posture',
      description: 'Build functional strength while correcting postural imbalances. Combines resistance training with mobility work for desk workers who want to get strong.',
    };
  }
  // Default
  return {
    name: 'Daily Movement Protocol',
    description: 'A balanced daily routine combining mobility, strength, and recovery exercises. Perfect for maintaining an active lifestyle while working a desk job.',
  };
}
```

**Files to modify:**
- `src/pages/Onboarding.tsx` (add new steps, conditional logic, updated interface)

**Verification:**
- "No pain currently" → skips Pain Severity and Pain Duration
- Select pain → severity + duration steps appear
- All new steps have proper icons, radio/checkbox UI matching existing style
- Program recommendation considers pain severity + duration
- Progress bar shows correct step count (adjust for skipped steps)

---

### TASK 4: Program Templates + AI Program Generator

**Problem:** Programs only exist if a trainer manually creates them. Users who complete onboarding get a program "recommendation" but nothing is actually created or assigned.

**Architecture:**

#### 4A: Program Template System

Create a data file with pre-built program templates. Each template targets specific pain conditions or goals. Ryan will provide the exact exercise-to-condition mapping, but here's the structure:

```typescript
// src/data/program-templates.ts

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  category: 'pain_relief' | 'mobility' | 'strength' | 'daily' | 'posture';
  targetConditions: string[];   // ['lower_back', 'hips', 'neck']
  targetBodyAreas: BodyArea[];   // ['L Spine', 'Hip']
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  daysPerWeek: number;
  exercises: ProgramTemplateExercise[];
}

export interface ProgramTemplateExercise {
  exerciseName: string;    // Matches exercise name in DB
  sets: number;
  reps: string;
  order: number;
  dayNumber: number;       // Which day of the week
  notes?: string;
}

export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  // ─── Lower Back Pain Protocol ──────────────────────────
  {
    id: 'tpl-lower-back',
    name: 'Lower Back Pain Protocol',
    description: 'Targets the root causes of lower back pain: tight hip flexors, weak glutes, and poor core stability. Progresses from gentle mobility to functional strength.',
    category: 'pain_relief',
    targetConditions: ['lower_back'],
    targetBodyAreas: ['L Spine', 'Hip', 'Foot/Ankle'],
    difficulty: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 5,
    exercises: [
      // Ryan will fill these in — placeholder structure:
      // { exerciseName: "Cat-Cow", sets: 2, reps: "10 reps", order: 1, dayNumber: 1 }
      // { exerciseName: "Glute Bridge", sets: 3, reps: "12-15 reps", order: 2, dayNumber: 1 }
      // { exerciseName: "Dead Bug", sets: 3, reps: "8 reps each side", order: 3, dayNumber: 1 }
      // ...
    ],
  },

  // ─── Hip Pain Protocol ─────────────────────────────────
  {
    id: 'tpl-hip-pain',
    name: 'Hip Pain Protocol',
    description: 'Opens tight hip flexors, strengthens weak glutes, and improves hip joint mobility. Addresses both the hip and the ankle/knee that feed into it.',
    category: 'pain_relief',
    targetConditions: ['hips'],
    targetBodyAreas: ['Hip', 'Foot/Ankle', 'Knee'],
    difficulty: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 5,
    exercises: [
      // { exerciseName: "90/90 Hip Stretch", sets: 2, reps: "30s each side", order: 1, dayNumber: 1 }
      // { exerciseName: "Glute Bridge", sets: 3, reps: "12-15 reps", order: 2, dayNumber: 1 }
      // ...
    ],
  },

  // ─── Neck Pain Protocol ────────────────────────────────
  {
    id: 'tpl-neck-pain',
    name: 'Neck Pain Protocol',
    description: 'Releases tight upper traps and suboccipitals, strengthens deep neck flexors, and restores thoracic mobility. Addresses forward head posture.',
    category: 'pain_relief',
    targetConditions: ['neck'],
    targetBodyAreas: ['C Spine', 'T Spine', 'Shoulder'],
    difficulty: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 5,
    exercises: [
      // { exerciseName: "Chin Tucks", sets: 2, reps: "10 reps", order: 1, dayNumber: 1 }
      // { exerciseName: "Thoracic Rotation", sets: 2, reps: "8 reps each side", order: 2, dayNumber: 1 }
      // ...
    ],
  },

  // ─── Upper Back / Shoulder Protocol ────────────────────
  {
    id: 'tpl-upper-back',
    name: 'Upper Back & Shoulder Protocol',
    description: 'Opens tight chests, strengthens weak rhomboids and lower traps, and restores shoulder mobility. Combats rounded shoulders from desk work.',
    category: 'pain_relief',
    targetConditions: ['upper_back'],
    targetBodyAreas: ['T Spine', 'Shoulder'],
    difficulty: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 5,
    exercises: [
      // ...
    ],
  },

  // ─── Knee Pain Protocol ────────────────────────────────
  {
    id: 'tpl-knee-pain',
    name: 'Knee Pain Protocol',
    description: 'Knee pain is rarely a knee problem. This protocol addresses the ankle mobility and hip strength that feed into knee dysfunction.',
    category: 'pain_relief',
    targetConditions: ['knees'],
    targetBodyAreas: ['Knee', 'Foot/Ankle', 'Hip'],
    difficulty: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 5,
    exercises: [
      // ...
    ],
  },

  // ─── Foundation Reset ──────────────────────────────────
  {
    id: 'tpl-foundation',
    name: 'Foundation Reset',
    description: 'A 4-week program for heavy sitters. Full body mobility, core stability, and foundational strength. The starting point for most users.',
    category: 'daily',
    targetConditions: [],
    targetBodyAreas: ['Foot/Ankle', 'Knee', 'Hip', 'L Spine', 'T Spine', 'C Spine', 'Shoulder'],
    difficulty: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 5,
    exercises: [
      // ...
    ],
  },

  // ─── Daily Mobility ────────────────────────────────────
  {
    id: 'tpl-daily-mobility',
    name: 'Daily Mobility Protocol',
    description: 'A quick daily routine (10-15 min) covering all major joints. Perfect for maintenance and prevention.',
    category: 'mobility',
    targetConditions: [],
    targetBodyAreas: ['Foot/Ankle', 'Knee', 'Hip', 'L Spine', 'T Spine', 'C Spine', 'Shoulder'],
    difficulty: 'beginner',
    durationWeeks: 0, // Ongoing
    daysPerWeek: 7,
    exercises: [
      // ...
    ],
  },
];
```

**IMPORTANT:** The exercise arrays are currently EMPTY. Ryan will provide the actual exercise-to-condition mappings. The code should work with empty arrays (show "Coming Soon" or "Exercises being added") and gracefully handle when exercises are added later.

#### 4B: AI Program Generator

Create a function that takes onboarding data and generates a personalized program:

```typescript
// src/lib/program-generator.ts

import { PROGRAM_TEMPLATES, ProgramTemplate } from '@/data/program-templates';
import { BodyArea } from '@/data/exercises';

interface OnboardingData {
  sittingHours: string;
  painAreas: string[];      // ['lower_back', 'neck', ...]
  painSeverity: string;
  painDuration: string;
  fitnessLevel: string;
  activityLevel: string;
  movementHistory: string[];
  posturePatterns: string[];
  goal: string;
  timeCommitment: string;
  workSetup: string;
  equipment: string[];
}

export function generateProgram(data: OnboardingData): {
  template: ProgramTemplate;
  personalizationNotes: string;
  modifications: string[];
} {
  // 1. Start with pain-based matching
  let bestTemplate: ProgramTemplate | null = null;
  let personalizationNotes: string[] = [];
  let modifications: string[] = [];

  // If user has pain, find the best matching pain protocol
  if (data.painAreas.length > 0 && !data.painAreas.includes('none')) {
    // Map onboarding pain values to template targetConditions
    const painMap: Record<string, string> = {
      'lower_back': 'lower_back',
      'upper_back': 'upper_back',
      'neck': 'neck',
      'hips': 'hips',
      'knees': 'knees',
      'wrists': 'wrists',
    };

    // Find template that matches the most pain areas
    const matchedTemplates = PROGRAM_TEMPLATES
      .filter(t => t.category === 'pain_relief')
      .map(t => ({
        template: t,
        matchCount: data.painAreas.filter(pa => t.targetConditions.includes(painMap[pa] || pa)).length,
      }))
      .filter(m => m.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    if (matchedTemplates.length > 0) {
      bestTemplate = matchedTemplates[0].template;
      personalizationNotes.push(
        `Selected ${bestTemplate.name} based on your reported pain areas: ${data.painAreas.join(', ')}`
      );
    }
  }

  // 2. If no pain match, use goal-based matching
  if (!bestTemplate) {
    if (data.goal === 'pain' || data.sittingHours === '8+') {
      bestTemplate = PROGRAM_TEMPLATES.find(t => t.id === 'tpl-foundation') || null;
      personalizationNotes.push('Starting with Foundation Reset due to high sitting hours or pain-focused goal');
    } else if (data.goal === 'mobility') {
      bestTemplate = PROGRAM_TEMPLATES.find(t => t.id === 'tpl-daily-mobility') || null;
      personalizationNotes.push('Daily Mobility Protocol selected based on your mobility goal');
    } else if (data.goal === 'strength') {
      bestTemplate = PROGRAM_TEMPLATES.find(t => t.id === 'tpl-foundation') || null;
      personalizationNotes.push('Foundation Reset with strength progression — build base first');
    } else {
      bestTemplate = PROGRAM_TEMPLATES.find(t => t.id === 'tpl-foundation') || PROGRAM_TEMPLATES[0];
      personalizationNotes.push('Foundation Reset as default starting point');
    }
  }

  // 3. Apply modifications based on onboarding data
  if (data.painSeverity === '9-10' || data.painSeverity === '7-8') {
    modifications.push('Reduce all sets by 1. Start with mobility-only for first week.');
  }
  if (data.painDuration === 'Over 5 years' || data.painDuration === 'Over 1 year') {
    modifications.push('Chronic pain detected — progress slowly. Add 1 extra rest day per week.');
  }
  if (data.fitnessLevel === 'beginner') {
    modifications.push('Use regression variations for all exercises. Reduce reps by 30%.');
  }
  if (data.timeCommitment === '5-10 minutes (just the essentials)') {
    modifications.push('Time-limited: do only the first 3 exercises each day. Rotate through all exercises over 3 days.');
  }
  if (data.equipment.includes('none') || data.equipment.length === 0) {
    modifications.push('No equipment available — use bodyweight regressions for all exercises.');
  }
  if (data.posturePatterns.includes('forward_head') || data.posturePatterns.includes('rounded_shoulders')) {
    modifications.push('Posture issues detected — add chin tucks and wall slides as warm-up before each session.');
  }
  if (data.posturePatterns.includes('anterior_tilt')) {
    modifications.push('Anterior pelvic tilt — emphasize glute bridges and hip flexor stretches. Reduce spinal extension work.');
  }

  return {
    template: bestTemplate,
    personalizationNotes: personalizationNotes.join('. '),
    modifications,
  };
}
```

#### 4C: Wire Into Onboarding Completion

When user completes onboarding, actually CREATE a program for them:

```typescript
// In Onboarding.tsx, update completeOnboarding():
const completeOnboarding = async () => {
  // 1. Generate program recommendation
  const { template, personalizationNotes, modifications } = generateProgram(data);

  // 2. Save onboarding data to user profile
  localStorage.setItem('onboarding_complete', 'true');
  localStorage.setItem('user_preferences', JSON.stringify(data));

  // 3. Save to Supabase (if user is logged in)
  if (user) {
    try {
      // Save onboarding answers to profiles table
      await supabase
        .from('profiles')
        .update({
          onboarding_data: data,
          onboarding_complete: true,
        })
        .eq('id', user.id);

      // Find the program in DB by name (pre-seeded) or create it
      const { data: existingProgram } = await supabase
        .from('programs')
        .select('id')
        .eq('name', template.name)
        .eq('is_premade', true)
        .single();

      if (existingProgram) {
        // Assign program to user
        await supabase
          .from('client_programs')
          .insert({
            client_id: user.id,
            program_id: existingProgram.id,
            status: 'active',
          });
      }

      // Save personalization notes + modifications
      await supabase
        .from('profiles')
        .update({
          program_personalization: {
            templateId: template.id,
            notes: personalizationNotes,
            modifications,
          },
        })
        .eq('id', user.id);
    } catch (err) {
      console.error('Error saving program:', err);
    }
  }

  navigate('/');
};
```

#### 4D: Show Personalized Program on Dashboard

Add a "Your Program" section to the Dashboard that shows:
- Program name + description
- Personalization notes (why this program was selected)
- Modifications (what to adjust)
- "Start Today's Workout" button
- "View Full Program" link to `/my-programs`

**Files to create/modify:**
- `src/data/program-templates.ts` (NEW)
- `src/lib/program-generator.ts` (NEW)
- `src/pages/Onboarding.tsx` (wire in program generation on completion)
- `src/pages/Dashboard.tsx` (add program section)
- `src/pages/MyPrograms.tsx` (show personalized program details + modifications)

**Verification:**
- Complete onboarding with lower back pain → Lower Back Pain Protocol assigned
- Complete onboarding with no pain + strength goal → Foundation Reset assigned
- Dashboard shows personalized program with notes + modifications
- Modifications reflect onboarding answers (beginner → reduced reps, no equipment → bodyweight, etc.)
- Program templates with empty exercise arrays show "Exercises being added" gracefully

---

## Constraints

- Do NOT touch: `src/contexts/`, `src/hooks/` (existing hooks work fine)
- Do NOT change route paths in `src/App.tsx`
- Keep shadcn/ui components and Tailwind classes consistent with existing design
- Dark mode must still work (class-based via next-themes)
- Mobile responsive (shadcn/ui breakpoints)
- Don't break the existing Dashboard stats/achievements/streak system
- Keep the anatomy-themed design from Session 1
- Files under 500 lines — split if they grow

---

## Fable Prompt Guidelines

- Defensive framing for all fitness content
- No "show your reasoning" or "walk me through your thinking"
- No medical claims ("cures", "treats", "diagnoses") — use "may help", "targets", "supports"
- Focus on code generation, not explanation

---

## Session Order

Complete tasks in this order:
1. **Task 1** (body map fix) — highest priority, users can't use the core feature
2. **Task 2** (freemium funnel) — blocks conversion
3. **Task 3** (onboarding expansion) — needed for AI program generation
4. **Task 4** (program templates + AI generator) — depends on Task 3's onboarding data
