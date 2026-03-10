# NowPay Wallet v3.0 — React Edition

> A modern fintech digital wallet for **Abdul-malik Aminu**  
> Built with React 18 + Vite + TailwindCSS + Chart.js

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Set up your API keys
cp .env.example .env
# Then edit .env with your real keys

# 3. Start dev server
npm start          # or: npm run dev
# → http://localhost:3000

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

---

## 🔑 API Key Setup

**Never hardcode secrets in source code.** Use environment variables:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env`:
```env
VITE_PAYSTACK_SECRET_KEY=sk_live_your_key_here
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_key_here
VITE_FLUTTERWAVE_SECRET_KEY=FLWSECK_your_key_here
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_your_key_here
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_PAYPAL_SECRET=your_paypal_secret
```

> All keys also have in-app UI under **Settings → API Key Configuration**.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/
│   │   └── AnalyticsChart.jsx    # Chart.js line chart (week/month/year)
│   ├── layout/
│   │   ├── Sidebar.jsx           # Desktop sidebar navigation
│   │   ├── TopBar.jsx            # Sticky header + theme toggle
│   │   └── MobileNav.jsx         # Bottom nav for mobile
│   ├── ui/
│   │   ├── Avatar.jsx            # Smart avatar (photo/initials/logo)
│   │   ├── Modal.jsx             # Accessible animated modal
│   │   ├── Toggle.jsx            # Animated toggle switch
│   │   └── StatusBadge.jsx       # Status/type badges
│   └── wallet/
│       ├── BalanceCard.jsx       # Balance display with hide toggle
│       ├── VirtualCard.jsx       # Payment card UI
│       └── TransactionRow.jsx    # Tx row + detail modal
├── context/
│   ├── ThemeContext.jsx          # Light/dark mode + localStorage
│   ├── WalletContext.jsx         # Balance, transactions, recipients
│   └── ToastContext.jsx          # Toast notification system
├── hooks/
│   ├── useTransaction.js         # Transaction processing logic
│   └── useQR.js                  # Canvas QR code generator
├── pages/
│   ├── Dashboard.jsx             # Home: balance, cards, chart, quick transfer
│   ├── Transactions.jsx          # Filterable tx history (table + mobile cards)
│   ├── SendMoney.jsx             # Send with new recipient form + confirm flow
│   ├── Receive.jsx               # QR code + account details + converter
│   └── Settings.jsx              # Profile, theme, API keys, notifications
├── services/
│   └── api.js                    # Payment gateway integration layer
├── styles/
│   └── globals.css               # CSS design tokens + Tailwind base
└── utils/
    ├── constants.js              # App-wide data and config
    └── formatters.js             # Number/date/string utilities
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **5 Pages** | Dashboard · Transactions · Send · Receive · Settings |
| **Dark / Light Mode** | Toggle in topbar or Settings; persisted to `localStorage` |
| **Send to New Recipient** | Inline form: name, 10-digit account, bank (16 Nigerian banks), phone |
| **Transaction Processing** | Mock gateway (swap for Paystack/Flutterwave in production) |
| **Live Balance** | Updates instantly after each send |
| **Tx History** | Filterable (All/Credits/Debits/Pending/Failed), detail modal |
| **Analytics Chart** | Week/Month/Year with Chart.js |
| **Virtual Cards** | Two gradient card variants |
| **QR Code** | Canvas-drawn with NowPay centre logo |
| **Currency Converter** | Live NGN ↔ USD bidirectional |
| **API Key Manager** | Paystack · Flutterwave · PayPal with show/copy/revoke |
| **Notifications** | Toggle settings for 4 notification types |
| **Responsive** | Desktop sidebar → tablet → mobile bottom nav |
| **Toast System** | Coloured success/error/info toasts |

---

## 💸 New Transaction — Flow

1. Go to **Send Money**
2. Choose an existing recipient **or** click **Add New Recipient** and fill:
   - Full Name (required)
   - Account Number — 10 digits (required)  
   - Bank — dropdown of 16 Nigerian banks (required)
   - Phone — optional
3. Click **Save & Select Recipient**
4. Enter amount (toggle NGN/USD)
5. Select gateway: Paystack · Flutterwave · PayPal
6. Add an optional note
7. Review fee breakdown (1.5% transfer fee)
8. **Continue** → Confirm modal → **Confirm & Send**
9. Success modal with reference number
10. Transaction logged in history, balance deducted

---

## 🌐 Deployment

### Vercel
```bash
npm run build
# Connect GitHub repo at vercel.com
# Set environment variables in Vercel dashboard
```

### Netlify
```bash
npm run build
# Drag /dist folder to netlify.com/drop
# Or connect repo and set VITE_* env vars in settings
```

### Manual (any static host)
```bash
npm run build
# Upload /dist folder to your server
```

---

## 🛠 Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI framework |
| react-dom | ^18.3.1 | DOM rendering |
| chart.js | ^4.4.4 | Analytics charts |
| react-chartjs-2 | ^5.2.0 | React wrapper for Chart.js |
| react-icons | ^5.3.0 | Icon library (RemixIcon set) |
| tailwindcss | ^3.4.14 | Utility-first CSS |
| vite | ^5.4.10 | Build tool |
| @vitejs/plugin-react | ^4.3.3 | Vite React plugin |

---

## 🎨 Design Tokens (CSS Variables)

```css
--bg:        #070B14   /* deep navy background (dark) */
--surface:   #0D1321   /* slightly lighter panels */
--card:      #111827   /* card surfaces */
--primary:   #4E7CF6   /* electric blue accent */
--green:     #34D399   /* success / credit */
--red:       #F87171   /* danger / debit */
--gold:      #F6C94E   /* warnings / premium */
--teal:      #2DD4BF   /* secondary accent */
```

Light mode overrides these with a clean indigo-white palette.

---

## 📋 Recipient Users (Demo)

The wallet comes pre-loaded with:
- **Yusuf Sale** — GTBank
- **Buhari Rabi'u** — Access Bank  
- **Naja'atu Aminu** — Zenith Bank
- **Zayyad Mansur** — First Bank
- **Lukman Aminu** — UBA
