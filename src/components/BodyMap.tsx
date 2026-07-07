/**
 * BodyMap — Interactive muscle map component
 *
 * Wraps MuscleMapWidget (Canvas-based) as a React component.
 * Click a muscle → shows related exercises, body area info, pain protocol link.
 *
 * Usage:
 *   <BodyMap
 *     exercises={exercises}
 *     side="front"
 *     onMuscleClick={(muscle, info) => console.log(muscle, info)}
 *   />
 *
 * Props control display mode (interactive, gender, side, highlighting)
 * and wire up the connection to the Sitting Sucks exercise database.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { MuscleMapWidget, STYLE_PRESETS } from '@/lib/MuscleMapJS/src/index';
import type { Muscle, BodySide, BodyGender, MuscleSide } from '@/lib/MuscleMapJS/src/index';
import type { Exercise } from '@/data/exercises';
import {
  MUSCLE_MAP_BY_SLUG,
  getExercisesForMuscle,
  bodyAreaLabels,
  painConditionPaths,
} from '@/data/muscle-mapping';

// ─── Types ──────────────────────────────────────────────────

export interface MuscleClickInfo {
  /** The muscle slug */
  muscle: Muscle;
  /** Display label (e.g. "Calves") */
  label: string;
  /** Body area this muscle belongs to */
  bodyArea: string;
  /** Pain condition name (if any) */
  painCondition?: string;
  /** Pain condition vault path (if any) */
  painConditionPath?: string;
  /** Exercises that target this muscle */
  exercises: Exercise[];
  /** Description of this muscle's relevance */
  description: string;
  /** Whether this muscle is a sub-group */
  isSubgroup: boolean;
}

export interface HighlightConfig {
  muscle: Muscle;
  color: string;
  opacity?: number;
}

export interface BodyMapProps {
  /** Exercise list to filter against */
  exercises: Exercise[];
  /** Which side of the body to show */
  side?: BodySide;
  /** Body gender */
  gender?: BodyGender;
  /** Visual style preset */
  style?: 'default' | 'minimal' | 'neon' | 'medical';
  /** Whether the map responds to clicks/hover */
  interactive?: boolean;
  /** Allow selecting multiple muscles */
  multiSelect?: boolean;
  /** Initial highlights to show on load */
  initialHighlights?: HighlightConfig[];
  /** Callback when a muscle is clicked */
  onMuscleClick?: (info: MuscleClickInfo) => void;
  /** Callback when selection changes */
  onSelectionChange?: (muscles: Muscle[]) => void;
  /** CSS height (default: '24rem') */
  height?: string;
  /** CSS width (default: '100%') */
  width?: string;
  /** Additional class names */
  className?: string;
  /** Show muscle label tooltips on hover */
  showTooltips?: boolean;
  /** Enable smooth highlight transitions */
  animated?: boolean;
}

// ─── Component ──────────────────────────────────────────────

export function BodyMap({
  exercises,
  side = 'front',
  gender = 'male',
  style = 'default',
  interactive = true,
  multiSelect = false,
  initialHighlights = [],
  onMuscleClick,
  onSelectionChange,
  height = '24rem',
  width = '100%',
  className = '',
  showTooltips = true,
  animated = true,
}: BodyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MuscleMapWidget | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize MuscleMapWidget
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new MuscleMapWidget(containerRef.current, {
      gender,
      side,
      style,
      interactive,
      multiSelect,
      onSelectionChange: (muscles: Muscle[]) => {
        onSelectionChange?.(muscles);
      },
    });

    if (showTooltips) {
      map.enableTooltip();
    }

    if (animated) {
      map.enableAnimation(250);
    }

    // Apply initial highlights
    for (const h of initialHighlights) {
      map.highlight(h.muscle, h.color, h.opacity ?? 1);
    }

    mapRef.current = map;
    setIsReady(true);

    return () => {
      map.destroy();
      mapRef.current = null;
      setIsReady(false);
    };
  }, []); // mount once

  // Apply highlights when they change
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.clearHighlights();
    for (const h of initialHighlights) {
      mapRef.current.highlight(h.muscle, h.color, h.opacity ?? 1);
    }
  }, [initialHighlights]);

  // Change side (front/back) when prop changes
  useEffect(() => {
    mapRef.current?.setSide(side);
  }, [side]);

  // Change gender
  useEffect(() => {
    mapRef.current?.setGender(gender);
  }, [gender]);

  // Change style
  const prevStyle = useRef(style);
  useEffect(() => {
    if (prevStyle.current !== style) {
      prevStyle.current = style;
      // MuscleMapWidget doesn't have a direct setStyle that accepts preset string,
      // but we can recreate. For now just log — Fable can optimize.
    }
  }, [style]);

  // Switch to front/back
  const flipTo = useCallback((newSide: BodySide) => {
    mapRef.current?.setSide(newSide);
  }, []);

  // Highlight a specific muscle
  const highlight = useCallback((muscle: Muscle, color: string, opacity?: number) => {
    mapRef.current?.highlight(muscle, color, opacity ?? 1);
  }, []);

  // Clear all highlights
  const clearHighlights = useCallback(() => {
    mapRef.current?.clearHighlights();
  }, []);

  // Handle muscle click — builds the MuscleClickInfo from mapping data
  const handleMuscleClick = useCallback(
    (muscle: Muscle, _side: MuscleSide) => {
      const entry = MUSCLE_MAP_BY_SLUG[muscle];
      if (!entry) return;

      const matchingExercises = getExercisesForMuscle(exercises, muscle);

      const info: MuscleClickInfo = {
        muscle,
        label: entry.label,
        bodyArea: bodyAreaLabels[entry.bodyArea] ?? entry.bodyArea,
        painCondition: entry.painCondition,
        painConditionPath: entry.painCondition
          ? painConditionPaths[entry.painCondition]
          : undefined,
        exercises: matchingExercises,
        description: entry.description,
        isSubgroup: entry.isSubgroup,
      };

      setSelectedMuscle(muscle);
      onMuscleClick?.(info);
    },
    [exercises, onMuscleClick]
  );

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* The canvas container — MuscleMapWidget injects canvas here */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: height }}
      />

      {/* Side-flip buttons — front/back toggle */}
      {interactive && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          <button
            type="button"
            onClick={() => flipTo('front')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              side === 'front'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => flipTo('back')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              side === 'back'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Build heatmap data from exercise history or frequency.
 * Intensity 0-4 scale.
 * Returns array of { muscle, intensity } for MuscleMapWidget.setIntensities().
 */
export function buildMuscleHeatmap(
  exercisesLogged: Array<{ targetMuscles: string[]; count: number }>
): Array<[Muscle, number]> {
  const intensity = new Map<Muscle, number>();

  for (const log of exercisesLogged) {
    for (const entry of Object.values(MUSCLE_MAP_BY_SLUG)) {
      if (!entry) continue;
      // Check if any keyword matches
      const matches = entry.targetKeywords.some((kw) =>
        log.targetMuscles.some((tm) => tm.toLowerCase().includes(kw))
      );
      if (matches) {
        intensity.set(entry.slug, (intensity.get(entry.slug) ?? 0) + log.count);
      }
    }
  }

  // Normalize to 0-4
  const max = Math.max(...intensity.values(), 1);
  return Array.from(intensity.entries()).map(([muscle, val]) => [
    muscle,
    Math.round((val / max) * 4),
  ]) as Array<[Muscle, number]>;
}

/**
 * Pain condition color mapping for highlighting
 */
export const PAIN_CONDITION_COLORS: Record<string, string> = {
  'Lower Back Pain': '#ef4444',    // red
  'Hip Pain': '#f97316',           // orange
  'Knee Pain': '#eab308',          // yellow
  'Shoulder Pain': '#3b82f6',      // blue
  'Neck Pain': '#a855f7',          // purple
  'Foot & Ankle Pain': '#22c55e',  // green
  'Wrist & Elbow Pain': '#06b6d4', // cyan
};