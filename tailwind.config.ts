import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f7ff',
          100: '#e2efff',
          200: '#bddcff',
          300: '#8bbfff',
          400: '#599efe',
          500: '#377ff5',
          600: '#1d62e2',
          700: '#184ec0',
          800: '#173f97',
          900: '#163772'
        }
      }
    }
  },
  plugins: []
} satisfies Config
