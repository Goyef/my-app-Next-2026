import Stripe from 'stripe';

if (!process.env.sk_test) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.sk_test, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});