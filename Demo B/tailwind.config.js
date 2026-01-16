/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        solvera: {
          bg: '#0F1115', // Rich Dark Charcoal (custom interpretation)
          cream: '#F3EED8', // Primary Text
          navy: '#0F547D', // Brand Header
          lime: '#9EFF24', // Positive/Growth
          cyan: '#7AE5FF', // Interactive
          'card-bg': '#181B21', // Slightly lighter for cards
        }
      }
    },
  },
  plugins: [],
}
