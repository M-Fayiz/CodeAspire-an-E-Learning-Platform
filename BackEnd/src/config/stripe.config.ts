import Stripe from "stripe";
import { env } from "./env.config";

let stripe: Stripe | null = null;

if (env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(env.STRIPE_SECRET_KEY);
} else {
  console.warn("⚠️ Stripe disabled: missing STRIPE_SECRET_KEY");
}

export { stripe };
