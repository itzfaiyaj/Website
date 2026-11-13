/** Palette: deep circuit-board green + acid lime + aqua + amber. No purple / violet / pink anywhere. */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#050C0A", 900: "#08130F", 800: "#0D1D18", 700: "#14302A", 600: "#1D463D" },
        lime: { DEFAULT: "#C8FF3E", dim: "#9FD12B" },
        aqua: { DEFAULT: "#35E8D4", dim: "#1FA899" },
        amber: { DEFAULT: "#FFB224" },
        coral: "#FF5B45",
        bone: "#EAF3E4",
        mute: "#8DA89D",
      },
      fontFamily: {
        display: ["Unbounded", "Hind Siliguri", "sans-serif"],
        sans: ["Instrument Sans", "Hind Siliguri", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Martian Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.15" } },
        rise: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scan: { from: { transform: "translateY(-100%)" }, to: { transform: "translateY(100%)" } },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        float: "float 6s ease-in-out infinite",
        blink: "blink 1.1s steps(2, start) infinite",
        rise: "rise .6s ease-out both",
        scan: "scan 6s linear infinite",
      },
    },
  },
  plugins: [],
};
