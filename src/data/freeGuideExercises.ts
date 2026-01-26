/**
 * Free Anti-Sitting Guide Exercise Data
 *
 * This data is used for the free anti-sitting guide available to all users.
 * These exercises are specifically chosen to address common issues from prolonged sitting.
 *
 * THE TOP 5 ANTI-SITTING EXERCISES:
 * 1. Heel Wedge Calf Stretch - Restores ankle mobility
 * 2. Forearm Plank - Core stability and posture
 * 3. Supine Hip Flexion (Core Stability with Band) - Hip flexor and core strength
 * 4. Overhead Raises (Thumb Taps to Wall) - Shoulder mobility
 * 5. Standing Hip Abduction - Hip stability and glute activation
 */

export interface FreeGuideExercise {
  id: number;
  name: string;
  duration: string;
  targetAreas: string[];
  description: string;
  whyItHelps: string;
  tips: string[];
  videoUrl?: string;
}

export const FREE_GUIDE_EXERCISES: FreeGuideExercise[] = [
  {
    id: 1,
    name: 'Heel Wedge Calf Stretch',
    duration: '30-90 seconds',
    targetAreas: ['Calves', 'Achilles', 'Ankle Mobility'],
    description:
      'Place heel wedges on the floor with the elevated side toward you. Stand with both heels on the wedges, toes pointing forward on the ground. Keep legs straight and slowly lean forward, reaching toward your toes. You should feel a deep stretch in both calves and Achilles tendons.',
    whyItHelps:
      'Sitting shortens your calf muscles and reduces ankle dorsiflexion. This stretch restores the ankle mobility you lose from keeping your feet flat under a desk all day. Good ankle mobility is essential for proper squatting, walking, and preventing knee and hip problems.',
    tips: [
      'Keep your weight centered over both feet',
      'Do not bounce - hold the stretch steadily',
      'If you don\'t have heel wedges, use a rolled towel or the edge of a step',
      '📹 Video demonstration coming soon!',
    ],
  },
  {
    id: 2,
    name: 'Forearm Plank',
    duration: '15-60 seconds',
    targetAreas: ['Core', 'Lower Back', 'Shoulders'],
    description:
      'Start face down with forearms on the ground, elbows under shoulders. Push your body up so you\'re supported on forearms and toes. Keep your body in a straight line from head to heels. Engage your core by tucking your pelvis slightly and pushing your lumbar spine OUT (toward the ceiling). Hold while breathing steadily.',
    whyItHelps:
      'Sitting deactivates your core muscles and allows your spine to slump. The plank reactivates these muscles and teaches your body to maintain a neutral spine under load. A strong core protects your lower back and improves posture.',
    tips: [
      'Don\'t let your hips sag or pike up',
      'Actively push your forearms into the ground',
      'Squeeze your glutes to help maintain position',
      '📹 Video demonstration coming soon!',
    ],
  },
  {
    id: 3,
    name: 'Supine Core Stability Hold',
    duration: '30-60 seconds',
    targetAreas: ['Core', 'Hip Flexors', 'Lower Back'],
    description:
      'Lie on your back with knees bent and feet flat on the floor. Press your lower back firmly into the ground - there should be no space between your back and the floor. Hold a resistance band with both hands, arms extended toward the ceiling. Maintain the low back position while holding the band tension. Progress by slowly lowering one leg at a time while keeping your back pressed down.',
    whyItHelps:
      'This exercise teaches your deep core muscles to stabilize your spine while your limbs move - exactly what sitting prevents them from doing. The band adds resistance that forces your core to work harder to prevent rotation and maintain position.',
    tips: [
      'If your back arches off the floor, you\'ve gone too far',
      'Focus on breathing while maintaining the position',
      'Start without the band if needed, then add resistance',
      '📹 Video demonstration coming soon!',
    ],
  },
  {
    id: 4,
    name: 'Overhead Thumb Taps to Wall',
    duration: '5-15 reps',
    targetAreas: ['Shoulders', 'Upper Back', 'Thoracic Spine'],
    description:
      'Stand facing a wall, about 6 inches away. Keep your spine straight and core engaged. With thumbs pointing up, raise both arms overhead and try to tap the wall with your thumbs. The key: do NOT arch your lower back to reach the wall. If you can\'t reach without arching, stand further from the wall and work on your mobility.',
    whyItHelps:
      'Sitting hunched over a desk causes your shoulders to round forward and your thoracic spine to stiffen. This exercise restores overhead mobility by teaching you to raise your arms without compensating with your lower back. It\'s a test and a fix in one movement.',
    tips: [
      'Keep your ribs down - don\'t let them flare out',
      'Progress by moving closer to the wall over time',
      'If too difficult, do it lying on your back first',
      '📹 Video demonstration coming soon!',
    ],
  },
  {
    id: 5,
    name: 'Standing Hip Abduction',
    duration: '5-15 reps each side',
    targetAreas: ['Glute Medius', 'Hip Abductors', 'Hip Stability'],
    description:
      'Stand tall holding a wall or chair for balance. If using a band, place it around both ankles or just above your knees. Keeping both legs straight, lift one leg out to the side. Keep your hips level - do not lean to the opposite side. Lower with control and repeat. Complete all reps on one side before switching.',
    whyItHelps:
      'Your glute medius (side glute) becomes weak and inactive from sitting. This muscle is critical for hip stability, walking properly, and preventing knee and lower back pain. Strengthening it helps correct the muscle imbalances caused by sitting.',
    tips: [
      'Quality over quantity - don\'t swing the leg',
      'Keep the moving leg slightly behind your body line',
      'Focus on squeezing the outside of your hip, not just lifting the leg',
      '📹 Video demonstration coming soon!',
    ],
  },
];

/**
 * Get the total estimated time to complete the free guide
 * Based on typical completion times for each exercise
 */
export const getEstimatedGuideTime = (): string => {
  return '10-15 minutes';
};

/**
 * Get exercise by ID
 */
export const getExerciseById = (id: number): FreeGuideExercise | undefined => {
  return FREE_GUIDE_EXERCISES.find((e) => e.id === id);
};

/**
 * Get all target areas covered by the free guide
 */
export const getAllTargetAreas = (): string[] => {
  const areas = new Set<string>();
  FREE_GUIDE_EXERCISES.forEach((e) => e.targetAreas.forEach((a) => areas.add(a)));
  return Array.from(areas).sort();
};

export default FREE_GUIDE_EXERCISES;
