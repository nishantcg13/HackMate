/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1E1248",   // From Hackmate logo text
          blue: "#2563EB",   // From blue puzzle piece
          green: "#16A34A",  // From green puzzle piece
          pink: "#DB2777",   // From magenta puzzle piece
          yellow: "#D97706", // From yellow puzzle piece
        },
      },
    },
  },
  plugins: [],
};
