/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#FDFBF7",
          100: "#F8F5F0",
          200: "#F0EBE2",
          300: "#E5DDCE",
          400: "#D4C7B0",
        },
        ink: {
          900: "#3D2914",
          800: "#5C4423",
          700: "#7A5C32",
        },
        slate: {
          900: "#2C3E50",
          800: "#34495E",
          700: "#415A77",
        },
        ochre: {
          500: "#C17817",
          400: "#D49033",
          300: "#E5A952",
        },
      },
      fontFamily: {
        serif: ['"Source Serif Pro"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -4px rgba(61, 41, 20, 0.1)',
        'card-hover': '0 8px 30px -6px rgba(61, 41, 20, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'stagger-1': 'fadeIn 0.6s ease-out 0.1s forwards',
        'stagger-2': 'fadeIn 0.6s ease-out 0.2s forwards',
        'stagger-3': 'fadeIn 0.6s ease-out 0.3s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
