/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#fdfcfb',
          100: '#faf6f0',
          200: '#f2eae0',
          300: '#ebdccb',
          400: '#aa8e5d', // primary gold
          500: '#947a4f', // medium gold
          600: '#7b633f', // dark gold
          700: '#5c492c',
          800: '#43341e',
          900: '#2b2112',
        },
        yellow: {
          50: '#fdfcfb',
          100: '#faf6f0',
          200: '#f2eae0',
          300: '#ebdccb',
          400: '#aa8e5d',
          500: '#aa8e5d',
          600: '#947a4f',
          700: '#7b633f',
        }
      }
    },
  },
  plugins: [],
}
