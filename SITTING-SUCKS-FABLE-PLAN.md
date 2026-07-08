# Sitting Sucks: Fable Enhancement Plan

## Overview
The app is built but not differentiated. Current recommendation system is a generic muscle-group scorer. The site is functional but doesn't look or feel premium. Fable can fix both — embedding **your expertise** into the intelligence layer and making the UI actually convert.

---

## Phase 1: Smarter Recommendations (Your Expertise, Not Generic AI)

### Problem
Current `useRecommendations` scores exercises by muscle-group-needs-work (basic counting). It doesn't understand **joint mechanics, compensation patterns, or your mobility-first approach**. It recommends "chest exercises" because pecs haven't been hit, not "ankle dorsiflexion work" because tight calves are limiting the user's squat depth.

### Fable Solution
Replace the scoring algorithm with a **knowledge-driven recommendation engine** that encodes Ryan's methodology:

- **Joint Chain Logic**: Sitting creates predictable compensation patterns (tight hips → tight T-spine → shoulder impingement). Fable's reasoning engine understands these chains and recommends the correct upstream/downstream fix.
- **Pain-Aware Routing**: User reports "low back pain" → engine doesn't recommend lumbar extensions. It recommends hip flexor release + T-spine rotation + core stability — because that's what actually fixes it.
- **Progression Intelligence**: Knows when to regress (user hasn't worked out in 7+ days → regression-first) vs progress (consistent 5x/week → harder variation).
- **Equipment Reality**: Matches recommendations to what the user actually owns. Not "go buy a foam roller" — "here's 3 exercises you can do with a chair."

**Implementation:**
1. Build a `recommendation-engine.ts` service that runs Fable's reasoning on the exercise DB + user history
2. Create user profile fields: pain_points, equipment_owned, goals, movement_quality_score
3. Onboarding flow captures this data → Fable generates personalized starter program
4. Weekly check-in: "How's your lower back this week?" → Fable adjusts the program

### Cost Strategy
- Fable runs **once per onboarding** and **once per weekly check-in** — that's ~$1-2/week
- Daily "what do I do today?" uses the local scoring engine (already built, zero API cost)
- Fable only fires when reasoning matters, not on every page load

---

## Phase 2: Site UI Enhancement (Premium Feel)

### Current State
- shadcn/ui defaults — functional but not distinctive
- Auth page looks like every other Supabase template
- No video integration on the landing page
- Exercise cards are text-heavy

### Fable Solution
- **Landing page hero**: Add embedded YouTube demos (your garage gym footage). "Watch real exercises, not animations."
- **Exercise cards**: Show video thumbnail previews. Hover plays a GIF clip.
- **Premium color scheme**: Deep purple/indigo gradient (current) → tighten the contrast, add warm accent colors
- **Typography**: Use Inter for body, a heavier display font for headlines
- **Progress charts**: Upgrade Recharts visualizations — smoother animations, better mobile layout
- **Streak/gamification UI**: Make streaks visible, celebratory animations, shareable "I've been streak-free for X days" cards

---

## Phase 3: Fable AI Features

### Smart Form Coach
- User records a set → Fable analyzes the exercise context and provides **your** form cues
- "You did 8 push-ups. Remember: elbows not flared past 45°, shoulder blades together at the bottom. Try slowing your descent to 3 seconds next set."
- These aren't generic tips — they're pulled directly from your exercise instructions

### Recovery Intelligence
- "Your last 3 workouts all hammered shoulders. You're due for an ankle/hip mobility day."
- Fable reads the workout history, identifies overtraining patterns, adjusts recommendations

### Progress Narrative
- Instead of "you did 12 workouts this month" — "Your squat depth has improved 30% since you started using heel wedges. Your hip internal rotation is still limited. Here's this week's focus."

---

## Phase 4: Revenue Conversion Funnel

### Current Funnel
Landing → Auth → Dashboard (trial) → Subscriber

### Enhanced Funnel
Landing (video + social proof) → Free tier (exercise library preview, limited recommendations) → Auth (capture email) → Onboarding (Fable generates personal program → "wow" moment) → Trial ($10/mo or $249/mo coaching)

### Key Addition: The "WOW" Onboarding
1. User signs up → answers 5 questions (pain points, goals, equipment)
2. Fable generates a personalized 1-week starter program tailored to THEM
3. User sees "This program was built for YOUR body" — immediate value
4. Day 3: Fable-generated check-in email "How's that lower back feeling?"
5. Day 7: Week 2 program adjusts based on feedback
6. Day 14: Trial ends → user has already seen the value → converts

---

## Build Order

| Phase | What | Fable cost | Why first |
|-------|------|------------|-----------|
| **P1** | Onboarding → Fable-generated starter program | ~$1/user | Biggest "wow" moment, differentiator |
| **P2** | Landing page enhancements | $0 (UI only) | Converts visitors to signups |
| **P3** | Exercise library video thumbnails | $0 (CSS) | Makes the library sell itself |
| **P4** | Recovery intelligence | ~$2/week | Retention |
| **P5** | Smart form coach | ~$1/week | Engagement |
| **P6** | Progress narrative | ~$0.50/week | Stickiness |

---

## Fable Token Budget

| Task | Input (est.) | Output (est.) | Cost |
|------|-------------|---------------|------|
| Generate starter program (onboarding) | 5K system + 2K user data | 1K program | ~$0.35 |
| Weekly check-in adjustment | 5K system + 3K history | 500B adjustment | ~$0.30 |
| Form cue generation | 3K context + 200B log | 200B cue | ~$0.15 |
| Progress narrative | 4K history + 1K stats | 300B narrative | ~$0.22 |

**Monthly Fable cost estimate (100 active users):** ~$50-75/month
**Monthly Fable cost estimate (1,000 active users):** ~$200-400/month (caching reduces this significantly)