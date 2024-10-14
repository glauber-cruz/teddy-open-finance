import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export function passwordValidation(password:string) {
  if(!password) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);

  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isValidLength = password.length >= 8;
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength;
}

@ValidatorConstraint({ async: false })
export class IsPasswordSecureConstraint implements ValidatorConstraintInterface {
  
  validate(password: string) {
    return passwordValidation(password);
  }

  defaultMessage() {
    return "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters";
  }
}

/**
 * Decorator to validate if a password is secure.
 * 
 * @param {ValidationOptions} [validationOptions] - Optional validation options.
 * @returns {(object: object, propertyName: string) => void} A function that registers the decorator.
 */
export function IsPasswordSafe(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordSecureConstraint,
    });
  };
}