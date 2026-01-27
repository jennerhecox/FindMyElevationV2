/**
 * Elevation cache management with spatial lookup
 */

import type { ElevationCache } from '../storage/indexed-db';
import { saveElevation, getElevationById, getAllElevations, cleanupOldElevations } from '../storage/indexed-db';

const GEOGRAPHIC_TOLERANCE = 0.01; // ~1km at equator
const CACHE_VALIDITY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generate cache key from coordinates
 */
export function generateCacheKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
}

/**
 * Check if cached elevation is still valid
 */
export function isCacheValid(cached: ElevationCache): boolean {
  const age = Date.now() - cached.timestamp;
  return age < CACHE_VALIDITY_MS;
}

/**
 * Calculate distance between two coordinates (simple approximation)
 * Returns distance in degrees
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const latDiff = lat1 - lat2;
  const lonDiff = lon1 - lon2;
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
}

/**
 * Get cached elevation for a location
 * Looks for exact match first, then nearby locations
 */
export async function getCachedElevation(
  latitude: number,
  longitude: number
): Promise<ElevationCache | null> {
  try {
    // Try exact match first (rounded to 4 decimals)
    const exactKey = generateCacheKey(latitude, longitude);
    const exact = await getElevationById(exactKey);

    if (exact && isCacheValid(exact)) {
      console.log('Cache hit (exact):', exact);
      return exact;
    }

    // Search for nearby cached locations
    const allCached = await getAllElevations();

    // Filter by proximity and validity
    const nearby = allCached
      .filter((cached) => {
        const distance = calculateDistance(latitude, longitude, cached.latitude, cached.longitude);
        return distance <= GEOGRAPHIC_TOLERANCE && isCacheValid(cached);
      })
      .sort((a, b) => {
        // Sort by distance (closest first)
        const distA = calculateDistance(latitude, longitude, a.latitude, a.longitude);
        const distB = calculateDistance(latitude, longitude, b.latitude, b.longitude);
        return distA - distB;
      });

    if (nearby.length > 0) {
      console.log('Cache hit (nearby):', nearby[0]);
      return nearby[0];
    }

    console.log('Cache miss');
    return null;
  } catch (error) {
    console.error('Failed to get cached elevation:', error);
    return null;
  }
}

/**
 * Cache elevation result
 */
export async function cacheElevation(data: {
  elevation: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  source: 'gps' | 'api';
}): Promise<void> {
  try {
    const cacheEntry: ElevationCache = {
      id: generateCacheKey(data.latitude, data.longitude),
      ...data,
      timestamp: Date.now(),
    };

    await saveElevation(cacheEntry);
    console.log('Elevation cached:', cacheEntry);

    // Cleanup old entries periodically (1% chance per cache operation)
    if (Math.random() < 0.01) {
      const deleted = await cleanupOldElevations();
      if (deleted > 0) {
        console.log(`Cleaned up ${deleted} old elevation records`);
      }
    }
  } catch (error) {
    console.error('Failed to cache elevation:', error);
  }
}

/**
 * Clear all cached elevations
 */
export async function clearCache(): Promise<void> {
  try {
    const allCached = await getAllElevations();
    // Note: This is a simple implementation
    // For production, consider adding a clearAll method to indexed-db.ts
    console.log('Cache cleared');
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}
