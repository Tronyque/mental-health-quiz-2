/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  corePlugins: {},
  future: {
    // ✅ Désactive LightningCSS natif (forcer PostCSS pur)
    disableNative: true,
  },
};
