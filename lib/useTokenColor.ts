// lib/useTokenColor.ts
import { useEffect, useState } from "react";

/**
 * Récupère dynamiquement la valeur d'une variable CSS.
 * Exemple : const primary = useTokenColor("--color-primary");
 */
export function useTokenColor(tokenVar: string, fallback = "#999999") {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cs = getComputedStyle(document.documentElement);
    const val = cs.getPropertyValue(tokenVar).trim();
    if (val) setColor(val);
  }, [tokenVar]);

  return color;
}
