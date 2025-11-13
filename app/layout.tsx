import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mental Health Quiz",
  description: "Questionnaire Bien-Être au Travail",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground antialiased transition-colors">
        {children}
      </body>
    </html>
  );
}
