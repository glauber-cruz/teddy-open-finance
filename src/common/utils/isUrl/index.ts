/**
 * Checks if the provided string is a valid URL.
 * 
 * @param {string} url - The URL to be validated.
 * @returns {boolean} Returns true if the URL is valid, otherwise false.
 */
export function isUrl(url:string) {
  try {
    new URL(url);
    return true;
  } 
  catch {
    return false;
  }
}