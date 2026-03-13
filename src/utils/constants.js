// ══════════════════════════════════════════════════════════
//  NowPay — constants.js (Paystack only)
// ══════════════════════════════════════════════════════════

export const API_KEYS = {
  PAYSTACK_SECRET: import.meta.env.VITE_PAYSTACK_SECRET_KEY || 'YOUR_PAYSTACK_SECRET_KEY_HERE',
  PAYSTACK_PUBLIC: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'YOUR_PAYSTACK_PUBLIC_KEY_HERE',
};

export const APP_CONFIG = {
  NAME:        import.meta.env.VITE_APP_NAME || 'NowPay',
  NGN_PER_USD: Number(import.meta.env.VITE_NGN_PER_USD) || 1590,
  FEE_RATE:    0.015,
  THEME_KEY:   'nowpay_theme',
};

export const CURRENT_USER = {
  name:      'Abdul-malik Aminu',
  firstName: 'Abdul-malik',
  email:     'abdulmalik.aminu@email.com',
  phone:     '+234 080 1234 5678',
  bank:      'Guaranty Trust Bank',
  accountNo: '0123456789',
  nowpayId:  '@abdulmalik.np',
  avatar:    '/images/profile.jpg',
};

export const NIGERIAN_BANKS = [
  'Access Bank', 'Citibank Nigeria', 'Ecobank Nigeria',
  'Fidelity Bank', 'First Bank of Nigeria', 'First City Monument Bank',
  'Guaranty Trust Bank', 'Heritage Bank', 'Keystone Bank',
  'Kuda Bank', 'Moniepoint', 'Opay', 'PalmPay',
  'Polaris Bank', 'Stanbic IBTC Bank', 'Standard Chartered Bank',
  'Sterling Bank', 'Union Bank of Nigeria', 'United Bank for Africa',
  'Unity Bank', 'Wema Bank', 'Zenith Bank',
];

// Paystack only — Flutterwave and PayPal removed
export const GATEWAYS = [
  { id: 'paystack', label: 'Paystack', img: '/images/paystack.png' },
];

export const CHART_DATA = {
  week: {
    labels:  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    income:  [80000,120000,45000,95000,210000,60000,140000],
    expense: [30000,50000,20000,75000,90000,40000,55000],
  },
  month: {
    labels:  ['W1','W2','W3','W4'],
    income:  [620000,480000,350000,540000],
    expense: [180000,120000,90000,200000],
  },
  year: {
    labels:  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    income:  [1.2,0.9,1.5,1.1,1.8,1.3,2.0,1.6,1.4,1.9,2.1,1.7].map(v=>v*1000000),
    expense: [0.4,0.3,0.6,0.5,0.7,0.4,0.8,0.6,0.5,0.7,0.9,0.6].map(v=>v*1000000),
  },
};

export const INITIAL_TRANSACTIONS = [
  { id:'NP-2025-0021', name:'Yusuf Sale',     bank:'Guaranty Trust Bank',    initials:'YS', img:'',            type:'debit',  date:'Mar 9, 2025',  time:'09:41 AM', amount:25000,  status:'completed', cat:'Transfer'  },
  { id:'NP-2025-0020', name:'Salary Credit',  bank:'Payroll',                initials:'SC', img:'',            type:'credit', date:'Mar 9, 2025',  time:'07:00 AM', amount:620000, status:'completed', cat:'Payroll'   },
  { id:'NP-2025-0019', name:'Paystack',       bank:'Merchant',               initials:'PS', img:'paystack.png',type:'debit',  date:'Mar 8, 2025',  time:'04:22 PM', amount:8700,   status:'completed', cat:'Merchant'  },
  { id:'NP-2025-0018', name:"Buhari Rabi'u",  bank:'Access Bank',            initials:'BR', img:'',            type:'debit',  date:'Mar 7, 2025',  time:'01:05 PM', amount:50000,  status:'pending',   cat:'Transfer'  },
  { id:'NP-2025-0016', name:"Naja'atu Aminu", bank:'Zenith Bank',            initials:'NA', img:'',            type:'credit', date:'Mar 5, 2025',  time:'06:45 PM', amount:75000,  status:'completed', cat:'Transfer'  },
  { id:'NP-2025-0014', name:'Zayyad Mansur',  bank:'First Bank of Nigeria',  initials:'ZM', img:'',            type:'debit',  date:'Mar 3, 2025',  time:'02:20 PM', amount:30000,  status:'failed',    cat:'Transfer'  },
  { id:'NP-2025-0013', name:'Salary Credit',  bank:'Payroll',                initials:'SC', img:'',            type:'credit', date:'Feb 28, 2025', time:'07:00 AM', amount:620000, status:'completed', cat:'Payroll'   },
  { id:'NP-2025-0012', name:'Lukman Aminu',   bank:'United Bank for Africa', initials:'LA', img:'',            type:'debit',  date:'Feb 27, 2025', time:'11:15 AM', amount:45000,  status:'completed', cat:'Transfer'  },
];

export const INITIAL_RECIPIENTS = [
  { id:'rec1', name:'Yusuf Sale',       acct:'0123456789', bank:'Guaranty Trust Bank',    img:'' },
  { id:'rec2', name:"Buhari Rabi'u",    acct:'0987654321', bank:'Access Bank',            img:'' },
  { id:'rec3', name:"Naja'atu Aminu",   acct:'0567891234', bank:'Zenith Bank',            img:'' },
  { id:'rec4', name:'Zayyad Mansur',    acct:'0412345678', bank:'First Bank of Nigeria',  img:'' },
  { id:'rec5', name:'Lukman Aminu',     acct:'0312345678', bank:'United Bank for Africa', img:'' },
];

export const INITIAL_BALANCE = 4820500.00;
