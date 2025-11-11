import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tailwind from 'eslint-plugin-tailwindcss'; // 👈 ajout du plugin

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    plugins: { tailwindcss: tailwind }, // 👈 active le plugin
    rules: {
      // Désactive la règle qui se plaint des classes arbitraires comme supports-[...]
      'tailwindcss/no-custom-classname': 'off',
    },
    settings: {
      tailwindcss: {
        callees: ['cn', 'clsx', 'classnames'], // autorise tes helpers
        config: 'tailwind.config.ts', // chemin vers ta config Tailwind
      },
    },
  },

  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'supabase/**', // ✅ Ignore fichiers générés par Supabase CLI
    ],
  },
];

export default eslintConfig;
