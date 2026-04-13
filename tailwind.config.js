/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      colors: {
        violet: { 400:"#a78bfa", 500:"#8b5cf6", 600:"#7c3aed" },
        indigo: { 400:"#818cf8", 500:"#6366f1" },
        cyan:   { 400:"#22d3ee", 500:"#06b6d4" },
        fuchsia:{ 400:"#e879f9", 500:"#d946ef" },
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "spin-reverse": "spinReverse 30s linear infinite",
        glow: "glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "slide-up": "slideUp .7s cubic-bezier(.16,1,.3,1) both",
        "fade-in": "fadeIn .6s ease both",
        shimmer: "shimmer 2.5s linear infinite",
        "border-spin": "borderSpin 4s linear infinite",
      },
      keyframes: {
        spinReverse: { to: { transform:"rotate(-360deg)" } },
        glow:   { "0%,100%":{ opacity:.6 }, "50%":{ opacity:1 } },
        float:  { "0%,100%":{ transform:"translateY(0)" }, "50%":{ transform:"translateY(-12px)" } },
        slideUp:{ from:{ opacity:0, transform:"translateY(40px)" }, to:{ opacity:1, transform:"none" } },
        fadeIn: { from:{ opacity:0 }, to:{ opacity:1 } },
        shimmer:{ from:{ backgroundPosition:"200% center" }, to:{ backgroundPosition:"-200% center" } },
        borderSpin:{ to:{ "--angle":"360deg" } },
      },
    },
  },
  plugins: [],
};
