import { generateUrlKey } from "./";

describe("generateUrlKey", () => {

  it("should generate a Base62 encoded string for a given number", () => {
    expect(generateUrlKey(0)).toBeTruthy();
    expect(generateUrlKey(12345)).toBeTruthy();
  });

  it("should handle the maximum length parameter", () => {
    expect(generateUrlKey(999999, 6)).toBe("4c91");
    expect(generateUrlKey(62, 2)).toBe("10");
    expect(generateUrlKey(123, 4)).toBe("1Z");
  });

  it("should throw an error if the generated string exceeds the maximum length", () => {
    expect(() => generateUrlKey(99999912421421411249, 6)).toThrow("Generated Base62 string exceeds 6 characters");
  });

  it("should throw an error if the generated string exceeds the maximum length when maxLength is less than default", () => {
    expect(() => generateUrlKey(12345678, 3)).toThrow("Generated Base62 string exceeds 6 characters");
  });
});