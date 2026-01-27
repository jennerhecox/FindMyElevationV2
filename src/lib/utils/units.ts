/**
 * Unit conversion utilities for elevation measurements
 */

const METERS_TO_FEET = 3.28084;

/**
 * Convert meters to feet
 */
export function metersToFeet(meters: number): number {
  return meters * METERS_TO_FEET;
}

/**
 * Convert feet to meters
 */
export function feetToMeters(feet: number): number {
  return feet / METERS_TO_FEET;
}

/**
 * Format elevation value with appropriate precision
 */
export function formatElevation(value: number, decimals: number = 0): string {
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
