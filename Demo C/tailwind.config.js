/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
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
                    bg: '#1A1D21', // Rich Dark Charcoal (custom approximation)
                    text: '#F3EED8', // Solvera Cream
                    navy: '#0F547D', // Solvera Navy
                    lime: '#9EFF24', // Solvera Lime
                    cyan: '#7AE5FF', // Solvera Cyan
                }
            }
        },
    },
    plugins: [],
}
