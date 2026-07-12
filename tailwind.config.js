/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["Unbounded", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["SFMono-Regular", "Cascadia Code", "Roboto Mono", "monospace"],
      },
      colors: {
        brand: {
          cream: "#e8e4d9",
          creamDeep: "#ded8c8",
          ochre: "#c9bb3f",
          slate: "#6f8db5",
          umber: "#5e4f2b",
          ink: "#161616",
          paper: "#ffffff"
        }
      },
      boxShadow: {
        minimal: "0 2px 8px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};
