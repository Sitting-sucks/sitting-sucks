/**
 * Program Generator — turns onboarding answers into a personalized program:
 * a matched template, why it was selected, and modifications to apply.
 */

import { PROGRAM_TEMPLATES, ProgramTemplate } from '@/data/program-templates';

export interface OnboardingData {
  sittingHours: string;
  painAreas: string[];
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

export interface GeneratedProgram {
  template: ProgramTemplate;
  personalizationNotes: string;
  modifications: string[];
}

const PAIN_LABELS: Record<string, string> = {
  lower_back: 'lower back',
  upper_back: 'upper back/shoulders',
  neck: 'neck',
  hips: 'hips',
  knees: 'knees',
  wrists: 'wrists',
};

export function generateProgram(data: OnboardingData): GeneratedProgram {
  let bestTemplate: ProgramTemplate | null = null;
  const personalizationNotes: string[] = [];
  const modifications: string[] = [];

  const painAreas = data.painAreas.filter((p) => p !== 'none');

  // 1. Pain-based matching: template covering the most reported pain areas
  if (painAreas.length > 0) {
    const matched = PROGRAM_TEMPLATES.filter((t) => t.category === 'pain_relief')
      .map((t) => ({
        template: t,
        matchCount: painAreas.filter((pa) => t.targetConditions.includes(pa)).length,
      }))
      .filter((m) => m.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    if (matched.length > 0) {
      bestTemplate = matched[0].template;
      const labels = painAreas.map((pa) => PAIN_LABELS[pa] ?? pa).join(', ');
      personalizationNotes.push(
        `Selected ${bestTemplate.name} based on your reported pain areas: ${labels}`
      );
    }
  }

  // 2. Goal-based fallback
  if (!bestTemplate) {
    if (data.goal === 'mobility') {
      bestTemplate = PROGRAM_TEMPLATES.find((t) => t.id === 'tpl-daily-mobility') ?? PROGRAM_TEMPLATES[0];
      personalizationNotes.push('Daily Mobility Protocol selected based on your mobility goal');
    } else if (data.goal === 'strength') {
      bestTemplate = PROGRAM_TEMPLATES.find((t) => t.id === 'tpl-foundation') ?? PROGRAM_TEMPLATES[0];
      personalizationNotes.push('Foundation Reset with strength progression — build the base first');
    } else if (data.goal === 'pain' || data.sittingHours === '8+') {
      bestTemplate = PROGRAM_TEMPLATES.find((t) => t.id === 'tpl-foundation') ?? PROGRAM_TEMPLATES[0];
      personalizationNotes.push('Starting with Foundation Reset due to high sitting hours or pain-focused goal');
    } else {
      bestTemplate = PROGRAM_TEMPLATES.find((t) => t.id === 'tpl-foundation') ?? PROGRAM_TEMPLATES[0];
      personalizationNotes.push('Foundation Reset as your starting point');
    }
  }

  // 3. Modifications from onboarding answers
  if (data.painSeverity === '9-10' || data.painSeverity === '7-8') {
    modifications.push('Reduce all sets by 1. Start with mobility-only for the first week.');
  }
  if (data.painDuration === 'Over 5 years' || data.painDuration === 'Over 1 year') {
    modifications.push('Long-standing pain — progress slowly. Add 1 extra rest day per week.');
  }
  if (data.fitnessLevel === 'beginner') {
    modifications.push('Use regression variations for all exercises. Reduce reps by 30%.');
  }
  if (data.timeCommitment.startsWith('5-10')) {
    modifications.push('Time-limited: do only the first 3 exercises each day. Rotate through all exercises over 3 days.');
  }
  if (data.equipment.includes('none') || data.equipment.length === 0) {
    modifications.push('No equipment available — use bodyweight regressions for all exercises.');
  }
  if (data.posturePatterns.includes('forward_head') || data.posturePatterns.includes('rounded_shoulders')) {
    modifications.push('Postural patterns noted — add chin tucks and wall slides as warm-up before each session.');
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
