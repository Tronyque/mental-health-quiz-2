// app/layout.tsx — version "zéro metadata"
import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import RootLayoutClient from './layout-client';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Remplacement simple des anciennes configs metadata/viewport */}
        <title>Mental-Health-Quiz</title>
        <meta
          name="description"
          content="Questionnaire de bien-être au travail avec visualisation des résultats — Next.js, Tailwind, Supabase."
        />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f8fa" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0e1625" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Questionnaire Bien-Être" />
        <meta
          property="og:description"
          content="Outil anonyme pour évaluer la santé mentale au travail et visualiser les résultats."
        />
        <meta property="og:type" content="website" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
