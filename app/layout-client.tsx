'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { CookieConsent } from '@/components/CookieConsent';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div
        className={cn(
          'bg-background text-foreground flex min-h-screen flex-col scroll-smooth antialiased',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={typeof window !== 'undefined' ? window.location.pathname : 'static'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex-1"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        <Toaster richColors position="bottom-right" />
        <CookieConsent />

        <footer className="text-muted-foreground border-accent/20 mt-10 w-full border-t py-6 text-center text-xs">
          <p>
            © {new Date().getFullYear()} Questionnaire Bien-Être — Données hébergées en Europe via
            Supabase.
          </p>
          <p className="mt-2 flex justify-center gap-4">
            <Link href="/privacy" className="hover:text-primary underline transition-colors">
              Politique de confidentialité
            </Link>
            <span className="text-muted-foreground/60">•</span>
            <Link href="/legal" className="hover:text-primary underline transition-colors">
              Mentions légales
            </Link>
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}
