import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Initialize Supabase client (fall back to VITE var when appropriate)
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY || ''
);

class PaymentService {
  // Create or retrieve Stripe customer for user
  async getOrCreateCustomer(userId, email) {
    // Check if user already has a Stripe customer ID
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profile && profile.stripe_customer_id) {
      return profile.stripe_customer_id;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: { userId }
    });

    // Update user profile with Stripe customer ID
    await supabase
      .from('user_profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', userId);

    return customer.id;
  }

  // Create payment intent for ride booking
  async createPaymentIntent(userId, rideId, amount, currency = 'inr') {
    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    // Get or create Stripe customer
    const customerId = await this.getOrCreateCustomer(userId, profile.email);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      metadata: {
        userId,
        rideId
      }
    });

    // Create payment transaction record
    await supabase.from('payment_transactions').insert({
      user_id: userId,
      ride_id: rideId,
      amount,
      currency,
      status: 'pending',
      stripe_payment_intent_id: paymentIntent.id
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  }

  // Handle successful payment
  async handlePaymentSuccess(paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const { userId, rideId } = paymentIntent.metadata || {};

    // Update payment transaction status
    await supabase
      .from('payment_transactions')
      .update({
        status: 'completed',
        stripe_payment_method: paymentIntent.payment_method
      })
      .eq('stripe_payment_intent_id', paymentIntentId);

    // Update ride participant status
    await supabase
      .from('ride_participants')
      .update({
        paid: true,
        amount_paid: paymentIntent.amount,
        payment_intent_id: paymentIntentId
      })
      .eq('user_id', userId)
      .eq('ride_id', rideId);
  }
}

export const paymentService = new PaymentService();