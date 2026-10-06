/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        grape: {
          50: '#f5f0ff',
          100: '#e6d9ff',
          300: '#b48cff',
          500: '#7b3fe4',
          700: '#4f1fa3',
          900: '#2a0f5c',
        },
        teal: {
          50: '#e8fffb',
          100: '#c2fff4',
          300: '#4fe3cf',
          500: '#14b8a6',
          700: '#0f766e',
          900: '#083d3a',
        },
        ink: '#0b0820',
        paper: '#f4f1fa',
      },
      fontFamily: {
        sans: ['Verdana', 'Tahoma', '"Trebuchet MS"', 'Geneva', 'sans-serif'],
        pixel: ['var(--font-pixel)', '"Courier New"', 'monospace'],
        terminal: ['var(--font-terminal)', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 12px 2px rgb(79 227 207 / 0.55)',
        bevel: 'inset 1px 1px 0 rgb(255 255 255 / 0.6), inset -1px -1px 0 rgb(0 0 0 / 0.35)',
      },
    },
  },
  plugins: [],
};
