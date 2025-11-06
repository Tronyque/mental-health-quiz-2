"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Basculer le thème"
      aria-pressed={isDark}
      title={isDark ? "Passer en clair" : "Passer en sombre"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
      <span className="sr-only">
        {isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      </span>
    </Button>
  );
}
