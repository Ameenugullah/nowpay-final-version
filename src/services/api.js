// ══════════════════════════════════════════════════════════
//  NowPay — services/api.js
//
//  Payment gateway API integration layer.
//  ──────────────────────────────────────────────────────
//  HOW TO ADD YOUR API KEYS:
//  1. Copy .env.example → .env
//  2. Fill in your real keys in .env
//  3. Keys are auto-loaded from import.meta.env
//
//  NEVER hardcode secret keys in this file.
//  NEVER commit .env to version control.
// ══════════════════════════════════════════════════════════

import { API_KEYS, APP_CONFIG } from '@/utils/constants';

// ── API KEY PLACEHOLDER SECTION ──────────────────────────
// Replace these placeholders by setting your .env variables:
//   VITE_PAYSTACK_SECRET_KEY=sk_live_xxxx
//   VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxx
//   VITE_FLUTTERWAVE_SECRET_KEY=FLWSECK_xxxx
//   VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_xxxx
//   VITE_PAYPAL_CLIENT_ID=xxxx
//   VITE_PAYPAL_SECRET=xxxx

const PAYSTACK_BASE    = 'https://api.paystack.co';
const FLUTTERWAVE_BASE = 'https://api.flutterwave.com/v3';

// ── HELPER ────────────────────────────────────────────────
const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
};

// ── PAYSTACK ──────────────────────────────────────────────

/**
 * Initialize a Paystack transaction.
 * @param {object} params - { email, amount_kobo, reference, metadata }
 */
export const paystackInitialize = async ({ email, amount_kobo, reference, metadata = {} }) => {
  // NOTE: In production, this call MUST be made from your backend to protect your secret key.
  // This is a client-side demo — replace with a backend proxy endpoint.
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEYS.PAYSTACK_SECRET}`,
    },
    body: JSON.stringify({ email, amount: amount_kobo, reference, metadata }),
  });
  return handleResponse(res);
};

/**
 * Verify a Paystack transaction by reference.
 */
export const paystackVerify = async (reference) => {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${API_KEYS.PAYSTACK_SECRET}` },
  });
  return handleResponse(res);
};

// ── FLUTTERWAVE ───────────────────────────────────────────

/**
 * Initiate a Flutterwave transfer.
 * @param {object} params - { account_bank, account_number, amount, currency, narration }
 */
export const flutterwaveTransfer = async (params) => {
  const res = await fetch(`${FLUTTERWAVE_BASE}/transfers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEYS.FLUTTERWAVE_SECRET}`,
    },
    body: JSON.stringify({ currency: 'NGN', ...params }),
  });
  return handleResponse(res);
};

// ── MOCK GATEWAY (Development / Demo) ─────────────────────

/**
 * Simulated transaction for demo/testing without real API keys.
 * Returns a mock success response after a short delay.
 */
export const mockTransaction = async ({ amount, recipient, method }) => {
  await new Promise((r) => setTimeout(r, 1200));  // simulate network delay
  const isSuccess = Math.random() > 0.05;          // 95% success rate in mock
  if (!isSuccess) throw new Error('Transaction declined (mock)');
  return {
    status:    'success',
    reference: 'NP-MOCK-' + Date.now(),
    amount,
    recipient,
    method,
    timestamp: new Date().toISOString(),
  };
};

// ── CURRENCY CONVERSION ──────────────────────────────────

/** Convert NGN → USD */
export const toUSD = (ngn) => ngn / APP_CONFIG.NGN_PER_USD;

/** Convert USD → NGN */
export const toNGN = (usd) => usd * APP_CONFIG.NGN_PER_USD;

/** Calculate transfer fee */
export const calcFee = (amount) => ({
  amount,
  fee:   amount * APP_CONFIG.FEE_RATE,
  total: amount * (1 + APP_CONFIG.FEE_RATE),
});
