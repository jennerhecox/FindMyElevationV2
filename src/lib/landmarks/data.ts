/**
 * Landmark data management
 */

import landmarksData from '../../data/landmarks.json';
import type { Landmark } from './matcher';

/**
 * Get all landmarks
 */
export function getAllLandmarks(): Landmark[] {
  return landmarksData as Landmark[];
}

/**
 * Get landmarks by type
 */
export function getLandmarksByType(type: string): Landmark[] {
  return landmarksData.filter((landmark) => landmark.type === type) as Landmark[];
}

/**
 * Get landmarks in elevation range
 */
export function getLandmarksInRange(minElevation: number, maxElevation: number): Landmark[] {
  return landmarksData.filter(
    (landmark) =>
      landmark.elevation_meters >= minElevation && landmark.elevation_meters <= maxElevation
  ) as Landmark[];
}

/**
 * Get landmark by name
 */
export function getLandmarkByName(name: string): Landmark | null {
  const landmark = landmarksData.find(
    (l) => l.name.toLowerCase() === name.toLowerCase()
  );
  return landmark ? (landmark as Landmark) : null;
}

/**
 * Get available landmark types
 */
export function getLandmarkTypes(): string[] {
  const types = new Set(landmarksData.map((landmark) => landmark.type));
  return Array.from(types).sort();
}
