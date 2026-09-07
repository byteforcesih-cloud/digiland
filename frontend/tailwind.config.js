/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0F2C59',
          navyDark: '#071933',
          navyLight: '#1E40AF',
          gold: '#D97706',
          goldLight: '#FBBF24',
          emerald: '#059669',
          emeraldLight: '#10B981',
          crimson: '#DC2626',
          surface: '#F8FAFC',
          border: '#E2E8F0',
          muted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
