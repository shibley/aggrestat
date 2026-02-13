import Stripe from 'stripe';
import { Plan } from '@/types';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2026-01-28.clover',
    });
  }
  return _stripe;
}

export const stripe = typeof process !== 'undefined' && process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-01-28.clover' })
  : (null as unknown as Stripe);

export const STRIPE_PRICES: Record<Exclude<Plan, 'free'>, string> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID || '',
  growth: process.env.STRIPE_GROWTH_PRICE_ID || '',
};

export async function createCheckoutSession(
  customerId: string,
  plan: Exclude<Plan, 'free'>,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: STRIPE_PRICES[plan], quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session.url || '';
}

export async function createCustomer(email: string, userId: string): Promise<string> {
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });
  return customer.id;
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.cancel(subscriptionId);
}
