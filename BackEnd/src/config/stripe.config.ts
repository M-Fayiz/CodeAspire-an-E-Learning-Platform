import Stripe from 'stripe';
import { env } from './env.config';
const stripe = new Stripe(env.STRIPE_SECRETE_KEY as string);

export default stripe;