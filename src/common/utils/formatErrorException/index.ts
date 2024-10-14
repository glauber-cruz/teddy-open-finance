import { BadRequestException } from "@nestjs/common";
import { ValidationError } from "class-validator";

/**
 * Formats validation errors into a more readable format for error responses.
 * 
 * @param {ValidationError[]} errors - An array of validation errors.
 * @returns {BadRequestException} A BadRequestException with formatted error messages.
 */
export function formatErrorException(errors:ValidationError[]) {

  const result = errors.map((error) => { 
    const constraints = error.constraints;

    if(!constraints) return {
      property: error.property,
      message: "",
    };

    let errorMessage = "";
    const constraintKeys = Object.keys(constraints);
    
    const lastKey = constraintKeys[constraintKeys.length - 1];
    errorMessage = constraints[lastKey];
    
    return {
      field: error.property,
      message: errorMessage,
    };
  });
  
  return new BadRequestException(result);
}