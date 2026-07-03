# Fable Prompts for Sitting Sucks

Use these with Claude Code running `claude-fable-5` model. These are meant to be copy-pasted into Claude Code / Fable.

---

## PROMPT 1: Exercise Video Embed System

> **Use when:** You're ready to set up the video system for your own recorded exercise videos.
> **Fable cost:** $0 (single-shot code generation)

```
Build a custom video embed component for my Sitting Sucks React/TypeScript app called ExerciseVideo.

Requirements:
- Self-hosted video player (NOT YouTube embeds — no iframes, no YouTube)
- Supports MP4/WebM uploads stored in Supabase storage bucket called 'exercise-videos'
- Fallback poster image when no video is available
- Play/pause, progress bar, fullscreen toggle
- Dark theme matching shadcn/ui dark mode
- Mobile responsive (portrait + landscape)
- Accessible (keyboard controls, aria labels)
- Component props: { exerciseId, videoUrl, posterUrl, title }

Also create a Supabase Edge Function `generate-video-thumbnail` that extracts a frame from uploaded MP4 and saves it as a poster image.

The file should live at src/components/ExerciseVideo.tsx
```

---

## PROMPT 2: Onboarding Generator (Fable-Powered)

> **Use when:** You're ready to build the personalized onboarding flow.
> **Fable cost:** Fable generates the code once ($0). Fable runs per-user at signup (~$0.35/user).

```
Create an onboarding flow for my Sitting Sucks fitness app that asks users 5 questions and uses the new user's answers to generate a personalized starter workout program.

LOCATION: src/pages/Onboarding.tsx (already exists, rewrite it)

QUESTIONS:
1. "What's your main pain point?" — Lower back, Hips, Shoulders, Neck, Knees, Feet/Ankles, Multiple areas
2. "How active are you right now?" — Sedentary (no exercise), Light (1-2x/week), Moderate (3-4x/week), Very active (5+)
3. "Do you have any equipment?" — None (bodyweight only), Basic (chair, wall), Some (bands, foam roller), Full (bands, weights, roller)
4. "What's your primary goal?" — Relieve pain, Improve posture, Build strength, Increase mobility, All of the above
5. "How much time per day?" — 5-10 min, 10-20 min, 20-30 min, 30+ min

After they answer, call a Supabase Edge Function (`generate-workout-program`) that:
1. Takes the user's answers as input
2. Returns a structured 7-day program (array of objects: { day: number, focus: string, exercises: [{ name, sets, reps, notes }] })
3. Saves the program to a user_programs table

For now, the edge function returns a rule-based program (not AI). The AI layer comes in the next prompt.

The UI should:
- One question at a time with smooth transitions (swipe/fade)
- Progress indicator showing 1/5, 2/5 etc.
- Shadcn/ui radio group / button select answers
- After last question, show loading state "Building your program..." with animation
- Then show the generated program with day-by-day tabs
- "Start Day 1" button → navigates to /dashboard

Keep the existing completed-program logic that redirects to /dashboard on finish.
```

---

## PROMPT 3: Fable AI Engine for Personalized Programs

> **Use when:** The onboarding flow works and you want Fable to generate REAL personalized programs instead of rule-based.
> **Fable cost:** ~$0.35 per generated program.

```
Create a Supabase Edge Function at supabase/functions/generate-workout-program/index.ts

This function receives a user's onboarding answers and returns a personalized 7-day program.

Use the Fable 5 API (claude-fable-5) via OpenRouter or Anthropic API to generate the program.

SYSTEM PROMPT FOR FABLE:

You are Ryan Venezia, an NASM-certified personal trainer with 8 years of experience in corrective exercise, mobility, and anti-sitting fitness. You run Sitting Sucks.

Generate a 7-day workout program for a user with these answers:
- Pain point: {painPoint}
- Activity level: {activityLevel}
- Equipment: {equipment}
- Goal: {goal}
- Time per day: {timePerDay}

YOUR TRAINING PHILOSOPHY (must follow):
1. Mobility FIRST — every session starts with joint prep before strength
2. No muscle isolation — train movement patterns, not body parts
3. Know compensation chains: tight hips → tight T-spine → shoulder issues. Tight ankles → knee Valgus → hip pain. Always fix the root.
4. Progressions and regressions for every exercise
5. The world is your gym — use chairs, walls, floors, bands. No fancy equipment needed.
6. Anti-sitting focus: open up the front line (hips, chest, shoulders), strengthen the posterior chain (glutes, upper back, deep neck flexors)

Return JSON:
{
  "focus": "string describing the week's theme based on their needs",
  "dailyTip": "one actionable tip for this week",
  "days": [
    {
      "day": 1,
      "focus": "e.g. Hip Mobility & Core Stability",
      "exercises": [
        {
          "name": "exercise name",
          "description": "1 sentence what this does",
          "sets": "e.g. 3",
          "reps": "e.g. 8-12 each side",
          "regression": "easier version if needed",
          "progression": "harder version when ready",
          "formCues": ["key 1", "key 2", "key 3"]
        }
      ],
      "estimatedMinutes": 15
    }
  ]
}

Make every exercise achievable with their listed equipment. If equipment=None, use only bodyweight, chairs, and walls.
```

---

## PROMPT 4: Fucking Cool Dashboard Redesign

> **Use when:** The onboarding works and you want the UI to feel premium.
> **Fable cost:** $0 (code generation, no ongoing cost)

```
Redesign my Sitting Sucks Dashboard (src/pages/Dashboard.tsx) to feel premium and modern.

CURRENT:
- Basic shadcn/ui cards with purple primary color
- Standard grid layout
- Default typography

REQUIRED:
- Dark theme as DEFAULT (remove light mode toggle or keep optional)
- Deep gradient hero section (purple/indigo → dark)
- Glass-morphism cards with backdrop blur where appropriate
- Animated stat counters (number rolls up on load)
- Exercise recommendations shown as horizontal scrollable cards with video thumbnails
- Streak fire animation (already exists, make it more prominent)
- "Today's Focus" card showing the day's recommended muscle groups / movement pattern
- Quick-start floating action button for logging a workout
- Mobile: bottom nav instead of sidebar

COLOR PALETTE:
- Background: #0a0a0f (very dark)
- Cards: #1a1a2e with subtle border
- Primary gradient: #7c3aed → #a855f7
- Accent: #f59e0b (amber for streaks/energy)
- Success: #22c55e

ANIMATIONS:
- Framer Motion or CSS transitions on card entrance
- Streak fire pulsing
- Counter roll-up

The dashboard should make you FEEL something when you open it.
```

---

## PROMPT 5: Weekly Check-in (Retention Engine)

> **Use when:** Users exist and you want Fable to improve retention.
> **Fable cost:** ~$0.30 per check-in.

```
Create a weekly check-in system for Sitting Sucks.

COMPONENT: src/components/WeeklyCheckin.tsx
EDGE FUNCTION: supabase/functions/weekly-checkin/index.ts

The check-in asks 3 questions:
1. "How's your [main pain point] this week?" (1-5 scale)
2. "Did you complete all your workouts?" (Yes/Mostly/Some/None)
3. "Anything feel better or worse?"

On submit, the edge function calls Fable (claude-fable-5) with their history + odpovědi and returns:
- Adjustments to their current program
- A new focus for next week
- An encouraging message

The component shows as a modal once per week after their last scheduled workout.
```

---

## PROMPT 6: Exercise Library Video Upgrades

> **Use when:** Your exercise videos are recorded and uploaded.
> **Fable cost:** $0

```
Upgrade the ExerciseLibrary page (src/pages/ExerciseLibrary.tsx):

1. Each exercise card shows a video thumbnail poster image
2. Clicking opens a modal with the custom ExerciseVideo component
3. Modal also shows: description, instructions, equipment needed, target muscles, joint movements, difficulty, regressions, progressions
4. "Add to Today's Workout" button on each exercise
5. Filter by pain point (new filter: "Helps with: Lower Back, Hips, Shoulders, etc.")
6. Each exercise has tags for: "Mobility", "Strength", "No Equipment", "Chair Only", "Beginner Friendly"
7. Mobile: swipeable exercise cards
```

