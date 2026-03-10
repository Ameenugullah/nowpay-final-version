// ══════════════════════════════════════════════════════════
//  NowPay — constants.js
//  All app-wide constants. API keys come from .env only.
// ══════════════════════════════════════════════════════════

// ── API KEYS (loaded from .env) ────────────────────────────
// Create a .env file (see .env.example) and add your real keys.
// NEVER hardcode secrets here.
export const API_KEYS = {
  PAYSTACK_SECRET: import.meta.env.VITE_PAYSTACK_SECRET_KEY || 'YOUR_PAYSTACK_SECRET_KEY_HERE',
  PAYSTACK_PUBLIC: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'YOUR_PAYSTACK_PUBLIC_KEY_HERE',
  FLUTTERWAVE_SECRET: import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY || 'YOUR_FLUTTERWAVE_SECRET_KEY_HERE',
  FLUTTERWAVE_PUBLIC: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'YOUR_FLUTTERWAVE_PUBLIC_KEY_HERE',
  PAYPAL_CLIENT_ID:  import.meta.env.VITE_PAYPAL_CLIENT_ID  || 'YOUR_PAYPAL_CLIENT_ID_HERE',
  PAYPAL_SECRET:     import.meta.env.VITE_PAYPAL_SECRET      || 'YOUR_PAYPAL_SECRET_HERE',
};

// ── APP CONFIG ─────────────────────────────────────────────
export const APP_CONFIG = {
  NAME:         import.meta.env.VITE_APP_NAME || 'NowPay',
  NGN_PER_USD:  Number(import.meta.env.VITE_NGN_PER_USD) || 1590,
  FEE_RATE:     0.015,   // 1.5% transfer fee
  THEME_KEY:    'nowpay_theme',
};

// ── USER (mock — replace with auth context) ──────────────────
export const CURRENT_USER = {
  name:       'Abdul-malik Aminu',
  firstName:  'Abdul-malik',
  email:      'abdulmalik.aminu@email.com',
  phone:      '+234 080 1234 5678',
  bank:       'Guaranty Trust Bank',
  accountNo:  '0123456789',
  nowpayId:   '@abdulmalik.np',
  avatar:     '/images/profile.jpg',
};

// ── NIGERIAN BANKS ─────────────────────────────────────────
export const NIGERIAN_BANKS = [
  'Access Bank', 'First Bank', 'GTBank', 'Zenith Bank', 'UBA',
  'First City Monument Bank', 'Stanbic IBTC', 'Union Bank',
  'Fidelity Bank', 'Polaris Bank', 'Sterling Bank', 'Wema Bank',
  'Kuda Bank', 'Moniepoint', 'Opay', 'PalmPay',
];

// ── PAYMENT GATEWAYS ───────────────────────────────────────
export const GATEWAYS = [
  { id: 'paystack',    label: 'Paystack',    img: '/images/paystack.png' },
  { id: 'flutterwave', label: 'Flutterwave', img: '/images/flutterwave.jpg' },
  { id: 'paypal',      label: 'PayPal',      img: '/images/paypal.png' },
];

// ── CHART DATA ─────────────────────────────────────────────
export const CHART_DATA = {
  week: {
    labels:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    income:  [80000, 120000, 45000, 95000, 210000, 60000, 140000],
    expense: [30000, 50000,  20000, 75000,  90000, 40000,  55000],
  },
  month: {
    labels:  ['W1', 'W2', 'W3', 'W4'],
    income:  [620000, 480000, 350000, 540000],
    expense: [180000, 120000,  90000, 200000],
  },
  year: {
    labels:  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    income:  [1.2,0.9,1.5,1.1,1.8,1.3,2.0,1.6,1.4,1.9,2.1,1.7].map(v => v * 1_000_000),
    expense: [0.4,0.3,0.6,0.5,0.7,0.4,0.8,0.6,0.5,0.7,0.9,0.6].map(v => v * 1_000_000),
  },
};

// ── INITIAL TRANSACTIONS ───────────────────────────────────
export const INITIAL_TRANSACTIONS = [
  { id:'NP-2025-0021', name:'Yusuf Sale',      bank:'GTBank',     initials:'YS', img:'',             type:'debit',  date:'Mar 9, 2025',  time:'09:41 AM', amount:25000,  status:'completed', cat:'Transfer'   },
  { id:'NP-2025-0020', name:'Salary Credit',   bank:'Payroll',    initials:'SC', img:'',             type:'credit', date:'Mar 9, 2025',  time:'07:00 AM', amount:620000, status:'completed', cat:'Payroll'    },
  { id:'NP-2025-0019', name:'Paystack',        bank:'Merchant',   initials:'PS', img:'paystack.png', type:'debit',  date:'Mar 8, 2025',  time:'04:22 PM', amount:8700,   status:'completed', cat:'Merchant'   },
  { id:"NP-2025-0018", name:"Buhari Rabi'u",   bank:'Access Bank',initials:'BR', img:'',             type:'debit',  date:'Mar 7, 2025',  time:'01:05 PM', amount:50000,  status:'pending',   cat:'Transfer'   },
  { id:'NP-2025-0017', name:'PayPal Cashout',  bank:'PayPal',     initials:'PP', img:'paypal.png',   type:'credit', date:'Mar 6, 2025',  time:'10:30 AM', amount:120000, status:'completed', cat:'Conversion' },
  { id:"NP-2025-0016", name:"Naja'atu Aminu",  bank:'Zenith Bank',initials:'NA', img:'',             type:'credit', date:'Mar 5, 2025',  time:'06:45 PM', amount:75000,  status:'completed', cat:'Transfer'   },
  { id:'NP-2025-0015', name:'Flutterwave',     bank:'Merchant',   initials:'FW', img:'flutterwave.jpg',type:'debit',date:'Mar 4, 2025', time:'09:00 AM', amount:15000,  status:'completed', cat:'Merchant'   },
  { id:'NP-2025-0014', name:'Zayyad Mansur',   bank:'First Bank', initials:'ZM', img:'',             type:'debit',  date:'Mar 3, 2025',  time:'02:20 PM', amount:30000,  status:'failed',    cat:'Transfer'   },
  { id:'NP-2025-0013', name:'Salary Credit',   bank:'Payroll',    initials:'SC', img:'',             type:'credit', date:'Feb 28, 2025', time:'07:00 AM', amount:620000, status:'completed', cat:'Payroll'    },
  { id:'NP-2025-0012', name:'Lukman Aminu',    bank:'UBA',        initials:'LA', img:'',             type:'debit',  date:'Feb 27, 2025', time:'11:15 AM', amount:45000,  status:'completed', cat:'Transfer'   },
];

// ── INITIAL RECIPIENTS ─────────────────────────────────────
export const INITIAL_RECIPIENTS = [
  { id:'rec1', name:'Yusuf Sale',      acct:'0123456789', bank:'GTBank',      img:'/images/user1.jpg' },
  { id:'rec2', name:"Buhari Rabi'u",   acct:'0987654321', bank:'Access Bank', img:'/images/user2.jpg' },
  { id:'rec3', name:"Naja'atu Aminu",  acct:'0567891234', bank:'Zenith Bank', img:'/images/user3.jpg' },
  { id:'rec4', name:'Zayyad Mansur',   acct:'0412345678', bank:'First Bank',  img:'/images/user4.jpg' },
  { id:'rec5', name:'Lukman Aminu',    acct:'0312345678', bank:'UBA',         img:'' },
];

export const INITIAL_BALANCE = 4_820_500.00;
