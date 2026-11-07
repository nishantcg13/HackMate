/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#A54100",
          hover: "#8A3600",
          light: "#FFF5EE",
          dark: "#702C00",
        },
      },
    },
  },
  plugins: [],
};
