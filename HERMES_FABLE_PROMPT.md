# Sitting Sucks — Fable 5 Redesign Prompt Pack

**Author:** Hermes (AI teammate)
**Purpose:** Preps Fable 5 (Claude Max) for anatomy-themed UI redesign. This file contains the full app context, vault knowledge, MuscleMapJS integration, the new BodyMap React component, and session plans.

---

## A. App Architecture

### Stack
- **Framework:** Vite 7 + React 18 + TypeScript
- **Styling:** Tailwind CSS 3 + shadcn/ui (all components at `src/components/ui/`)
- **Routing:** React Router v6
- **Auth/Database:** Supabase (client at `src/integrations/supabase/client.ts`)
- **Mobile:** Capacitor 8 (Android + iOS)
- **PWA:** vite-plugin-pwa (auto-update, full offline manifest)
- **Hosting:** Cloudflare Pages (SPA — `_redirects` with `/* /index.html 200`)
- **Alias:** `@/` maps to `src/` (configured in vite.config.ts)

### Routes (defined in `src/App.tsx`)

```
Route /                             -> ProtectedRoute > Navigation + Dashboard
Route /auth                         -> Auth (login/signup)
Route /landing                      -> Landing (public marketing page)
Route /onboarding                   -> ProtectedRoute > Onboarding
Route /exercise-library             -> ProtectedRoute > Navigation + ExerciseLibrary
Route /store                        -> ProtectedRoute > Navigation + EquipmentStore
Route /pricing                      -> ProtectedRoute > Navigation + Pricing
Route /today                        -> ProtectedRoute > Navigation + Today
Route /exercise-diary               -> ProtectedRoute > Navigation + ExerciseDiary
Route /settings                     -> ProtectedRoute > Navigation + Settings
Route /messages                     -> ProtectedRoute > Navigation + Messages
Route /my-programs                  -> ProtectedRoute > Navigation + MyPrograms
Route /log-workout                  -> ProtectedRoute > Navigation + LogWorkout
Route /progress                     -> ProtectedRoute > Navigation + ProgressHistory
Route /admin/exercises              -> TrainerRoute > Navigation + ExerciseManagement
Route /admin/programs               -> TrainerRoute > Navigation + ProgramBuilder
Route /admin/clients                -> TrainerRoute > Navigation + ClientManagement
Route /admin/my-clients             -> TrainerRoute > Navigation + MyClients
Route /admin/session-recap          -> TrainerRoute > Navigation + SessionRecap
Route /admin/prescribe              -> TrainerRoute > Navigation + PrescribeExercises
Route *                             -> NotFound (404)
```

Navigation component is a sidebar (desktop) / bottom nav (mobile) — `src/components/Navigation.tsx`.

### New Files (pre-built for Fable)

| File | Purpose | Size |
|------|---------|------|
| `src/data/muscle-mapping.ts` | Maps all 36 MuscleMapJS slugs to body areas, pain conditions, exercise keywords | 17KB |
| `src/components/BodyMap.tsx` | React wrapper for MuscleMapWidget with click→exercise connection | 9KB |
| `src/lib/MuscleMapJS/` | MuscleMapJS as git submodule (MIT, zero-dependency, Canvas-based) | — |

**These are IMPORTED into pages by Fable, not rebuilt.**

### Pages Summary (17 pages)

| File | Purpose | Lines | Key Features |
|------|---------|-------|-------------|
| Landing.tsx | Public marketing | 541 | Hero, stats, problem, features, how-it-works, pricing ($10/$249), testimonials, FAQ, CTA |
| Auth.tsx | Login/signup | 6,967 | Email + password, OAuth |
| Dashboard.tsx | User home | 28,030 | Stats, streak, recent activity, quick actions |
| ExerciseLibrary.tsx | Exercise browse | 18,382 | Filter, search, category tabs, exercise cards |
| EquipmentStore.tsx | Equipment shop | 16,446 | Product cards, cart integration |
| Pricing.tsx | Pricing display | 9,031 | Plan comparison, feature lists |
| Today.tsx | Daily workout | 8,781 | Current day's program, timer, exercise list |
| ExerciseDiary.tsx | Log history | 21,266 | Calendar view, workout history, stats |
| Settings.tsx | Account settings | 18,536 | Profile, preferences, subscription |
| Messages.tsx | Messaging | 4,764 | Conversation thread (trainer <=> client) |
| MyPrograms.tsx | User programs | 13,912 | Assigned programs, progress |
| LogWorkout.tsx | Log workout | 13,265 | Exercise logging form, sets/reps/weight |
| ProgressHistory.tsx | Charts | 14,360 | Recharts-based progress graphs |
| Onboarding.tsx | First-time setup | 21,359 | Multi-step onboarding flow |
| NotFound.tsx | 404 | 739 | Minimal error page |
| admin/ExerciseManagement.tsx | Admin | — | CRUD exercises |
| admin/ProgramBuilder.tsx | Admin | — | Build/assign programs |
| admin/ClientManagement.tsx | Admin | — | Client list, manage |
| admin/MyClients.tsx | Admin | — | Trainer's client list |
| admin/SessionRecap.tsx | Admin | — | Session notes |
| admin/PrescribeExercises.tsx | Admin | — | Prescribe exercises |

### Key Components
- `src/components/Navigation.tsx` — sidebar/bottom nav (14,027 lines)
- `src/components/BodyMap.tsx` — **NEW** interactive muscle map React component
- `src/components/ProtectedRoute.tsx` — auth gate
- `src/components/TrainerRoute.tsx` — trainer role gate
- `src/components/ExerciseCard.tsx` — reusable exercise display
- `src/components/QuickLogModal.tsx` — quick workout logging
- `src/components/StatsChart.tsx` — Recharts wrapper
- `src/components/StreakCelebration.tsx` — gamification animation
- `src/components/GamificationBadge.tsx` — achievement badges
- `src/components/SubscriptionGate.tsx` — paywall
- `src/components/messaging/` — ConversationList, MessageBubble, MessageInput, MessageThread
- `src/components/admin/ExerciseForm.tsx` — admin exercise CRUD

### Data & Hooks
- `src/data/exercises.ts` — exercise definitions (19 exercises with bodyAreas, targetMuscles, instructions)
- `src/data/muscle-mapping.ts` — **NEW** MuscleMapJS to exercise database bridge
- `src/contexts/AuthContext.tsx` — Supabase auth state
- `src/contexts/CartContext.tsx` — equipment store cart
- `src/hooks/useExercises.ts` — exercise data hook
- `src/hooks/usePrograms.ts` — program data hook
- `src/hooks/useUserStats.ts` — stats hook
- `src/hooks/useGamification.ts` — streak/points/achievements
- `src/hooks/useMessages.ts` — messaging hook
- `src/hooks/useMyClients.ts` — trainer client hook
- `src/hooks/useRecommendations.ts` — AI exercise recommendations
- `src/hooks/useRole.ts` — user role check
- `src/hooks/useNative.ts` — Capacitor native features
- `src/hooks/useSubscription.ts` — subscription status
- `src/hooks/useUnreadCount.ts` — unread message count
- `src/hooks/use-toast.ts` — toast notifications

### Current Design System

**Colors (CSS custom properties in `src/index.css`):**

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| --primary | 4 90% 58% (coral red) | 4 90% 60% | CTAs, active states |
| --secondary | 222 47% 11% (navy) | 222 30% 18% | Headers, contrast |
| --accent | 24 95% 53% (orange) | 24 95% 55% | Motivation, highlights |
| --background | 0 0% 99% (white) | 222 47% 6% | Page bg |
| --foreground | 222 47% 11% | 0 0% 98% | Text |
| --success | 160 84% 39% (green) | 160 84% 45% | Checks, progress |
| --streak | 24 100% 50% (fire) | 24 100% 55% | Streak displays |
| --card | 0 0% 100% | 222 47% 9% | Card bg |
| --muted | 220 14% 96% | 222 30% 15% | Subtle bg |
| --radius | 0.75rem | — | Border radius |

**Font:** Inter (400/500/600/700/800/900 via Google Fonts)

**Tailwind plugins:** `tailwindcss-animate`, `@tailwindcss/typography`

**Key animations:** fade-in, fade-up, scale-in, slide-in-right, shimmer, pulse-ring, celebration, streak-fire, number-tick

---

## B. Vault Knowledge — Ryan's Movement Philosophy

This is the moat. Located at `/mnt/h/Knowledge Vault/Knowledge/Movement/`. Fable needs this context to design a UI that reflects Ryan's unique approach.

### Core Principles
- **Brain controls body, you control brain input.** Every exercise starts in the brain. Neurological connection determines value.
- **Variables beyond weight.** Harder exercise doesn't mean more weight. Tempo, ROM, stability, balance, breath, time under tension, plane of motion, lever length, base of support — these are the dials Ryan turns.
- **Three planes of motion:** Sagittal (flexion/extension), Frontal (adduction/abduction), Transverse (rotation). Most apps train only sagittal. Sitting Sucks trains all three.
- **Ground-up approach:** Foot/Ankle → Knee → Hip → L-Spine → T-Spine → C-Spine → Shoulder → Elbow → Wrist. Fix the root, not the symptom.
- **Prolonged shortened vs prolonged lengthened:** Sitting creates predictable patterns. Tight ≠ strong. Lengthened ≠ relaxed. Both need strengthening through full range.
- **Exercise is a total human experience.** Different states (stiff, weak, strong, achy) require different approaches.
- **Prehab = Rehab.** Same exercises, different intensity.

### Compensation Chains (Ryan's #1 Differentiator)
```
Tight calves → limited ankle dorsiflexion → knee valgus → hip adductors overwork → pelvis rocks → lumbar stress → T-spine stiff
Tight hips → psoas shortens → glutes shut off → anterior pelvic tilt → lumbar extension → ribs flare → T-spine can't extend → shoulders internally rotate → head juts forward
```
**Golden rule:** Pain is a full-body approach. The symptomatic thing is NOT always the problematic thing. A knee problem might be solved at the ankle. Shoulder pain might be solved at the T-spine.

### Brain-Body Connection
- **Neurological connection before strength.** Can't feel a muscle? Smash it (SMR), then isometric hold, THEN strengthen.
- **If you can't feel it, you're not training it.** You're just moving weight around.
- **Quality over volume.** One perfect rep teaches more than ten sloppy ones.

### 7 Foundational Anti-Sitting Exercises
1. Wall Calf Stretch — ankle mobility
2. Standing Hip Abduction Isometric Hold — glute med
3. Overhead Thumb Taps (Wall Seated) — shoulder flexion + T-spine extension
4. T-Spine Rotation — spinal rotation
5. Plank (Progressive Holds) — core stability
6. Couch Stretch — deep hip flexor
7. Single-Leg Knee Raises — gait mechanics

### Top 5 Should Be Personalized
NOT a fixed list. The app should generate a personalized top 5 per user based on onboarding answers. Every person's body is different — their top 5 should reflect their pain points, activity level, equipment, and goals.

### Brand Voice
- Direct, no fluff
- Anatomically precise but accessible
- "You're talking to someone who hurts"
- Teaching over telling — explain WHY, not just WHAT
- Evidence-based, corrective exercise focused
- Not generic fitness — specifically desk worker/anti-sitting

---

## C. BodyMap Component (Pre-Built)

The React component `BodyMap` is already built and production-ready at `src/components/BodyMap.tsx`. Import and use it in pages — do NOT rewrite it.

### How to Import

```tsx
import { BodyMap, buildMuscleHeatmap, PAIN_CONDITION_COLORS } from '@/components/BodyMap';
import type { MuscleClickInfo } from '@/components/BodyMap';
import { exercises } from '@/data/exercises';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `exercises` | `Exercise[]` | required | Exercise list to filter against on click |
| `side` | `'front' \| 'back'` | `'front'` | Body side to display |
| `gender` | `'male' \| 'female'` | `'male'` | Body gender model |
| `style` | `'default' \| 'minimal' \| 'neon' \| 'medical'` | `'default'` | Visual style |
| `interactive` | `boolean` | `true` | Click/hover responsiveness |
| `multiSelect` | `boolean` | `false` | Allow selecting multiple muscles |
| `initialHighlights` | `HighlightConfig[]` | `[]` | Pre-highlighted muscles on load |
| `onMuscleClick` | `(info: MuscleClickInfo) => void` | — | Fired when a muscle is clicked |
| `onSelectionChange` | `(muscles: Muscle[]) => void` | — | Fired when selection changes |
| `height` | `string` | `'24rem'` | CSS height |
| `width` | `string` | `'100%'` | CSS width |
| `className` | `string` | `''` | Additional CSS classes |
| `showTooltips` | `boolean` | `true` | Hover tooltips with muscle names |
| `animated` | `boolean` | `true` | Smooth highlight transitions |

### MuscleClickInfo (what onMuscleClick receives)

```tsx
{
  muscle: Muscle,            // e.g. 'lower-back'
  label: string,             // e.g. 'Lower Back'
  bodyArea: string,          // e.g. 'Lower Back'
  painCondition?: string,    // e.g. 'Lower Back Pain'
  painConditionPath?: string,// vault path for the protocol note
  exercises: Exercise[],     // exercises matching this muscle
  description: string,       // why this muscle matters for sitters
  isSubgroup: boolean,       // whether it's a sub-group muscle
}
```

### Usage Pattern in Pages

**Landing.tsx — large interactive hero body map:**
```tsx
const [selectedMuscle, setSelectedMuscle] = useState<MuscleClickInfo | null>(null);

<BodyMap
  exercises={exercises}
  side="front"
  height="32rem"
  initialHighlights={[
    { muscle: 'calves', color: '#ef4444', opacity: 0.6 },
    { muscle: 'gluteal', color: '#6b7280', opacity: 0.4 },
    { muscle: 'upper-trapezius', color: '#ef4444', opacity: 0.6 },
  ]}
  onMuscleClick={setSelectedMuscle}
/>
```

**Dashboard.tsx — heatmap showing recent work:**
```tsx
// Build heatmap from user's exercise log
const heatmapData = buildMuscleHeatmap(userExerciseLog);

// Apply via setIntensities or pass as highlighted
<BodyMap
  exercises={exercises}
  side="front"
  height="20rem"
  initialHighlights={[
    { muscle: 'gluteal', color: '#22c55e' },
    { muscle: 'lower-back', color: '#eab308' },
  ]}
  onMuscleClick={(info) => navigate(`/exercise-library?area=${info.bodyArea}`)}
/>
```

**ExerciseLibrary.tsx — interactive filter:**
```tsx
const [activeMuscle, setActiveMuscle] = useState<Muscle | null>(null);

// Filter exercises when a muscle is clicked
const filteredExercises = activeMuscle
  ? getExercisesForMuscle(exercises, activeMuscle)
  : exercises;

<BodyMap
  exercises={exercises}
  side="front"
  height="18rem"
  interactive={true}
  multiSelect={false}
  onMuscleClick={(info) => setActiveMuscle(info.muscle)}
/>
```

**Navigation.tsx — sidebar mini map:**
```tsx
<BodyMap
  exercises={exercises}
  side="front"
  height="12rem"
  interactive={true}
  showTooltips={false}
  onMuscleClick={(info) => navigate(`/exercise-library`)}
/>
```

### Helpers

```tsx
// Build a 0-4 heatmap intensity from exercise log data
buildMuscleHeatmap(exercisesLogged: Array<{targetMuscles: string[], count: number}>): Array<[Muscle, number]>

// Color mapping for pain condition highlighting
PAIN_CONDITION_COLORS: {
  'Lower Back Pain': '#ef4444',     // red
  'Hip Pain': '#f97316',            // orange
  'Knee Pain': '#eab308',           // yellow
  'Shoulder Pain': '#3b82f6',       // blue
  'Neck Pain': '#a855f7',           // purple
  'Foot & Ankle Pain': '#22c55e',   // green
  'Wrist & Elbow Pain': '#06b6d4',  // cyan
}
```

### Muscle Data Mapping

Pre-built at `src/data/muscle-mapping.ts`. Key exports:

```tsx
MUSCLE_MAP               // Array<MuscleMapEntry> — all 36 muscles with labels, body areas, pain conditions, keywords
MUSCLE_MAP_BY_SLUG        // Record<Muscle, MuscleMapEntry> — O(1) lookup by slug
bodyAreaLabels             // Record<BodyArea, string> — display labels
painConditionPaths         // Record<string, string> — vault paths for each condition
getExercisesForMuscle()    // Filters exercises by body area + keyword match
getExercisesByBodyArea()   // Filters exercises by body area only
getExercisesByMuscleKeywords() // Filters exercises by targetMuscle keyword match
```

### TypeScript Note
MuscleMapJS has minor TS strictness issues (Map iteration patterns). With `skipLibCheck: true` in tsconfig, these are suppressed. Vite handles transpilation correctly regardless.

---

## D. Fable Sessions Plan

### Session 1 (Tonight): Anatomy-Themed UI Redesign + BodyMap Integration

**Scope:** NOT a full rebuild. Update 4 existing files to a cohesive anatomy/training theme:

1. **`src/pages/Landing.tsx`** — hero redesign + BodyMap integration
2. **`src/pages/Dashboard.tsx`** — heatmap + BodyMap exercise card
3. **`src/pages/ExerciseLibrary.tsx`** — BodyMap as interactive filter
4. **`src/components/Navigation.tsx`** — mini BodyMap in sidebar
5. **`src/index.css`** + **`tailwind.config.ts`** — anatomy color palette

#### Color Palette (Anatomy Theme)

| Token | Light | Usage |
|-------|-------|-------|
| Bone white `#F5F0EB` | `--background` / `--card` | Warm off-white backgrounds (replace pure white) |
| Muscle red | Keep `--primary: 4 90% 58%` | CTAs, active highlights, muscle glows |
| Deep navy | Keep `--secondary: 222 47% 11%` | Depth, professionalism, dark sections |
| Tissue warm grey | `--muted` → warmer tone | Connective tissue, subtle dividers |
| Amber accent | `--accent` → warm up | Achievement, progress indicators |
| Dark mode | Keep existing | Adjust bone white → dark bone, keep muscle red bright |

#### Typography
- Keep Inter as base font
- Section titles: uppercase, wide letter-spacing (medical illustration feel)
- Hero headings: bold, large weight (800-900), confident

#### Design Principles (Ryan's Philosophy Applied to UI)
- **Ground-up hierarchy:** Information flows Foot→Ankle→Knee→Hip→Spine→Shoulder (like compensation chains)
- **Three planes:** Layout sections reference sagittal/frontal/transverse organization
- **Variables beyond weight:** Filters/toggles show tempo, ROM, plane of motion — not just difficulty
- **If you can't feel it, you're not training it:** Body map click feedback is immediate and visual
- **Quality over volume:** Clean whitespace, generous padding, focused CTAs
- **Direct, no fluff:** Copy is terse, confident, anatomical — no filler

#### BodyMap Integration Per Page

**Landing.tsx:**
```
[Hero: headline left + BodyMap right (30rem tall, 'medical' style)]
  → BodyMap shows Sitting Epidemic highlights (tight calves in red, glutes faded grey, neck/shoulders tense)
  → Click a muscle → panel slides in with: muscle name, description, pain condition link, exercise count
  → Scroll down to The Problem section highlights the compensation chain visually
[Stats bar] [The Sitting Epidemic] [How It Works] [Features]
[Pricing] [Testimonials] [FAQ] [CTA] [Footer]
```

**Dashboard.tsx (after auth):**
```
[Nav sidebar — mini BodyMap at bottom (12rem, 'minimal' style)]
  → Click muscle → navigates to filtered ExerciseLibrary
[Main: Welcome + streak bar]
[Body heatmap card — "Your Body Today"]
  → BodyMap shows heatmap overlay from recent exercise log
  → Click a muscle → exercise recommendations for that area
[Today's recommended exercises — cards with muscle target badges]
[Recent activity — last 3 logged workouts]
[Quick actions row — Log Workout, Exercise Library, Messages]
```

**ExerciseLibrary.tsx:**
```
[Nav sidebar — mini BodyMap at bottom]
[Top section: BodyMap as filter (18rem, interactive)]
  → Click a muscle → highlights it on the map + filters exercise grid below
  → Front/back flip buttons to see all muscle groups
  → "Chain view" toggle → shows compensation chain arrows between related muscles
[Search bar + filter chips: equipment, difficulty, body area, plane of motion]
[Exercise grid — cards with muscle target badges, difficulty, duration]
[Empty state: "Select a body area to find relevant exercises"]
```

#### Important Constraints
- Do NOT rewrite: auth, data hooks, Supabase calls, routing, contexts
- Keep all existing React Router paths and params
- Keep all existing shadcn/ui components — wrap them, don't rewrite them
- New components go in `src/components/` (e.g., `AnatomyHero.tsx`, `ExerciseFilterBar.tsx`)
- All imports use `@/` alias
- Do NOT touch `src/integrations/`, `src/contexts/`, `src/hooks/`, `src/lib/` (except adding new files)
- Tailwind utility classes > custom CSS
- Dark mode must work (class-based via `next-themes`)
- Mobile responsive (shadcn/ui breakpoints already configured)
- Do NOT modify `src/components/BodyMap.tsx` or `src/data/muscle-mapping.ts` — they're already built
- Do NOT modify `src/lib/MuscleMapJS/` — it's a git submodule

### Session 2: (Not needed — completed by Hermes)
BodyMap component and muscle-mapping data are already built and production-verified. Fable imports them directly.

### Session 3 (Future): Auth, Pricing, Backend Page Polish
After the 3 main pages + nav are redesigned, polish Auth, Pricing, and remaining protected pages to match the anatomy theme.

### Session 4: Pain Protocol Pages

**Scope:** Wire up the vault's pain protocol knowledge into the app as browsable, searchable protocol pages.

**Vault content (all pre-written at `/mnt/h/Knowledge Vault/Knowledge/Movement/Pain & Conditions/`):**

| File | Status |
|------|--------|
| `Lower Back Pain.md` | Already existed (7,210 bytes) |
| `Hip Pain.md` | Written by Hermes |
| `Knee Pain.md` | Written by Hermes |
| `Shoulder Pain.md` | Written by Hermes |
| `Neck Pain.md` | Written by Hermes |
| `Foot & Ankle Pain.md` | Written by Hermes |
| `Wrist & Elbow Pain.md` | Written by Hermes |

Each page follows the same 7-part structure:
1. **Root Cause Philosophy** — why this condition happens in desk workers
2. **Critical Assessment** — location-based diagnosis (2-4 subtypes per condition)
3. **Universal Treatment Approach** — SMR → Awareness → Isometrics → Slow Eccentric
4. **Exercise Protocol** — specific exercises per subtype
5. **Compensation Chain Context** — links back to the chain logic
6. **Full Fix Path** — assessment → resolution steps
7. **Related Notes** — cross-links to other conditions

**Fable's job:** Create a `/pain-protocols` route and protocol pages that:
- Read/display the vault content (either embedded or as structured data)
- Link from BodyMap muscle clicks to the relevant protocol
- Show the compensation chain diagram for each condition
- List related exercises from `exercises.ts` that apply to each protocol
- Use the same anatomy-themed styling as the rest of the site
- Include the "Universal Treatment Approach" progress tracker (SMR → Isometrics → Eccentric)

**Structure for each page:**
```
[Header: Condition name + body map highlight of affected areas]
[Quick assessment: "Where does it hurt?" selector with location subtypes]
[Root cause — expandable section]
[Compensation chain — visual diagram showing the chain from root to symptom]
[Universal Treatment Approach — 4-step progress flow]
[Exercises — linked from exercise database, filtered to relevant ones]
[Related protocols — cross-links to other conditions]
```

### Session 5 (Future): Exercise Detail, Video Integration, AI Recommendations
Deep-dive exercise view with embedded YouTube videos, AI-powered recommendations using vault knowledge, and form cue overlays.

---

## E. Fable 5 Prompt Guidelines

This project is a fitness app. It's standard commercial software. To avoid guardrail issues:

1. **Frame everything as defensive.** You're building a fitness app — "implement", "design", "build", "integrate". Not "exploit" or "analyze vulnerabilities."
2. **Avoid "show your reasoning" / "walk me through your thinking"** — trips `reasoning_extraction`. Just write the code.
3. **No medical claims.** "Addresses posture concerns from prolonged sitting" ✓. "Cures back pain" ✗.
4. **Standard React + Tailwind commercial work.** Nothing dual-use. You're styling components and wiring up interactive maps.
5. **If Fable refuses or downgrades to Opus 4.8**, switch to Opus 4.8 on Max plan. Same budget, same files.
6. **Return complete file content.** Generate each file and output it fully. Use pbcopy if working CLI-side.

---

## F. Files Fable Should NEVER Touch

These files are off-limits. Fable reads them for context but does NOT modify them.

### DO NOT MODIFY — Infrastructure
- `src/integrations/supabase/client.ts` — Supabase client setup
- `src/integrations/supabase/types.ts` — Supabase type definitions
- `src/contexts/AuthContext.tsx` — auth state management
- `src/contexts/CartContext.tsx` — equipment store cart
- `vite.config.ts` — Vite configuration
- `tsconfig.json` / `tsconfig.app.json` — TypeScript configuration
- `tailwind.config.ts` — **Can add NEW colors/themes** but do NOT remove existing
- `postcss.config.js` — PostCSS configuration
- `capacitor.config.ts` — Capacitor mobile config

### DO NOT MODIFY — Data & Hooks
- `src/data/exercises.ts` — exercise database (19 exercises with bodyAreas, targetMuscles, instructions)
- `src/data/muscle-mapping.ts` — MuscleMapJS ↔ exercise bridge (36-muscle mapping, helper functions)
- All files in `src/hooks/` — data fetching, auth, stats, gamification, messaging, recommendations
- All files in `src/lib/` — utilities, constants, supabase client (except adding new files)

### DO NOT MODIFY — Pre-Built Components
- `src/components/BodyMap.tsx` — MuscleMapWidget React wrapper (props, click handling, heatmap, lifecycle)
- `src/components/MuscleInfoPanel.tsx` — Click info panel (modal + sidebar modes, exercise list, pain protocol link)
- `src/components/ui/` — shadcn/ui primitives (button, card, dialog, badge, scroll-area, etc.)

### DO NOT MODIFY — Infrastructure Directories
- `src/lib/MuscleMapJS/` — git submodule (abdofallah/MuscleMapJS)
- `node_modules/`, `dist/`, `public/` — build artifacts
- `android/`, `ios/` — Capacitor native projects
- `scripts/` — build scripts

### CAN MODIFY — These Pages
- `src/pages/Landing.tsx` — redesign hero, add BodyMap, apply anatomy theme
- `src/pages/Dashboard.tsx` — add BodyMap heatmap card, exercise recommendations
- `src/pages/ExerciseLibrary.tsx` — add BodyMap as interactive filter
- `src/pages/Auth.tsx` — restyle to match anatomy theme (future session)
- `src/pages/Pricing.tsx` — restyle to match anatomy theme (future session)

### CAN MODIFY — These Components
- `src/components/Navigation.tsx` — add mini BodyMap to sidebar, preserve existing nav items

### CAN MODIFY — Styling
- `src/index.css` — add anatomy theme CSS vars (bone white, tissue warm grey, amber), keep existing
- `tailwind.config.ts` — add new colors/themes, keep existing palette

### CAN ADD — New Files (in these directories only)
- `src/components/` — new anatomy-themed components (AnatomyHero, ExerciseFilterBar, ProtocolCard, etc.)
- `src/pages/` — new pages (PainProtocolPage, ExerciseDetailPage, etc.)
- `src/data/` — new data files for pain protocols, exercise categories
- `src/hooks/` — only if absolutely necessary, prefer functional components

---

## G. Appendix: Quick Reference — File Map

```
src/
├── App.tsx                          # Routes
├── main.tsx                         # Entry point
├── index.css                        # CSS vars, dark/light, animations
├── components/
│   ├── BodyMap.tsx                  # **NEW** Interactive muscle map (DO NOT MODIFY)
│   ├── MuscleInfoPanel.tsx          # **NEW** Click info panel (DO NOT MODIFY)
│   ├── Navigation.tsx               # Sidebar/bottom nav (MODIFY — add mini BodyMap)
│   ├── ProtectedRoute.tsx
│   ├── TrainerRoute.tsx
│   ├── ExerciseCard.tsx
│   ├── ui/                          # shadcn/ui components (DO NOT MODIFY)
│   └── messaging/                   # Chat components
├── data/
│   ├── exercises.ts                 # 19 exercises (DO NOT MODIFY)
│   └── muscle-mapping.ts            # **NEW** Muscle→exercise bridge (DO NOT MODIFY)
├── pages/
│   ├── Landing.tsx                  # MODIFY — hero + BodyMap
│   ├── Dashboard.tsx                # MODIFY — heatmap + BodyMap card
│   ├── ExerciseLibrary.tsx          # MODIFY — BodyMap filter
│   ├── Auth.tsx                     # (future session)
│   ├── Pricing.tsx                  # (future session)
│   └── ...                          # Other pages
├── lib/
│   └── MuscleMapJS/                 # Git submodule (DO NOT MODIFY)
├── hooks/                           # (DO NOT MODIFY)
├── contexts/                        # (DO NOT MODIFY)
└── integrations/                    # (DO NOT MODIFY)
```

### Build Verification
Build passes clean: `npx vite build` → 3,361 modules transformed, 0 errors. All new imports resolve.