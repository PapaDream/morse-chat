/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal-bg': '#0a0a0a',
        'terminal-sidebar': '#000000',
        'terminal-chat': '#1a1a1a',
        'terminal-orange': '#ff8800',
        'terminal-orange-hover': '#ff9920',
        'terminal-orange-dim': '#cc6600',
        'terminal-timestamp': '#996633',
        'bubble-own': '#3d2a1a',
        'bubble-other': '#1a1a1a',
      },
      fontFamily: {
        'mono': ['"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
}
