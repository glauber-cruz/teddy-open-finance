import { compare, genHash } from ".";

describe("Hashing functions", () => {

  describe("genHash", () => {
    it("should generate a hash and salt", async () => {
      const text = "password";
      const result = await genHash(text, 10);

      expect(result).toHaveProperty("hash");
      expect(result).toHaveProperty("salt");

      expect(result.hash).toBeDefined();
      expect(result.salt).toBeDefined();

      expect(result.hash).not.toBe(text);
    });
  });


  describe("compare", () => {
    it("should return true if the text matches the hash", async () => {
      const plainText = "password";
      const { hash, salt } = await genHash(plainText, 10);

      const isMatch = await compare(plainText, hash, salt);
      expect(isMatch).toBe(true);
    });

    it("should return false if the text does not match the hash", async () => {
      const plainText = "password";
      const wrongText = "wrongPassword";

      const { hash, salt } = await genHash(plainText, 10);
      const isMatch = await compare(wrongText, hash, salt);

      expect(isMatch).toBe(false);
    });
  });
});