/**
 * Error codes for App Cards operations.
 *
 * These codes are aligned with the native SDK error codes on both Android and iOS:
 * - Android: AppCardsException.AppCardsExceptionCode
 * - iOS: InsiderAppCardsErrorCode
 *
 * @readonly
 * @enum {string}
 */
export declare const InsiderAppCardsErrorCode: {
  /** An unknown or unexpected error occurred. */
  readonly UNKNOWN: 'unknown';
  /** The Insider SDK is not initialized, frozen, or not GDPR compliant. */
  readonly SDK_NOT_INITIALIZED: 'sdkNotInitialized';
  /** An invalid parameter was provided (e.g., empty or null IDs). */
  readonly INVALID_PARAMETER: 'invalidParameter';
  /** A network error occurred during the request. */
  readonly NETWORK_ERROR: 'networkError';
  /** The server returned an error response. */
  readonly SERVER_ERROR: 'serverError';
  /** The server response could not be parsed. */
  readonly PARSE_ERROR: 'parseError';
};

/** Union type of all possible error code values. */
export type InsiderAppCardsErrorCodeType = typeof InsiderAppCardsErrorCode[keyof typeof InsiderAppCardsErrorCode];

/**
 * Represents a typed error from an App Cards operation.
 *
 * Extends the standard Error class with a structured error code
 * that maps to the native SDK error codes on both Android and iOS.
 *
 * @example
 * ```typescript
 * try {
 *   const response = await Insider.appCards.getCampaigns();
 * } catch (error) {
 *   if (error instanceof InsiderAppCardsError) {
 *     switch (error.code) {
 *       case InsiderAppCardsErrorCode.NETWORK_ERROR:
 *         console.log('Network issue, please try again');
 *         break;
 *       case InsiderAppCardsErrorCode.SDK_NOT_INITIALIZED:
 *         console.log('SDK not ready');
 *         break;
 *       default:
 *         console.log('Error:', error.code, error.message);
 *     }
 *   }
 * }
 * ```
 */
export class InsiderAppCardsError extends Error {
  /** The name of the error, always 'InsiderAppCardsError'. */
  readonly name: 'InsiderAppCardsError';

  /** The error code identifying the type of error. */
  readonly code: InsiderAppCardsErrorCodeType;

  /**
   * @param code - One of InsiderAppCardsErrorCode values.
   * @param message - A human-readable error description.
   */
  constructor(code: InsiderAppCardsErrorCodeType, message: string);

  /**
   * Creates an InsiderAppCardsError from a native bridge error response.
   *
   * @param error - The error from the native bridge, either a structured object or a plain string.
   * @returns A new InsiderAppCardsError instance.
   */
  static from(error: { code: string; message: string } | string | unknown): InsiderAppCardsError;
}
