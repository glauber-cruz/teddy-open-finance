/**
 * Checks if a string is a numeric string.
 * 
 * @param {string} input - The string to be checked.
 * @returns {boolean} True if the string is a numeric string, false otherwise.
 */
export function isNumericString(input: string) {
  const regex = /^\d+$/;
  return regex.test(input);
}