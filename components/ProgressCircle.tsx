"use client";
import * as React from "react";

type ProgressCircleProps = {
  /** 0..100 */
  value: number;
  /** Diamètre en px (par défaut 88) */
  size?: number;
  /** Épaisseur du trait (par défaut 8) */
  strokeWidth?: number;
  /** Couleur manuelle (si autoColor=false) */
  color?: string;
  /** Active la couleur automatique (rouge → vert) */
  autoColor?: boolean;
  /** Légende accessible (aria-label) */
  label?: string;
};

export function ProgressCircle({
  value,
  size = 88,
  strokeWidth = 8,
  color = "hsl(var(--primary))",
  autoColor = false,
  label = "Progression",
}: ProgressCircleProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  // Déterminer la couleur de progression
  const stroke = React.useMemo(() => {
    if (!autoColor) return color;
    // 0 → rouge, 100 → vert doux
    const hue = 0 + (140 * clamped) / 100;
    return `hsl(${hue} 70% 45%)`;
  }, [autoColor, color, clamped]);

  // Couleur du fond : légère pour clair + sombre
  const trackColor = "hsl(var(--muted-foreground) / 0.25)";
  // Couleur du texte central : contraste garanti
  const textColor = clamped >= 50 ? "hsl(var(--foreground))" : "hsl(var(--primary))";


  return (
    <svg
      width={size}
      height={size}
      role="img"
      aria-label={`${label}: ${Math.round(clamped)}%`}
      viewBox={`0 0 ${size} ${size}`}
      className="block"
    >
      {/* Fond / track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Valeur */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        style={{
          strokeDasharray: `${circumference} ${circumference}`,
          strokeDashoffset: offset,
          transition: "stroke-dashoffset .3s ease, stroke .2s ease",
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
        }}
      />
      {/* Texte central */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={Math.max(12, Math.floor(size * 0.2))}
        fill={textColor}
        style={{
          fontWeight: 600,
          textShadow:
            "0 0 2px rgba(0,0,0,0.5), 0 0 4px rgba(0,0,0,0.25)", // lisible en dark
        }}
      >
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}

export default ProgressCircle;
