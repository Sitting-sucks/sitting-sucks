# Sitting Sucks — Exercise Authoring Template

**How this works:** You write exercises as YAML blocks in files under `content/exercises/`.
Run `node scripts/seed-exercises.mjs --check` to validate, then `--push` to send to Supabase.
One file per body area is fine (e.g. `hip.yaml`, `calves.yaml`) — the script reads them all.

Split the file however you like. Order doesn't matter. Re-running is safe (upsert by name).

---

## Field reference

Every exercise needs `name`, `bodyArea`, `jointMovements`, `targetMuscles`, `instructions`.
Everything else is optional but makes the app richer.

| Field | Required | What it is |
|-------|----------|------------|
| `name` | ✅ | Exercise name. Unique. This is the upsert key. |
| `bodyArea` | ✅ | ONE of: `Foot/Ankle`, `Knee`, `Hip`, `L Spine`, `T Spine`, `C Spine`, `Shoulder`, `Elbow`, `Wrist` |
| `jointMovements` | ✅ | List from the joint-movement vocabulary (see bottom). Drives BodyMap filtering. |
| `targetMuscles` | ✅ | Plain muscle names. Must contain at least one keyword from the muscle vocabulary (bottom) so the body map can match it. |
| `instructions` | ✅ | How to do it. Multi-line ok. |
| `description` | | One-line summary shown on cards. |
| `difficulty` | | `beginner` \| `intermediate` \| `advanced` |
| `intensity` | | `low` \| `moderate` \| `high` |
| `duration` | | Free text, e.g. `"30s each side"`, `"2 min"` |
| `equipment` | | List. `[]` or omit = bodyweight. e.g. `[Foam roller]`, `[Resistance band]` |
| `categories` | | List: `mobility` and/or `strength` |
| `videoUrl` | | YouTube link (@sittingsucks). |
| `tips` | | List of coaching cues. |
| `feelCue` | | "What you should feel" — your neurological-connection cue. Goes into tips. |
| `baseline` | | The standard version. |
| `regression` | | Easier variation (can't feel it / too hard). |
| `progression` | | Harder variation. |
| **`variables`** | | Your dials beyond weight. Any of: `tempo`, `rom`, `stability`, `plane`, `breath`, `time` — free text each. |

`variables`, `feelCue`, `regression`, `progression`, `baseline` are the Sitting Sucks
differentiators — the "if you can't feel it you're not training it" and "harder ≠ heavier" philosophy.
Fill them when they matter; skip when they don't.

---

## FILLED EXAMPLE — copy the shape, not the content

```yaml
- name: Wall Calf Stretch
  bodyArea: Foot/Ankle
  description: Restores ankle dorsiflexion locked up by sitting with feet tucked.
  difficulty: beginner
  intensity: low
  duration: 30s each side
  equipment: []
  categories: [mobility]
  jointMovements: [Ankle Dorsiflexion]
  targetMuscles: [gastrocnemius, soleus, calf]
  videoUrl: https://youtube.com/@sittingsucks
  instructions: |
    Hands on wall, one foot back, heel down, back knee straight.
    Lean forward until you feel a stretch in the back calf. Hold.
    Then bend the back knee slightly to shift the stretch to the lower calf (soleus).
  feelCue: A deep pull through the belly of the calf — not the achilles, not the knee.
  baseline: Straight back leg, heel flat, 30s hold.
  regression: Hands higher on wall, smaller lean. Or seated towel-pull dorsiflexion.
  progression: Elevate ball of foot on a book to increase dorsiflexion range.
  variables:
    tempo: Hold 30s; or pulse — 2s in, 2s out for 10 reps.
    rom: Increase lean depth as ankle opens up.
    stability: Progress to a single-leg balance version off a step.
    breath: Exhale into each deepening of the stretch.
    plane: Sagittal (forward lean); add slight inversion/eversion to hit medial/lateral calf.
```

---

## BLANK — copy this per exercise

```yaml
- name: 
  bodyArea: 
  description: 
  difficulty: 
  intensity: 
  duration: 
  equipment: []
  categories: []
  jointMovements: []
  targetMuscles: []
  videoUrl: 
  instructions: |
    
  feelCue: 
  baseline: 
  regression: 
  progression: 
  variables:
    tempo: 
    rom: 
    stability: 
    plane: 
    breath: 
    time: 
```

---

## Vocabularies (the validator checks against these)

**Body areas (pick ONE per exercise):**
Foot/Ankle · Knee · Hip · L Spine · T Spine · C Spine · Shoulder · Elbow · Wrist

**Joint movements (pick any that apply):**
Ankle Dorsiflexion, Ankle Plantarflexion, Ankle Inversion, Ankle Eversion, Toe Extension,
Knee Flexion, Knee Extension, Knee Internal Rotation, Knee External Rotation,
Hip Flexion, Hip Extension, Hip Abduction, Hip Adduction, Hip Internal Rotation, Hip External Rotation, Hip Neutral,
Lumbar Flexion, Lumbar Extension, Lumbar Lateral Flexion, Lumbar Rotation, Lumbar Neutral,
Thoracic Flexion, Thoracic Extension, Thoracic Lateral Flexion, Thoracic Rotation,
Cervical Flexion, Cervical Extension, Cervical Lateral Flexion, Cervical Rotation, Cervical Neutral,
Shoulder Flexion, Shoulder Extension, Shoulder Abduction, Shoulder Adduction,
Shoulder Internal Rotation, Shoulder External Rotation, Shoulder Horizontal Abduction,
Shoulder Horizontal Adduction, Shoulder Retraction, Shoulder Stabilization,
Elbow Flexion, Elbow Extension, Forearm Pronation, Forearm Supination,
Wrist Flexion, Wrist Extension, Wrist Radial Deviation, Wrist Ulnar Deviation

**Muscle keywords (targetMuscles must include at least one so BodyMap can match):**
calf/calves, gastrocnemius, soleus, achilles, foot/feet, plantar, tibialis, ankle,
quadriceps/quad, vmo, vastus, rectus femoris, hamstring(s), biceps femoris, knee,
glute/gluteus (maximus/medius/minimus), hip flexor, psoas, iliacus, adductor(s),
erector spinae, multifidi, quadratus lumborum, lower back, paraspinal,
abdominis/abs, core, transverse abdominis, oblique(s),
upper back, trapezius/trap(s), rhomboid(s), serratus, upper/lower trapezius,
neck, cervical, suboccipital,
pectoral(s)/chest/pec, deltoid(s), rotator cuff, supraspinatus, infraspinatus, teres minor, subscapularis,
biceps, triceps, anterior/posterior deltoid,
forearm, flexor carpi, extensor carpi, brachioradialis, hand, finger
```

---

## Program templates (optional — do this after exercises exist)

To fill a program template's daily exercises, in `content/programs/<template-id>.yaml`:

```yaml
# template-id must match src/data/program-templates.ts (e.g. tpl-lower-back)
templateId: tpl-lower-back
days:
  - day: 1
    exercises:
      - { name: Wall Calf Stretch, sets: 2, reps: "30s each side" }
      - { name: Glute Bridge, sets: 3, reps: "12-15" }
  - day: 2
    exercises:
      - { name: Couch Stretch, sets: 2, reps: "60s each side" }
```

Exercise `name` must match a seeded exercise exactly. The seed script wires these into
the `programs` / `program_exercises` tables.
