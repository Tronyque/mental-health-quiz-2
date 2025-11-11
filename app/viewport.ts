// app/viewport.ts
import type { Viewport } from 'next';

// ⚠️ Ne mets surtout PAS "use client" ici
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8fa' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1625' },
  ],
};
