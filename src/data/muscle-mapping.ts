/**
 * MuscleMapJS ↔ Sitting Sucks Exercise Database Mapping
 *
 * Maps MuscleMapJS slugs (36 muscles) to:
 * - Display names (for UI labels)
 * - Body areas (to filter exercises via `bodyAreas` field)
 * - Pain condition links (to vault Knowledge/Movement/Pain & Conditions/)
 * - Exercise search keywords (to match exercise `targetMuscles` array)
 */

import type { Muscle } from '@/lib/MuscleMapJS/src/index';
import type { BodyArea } from '@/data/exercises';
import { computeBodyAreas } from '@/lib/exercise-utils';

export interface MuscleMapEntry {
  /** MuscleMapJS slug — matches the type `Muscle` */
  slug: Muscle;
  /** Human-readable display name */
  label: string;
  /** Which body area this muscle belongs to */
  bodyArea: BodyArea;
  /** Pain condition name for vault link (maps to Knowledge/Movement/Pain & Conditions/) */
  painCondition?: string;
  /** Keywords that appear in exercise `targetMuscles` field */
  targetKeywords: string[];
  /** Description — what this muscle does / why it matters for sitters */
  description: string;
  /** Whether this is a sub-group (shown only when expanded) */
  isSubgroup: boolean;
}

// Body area labels for display
export const bodyAreaLabels: Record<BodyArea, string> = {
  'Foot/Ankle': 'Foot & Ankle',
  'Knee': 'Knee',
  'Hip': 'Hip',
  'L Spine': 'Lower Back',
  'T Spine': 'Upper Back',
  'C Spine': 'Neck',
  'Shoulder': 'Shoulder',
  'Elbow': 'Elbow',
  'Wrist': 'Wrist',
};

// Pain condition → vault path mapping
export const painConditionPaths: Record<string, string> = {
  'Lower Back Pain': '/Knowledge/Movement/Pain & Conditions/Lower Back Pain.md',
  'Hip Pain': '/Knowledge/Movement/Pain & Conditions/Hip Pain.md',
  'Knee Pain': '/Knowledge/Movement/Pain & Conditions/Knee Pain.md',
  'Shoulder Pain': '/Knowledge/Movement/Pain & Conditions/Shoulder Pain.md',
  'Neck Pain': '/Knowledge/Movement/Pain & Conditions/Neck Pain.md',
  'Foot & Ankle Pain': '/Knowledge/Movement/Pain & Conditions/Foot & Ankle Pain.md',
  'Wrist & Elbow Pain': '/Knowledge/Movement/Pain & Conditions/Wrist & Elbow Pain.md',
};

/**
 * Complete mapping from MuscleMapJS slugs to Sitting Sucks domain data.
 * Every MuscleMapJS muscle gets: body area, pain condition, exercise search keywords,
 * display label, and a description explaining its relevance to desk workers.
 *
 * Sub-groups are listed at the bottom — by default they inherit their parent's
 * body area and pain condition.
 */
export const MUSCLE_MAP: MuscleMapEntry[] = [
  // ─── Foot & Ankle ──────────────────────────────────────────
  {
    slug: 'calves',
    label: 'Calves',
    bodyArea: 'Foot/Ankle',
    painCondition: 'Foot & Ankle Pain',
    targetKeywords: ['calf', 'calves', 'gastrocnemius', 'soleus', 'achilles'],
    description: '9 muscles plantar flex the ankle. Tight from sitting with feet tucked — they lock up ankle dorsiflexion and start the compensation chain.',
    isSubgroup: false,
  },
  {
    slug: 'feet',
    label: 'Feet',
    bodyArea: 'Foot/Ankle',
    painCondition: 'Foot & Ankle Pain',
    targetKeywords: ['foot', 'feet', 'plantar', 'intrinsic', 'toe'],
    description: 'Your foundation. Weak feet = unstable base = compensates everything above.',
    isSubgroup: false,
  },
  {
    slug: 'tibialis',
    label: 'Tibialis',
    bodyArea: 'Foot/Ankle',
    painCondition: 'Foot & Ankle Pain',
    targetKeywords: ['tibialis'],
    description: 'Shin muscle responsible for dorsiflexion. Weak in sitters who don\'t lift their feet.',
    isSubgroup: false,
  },
  {
    slug: 'ankles',
    label: 'Ankles',
    bodyArea: 'Foot/Ankle',
    painCondition: 'Foot & Ankle Pain',
    targetKeywords: ['ankle', 'dorsi', 'plantar', 'inversion', 'eversion'],
    description: 'Ankle mobility is the root of the compensation chain. Limited dorsiflexion breaks everything above.',
    isSubgroup: true,
  },

  // ─── Knee ───────────────────────────────────────────────────
  {
    slug: 'quadriceps',
    label: 'Quadriceps',
    bodyArea: 'Knee',
    painCondition: 'Knee Pain',
    targetKeywords: ['quadriceps', 'quad', 'vmo', 'vastus', 'rectus femoris'],
    description: 'Front thigh. Weak VMO (teardrop) is a common sitting problem — contributes to knee pain and tracking issues.',
    isSubgroup: false,
  },
  {
    slug: 'hamstring',
    label: 'Hamstrings',
    bodyArea: 'Knee',
    painCondition: 'Knee Pain',
    targetKeywords: ['hamstring', 'hamstrings', 'biceps femoris', 'semitendinosus', 'semimembranosus'],
    description: 'Back thigh. Tight from sitting, weak in lengthened position. Contributes to posterior pelvic tilt and low back strain.',
    isSubgroup: false,
  },
  {
    slug: 'knees',
    label: 'Knees',
    bodyArea: 'Knee',
    painCondition: 'Knee Pain',
    targetKeywords: ['knee'],
    description: 'The knee is caught between the ankle and hip. Knee pain is rarely a knee problem — look at the ankle or hip.',
    isSubgroup: false,
  },
  {
    slug: 'inner-quad',
    label: 'Inner Quad (VMO)',
    bodyArea: 'Knee',
    painCondition: 'Knee Pain',
    targetKeywords: ['vmo', 'vastus medialis', 'inner quad'],
    description: 'The teardrop muscle. Weak in sitters — contributes to knee tracking issues and patellar pain.',
    isSubgroup: true,
  },
  {
    slug: 'outer-quad',
    label: 'Outer Quad (VL)',
    bodyArea: 'Knee',
    painCondition: 'Knee Pain',
    targetKeywords: ['vastus lateralis', 'outer quad'],
    description: 'Often overpowers the VMO in sitters. Imbalance here pulls the kneecap laterally.',
    isSubgroup: true,
  },

  // ─── Hip ─────────────────────────────────────────────────────
  {
    slug: 'gluteal',
    label: 'Glutes',
    bodyArea: 'Hip',
    painCondition: 'Hip Pain',
    targetKeywords: ['glute', 'gluteus', 'gluteus maximus', 'gluteus medius', 'gluteus minimus'],
    description: 'Shut off from sitting. The glutes are the most important muscle group for desk workers — they stabilize the entire kinetic chain.',
    isSubgroup: false,
  },
  {
    slug: 'hip-flexors',
    label: 'Hip Flexors',
    bodyArea: 'Hip',
    painCondition: 'Hip Pain',
    targetKeywords: ['hip flexor', 'psoas', 'rectus femoris', 'iliacus'],
    description: 'Shortened from 8+ hours of sitting. Tight hip flexors pull the pelvis into anterior tilt and wreck low back mechanics.',
    isSubgroup: true,
  },
  {
    slug: 'adductors',
    label: 'Adductors',
    bodyArea: 'Hip',
    painCondition: 'Hip Pain',
    targetKeywords: ['adductor', 'adductors', 'inner thigh'],
    description: 'Tight AND weak in sitters. They pull the pelvis into altered positions and need release, stretch, AND strengthening.',
    isSubgroup: true,
  },

  // ─── Lower Back (L Spine) ──────────────────────────────────
  {
    slug: 'lower-back',
    label: 'Lower Back',
    bodyArea: 'L Spine',
    painCondition: 'Lower Back Pain',
    targetKeywords: ['erector spinae', 'longissimus', 'multifidi', 'quadratus lumborum', 'lower back', 'spinal stabilizer', 'paraspinal'],
    description: 'The #1 desk worker complaint. Almost always the victim, not the culprit — the real problem is usually the hips, ankles, or core.',
    isSubgroup: false,
  },
  {
    slug: 'abs',
    label: 'Abdominals',
    bodyArea: 'L Spine',
    painCondition: 'Lower Back Pain',
    targetKeywords: ['abdominis', 'abs', 'rectus abdominis', 'core', 'transverse abdominis'],
    description: 'The front wall of core stability. Weak abs = no anterior support = lower back takes the load.',
    isSubgroup: false,
  },
  {
    slug: 'obliques',
    label: 'Obliques',
    bodyArea: 'L Spine',
    painCondition: 'Lower Back Pain',
    targetKeywords: ['oblique', 'obliques', 'external oblique', 'internal oblique'],
    description: 'Rotational core muscles. Weak obliques = poor rotational control = T-spine and L-spine compensate.',
    isSubgroup: false,
  },
  {
    slug: 'upper-abs',
    label: 'Upper Abs',
    bodyArea: 'L Spine',
    painCondition: 'Lower Back Pain',
    targetKeywords: ['upper ab', 'rectus abdominis'],
    description: 'Upper portion of the rectus abdominis. Often overworked relative to lower abs in sitters.',
    isSubgroup: true,
  },
  {
    slug: 'lower-abs',
    label: 'Lower Abs',
    bodyArea: 'L Spine',
    painCondition: 'Lower Back Pain',
    targetKeywords: ['lower ab', 'transverse abdominis'],
    description: 'The deep core that stabilizes the pelvis. Weak lower abs = anterior pelvic tilt = low back strain.',
    isSubgroup: true,
  },

  // ─── Thoracic Spine (T Spine) / Upper Back ─────────────────
  {
    slug: 'upper-back',
    label: 'Upper Back',
    bodyArea: 'T Spine',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['upper back', 'trapezius', 'rhomboid', 'erector spinae'],
    description: 'The T-spine is where shoulder mobility lives. A stiff T-spine forces the shoulder and low back to compensate.',
    isSubgroup: false,
  },
  {
    slug: 'trapezius',
    label: 'Trapezius',
    bodyArea: 'T Spine',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['trapezius', 'trap', 'traps'],
    description: 'Upper traps get overworked and tight from desk posture. Lower traps go dormant and weak.',
    isSubgroup: false,
  },
  {
    slug: 'rhomboids',
    label: 'Rhomboids',
    bodyArea: 'T Spine',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['rhomboid', 'rhomboids'],
    description: 'Retract the scapulae. Weak from slouched sitting — leads to rounded shoulders and forward head posture.',
    isSubgroup: false,
  },
  {
    slug: 'serratus',
    label: 'Serratus Anterior',
    bodyArea: 'T Spine',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['serratus'],
    description: 'Wraps around the ribs and holds the scapula flat. Weak = scapular winging = shoulder impingement.',
    isSubgroup: false,
  },
  {
    slug: 'upper-trapezius',
    label: 'Upper Traps',
    bodyArea: 'T Spine',
    painCondition: 'Neck Pain',
    targetKeywords: ['upper trapezius', 'upper trap'],
    description: 'Overworked from desk posture. Elevates the shoulders toward the ears — creates neck tension and headaches.',
    isSubgroup: true,
  },
  {
    slug: 'lower-trapezius',
    label: 'Lower Traps',
    bodyArea: 'T Spine',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['lower trapezius', 'lower trap'],
    description: 'Dormant in sitters. Lower traps pull the scapulae down and back — essential for overhead shoulder health.',
    isSubgroup: true,
  },

  // ─── Cervical Spine (C Spine / Neck) ────────────────────────
  {
    slug: 'neck',
    label: 'Neck',
    bodyArea: 'C Spine',
    painCondition: 'Neck Pain',
    targetKeywords: ['neck', 'cervical', 'suboccipital'],
    description: 'Forward head posture from desk work puts 40+ lbs of pressure on the cervical spine. The deep neck flexors are weak.',
    isSubgroup: true,
  },
  {
    slug: 'head',
    label: 'Head & Suboccipitals',
    bodyArea: 'C Spine',
    painCondition: 'Neck Pain',
    targetKeywords: ['suboccipital', 'head', 'skull'],
    description: 'The suboccipitals at the base of the skull are typically locked up from forward head posture.',
    isSubgroup: false,
  },

  // ─── Shoulder ──────────────────────────────────────────────
  {
    slug: 'chest',
    label: 'Chest',
    bodyArea: 'Shoulder',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['pectoral', 'pectoralis', 'chest', 'pec'],
    description: 'Tight from slouched sitting. Shortened pectorals pull the shoulders forward and internally rotate the arms.',
    isSubgroup: false,
  },
  {
    slug: 'deltoids',
    label: 'Deltoids',
    bodyArea: 'Shoulder',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['deltoid', 'deltoids'],
    description: 'Primary shoulder mover. Anterior delts overwork in desk workers while posterior delts weaken.',
    isSubgroup: false,
  },
  {
    slug: 'rotator-cuff',
    label: 'Rotator Cuff',
    bodyArea: 'Shoulder',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['rotator cuff', 'supraspinatus', 'infraspinatus', 'teres minor', 'subscapularis'],
    description: '4 deep stabilizers that keep the shoulder joint centered. Weak = impingement, instability, pain.',
    isSubgroup: false,
  },
  {
    slug: 'biceps',
    label: 'Biceps',
    bodyArea: 'Shoulder',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['biceps', 'bicep', 'brachii'],
    description: 'Front arm. Also assists shoulder flexion. Can develop trigger points from prolonged typing position.',
    isSubgroup: false,
  },
  {
    slug: 'triceps',
    label: 'Triceps',
    bodyArea: 'Shoulder',
    painCondition: 'Wrist & Elbow Pain',
    targetKeywords: ['triceps', 'tricep'],
    description: 'Back arm. Extends the elbow. Weakness here means all pushing movements rely on the shoulder instead.',
    isSubgroup: false,
  },
  {
    slug: 'front-deltoid',
    label: 'Front Deltoid',
    bodyArea: 'Shoulder',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['anterior deltoid', 'front delt'],
    description: 'Overworks in desk workers from constant forward reaching (typing, mouse). Can create impingement.',
    isSubgroup: true,
  },
  {
    slug: 'rear-deltoid',
    label: 'Rear Deltoid',
    bodyArea: 'Shoulder',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['posterior deltoid', 'rear delt'],
    description: 'Weak in sitters. The rear delt pulls the shoulder back — essential for balance against the tight chest.',
    isSubgroup: true,
  },
  {
    slug: 'upper-chest',
    label: 'Upper Chest',
    bodyArea: 'Shoulder',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['upper chest', 'pectoralis minor', 'clavicular'],
    description: 'Tight from desk posture. Pulls the shoulders forward and can contribute to thoracic outlet syndrome.',
    isSubgroup: true,
  },
  {
    slug: 'lower-chest',
    label: 'Lower Chest',
    bodyArea: 'Shoulder',
    painCondition: 'Shoulder Pain',
    targetKeywords: ['lower chest', 'pectoralis major sternal'],
    description: 'Lower portion of pec major. Often underworked while upper chest gets tight.',
    isSubgroup: true,
  },

  // ─── Elbow ──────────────────────────────────────────────────
  {
    slug: 'forearm',
    label: 'Forearm',
    bodyArea: 'Elbow',
    painCondition: 'Wrist & Elbow Pain',
    targetKeywords: ['forearm', 'flexor carpi', 'extensor carpi', 'brachioradialis'],
    description: 'Tight from typing. The forearm flexors are chronically shortened — leads to elbow pain and wrist stiffness.',
    isSubgroup: false,
  },
  {
    slug: 'hands',
    label: 'Hands',
    bodyArea: 'Elbow',
    painCondition: 'Wrist & Elbow Pain',
    targetKeywords: ['hand', 'finger', 'thenar', 'hypothenar'],
    description: 'The end of the chain. Weak grip and finger flexors from lack of use beyond typing.',
    isSubgroup: false,
  },

  // ─── Wrist ──────────────────────────────────────────────────
  // No dedicated slug for wrist — handled via forearm + hands
];

/**
 * Quick lookup: MuscleMapJS slug → MuscleMapEntry
 */
export const MUSCLE_MAP_BY_SLUG = Object.fromEntries(
  MUSCLE_MAP.map((entry) => [entry.slug, entry])
) as Record<Muscle, MuscleMapEntry | undefined>;

/**
 * Get exercises by body area.
 * Used by BodyMap component to filter exercises matching the clicked muscle.
 */
export function getExercisesByBodyArea(
  exercises: { bodyAreas: BodyArea[] }[],
  bodyArea: BodyArea
) {
  return exercises.filter((ex) => ex.bodyAreas.includes(bodyArea));
}

/**
 * Get exercises by target muscle keywords.
 * Matches against the `targetMuscles` string array on exercises.
 */
export function getExercisesByMuscleKeywords(
  exercises: { targetMuscles: string[] }[],
  keywords: string[]
) {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());
  return exercises.filter((ex) =>
    ex.targetMuscles.some((tm) =>
      lowerKeywords.some((kw) => tm.toLowerCase().includes(kw))
    )
  );
}

/**
 * Best-effort: get exercises that target this muscle.
 * First tries body area match (most reliable), then keyword match on targetMuscles.
 * Returns deduplicated results.
 */
export function getExercisesForMuscle<
  T extends {
    id: string;
    bodyAreas?: BodyArea[];
    targetMuscles?: string[];
    muscle_groups?: string[];
    joint_movements?: string[];
  }
>(exercises: T[], muscle: Muscle): T[] {
  const entry = MUSCLE_MAP_BY_SLUG[muscle];
  if (!entry) return [];

  const lowerKeywords = entry.targetKeywords.map((k) => k.toLowerCase());
  const seen = new Set<string>();

  for (const ex of exercises) {
    // Body area match: local `bodyAreas`, or derived from Supabase `joint_movements`
    const bodyAreas = ex.bodyAreas ?? computeBodyAreas(ex.joint_movements ?? []);
    if (bodyAreas.includes(entry.bodyArea)) {
      seen.add(ex.id);
      continue;
    }

    // Keyword match: Supabase `muscle_groups`, or local `targetMuscles`
    const muscleGroups = ex.muscle_groups ?? ex.targetMuscles ?? [];
    if (
      muscleGroups.some((mg) =>
        lowerKeywords.some((kw) => mg.toLowerCase().includes(kw))
      )
    ) {
      seen.add(ex.id);
    }
  }

  return exercises.filter((ex) => seen.has(ex.id));
}