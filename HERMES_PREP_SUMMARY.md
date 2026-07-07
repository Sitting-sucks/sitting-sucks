# Sitting Sucks — Fable Prep Summary

**Date:** July 6, 2026
**Goal:** 2-day redesign of sittingsucks.com
**Tonight:** Fable 5 session (Claude Max, $200 budget, 20 credits)

---

## What Was Prepared

### 1. Codebase Survey — Complete

| Metric | Count |
|--------|-------|
| Pages | 17 (Landing, Dashboard, Auth, ExerciseLibrary + 13 more) |
| Components | 25+ (including 60+ shadcn/ui primitives) |
| Hooks | 15 (auth, exercises, programs, stats, gamification, messaging, etc.) |
| Contexts | 2 (AuthContext, CartContext) |
| Routes | 21 (public, protected, trainer-only, 404) |
| Exercise data | 19 exercises with bodyAreas, targetMuscles, instructions, videos |

### 2. Infrastructure — Ready

| Item | Status |
|------|--------|
| Vite 7 + React 18 + TS | Running |
| shadcn/ui | Full component library installed |
| Tailwind 3 | Configured with custom colors, animations |
| Supabase | Client connected, auth context active |
| Capacitor 8 | Android + iOS targets configured |
| PWA | vite-plugin-pwa, manifest, service worker |
| Cloudflare Pages | SPA hosting with `_redirects` |

### 3. MuscleMapJS — Installed & Wrapped

| Item | File | Lines |
|------|------|-------|
| Git submodule | `src/lib/MuscleMapJS/` | — |
| 36-muscle mapping to exercise DB | `src/data/muscle-mapping.ts` | 464 |
| React wrapper component | `src/components/BodyMap.tsx` | 302 |
| Muscle click info panel | `src/components/MuscleInfoPanel.tsx` | ~250 |

### 4. Vault Knowledge — Digitized

| Knowledge Base | Location |
|----------------|----------|
| Core Principles | `/Knowledge/Movement/Philosophy/Core Principles.md` |
| Compensation Chains | `/Knowledge/Movement/Anatomy & Movement/Compensation Chains.md` |
| Brain-Body Connection | `/Knowledge/Movement/Philosophy/Brain-Body Connection.md` |
| Exercise as Total Human Exp | `/Knowledge/Movement/Philosophy/Exercise as Total Human Experience.md` |
| Video Script Structure | `/Knowledge/Movement/Content/Video Scripts.md` |
| **Lower Back Pain Protocol** | `/Knowledge/Movement/Pain & Conditions/Lower Back Pain.md` |
| **Hip Pain Protocol** | `/Knowledge/Movement/Pain & Conditions/Hip Pain.md` |
| **Knee Pain Protocol** | `/Knowledge/Movement/Pain & Conditions/Knee Pain.md` |
| **Shoulder Pain Protocol** | `/Knowledge/Movement/Pain & Conditions/Shoulder Pain.md` |
| **Neck Pain Protocol** | `/Knowledge/Movement/Pain & Conditions/Neck Pain.md` |
| **Foot & Ankle Pain Protocol** | `/Knowledge/Movement/Pain & Conditions/Foot & Ankle Pain.md` |
| **Wrist & Elbow Pain Protocol** | `/Knowledge/Movement/Pain & Conditions/Wrist & Elbow Pain.md` |

### 5. Fable Prompt Pack — Written

**File:** `/home/ryan/sitting-sucks-app/HERMES_FABLE_PROMPT.md` (25KB)

Sections:
- **A.** App architecture (routes, pages, components, hooks, design system)
- **B.** Vault knowledge (movement philosophy, compensation chains, brain-body, brand voice)
- **C.** BodyMap component reference (props, API, usage patterns per page)
- **D.** Fable sessions (Session 1: UI redesign, Session 4: Pain protocol pages)
- **E.** Fable 5 guardrail guidelines
- **F.** Files Fable should NEVER touch (definitive allow/block list)
- **G.** Appendix: File map

---

## Tonight's Session Plan

### Session 1: Anatomy-Themed UI Redesign

**Priority order:**
1. `src/index.css` + `tailwind.config.ts` — add bone white `#F5F0EB`, tissue warm grey, amber accent colors. Keep existing palette.
2. `src/pages/Landing.tsx` — hero section with BodyMap on right, headline left. Sitting Epidemic highlights. Modal on muscle click.
3. `src/components/Navigation.tsx` — mini BodyMap at bottom of sidebar (12rem, minimal style).
4. `src/pages/Dashboard.tsx` — "Your Body Today" heatmap card using buildMuscleHeatmap(). Exercise recommendations feed from muscle click.
5. `src/pages/ExerciseLibrary.tsx` — BodyMap as interactive filter at top. Click muscle → filter grid. Front/back flip buttons.

### Session 4: Pain Protocol Pages (when we get there)
- New route: `/pain-protocols/:condition`
- 7 protocol pages from vault content
- BodyMap highlights affected areas
- Compensation chain diagrams
- Linked exercises from database

---

## Key Decisions Made

1. **NOT a full rebuild** — update existing pages, keep all hooks/contexts/routes
2. **BodyMap component is pre-built** — Fable imports it, doesn't rewrite it
3. **MuscleInfoPanel is pre-built** — Fable wires it up to page state
4. **All 7 pain protocol vault pages written** — Fable reads them, doesn't write them
5. **Dark mode must work** — all new colors need dark variants
6. **Mobile responsive** — shadcn/ui breakpoints already in place
7. **No git commits yet** — Fable generates code, we review and commit after

---

## Build Verification

Latest build: `npx vite build` → 3,361 modules, 0 errors, 24.87s, 378KB gzip JS + 14.5KB gzip CSS.

All new imports resolved:
- `@/lib/MuscleMapJS/src/index` ✓
- `@/data/muscle-mapping` ✓
- `@/components/BodyMap` ✓
- `@/components/MuscleInfoPanel` ✓

---

## Risks

1. **Fable 5 guardrails** — health/exercise topics can trigger classifiers. Framed defensively in prompt. Opus 4.8 fallback available.
2. **Tailwind class conflicts** — existing shadcn/ui uses standard classes. New anatomy classes (bone-white, etc.) use custom CSS vars to avoid conflicts.
3. **Build size** — 1.3MB JS bundle, warning already exists. Fable should be aware of import sizes.