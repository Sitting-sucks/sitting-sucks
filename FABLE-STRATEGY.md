# Fable Strategy for Sitting Sucks

## Architecture

```
┌─────────────────────────────────────────────┐
│  FABLE (Claude Code)                        │
│  Builds the site, understands Ryan's        │
│  philosophy, writes the code                │
│  Cost: $0 (one-time code generation)        │
├─────────────────────────────────────────────┤
│  OBSIDIAN KNOWLEDGE VAULT                    │
│  Ryan's complete movement philosophy,       │
│  exercise knowledge, form cues,             │
│  compensation chains, coaching approach     │
│  FEEDS EVERYTHING BELOW                     │
├─────────────────────────────────────────────┤
│  CHEAP MODELS (GLM 5.2 / Kimi K2.6 /       │
│  DeepSeek V4)                               │
│  Run the app features:                      │
│  - Onboarding program generation            │
│  - Daily recommendations                    │
│  - Form feedback                            │
│  - Progress analysis                        │
│  Cost: pennies per user                     │
├─────────────────────────────────────────────┤
│  EXERCISE DATABASE (Supabase)                │
│  Exercises, body areas, equipment,          │
│  your video embeds                          │
└─────────────────────────────────────────────┘
```

## The Insight

**Fable is the architect and builder, not the runtime.** You use Fable once — to build the site and deeply understand your philosophy. Then cheap models carry that philosophy to users at a fraction of the cost.

Your knowledge is the moat. No AI can replicate 8 years of NASM corrective exercise experience. Once it's digitized in the vault, any model can reference it.

## Fable Prompts (For Claude Code with Fable)

### PROMPT 1: Build the Site (One-Time)

```
I'm building Sitting Sucks — a fitness app specifically for desk workers who sit all day.

My philosophy:
- Mobility FIRST before strength
- Train movement patterns, not isolated muscles
- Fix compensation chains (tight ankles → knee pain → hip tightness → T-spine issues → shoulder pain)
- The world is your gym — use chairs, walls, floors, bands
- Evidence-based, NASM corrective exercise methodology

Build the website at sittingsucks.com with:
- Landing page: "Your Body Wasn't Built to Sit All Day" — hero, problem stats, features, pricing ($10/mo, $249 coaching), testimonials, FAQ
- Auth flow: email + Google sign-in via Supabase
- Dashboard: streak tracking, weekly progress, today's recommended workout
- Exercise library: filterable by body area, equipment, difficulty, joint movement, pain point
- Onboarding: 5 questions → personalized starter program
- Video player: custom (not YouTube) for my recorded exercise videos
- Progress tracking: charts, achievements, gamification

Tech stack: Vite + React 18 + TypeScript + shadcn/ui + TailwindCSS + Supabase + Stripe + PWA

The app is already partially built at github.com/Sitting-sucks/sitting-sucks. Clone it and work from there.
```

### PROMPT 2: Build the Knowledge-Backed Recommendation Engine

```
Create a recommendation engine service at src/lib/recommendation-engine.ts

This engine reads from an Obsidian knowledge vault at /mnt/h/Knowledge Vault/Knowledge/Movement/

The vault contains Ryan's complete movement philosophy organized as markdown files covering:
- Compensation chains (tight X → problem Y → fix Z)
- Pain condition protocols (lower back, hips, shoulders, neck, knees, feet)
- Form cues for every exercise
- Exercise progressions and regressions
- Programming principles

The engine should:
1. Load relevant notes from the vault based on the user's profile (pain points, activity level, equipment)
2. Use a cheap model (GLM 5.2, Kimi K2.6, or DeepSeek) to generate personalized recommendations
3. Pass the vault content as context so the AI generates recommendations that match Ryan's actual methodology
4. Cache results to minimize API calls

The vault content IS the differentiator — it makes the AI sound like Ryan, not like a generic fitness app.
```

### PROMPT 3: Video Embed & Recording Pipeline

```
Build a complete video pipeline for Sitting Sucks:

1. ExerciseVideo component (already exists at src/components/ExerciseVideo.tsx) — verify it works
2. Supabase storage bucket 'exercise-videos' with folder structure per exercise ID
3. Admin panel to upload videos and set poster frames
4. Recording guide with DaVinci Resolve export settings

The exercise library should show video poster images on cards. Click opens the custom player.
Videos are MP4, self-hosted via Supabase storage, zero YouTube embeds.
Each exercise video shows: setup, demonstration, form cues, common mistakes, regression, progression.
```

### PROMPT 4: Cool UI Upgrade

```
Redesign the Sitting Sucks dashboard and exercise library to feel premium.

Requirements:
- Dark theme default (very dark background #0a0a0f)
- Glass-morphism cards with backdrop blur
- Animated stat counters
- Gradient hero sections
- Smooth transitions between views
- Horizontal scrollable exercise recommendations
- Prominent streak display with fire animation
- Mobile-responsive with bottom navigation

Color palette: deep purple/indigo primary, amber highlights for streaks/energy
The dashboard should make you feel something when you open it.
```

### PROMPT 5: Knowledge-Backed Onboarding Generator

```
Build the onboarding flow that generates personalized programs using Ryan's knowledge.

The onboarding asks 5 questions:
1. Main pain point (lower back, hips, shoulders, neck, knees, feet/ankles, multiple)
2. Activity level (sedentary, light, moderate, very active)  
3. Equipment owned (none, basic, some, full)
4. Primary goal (relieve pain, improve posture, build strength, increase mobility, all)
5. Time per day (5-10, 10-20, 20-30, 30+ min)

After answers are collected, call a cheap model (GLM 5.2 or DeepSeek) with:
- The user's answers
- Context from the Obsidian vault about the user's specific pain points
- Ryan's training philosophy

Generate a 7-day starter program with day-by-day exercise breakdowns.
Save to user_programs table. Show the program with tabs. "Start Day 1" navigates to dashboard.

Cost target: pennies per user, not dollars.
```

## Cost Comparison

| Feature | Fable-only approach | Vault + cheap model approach |
|---------|-------------------|-------------------------------|
| Onboarding program | ~$0.35/user | ~$0.01-0.03/user |
| Daily recommendation | ~$0.15/user/day | ~$0.002/user/day |
| Weekly check-in | ~$0.30/user | ~$0.01/user |
| 100 users/month | ~$500+/month | ~$10-30/month |
| 1000 users/month | ~$5000+/month | ~$100-300/month |

The vault makes cheap models effective because they're not guessing — they're referencing YOUR knowledge.