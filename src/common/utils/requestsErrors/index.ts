import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException, InternalServerErrorException } from "@nestjs/common";

/**
 * Throws a BadRequestException with the provided message and optional field.
 * 
 * @param {string} message - The error message.
 * @param {string} [field=""] - The field related to the error. Defaults to an empty string.
 * @returns {BadRequestException} A BadRequestException with the provided message and field.
 */
export function badRequestError(message:string, field="") {
  return new BadRequestException([ {
    field,
    message
  } ]);
}

/**
 * Throws an UnauthorizedException with the provided message and optional field.
 * 
 * @param {string} message - The error message.
 * @param {string} [field=""] - The field related to the error. Defaults to an empty string.
 * @returns {UnauthorizedException} An UnauthorizedException with the provided message and field.
 */
export function unauthorizedError(message:string, field="") {
  return new UnauthorizedException([ {
    field,
    message
  } ]);
}

/**
 * Throws a ForbiddenException with the provided message and optional field.
 * 
 * @param {string} message - The error message.
 * @param {string} [field=""] - The field related to the error. Defaults to an empty string.
 * @returns {ForbiddenException} A ForbiddenException with the provided message and field.
 */
export function forbiddenError(message:string, field="") {
  return new ForbiddenException([ {
    field,
    message
  } ]);
}

/**
 * Throws a NotFoundException with the provided message.
 * 
 * @param {string} message - The error message.
 * @returns {NotFoundException} A NotFoundException with the provided message.
 */
export function notFoundError(message:string) {
  return new NotFoundException([ {
    message
  } ]);
}

/**
 * Throws an InternalServerErrorException with the provided message.
 * 
 * @param {string} message - The error message.
 * @returns {InternalServerErrorException} An InternalServerErrorException with the provided message.
 */
export function internalServerErrorException(message:string) {
  return new InternalServerErrorException([ {
    message
  } ]);
}