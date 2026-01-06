/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#050810",
          panel: "rgba(4, 8, 18, 0.72)",
          cyan: "#00F0FF",
          green: "#00FF66",
          red: "#FF003C",
          magenta: "#FF00FF",
          yellow: "#FDE047",
        },
      },
      boxShadow: {
        glowCyan: "0 0 28px rgba(0, 240, 255, 0.18)",
        glowGreen: "0 0 28px rgba(0, 255, 102, 0.16)",
        glowRed: "0 0 28px rgba(255, 0, 60, 0.14)",
      },
    },
  },
  plugins: [],
};