import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY. Set it in your environment to enable Stripe Checkout.");
}

export const stripe = new Stripe(secretKey);
