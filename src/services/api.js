// ══════════════════════════════════════════════════════════
//  NowPay — services/api.js  (Paystack only)
//
//  HOW TO ADD YOUR API KEY:
//  1. Copy .env.example → .env
//  2. Set VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxx
//  3. Keys auto-load from import.meta.env
// ══════════════════════════════════════════════════════════

import { API_KEYS, APP_CONFIG } from '@/utils/constants';

const PAYSTACK_BASE = 'https://api.paystack.co';

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
};

export const paystackInitialize = async ({ email, amount_kobo, reference, metadata = {} }) => {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEYS.PAYSTACK_SECRET}` },
    body: JSON.stringify({ email, amount: amount_kobo, reference, metadata }),
  });
  return handleResponse(res);
};

export const paystackVerify = async (reference) => {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${API_KEYS.PAYSTACK_SECRET}` },
  });
  return handleResponse(res);
};

// Pool of plausible Nigerian names for unknown accounts
const MOCK_ACCOUNT_NAMES = [
  'Amina Suleiman', 'Ibrahim Musa', 'Fatima Al-Hassan',
  'Usman Bello', 'Aisha Yusuf', 'Musa Abdullahi',
  'Halima Garba', 'Sani Danladi', 'Khadijah Mohammed',
  'Tunde Adeyemi', 'Ngozi Okafor', 'Emeka Eze',
];

/**
 * Simulate fetching an account name from Paystack bank resolve.
 * Production endpoint: POST /bank/resolve { account_number, bank_code }
 */
export const resolveAccountName = async (accountNumber, bankName, knownRecipients = []) => {
  await new Promise((r) => setTimeout(r, 1200));

  const match = knownRecipients.find(
    (r) => r.acct === accountNumber && r.bank === bankName
  );
  if (match) return { name: match.name, matched: true };

  const acctMatch = knownRecipients.find((r) => r.acct === accountNumber);
  if (acctMatch) return { name: acctMatch.name, matched: true };

  const idx = parseInt(accountNumber.slice(-2), 10) % MOCK_ACCOUNT_NAMES.length;
  return { name: MOCK_ACCOUNT_NAMES[idx], matched: false };
};

export const mockTransaction = async ({ amount, recipient, method = 'paystack' }) => {
  await new Promise((r) => setTimeout(r, 1400));
  const success = Math.random() > 0.04;
  if (!success) throw new Error('Transaction declined by bank');
  return {
    status: 'success',
    reference: 'NP-PS-' + Date.now(),
    amount, recipient, method,
    timestamp: new Date().toISOString(),
  };
};

export const toUSD  = (ngn) => ngn / APP_CONFIG.NGN_PER_USD;
export const toNGN  = (usd) => usd * APP_CONFIG.NGN_PER_USD;

export const calcFee = (amount) => {
  const fee   = amount * APP_CONFIG.FEE_RATE;
  const total = amount + fee;
  return { amount, fee, total };
};
