import { isNumericString } from "./";

describe("isNumericString", () => {

  it("should return true for valid numeric strings", () => {
    expect(isNumericString("123")).toBe(true);
    expect(isNumericString("0")).toBe(true);
    expect(isNumericString("9876543210")).toBe(true);
  });

  it("should return false for invalid numeric strings", () => {
    expect(isNumericString("abc")).toBe(false);
    expect(isNumericString("123abc")).toBe(false);

    expect(isNumericString("1.23")).toBe(false);
    expect(isNumericString("-123")).toBe(false);

    expect(isNumericString(" ")).toBe(false);
    expect(isNumericString("")).toBe(false);
  });

  it("should return false for strings with special characters", () => {
    expect(isNumericString("123!")).toBe(false);
    expect(isNumericString("12#34")).toBe(false);
    expect(isNumericString("$%^&")).toBe(false);
  });
});