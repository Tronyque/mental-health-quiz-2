"use client";

import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

type Props = {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  labels?: string[];
  className?: string;
  dense?: boolean;
};

export function LikertScale({
  min,
  max,
  value,
  onChange,
  labels,
  className,
  dense,
}: Props) {
  const steps = useMemo(() => {
    const arr: number[] = [];
    for (let v = min; v <= max; v++) arr.push(v);
    return arr;
  }, [min, max]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const i = steps.indexOf(value);
        const next = steps[Math.max(0, i - 1)] ?? steps[0];
        onChange(next);
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const i = steps.indexOf(value);
        const next = steps[Math.min(steps.length - 1, i + 1)] ?? steps[steps.length - 1];
        onChange(next);
      }
    },
    [steps, value, onChange]
  );

  return (
    <div
      role="radiogroup"
      aria-label="Échelle de réponse"
      tabIndex={0}
      onKeyDown={handleKey}
      className={cn(
        "w-full mx-auto grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-md",
        className
      )}
    >
      {steps.map((v, i) => {
        const active = v === value;
        const label = labels?.[i] ?? String(v);

        return (
          <button
            key={v}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            className={cn(
              "rounded-lg border text-sm font-medium text-center select-none transition-colors",
              dense ? "px-2.5 py-2" : "px-3 py-2.5",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-ring))]",
              active
                ? "bg-primary text-primary-foreground border-primary shadow bg-blue-600 text-white border-blue-600"
                : "bg-card text-foreground border-border hover:bg-[color-mix(in_oklab,hsl(var(--color-foreground))_8%,transparent)]"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
