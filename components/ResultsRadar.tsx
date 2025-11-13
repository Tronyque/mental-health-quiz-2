'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  RadarChart as RcRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts';

type Result = { dimension: string; score: number };

type Props = {
  data: Result[];
  getAdvice: (dimension: string, score: number) => string;
  /** Mise en évidence si moyenne < 50 (palette ambrée/rouge) */
  highlightBelow50?: boolean;
};

/** Lit une var CSS (shadcn/tailwind) et retourne une couleur utilisable */
function cssColor(varName: string, fallback: string) {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v ? (v.startsWith('hsl(') ? v : `hsl(${v})`) : fallback;
}

const ONE_WORD_MAP: Record<string, string> = {
  'Satisfaction globale': 'Satisfaction',
  'Optimisme professionnel': 'Optimisme',
  'Énergie et engagement': 'Énergie',
  'Efficacité personnelle': 'Efficacité',
  'Relations interpersonnelles': 'Relations',
  'Équilibre vie privée / personnelle': 'Équilibre',
  'Reconnaissance et valorisation': 'Reconnaissance',
  'Charge de travail': 'Charge',
  'Management – cadre de santé et direction': 'Management',
  'Santé au travail – perception des dispositifs': 'Dispositifs',
  'Sens du travail': 'Sens',
  'Détente (↗ mieux)': 'Détente',
  'Satisfaction dans le rôle': 'Rôle',
};
const oneWord = (label: string) =>
  ONE_WORD_MAP[label] ?? (label.replace(/[–—()]/g, ' ').trim().split(/\s+/)[0] || label);

// Couleur dynamique 0→100 : teinte rouge→vert (0→140)
const hueFrom = (v: number) => Math.max(0, Math.min(100, v)) * 1.4;

export default function ResultsRadar({
  data,
  getAdvice,
  highlightBelow50 = true,
}: Props) {
  const chartData = React.useMemo(
    () =>
      data.map((d) => ({
        ...d,
        short: oneWord(d.dimension),
        ring50Score: 50,
      })),
    [data]
  );

  const avg = React.useMemo(
    () =>
      chartData.reduce((s, d) => s + (Number.isFinite(d.score) ? d.score : 0), 0) /
      Math.max(1, chartData.length),
    [chartData]
  );

  // Palette lisible dark/light
  const fg = cssColor('--foreground', '#e5e7eb');
  const bd = cssColor('--border', '#334155');
  const card = cssColor('--card', '#0b1220');

  // Palette score : si moyenne < 50 et highlightBelow50 ⇒ ambrée/rouge
  const hue = hueFrom(avg);
  const stroke =
    highlightBelow50 && avg < 50
      ? `hsl(28 90% 52%)` // ambré chaud lisible
      : `hsl(${hue} 70% 45%)`;
  const gradId = React.useId();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold" style={{ color: fg }}>
          Vos résultats
        </h3>
        <span className="text-xs" style={{ color: fg, opacity: 0.7 }}>
          0–100 • repère à 50
        </span>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <RcRadarChart data={chartData} outerRadius="75%">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop
                offset="0%"
                stopColor={stroke}
                stopOpacity={highlightBelow50 && avg < 50 ? 0.65 : 0.55}
              />
              <stop
                offset="100%"
                stopColor={stroke}
                stopOpacity={highlightBelow50 && avg < 50 ? 0.35 : 0.28}
              />
            </linearGradient>
          </defs>

          <PolarGrid stroke={bd} strokeOpacity={0.2} radialLines />
          <PolarAngleAxis dataKey="short" tick={{ fontSize: 12, fill: fg }} tickLine={false} />
          <PolarRadiusAxis
            domain={[0, 100]}
            tickCount={5}
            tick={{ fontSize: 11, fill: fg }}
            tickLine={false}
            axisLine={false}
          />

          {/* Ligne médiane 50% */}
          <Radar
            dataKey="ring50Score"
            stroke={bd}
            strokeOpacity={0.45}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            fillOpacity={0}
            isAnimationActive={false}
          />

          {/* Scores */}
          <Radar
            dataKey="score"
            stroke={stroke}
            strokeWidth={2}
            dot={false}
            fill={`url(#${gradId})`}
            fillOpacity={1}
          />

          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: `1px solid ${bd}`,
              background: card,
              color: fg,
              padding: '8px 10px',
              maxWidth: 360,
            }}
            formatter={(value: number, _n: string, props: any) => [
              `${value}%`,
              getAdvice(props?.payload?.dimension ?? props?.payload?.short, value),
            ]}
            // @ts-ignore — variations de types Recharts
            labelFormatter={(_label: string, payload: any[]) =>
              payload?.[0]?.payload?.dimension ?? ''
            }
          />
        </RcRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
