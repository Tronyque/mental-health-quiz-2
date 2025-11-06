"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

/* =========================================================
   🧠 Toaster global — Notifications fluides & thématiques
   ========================================================= */

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      expand
      richColors
      duration={4000}
      closeButton
      className="toaster group z-[9999]"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--background)] group-[.toaster]:text-[var(--foreground)] group-[.toaster]:border-[var(--border)] group-[.toaster]:shadow-lg rounded-xl px-4 py-3",
          description:
            "group-[.toast]:text-muted-foreground text-sm leading-snug",
          actionButton:
            "group-[.toast]:bg-[var(--primary)] group-[.toast]:text-[var(--foreground)] rounded-md font-medium hover:brightness-110 transition",
          cancelButton:
            "group-[.toast]:bg-[var(--muted)] group-[.toast]:text-[var(--foreground)] rounded-md font-medium",
        },
      }}
      {...props}
    />
  );
};
