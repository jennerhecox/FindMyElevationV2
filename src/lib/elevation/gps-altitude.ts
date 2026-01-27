/**
 * GPS altitude extraction from device sensors
 */

export interface GPSElevationResult {
  elevation: number; // in meters
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  source: 'gps';
  timestamp: number;
}

export interface GPSError {
  code: number;
  message: string;
}

/**
 * Get GPS-based altitude from device
 * Returns null if altitude is not available
 */
export async function getGPSAltitude(): Promise<GPSElevationResult | null> {
  if (!navigator.geolocation) {
    console.warn('Geolocation not supported');
    return null;
  }

  return new Promise((resolve) => {
    const options: PositionOptions = {
      enableHighAccuracy: true, // Request GPS if available
      timeout: 10000, // 10 second timeout
      maximumAge: 0, // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { coords } = position;

        // Check if altitude is available
        if (coords.altitude === null || coords.altitude === undefined) {
          console.log('GPS altitude not available from device');
          resolve(null);
          return;
        }

        // Altitude accuracy might not be available on all devices
        const accuracy = coords.altitudeAccuracy || 50; // Default to 50m if not available

        resolve({
          elevation: coords.altitude,
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy,
          source: 'gps',
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.warn('GPS position error:', error.message);
        resolve(null);
      },
      options
    );
  });
}

/**
 * Request location permission from user
 */
export async function requestLocationPermission(): Promise<GeolocationPosition> {
  if (!navigator.geolocation) {
    throw new Error('Geolocation not supported by this browser');
  }

  return new Promise((resolve, reject) => {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000, // 15 second timeout
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        let message = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable. Please check your device settings.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
        }
        reject(new Error(message));
      },
      options
    );
  });
}

/**
 * Check if geolocation permission is granted
 */
export async function checkLocationPermission(): Promise<'granted' | 'denied' | 'prompt'> {
  if (!navigator.permissions) {
    return 'prompt';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch (error) {
    console.warn('Failed to query location permission:', error);
    return 'prompt';
  }
}
