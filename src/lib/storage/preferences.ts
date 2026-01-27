/**
 * LocalStorage wrapper for user preferences
 */

const STORAGE_PREFIX = 'find-my-elevation:';

export type UnitPreference = 'meters' | 'feet';

/**
 * Get unit preference
 */
export function getUnitPreference(): UnitPreference {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}unit`);
    if (stored === 'meters' || stored === 'feet') {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to get unit preference:', error);
  }
  return 'feet'; // Default
}

/**
 * Set unit preference
 */
export function setUnitPreference(unit: UnitPreference): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}unit`, unit);
  } catch (error) {
    console.warn('Failed to save unit preference:', error);
  }
}

/**
 * Get a generic preference value
 */
export function getPreference(key: string, defaultValue: any = null): any {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn(`Failed to get preference "${key}":`, error);
  }
  return defaultValue;
}

/**
 * Set a generic preference value
 */
export function setPreference(key: string, value: any): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save preference "${key}":`, error);
  }
}

/**
 * Clear all preferences
 */
export function clearPreferences(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear preferences:', error);
  }
}
