/**
 * Exercise utilities — bridge between local exercise data and Supabase exercises.
 *
 * Supabase exercises carry `muscle_groups` + `joint_movements`;
 * local data carries `bodyAreas` + `targetMuscles`. These helpers let
 * muscle-mapping filters work with either shape.
 */

import { jointMovementToBodyAreas, BodyArea } from '@/data/exercises';

/**
 * Derive body areas from joint movements using the existing
 * jointMovementToBodyAreas mapping. Tries exact match first,
 * then case-insensitive.
 */
export function computeBodyAreas(jointMovements: string[]): BodyArea[] {
  const areas = new Set<BodyArea>();
  const lowerMap = new Map(
    Object.entries(jointMovementToBodyAreas).map(([k, v]) => [k.toLowerCase(), v])
  );
  for (const jm of jointMovements) {
    const mapped = jointMovementToBodyAreas[jm] || lowerMap.get(jm.toLowerCase());
    if (mapped) mapped.forEach((a) => areas.add(a));
  }
  return Array.from(areas);
}
