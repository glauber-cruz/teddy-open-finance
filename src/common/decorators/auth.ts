import { SetMetadata } from "@nestjs/common";

/**
 * Decorator to set metadata for authentication.
 * 
 * @param {boolean} [authRequired=true] - Whether authentication is required or not.
 * @returns {Function} A function that sets metadata for authentication.
 */
export const Auth = (authRequired: boolean = true) => SetMetadata("auth", authRequired);