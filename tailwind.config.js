/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        mono:   ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary:  'var(--primary)',
        surface:  'var(--surface)',
        card:     'var(--card)',
        border:   'var(--border)',
        'text-main': 'var(--text)',
        'text-sub':  'var(--text-s)',
        green:    'var(--green)',
        red:      'var(--red)',
        gold:     'var(--gold)',
        teal:     'var(--teal)',
      },
      boxShadow: {
        card: 'var(--sh)',
        lg:   'var(--sh-lg)',
      },
      borderRadius: {
        DEFAULT: 'var(--r)',
        sm:      'var(--r-sm)',
        lg:      'var(--r-lg)',
      },
      animation: {
        'fade-up':  'fadeUp .3s ease both',
        'fade-in':  'fadeIn .25s ease both',
        'slide-in': 'slideIn .28s ease both',
        'pulse-ring':'pulseRing 1.6s ease infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeUp:    { from:{ opacity:0, transform:'translateY(10px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        fadeIn:    { from:{ opacity:0 }, to:{ opacity:1 } },
        slideIn:   { from:{ opacity:0, transform:'scale(.93) translateY(12px)' }, to:{ opacity:1, transform:'scale(1) translateY(0)' } },
        pulseRing: { '0%,100%':{ boxShadow:'0 0 0 0 rgba(52,211,153,.3)' }, '50%':{ boxShadow:'0 0 0 14px rgba(52,211,153,0)' } },
      },
    },
  },
  plugins: [],
};
