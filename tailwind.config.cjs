/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#050507" },
        accent: { mint: "#6EF9B6", purple: "#9B7CFA" }
      },
      borderRadius: { glass: "18px" },
      boxShadow: {
        glow: "0 0 24px rgba(110,249,182,0.28)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.5)"
      }
    }
  },
  plugins: []
};