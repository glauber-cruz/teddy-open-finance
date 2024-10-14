import { passwordValidation } from "./";

describe("passwordValidation", () => {
  
  test("returns false for empty password", () => {
    expect(passwordValidation("")).toBe(false);
  });

  test("returns false for password without uppercase letter", () => {
    expect(passwordValidation("lowercase1!")).toBe(false);
  });

  test("returns false for password without lowercase letter", () => {
    expect(passwordValidation("UPPERCASE1!")).toBe(false);
  });

  test("returns false for password without number", () => {
    expect(passwordValidation("NoNumber!")).toBe(false);
  });

  test("returns false for password without special character", () => {
    expect(passwordValidation("NoSpecialChar1")).toBe(false);
  });

  test("returns false for password shorter than 8 characters", () => {
    expect(passwordValidation("Short1!")).toBe(false);
  });

  test("returns true for valid password", () => {
    expect(passwordValidation("Valid1Password!")).toBe(true);
  });
});