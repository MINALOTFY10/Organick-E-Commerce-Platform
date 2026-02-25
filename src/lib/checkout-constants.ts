export const SHIPPING_COST_CENTS = 500;

/** Default currency used in Stripe line items */
export const CURRENCY = "usd";

/** Default country for shipping addresses */
export const DEFAULT_COUNTRY = "Egypt";

/** Error codes thrown inside the success-page transaction */
export const CART_EMPTY_ERROR = "CART_EMPTY";
export const STOCK_ERROR_PREFIX = "INSUFFICIENT_STOCK";
export const SHIPPING_ERROR = "MISSING_SHIPPING";

export type CheckoutState = {
  errors?: {
    street?: string[];
    city?: string[];
    postalCode?: string[];
    country?: string[];
    state?: string[];
  };
  message: string;
  success?: boolean;
};
