import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* =========================================================
   🧱 Fonction utilitaire principale : cn()
   Combine intelligemment plusieurs classes Tailwind
   en tenant compte des conflits (ex: p-2 vs p-4)
   ========================================================= */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* =========================================================
   🕓 Formatage de date simple (utile pour logs / dashboards)
   ========================================================= */

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* =========================================================
   🧠 Nettoyage de texte (utile pour réponses ou API)
   ========================================================= */

export function cleanText(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

/* =========================================================
   🧩 Générateur d’ID unique (pour clés React, questions, etc.)
   ========================================================= */

export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
