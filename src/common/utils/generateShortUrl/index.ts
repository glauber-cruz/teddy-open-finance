/**
 * Generates a short URL using the provided key.
 * 
 * @param {string} key - The key to be used in the short URL.
 * @returns {string} The generated short URL.
 */
export function generateShortUrl(key:string) {
  return `${process.env.URL}/${key}`;
}