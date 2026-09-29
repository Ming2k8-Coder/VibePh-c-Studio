import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: '#0E0F12',
          800: '#16181D',
          700: '#22262F',
        },
        heritage: {
          son: '#C53030',    // Đỏ son cung đình (Chu sa)
          hoang: '#D69E2E',  // Hoàng thổ / Chỉ vàng Chính Trung
          cham: '#1E3A8A',   // Lam chàm truyền thống
        },
        cyber: {
          lime: '#CCFF00',   // Neon Gen Z streetwear accent
          jade: '#00F5D4',   // Ngọc bích Cybernetic
        },
      },
      backdropBlur: {
        organza: '16px',
      },
      boxShadow: {
        'heritage-glow': '0 0 25px rgba(214, 158, 46, 0.35)',
        'rule-error': '0 0 25px rgba(197, 48, 48, 0.55)',
        'cyber-glow': '0 0 25px rgba(204, 255, 0, 0.3)',
      },
      fontFamily: {
        imperial: ['"Playfair Display"', '"Cormorant Garamond"', '"Be Vietnam Pro"', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'm3-sm': '8px',
        'm3-md': '16px',
        'm3-lg': '28px',
        'm3-xl': '36px',
        'm3-full': '9999px',
      },
      animation: {
        'shake-ta-nham': 'taNhamShake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        taNhamShake: {
          '10%, 90%': { transform: 'translate3d(-2px, 0, 0) rotate(-1deg)' },
          '20%, 80%': { transform: 'translate3d(4px, 0, 0) rotate(1.5deg)' },
          '30%, 50%, 70%': { transform: 'translate3d(-6px, 0, 0) rotate(-2deg)' },
          '40%, 60%': { transform: 'translate3d(6px, 0, 0) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
