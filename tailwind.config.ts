import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: 'var(--color-navy)',
          light: 'var(--color-navy-light)',
          mid: 'var(--color-navy-mid)'
        },
        gold: {
          DEFAULT: 'var(--color-gold)',
          light: 'var(--color-gold-light)'
        },
        teal: {
          DEFAULT: 'var(--color-teal)',
          light: 'var(--color-teal-light)'
        },
        canvas: 'var(--color-canvas)',
        ink: {
          DEFAULT: 'var(--color-ink)',
          soft: 'var(--color-ink-soft)'
        },
        line: 'var(--color-line)',
        brand: {
          red: '#B3452E',
          green: '#1E7F5C'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        card: '16px'
      },
      boxShadow: {
        card: '0 1px 3px rgba(11,30,61,0.06), 0 1px 2px rgba(11,30,61,0.04)',
        goldGlow: 'var(--shadow-glow)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        countIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.35s ease both',
        countIn: 'countIn 0.3s ease both'
      }
    }
  },
  plugins: []
};

export default config;
