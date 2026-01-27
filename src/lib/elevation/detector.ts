/**
 * Core elevation detection with priority cascade
 */

import type { GPSElevationResult } from './gps-altitude';
import { getGPSAltitude, requestLocationPermission } from './gps-altitude';
import { getCachedElevation, cacheElevation } from './cache-manager';
import { fetchElevationFromAPI } from './api-fallback';

export interface ElevationResult {
  elevation: number; // in meters
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  source: 'gps' | 'api' | 'cache';
  timestamp: number;
  cached?: boolean; // true if from cache
}

export interface ElevationError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'NOT_SUPPORTED' | 'UNKNOWN';
  message: string;
}

/**
 * Main elevation detection function
 * Implements priority cascade: GPS → Cache → API (future)
 */
export async function getElevation(): Promise<ElevationResult> {
  try {
    // Step 1: Request location permission
    const position = await requestLocationPermission();
    const { latitude, longitude } = position.coords;

    // Step 2: Try GPS altitude (fastest if available)
    const gpsElevation = await getGPSAltitude();

    if (gpsElevation && gpsElevation.accuracy < 50) {
      // Good GPS altitude available
      console.log('Using GPS altitude:', gpsElevation);

      // Cache it for future offline use
      await cacheElevation({
        elevation: gpsElevation.elevation,
        latitude: gpsElevation.latitude,
        longitude: gpsElevation.longitude,
        accuracy: gpsElevation.accuracy,
        source: 'gps',
      });

      return {
        ...gpsElevation,
        cached: false,
      };
    }

    // Step 3: Check cache (works offline)
    const cached = await getCachedElevation(latitude, longitude);

    if (cached) {
      console.log('Using cached elevation:', cached);
      return {
        elevation: cached.elevation,
        latitude: cached.latitude,
        longitude: cached.longitude,
        accuracy: cached.accuracy,
        source: 'cache',
        timestamp: cached.timestamp,
        cached: true,
      };
    }

    // Step 4: Network API fallback (uses lat/lng to get elevation)
    console.log('Attempting to fetch elevation from API...');
    const apiElevation = await fetchElevationFromAPI(latitude, longitude);

    if (apiElevation) {
      console.log('Using API elevation:', apiElevation);

      // Cache it for future offline use
      await cacheElevation({
        elevation: apiElevation.elevation,
        latitude: apiElevation.latitude,
        longitude: apiElevation.longitude,
        accuracy: apiElevation.accuracy,
        source: 'api',
      });

      return {
        ...apiElevation,
        cached: false,
      };
    }

    // If all methods fail, throw error
    throw new Error('Unable to determine elevation. Please check your internet connection and try again.');

  } catch (error: any) {
    console.error('Elevation detection error:', error);
    throw error;
  }
}

/**
 * Get elevation with detailed status updates
 * Useful for UI progress indication
 */
export async function getElevationWithProgress(
  onProgress: (status: string) => void
): Promise<ElevationResult> {
  onProgress('Requesting location permission...');

  try {
    const position = await requestLocationPermission();
    const { latitude, longitude } = position.coords;

    onProgress('Location acquired. Detecting elevation...');

    // Try GPS altitude
    const gpsElevation = await getGPSAltitude();

    if (gpsElevation && gpsElevation.accuracy < 50) {
      onProgress('GPS altitude detected!');

      await cacheElevation({
        elevation: gpsElevation.elevation,
        latitude: gpsElevation.latitude,
        longitude: gpsElevation.longitude,
        accuracy: gpsElevation.accuracy,
        source: 'gps',
      });

      return {
        ...gpsElevation,
        cached: false,
      };
    }

    onProgress('Checking cached data...');

    const cached = await getCachedElevation(latitude, longitude);

    if (cached) {
      onProgress('Using cached elevation data');
      return {
        elevation: cached.elevation,
        latitude: cached.latitude,
        longitude: cached.longitude,
        accuracy: cached.accuracy,
        source: 'cache',
        timestamp: cached.timestamp,
        cached: true,
      };
    }

    // Step 4: Network API
    onProgress('Fetching elevation from network...');
    const apiElevation = await fetchElevationFromAPI(latitude, longitude);

    if (apiElevation) {
      onProgress('Elevation retrieved from API');

      await cacheElevation({
        elevation: apiElevation.elevation,
        latitude: apiElevation.latitude,
        longitude: apiElevation.longitude,
        accuracy: apiElevation.accuracy,
        source: 'api',
      });

      return {
        ...apiElevation,
        cached: false,
      };
    }

    onProgress('Unable to determine elevation');
    throw new Error('Unable to determine elevation. Please check your internet connection and try again.');

  } catch (error: any) {
    console.error('Elevation detection error:', error);
    throw error;
  }
}

/**
 * Validate elevation result
 */
export function isValidElevation(result: ElevationResult): boolean {
  // Validate elevation is within reasonable range
  // (Dead Sea is lowest at -430m, Everest is highest at 8,849m)
  if (result.elevation < -500 || result.elevation > 9000) {
    return false;
  }

  // Validate coordinates
  if (
    result.latitude < -90 ||
    result.latitude > 90 ||
    result.longitude < -180 ||
    result.longitude > 180
  ) {
    return false;
  }

  return true;
}
