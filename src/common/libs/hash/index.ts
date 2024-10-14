import * as bcrypt from "bcrypt";

/**
 * Hashes a password using bcrypt.
 * 
 * @param {string} text - The text to be hashed.
 * @param {number} [rounds=10] - Optional number of salt rounds to use. Default is 10.
 * @returns {Promise<{ hash: string, salt: string }>} A promise that resolves to an object containing the hashed text and the salt.
 */
export const genHash = async (text: string, rounds: number = 10): Promise<{ hash: string, salt: string }> => {
  const salt = await bcrypt.genSalt(rounds);
  const hash = await bcrypt.hash(text, salt);
  return { hash, salt };
};

/**
 * Compares a text with a hash to check if they match.
 * 
 * @param {string} password - The text to compare.
 * @param {string} hash - The hash to compare against.
 * @param {string} salt - The salt used to hash the original password.
 * @returns {Promise<boolean>} A promise that resolves to true if the password matches the hash, false otherwise.
 */
export const compare = async (planText: string, hash: string, salt: string): Promise<boolean> => {
  const hashedText = await bcrypt.hash(planText, salt); // Hash the input text with the provided salt
  return hashedText === hash; // Compare the newly hashed text with the stored hash
};