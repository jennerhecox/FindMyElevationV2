/**
 * Landmark matching algorithm
 * Finds the closest landmark to a given elevation
 */

export interface Landmark {
  name: string;
  type: string;
  elevation_meters: number;
  icon_svg: string;
}

/**
 * Find the closest landmark to the given elevation
 * Returns null if no landmark is within tolerance
 */
export function findClosestLandmark(
  elevation: number,
  landmarks: Landmark[],
  tolerance: number = 200
): Landmark | null {
  if (landmarks.length === 0) return null;

  let closest: Landmark | null = null;
  let minDiff = Infinity;

  for (const landmark of landmarks) {
    const diff = Math.abs(elevation - landmark.elevation_meters);

    if (diff < minDiff) {
      closest = landmark;
      minDiff = diff;
    }
  }

  // Only return if within tolerance
  if (closest && minDiff <= tolerance) {
    return closest;
  }

  return null;
}

/**
 * Find multiple nearby landmarks
 */
export function findNearbyLandmarks(
  elevation: number,
  landmarks: Landmark[],
  count: number = 3,
  tolerance: number = 500
): Landmark[] {
  return landmarks
    .map((landmark) => ({
      landmark,
      diff: Math.abs(elevation - landmark.elevation_meters),
    }))
    .filter(({ diff }) => diff <= tolerance)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, count)
    .map(({ landmark }) => landmark);
}

/**
 * Format comparison message
 */
export function formatComparisonMessage(
  elevation: number,
  landmark: Landmark,
  unit: 'meters' | 'feet' = 'meters'
): string {
  const diff = elevation - landmark.elevation_meters;
  const absDiff = Math.abs(diff);

  // Convert difference to display unit
  const displayDiff = unit === 'feet' ? Math.round(absDiff * 3.28084) : Math.round(absDiff);
  const unitLabel = unit === 'feet' ? 'ft' : 'm';

  if (absDiff < 10) {
    return `You are at about the same height as ${landmark.name}`;
  } else if (diff > 0) {
    return `You are ${displayDiff}${unitLabel} higher than ${landmark.name}`;
  } else {
    return `You are ${displayDiff}${unitLabel} lower than ${landmark.name}`;
  }
}
