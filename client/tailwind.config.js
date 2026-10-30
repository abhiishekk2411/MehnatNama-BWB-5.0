/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#176B45',      // Primary Forest Green
          dark: '#104B32',         // Dark Green
          soft: '#E8F3EC',         // Soft Green
          50: '#F0F7F3',
          100: '#E8F3EC',
          200: '#C2DFCE',
          300: '#94C7AA',
          400: '#5BA880',
          500: '#2E8B5E',
          600: '#176B45',          // Brand Primary
          700: '#104B32',          // Brand Dark Green
          800: '#0E3E29',
          900: '#0B2F20',
          950: '#051A11',
        },
        surface: {
          DEFAULT: '#F7F8F5',      // Warm Minimal Background
          card: '#FFFFFF',         // Cards
          muted: '#F0F2ED',
        },
        ink: {
          primary: '#202923',      // Primary Text
          secondary: '#68736B',    // Secondary Text
          muted: '#8F9B93',        // Caption Text
        },
        borderNeutral: {
          DEFAULT: '#E5EAE5',      // Core Border
          light: '#EEF2EE',
          dark: '#D2D9D3',
        },
        status: {
          success: '#15803D',
          'success-bg': '#E8F3EC',
          warning: '#D97706',
          'warning-bg': '#FEF3C7',
          danger: '#DC2626',
          'danger-bg': '#FEE2E2',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(32, 41, 35, 0.04)',
        'card': '0 1px 3px 0 rgba(32, 41, 35, 0.05), 0 1px 2px -1px rgba(32, 41, 35, 0.03)',
        'lifted': '0 4px 6px -1px rgba(32, 41, 35, 0.06), 0 2px 4px -2px rgba(32, 41, 35, 0.04)',
        'dropdown': '0 10px 15px -3px rgba(32, 41, 35, 0.08), 0 4px 6px -4px rgba(32, 41, 35, 0.03)',
      },
      borderRadius: {
        'card': '0.875rem',        // 14px for modern fintech card look
      },
    },
  },
  plugins: [],
}
