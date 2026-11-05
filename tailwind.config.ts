import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nexo: { bg: '#0A0B0D', blue: '#3B82F6', green: '#22C55E', purple: '#8B5CF6', red: '#EF4444' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-grotesk)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(40px,-30px,0) scale(1.12)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: { drift: 'drift 18s ease-in-out infinite', shimmer: 'shimmer 1.6s infinite' },
    },
  },
  plugins: [],
};
export default config;
