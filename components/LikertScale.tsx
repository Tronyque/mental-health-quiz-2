"use client";

import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

interface LikertScaleProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  labels?: string[];
}

export function LikertScale({
  min,
  max,
  value,
  onChange,
  labels,
}: LikertScaleProps) {
  const steps = useMemo(() => {
    const count = 5;
    const range = Array.from({ length: count }, (_, i) =>
      Math.round(min + (i * (max - min)) / (count - 1))
    );
    return Array.from(new Set(range));
  }, [min, max]);

  const defaultLabels = [
    "Pas du tout d’accord",
    "Plutôt pas d’accord",
    "Neutre",
    "Plutôt d’accord",
    "Tout à fait d’accord",
  ];

  const optionLabels =
    labels && labels.length >= 5 ? labels.slice(0, 5) : defaultLabels;

  const select = useCallback((v: number) => onChange(v), [onChange]);

  const move = useCallback(
    (dir: -1 | 1) => {
      const idx = Math.max(
        0,
        Math.min(steps.length - 1, Math.max(0, steps.indexOf(value)) + dir)
      );
      onChange(steps[idx]);
    },
    [steps, value, onChange]
  );

  return (
    <div
      role="radiogroup"
      aria-label="Échelle de réponse"
      className="w-full max-w-md mx-auto flex flex-col gap-3"
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          move(-1);
        } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          move(1);
        }
      }}
    >
      {steps.map((v, i) => {
        const active = v === value;
        const label = optionLabels[i] ?? String(v);
        return (
          <button
            key={v}
            role="radio"
            aria-checked={active}
            onClick={() => select(v)}
            className={cn(
              "w-full rounded-xl border px-4 py-4 transition text-center text-base font-medium",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              active
                ? "bg-primary text-(--color-primary-foreground) border-primary shadow"
                : "bg-card text-foreground border-border hover:bg-[color-mix(in_oklab,var(--color-foreground)_6%,transparent)]"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
