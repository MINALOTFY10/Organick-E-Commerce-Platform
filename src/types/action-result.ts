/**
 * Standardized return type for all server action mutations.
 *
 * - `success: true`  → operation completed; `data` may carry a payload.
 * - `success: false` → operation failed; `message` explains why,
 *                       `errors` may hold field-level validation details.
 */
export type ActionResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};
