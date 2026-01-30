/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal-bg': '#2a2a2a',
        'terminal-sidebar': '#1a1a1a',
        'terminal-chat': '#3a3a3a',
        'terminal-orange': '#ff8800',
        'terminal-orange-hover': '#ff9920',
        'terminal-orange-dim': '#cc6600',
        'terminal-timestamp': '#996633',
      },
      fontFamily: {
        'mono': ['"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
}
