/**
 * Generates a Base62 encoded string from a given number, with an optional maximum length.
 * 
 * @param {number} num - The number to be encoded.
 * @param {number} [maxLength=6] - The maximum length of the generated Base62 string. Defaults to 6.
 * @returns {string} The Base62 encoded string.
 * @throws {Error} If the generated Base62 string exceeds the specified maximum length.
 */
export function generateUrlKey(num: number, maxLength = 6) {
  const BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  if (num === 0) return "0";
  let base62String = "";

  while (num > 0) {
    const remainder = num % 62;
    base62String = BASE62_CHARS[remainder] + base62String;
    num = Math.floor(num / 62);
  }

  if (base62String.length > maxLength) {
    throw new Error("Generated Base62 string exceeds 6 characters");
  }

  return base62String;
}