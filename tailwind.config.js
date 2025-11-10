/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        isuzu: "var(--isuzu-red)",
        'bahana': {
          'primary':'#204066',
          'light': '#0363c4ff', // Biru Tua/Navy
          'light-10': '#a2c4f8ff',   // Biru Sangat Cerah (untuk hover/latar belakang submenu mobile)
          'dark': '#003A75',
        }
      },
    },
  },
  plugins: [],
};
