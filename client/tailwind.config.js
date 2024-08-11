/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          1: "#232731",
          2: "#292F3C",
          3: "#2E374B",
          4: "#2E323C",
          5: "#22262F"
        },
        green: {
          1: "#077E71"
        },
        gray: {
          1: "#8B8C91"
        }
      }
    },
  },
  plugins: [],
}