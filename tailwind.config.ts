import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A7C7E7', // Bleu doux
        secondary: '#B2D8B2', // Vert bienveillant
        accent: '#FFD3E0', // Rose pastel
        background: '#F9FAFB', // Gris clair
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 14px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        '3xl': '1.5rem', // Pour plus de rondeur
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;