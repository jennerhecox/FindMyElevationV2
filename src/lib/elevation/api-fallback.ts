/**
 * Network-based elevation API fallback
 * Uses Open-Meteo Elevation API (free, no API key required)
 */

export interface APIElevationResult {
  elevation: number; // in meters
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  source: 'api';
  timestamp: number;
}

/**
 * Fetch elevation from Open-Meteo Elevation API
 * Free service, no API key required
 * https://open-meteo.com/en/docs/elevation-api
 */
export async function fetchElevationFromAPI(
  latitude: number,
  longitude: number
): Promise<APIElevationResult | null> {
  const timeout = 5000; // 5 second timeout

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const url = `https://api.open-meteo.com/v1/elevation?latitude=${latitude}&longitude=${longitude}`;

    console.log('Fetching elevation from API:', url);

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    // Open-Meteo returns elevation array (we only request one point)
    if (data.elevation && Array.isArray(data.elevation) && data.elevation.length > 0) {
      const elevation = data.elevation[0];

      console.log('API elevation result:', elevation);

      return {
        elevation,
        latitude,
        longitude,
        accuracy: 10, // API-based elevation is generally accurate to ~10m
        source: 'api',
        timestamp: Date.now(),
      };
    }

    console.warn('API returned unexpected data:', data);
    return null;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn('API request timed out after', timeout, 'ms');
    } else {
      console.error('API request failed:', error);
    }
    return null;
  }
}

/**
 * Alternative: USGS Elevation Point Query Service (US only)
 * Keeping this as a backup option
 */
export async function fetchElevationFromUSGS(
  latitude: number,
  longitude: number
): Promise<APIElevationResult | null> {
  const timeout = 5000;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const url = `https://epqs.nationalmap.gov/v1/json?x=${longitude}&y=${latitude}&units=Meters&wkid=4326`;

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.value !== undefined && data.value !== null) {
      return {
        elevation: parseFloat(data.value),
        latitude,
        longitude,
        accuracy: 10,
        source: 'api',
        timestamp: Date.now(),
      };
    }

    return null;

  } catch (error) {
    console.error('USGS API request failed:', error);
    return null;
  }
}
