/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                solvera: {
                    bg: '#0B1116', // Rich Dark charcoal/blue
                    primary: '#0F547D', // Navy
                    accent: '#3D6230', // Dark Green
                    highlight: '#7AE5FF', // Cyan
                    positive: '#9EFF24', // Lime
                    text: '#F3EED8', // Cream
                }
            },
            fontFamily: {
                sans: ['"IBM Plex Sans"', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'monospace'],
            },
        },
    },
    plugins: [],
}
