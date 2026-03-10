// ══════════════════════════════════════════════════════════
//  NowPay — formatters.js
//  Pure utility functions for number/date formatting
// ══════════════════════════════════════════════════════════

/** Format as Nigerian Naira with 2 decimal places */
export const fmtNGN = (n) =>
  Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Format as USD with 2 decimal places */
export const fmtUSD = (n) =>
  Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Compact thousands: 620000 → "620k", 1500000 → "1.5M" */
export const fmtCompact = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'k';
  return String(n);
};

/** Capitalize first letter */
export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Get initials from full name */
export const initials = (name) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

/** Generate a NowPay transaction reference */
export const genRef = () => 'NP-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);

/** Today's date string: "Mar 10, 2025" */
export const todayStr = () =>
  new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** Current time string: "09:41 AM" */
export const nowTime = () =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

/** Safe copy to clipboard */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  }
};
