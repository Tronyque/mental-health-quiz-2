'use client';
import { motion } from 'framer-motion';
import { useTokenColor } from '@/lib/useTokenColor';

interface Props {
  value: number; // 0..100
  size?: number; // px – diamètre du cercle (par défaut 112)
  thickness?: number; // px – épaisseur du trait (par défaut 10)
  showLabel?: boolean; // afficher le % au centre (par défaut true)
  autoColor?: boolean; // adapte la couleur selon la progression
  trackColor?: string;
  progressColor?: string; // force une couleur
}

export function ProgressCircle({
  value,
  size = 112,
  thickness = 10,
  showLabel = true,
  autoColor = true,
  trackColor,
  progressColor,
}: Props) {
  const primary = useTokenColor('--color-primary', '#7da6d2');
  const secondary = useTokenColor('--color-secondary', '#9ac9aa');
  const accent = useTokenColor('--color-accent', '#e9e7da');
  const ring = useTokenColor('--color-ring', '#6d9bc4');

  const color = (() => {
    if (progressColor) return progressColor;
    if (!autoColor) return primary;
    if (value >= 75) return secondary;
    if (value >= 50) return primary;
    return accent;
  })();

  // On reste sur un repère 100x100 pour un rendu net,
  // et on scale via width/height (style) pour la taille finale.
  const radius = 45; // rayon effectif (dans le repère 100x100)
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      role="img"
      aria-label={`Progression ${Math.round(clamped)}%`}
      className="relative"
      style={{ width: size, height: size }}
    >
      <svg className="h-full w-full" viewBox="0 0 100 100">
        {/* piste */}
        <circle
          stroke={trackColor || 'var(--color-border)'}
          strokeWidth={thickness}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* progression */}
        <motion.circle
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>

      {showLabel && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-foreground text-sm font-semibold">{Math.round(clamped)}%</span>
        </div>
      )}
    </div>
  );
}
