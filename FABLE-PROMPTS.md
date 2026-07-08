# Fable Prompts — Sitting Sucks v2 (Knowledge-Baked)

Use with Claude Code running `claude-fable-5`. These encode Ryan Venezia's complete movement philosophy — the vault at `/mnt/h/Knowledge Vault/Knowledge/Movement/` has the raw notes if Fable needs deeper context.

---

## PROMPT A: Extended Onboarding Consultation

> **Use when:** Ready to build the health intake flow.
> **Fable cost:** $0 one-time code gen.

```
Build an extended onboarding flow for Sitting Sucks at src/pages/Onboarding.tsx.

This onboarding is a HEALTH CONSULTATION, not just a signup form. It asks more questions than a typical fitness app because Ryan's approach treats every person differently. The answers determine the user's personalized "top 5" exercises, their compensation chain focus, and the right starting approach.

QUESTIONS (one at a time, smooth transitions, progress indicator):

1. PAIN/CONCERN:
   "What's your main area of concern?"
   Options: Lower back, Hips, Shoulders, Neck, Knees, Feet/Ankles, Wrist/Elbow, Multiple areas, No pain (preventative)
   If "Multiple areas" → show multi-select of all options
   Design: Large buttons with body-part icons, not dropdowns

2. PAIN QUALITY:
   "What does it feel like?"
   Options: Sharp/stabbing, Dull/ache, Burning, Stiff/tight, Numbness/tingling, Just discomfort
   "Not sure? That's okay. Just pick what comes closest."
   Design: Emoji + text buttons

3. WHEN IT HAPPENS:
   "When does it bother you most?"
   Options: After sitting, After exercise, First thing in morning, At night, All the time, During specific movements

4. SITTING HABITS:
   "How many hours a day do you sit?"
   Options: Less than 4, 4-8, 8-10, 10+
   Sub-text: "Includes desk work, commuting, meals, couch time"

5. ACTIVITY LEVEL:
   "How active are you right now?"
   Options:
   - Sedentary (desk job, no exercise)
   - Light (desk job, walk sometimes)
   - Moderate (move throughout day + exercise 1-2x/week)
   - Active (move well + exercise 3-4x/week)
   - Very active (exercise 5+ times/week)

6. EQUIPMENT:
   "What equipment do you have?"
   Options (multi-select):
   - None (just my body)
   - Chair / Wall / Floor
   - Resistance bands
   - Foam roller or lacrosse ball
   - Weights or dumbbells
   - Full gym access

7. GOAL:
   "What's your primary goal?"
   Options: Relieve pain, Improve posture, Build strength, Increase mobility, All of the above — I want everything
   Design: Make "All of the above" feel like the exciting option

8. TIME:
   "How much time can you commit per day?"
   Options: 5-10 minutes, 10-20 minutes, 20-30 minutes, 30+ minutes
   Sub-text: "Consistency beats intensity. Pick what you can actually do."

9. INJURY HISTORY:
   "Any past injuries, surgeries, or chronic conditions we should know about?"
   Design: Text area, optional
   Sub-text: "This helps us make sure every exercise is safe for you."

10. BODY STATE RIGHT NOW:
    "What does your body feel like RIGHT NOW, in this moment?"
    Options: Stiff, Tight, Weak, Sore, Energized, Achy, Normal
    Sub-text: "There's no wrong answer. This helps us meet you where you are."

11. BODY CONNECTION:
    "How connected do you feel to your body today?"
    Scale: 1 (totally disconnected) to 5 (fully aware)
    Sub-text: "This changes day to day. Being honest helps us help you."
    Design: 5 buttons with labels

After all questions answered → call a Supabase Edge Function (generate-workout-program) that:
1. Takes all answers as input
2. Returns a personalized 7-day starter program with:
   - day-by-day breakdown
   - exercises selected based on their pain points, equipment, and body state
   - Each exercise includes: name, description, sets/reps/duration, form cues (from Ryan's actual cues), regression option, progression option
3. Save to user_programs table
4. Show the program with tabbed days
5. "Start Day 1" button → navigate to /dashboard

The tone throughout should feel like Ryan is talking to you — direct, human, no corporate fitness BS.
```

---

## PROMPT B: Build the Complete Sitting Sucks Site

> **Use when:** Ready to build the full site with philosophy baked in.
> **Fable cost:** $0 one-time code gen.

```
Build the complete Sitting Sucks fitness app from the existing codebase at github.com/Sitting-sucks/sitting-sucks.

RYAN'S PHILOSOPHY (this must be baked into EVERY feature):

1. Brain-Body Connection:
   - Exercise is a total human experience, not just mechanical movement
   - The body is always communicating — pain, stiffness, tightness are messages
   - "The brain adapts the body to what we do most. If you sit, your body will adapt you to becoming the world's best sitter."
   - SMR (foam rolling) before exercise wakes up the nerve before you can use the muscle
   - Different states (stiff, tight, weak, sore, energized, achy, normal) require different approaches

2. Compensation Chains (this is the core differentiator):
   - Pain is a full-body approach. The SYMPTOMATIC thing is NOT always the PROBLEMATIC thing.
   - Knee pain and low-back pain often come from the foot/ankle first → then hip → then core
   - Shoulder pain: check wrist, C-spine, T-spine, chest/ribs before the shoulder
   - THE CALF CRISIS: 9 muscles plantar flex. Nobody trains ankles. Tight calves → can't extend knee → low back over-extends to compensate
   - Universal truths: abdominal bracing helps everything. Hip strengthening (all 6 directions) helps every human

3. Variables Beyond Weight:
   - There are 14+ ways to make an exercise harder without adding load
   - Ryan's go-to: challenge position + deeper joint ranges + isometrics
   - Pay attention to EVERY part of your body during exercise. Is your stabilizing leg engaged?
   - The heel wedge example: touch toes with straight legs, add heel wedges, BOOM — full chain awakening

4. State-Based Training:
   - Stiff → deep, challenging ranges with isometrics (heel wedge, hinge stretch, chest stretch)
   - Weak → isometric holds, slow tempo, mind-muscle connection drills
   - Tight → SMR, stretching, end-range work
   - Achy → blood flow work, pain-free range only
   - The brain may reject certain exercises — if ROM decreases, try a different exercise for the same purpose

5. Onboarding is everything:
   - 11 questions covering pain, quality, timing, sitting habits, activity, equipment, goals, time, injury history, body state, body connection
   - Generate a personalized "top 5" program, not a generic one
   - The first workout program must feel like it was built for THEM

BUILD THESE PAGES/COMPONENTS:

A. LANDING PAGE (src/pages/Landing.tsx) — already exists, enhance it
   - Hero: "Your Body Wasn't Built to Sit All Day"
   - Problem stats: 8+ hrs sitting avg, 80% desk workers back pain, 40% increased disease risk
   - Features: Smart recommendations (AI with Ryan's logic), streak/gamification, progress analytics, targeted anti-sitting exercises, personalized programs, 1-on-1 coaching
   - How it works: 3 steps
   - Pricing: $10/mo or $60/yr, $249/mo coaching
   - Video section: embedded exercise demos (your videos, not YouTube)
   - Testimonials
   - FAQ

B. ONBOARDING (src/pages/Onboarding.tsx) — 11 questions, one at a time, generates personalized program
   - Smooth transitions, progress indicator
   - After answers → generate program via edge function
   - Show program with day tabs

C. DASHBOARD (src/pages/Dashboard.tsx) — premium redesign
   - Dark theme default (#0a0a0f background)
   - Glass-morphism cards
   - Animated stat counters (streak, weekly progress, total workouts, achievements)
   - "Today's Focus" card showing personalized recommendation based on user's CURRENT STATE
   - Horizontal scrollable exercise cards with video poster images
   - "How are you feeling today?" quick-check button → adjusts recommendations
   - Streak fire animation
   - Quick-log FAB for workouts

D. EXERCISE LIBRARY (src/pages/ExerciseLibrary.tsx) — upgrade
   - Filter by: body area, equipment, difficulty, joint movement, PAIN POINT (new filter!)
   - Exercise cards show video poster, difficulty/intensity stars
   - Click opens ExerciseVideo component (custom player, not YouTube)
   - Each exercise shows: description, instructions, equipment, target muscles, joint movements, regression, progression, form cues
   - "Add to Today" button
   - Tags: mobility, strength, no equipment, chair only, beginner friendly

E. VIDEO PLAYER (src/components/ExerciseVideo.tsx) — already exists, verify
   - MP4/WebM from Supabase storage
   - Play/pause, seek, fullscreen, mute
   - Poster image fallback
   - Dark theme

F. AI CHECK-IN (src/components/WeeklyCheckin.tsx) — weekly retention
   - "How's your [pain point] this week?" (1-5)
   - "Did you complete your workouts?"
   - "Anything feel better or worse?" (text)
   - Calls cheap model (GLM 5.2 / DeepSeek) with vault context → adjusts program

G. PROGRESS (src/pages/ProgressHistory.tsx) — upgrade
   - Progress narrative (not just charts — actual words describing their improvement)
   - "Your squat depth has improved 30% since using heel wedges"
   - Muscle group balance visualization
   - Streak history calendar

COLOR PALETTE:
- Background: #0a0a0f
- Cards: #1a1a2e with subtle border
- Primary gradient: #7c3aed → #a855f7
- Accent: #f59e0b (amber)
- Success: #22c55e
- Text: white/off-white

TOOLS/MODELS:
- The AI recommendation engine uses GLM 5.2 or DeepSeek, not Fable (cost optimization)
- Fable is the builder, not the runtime
- Context for the cheap model comes from the Obsidian vault at /mnt/h/Knowledge Vault/Knowledge/Movement/
```

---

## PROMPT C: The Recommendation Engine

> **Use when:** Ready to build the AI that generates personalized programs.
> **Fable cost:** $0 one-time code gen. The runtime uses cheap models.

```
Build a recommendation engine service at src/lib/recommendation-engine.ts that generates personalized workout programs using Ryan's movement philosophy.

ARCHITECTURE:
- This is called AFTER onboarding (when user's answers are saved)
- Called again on weekly check-in (when user reports how they feel)
- Uses a cheap model (GLM 5.2, Kimi K2.6, or DeepSeek via OpenRouter API)
- Passes vault context as the system prompt so the AI generates Ryan-quality programs

SYSTEM PROMPT (passed to the cheap model):

You are Ryan Venezia, an NASM-certified personal trainer with 8 years of experience. You run Sitting Sucks — a fitness company specifically for people who sit all day.

YOUR PHILOSOPHY:
1. Exercise is a total human experience, not just mechanical movement. The body communicates constantly — listen to it.
2. Pain is a full-body approach. The symptomatic thing is NOT the problematic thing. Check everything together AND individually.
3. The calf crisis: 9 plantar flexors, nobody trains ankles. Tight calves → can't extend knee → low back compensates.
4. Knee and low-back pain usually start at the foot/ankle → hip → core before reaching the knee or back.
5. Shoulder pain usually starts at wrist, C-spine, T-spine, or chest/ribs — not the shoulder itself.
6. There are 14+ ways to make an exercise harder without adding weight. Your go-to: deeper position + isometrics + full-body awareness.
7. Different states require different approaches:
   - Stiff → deep ranges with isometrics
   - Weak → isometric holds, slow tempo, connection drills
   - Tight → SMR release, stretching, end-range
   - Achy → pain-free ROM, blood flow work
8. The brain may reject an exercise. If ROM decreases, try a different exercise for the same purpose.
9. Abdominal bracing helps everything. Hip training (all 6 directions) helps every human being.
10. Quality over quantity. One perfect rep teaches more than ten sloppy ones.

Generate a personalized workout program based on the user's profile below.

User profile (from onboarding):
- Pain area: {pain_area}
- Pain quality: {pain_quality}
- Sitting hours: {sitting_hours}
- Activity level: {activity_level}
- Equipment: {equipment_list}
- Goal: {goal}
- Time per day: {time_per_day}
- Injury history: {injury_history}
- Body state: {body_state}
- Body connection score: {body_connection}/5

Return JSON:
{
  "focus": "1-2 sentence theme for the week based on their needs",
  "dailyTip": "one actionable mindset or body-awareness tip",
  "compensationChainNote": "what's likely happening in their body based on their answers",
  "days": [
    {
      "day": 1,
      "focus": "e.g. Reconnecting with Your Feet",
      "exercises": [
        {
          "name": "exercise name",
          "description": "1 sentence why this exercise for THIS person",
          "sets": "e.g. 2-3",
          "reps": "e.g. 30 seconds or 8-12",
          "formCues": ["key cue 1", "key cue 2", "key cue 3"],
          "regression": "easier version",
          "progression": "harder version when ready"
        }
      ],
      "estimatedMinutes": 10
    }
  ],
  "weeklyCheckInQuestion": "a question to ask them at the end of the week specific to their program"
}
```

---

## Quick Reference: How Fable Sits in the Stack

| What | Model | When | Cost |
|------|-------|------|------|
| Build the site | Fable (claude-fable-5) | One-time | $0 (code gen) |
| Onboarding program | GLM 5.2 / DeepSeek | Per signup | ~$0.01-0.03 |
| Daily recommendations | GLM 5.2 / DeepSeek | Per request | ~$0.002 |
| Weekly check-in | GLM 5.2 / DeepSeek | Weekly per user | ~$0.01 |
| Video storage | Supabase | Per upload | Storage costs |

Fable writes the code. Your vault + cheap models run the features. Your knowledge is the moat.