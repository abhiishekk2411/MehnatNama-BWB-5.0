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
          DEFAULT: '#176B45', // Primary Deep Forest Green
          50: '#F0F7F3',
          100: '#E1EFE7',
          200: '#C2DFCE',
          300: '#94C7AA',
          400: '#5BA880',
          500: '#2E8B5E',
          600: '#176B45',     // Brand Primary
          700: '#115436',
          800: '#0E442C',
          900: '#0B3623',
          950: '#051E13',
        },
        sage: {
          DEFAULT: '#4A7C59', // Secondary Sage Green
          50: '#F4F7F4',
          100: '#E8EFEA',
          200: '#D2DFD5',
          300: '#B2C7B7',
          400: '#8EA885',
          500: '#698E71',
          600: '#4A7C59',
          700: '#3A6246',
          800: '#2E4E37',
          900: '#26402D',
        },
        surface: '#F7F8F5',       // Warm Off-White Background
        surfaceCard: '#FFFFFF',   // White Cards
        surfaceSubtle: '#EEF0EB', // Subtle neutral background
        charcoal: '#1F2421',      // Dark Charcoal Primary Text
        charcoalMuted: '#4A5550', // Secondary Muted Text
        charcoalSubtle: '#738078',// Light/Caption Text
        borderNeutral: '#E2E5DE', // Soft Neutral Grey Borders
        borderNeutralDark: '#D0D5CB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(31, 36, 33, 0.04)',
        'card': '0 1px 3px 0 rgba(31, 36, 33, 0.05), 0 1px 2px -1px rgba(31, 36, 33, 0.03)',
        'lifted': '0 4px 6px -1px rgba(31, 36, 33, 0.06), 0 2px 4px -2px rgba(31, 36, 33, 0.04)',
      },
    },
  },
  plugins: [],
}
