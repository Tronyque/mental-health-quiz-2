// components/RadarChart.tsx
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

type Props = {
  data: number[];       // Scores 0..100
  dimensions: string[]; // Libellés complets
  maxScore?: number;    // défaut 100
  highlightBelow50?: boolean;
};

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
const toOneWord = (label: string) =>
  ONE_WORD_MAP[label] ??
  (label.replace(/[–—()]/g, ' ').trim().split(/\s+/)[0] || label);

const hueFrom = (v: number) => Math.max(0, Math.min(100, v)) * 1.4;

export default function RadarChart({
  data,
  dimensions,
  maxScore = 100,
  highlightBelow50 = true,
}: Props) {
  const chartData = React.useMemo(
    () =>
      dimensions.map((dimension, i) => ({
        dimension,
        short: toOneWord(dimension),
        score: Number.isFinite(data[i]) ? data[i] : 0,
        ring50Score: 50,
      })),
    [data, dimensions],
  );

  const avg = React.useMemo(
    () => chartData.reduce((s, d) => s + d.score, 0) / Math.max(1, chartData.length),
    [chartData],
  );

  // On force des couleurs lisibles (indépendantes du thème)
  const textColor = '#0f172a';      // texte sombre
  const gridColor = '#94a3b8';      // gris moyen
  const tooltipBorder = '#cbd5e1';  // bordure tooltip
  const tooltipBg = '#ffffff';      // fond tooltip

  const hue = hueFrom(avg);
  const stroke =
    highlightBelow50 && avg < 50
      ? `hsl(28 90% 52%)`
      : `hsl(${hue} 70% 45%)`;

  const gradId = React.useId();

  // Tooltip custom pour garder le texte dans le cadre
  const CustomTooltip = (props: any) => {
    const { active, payload } = props;
    if (!active || !payload || !payload.length) return null;

    const p = payload[0];
    const dimension = p.payload?.dimension ?? p.payload?.short;
    const rawValue = p.payload?.score ?? p.value;
    const value = Math.round(rawValue);

    return (
      <div
        style={{
          borderRadius: 12,
          border: `1px solid ${tooltipBorder}`,
          background: tooltipBg,
          color: textColor,
          padding: '8px 10px',
          maxWidth: 260,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflow: 'hidden',
          fontSize: 11,
          boxShadow: '0 8px 20px rgba(15,23,42,0.18)',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{dimension}</div>
        <div>{value} / {maxScore}</div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-semibold" style={{ color: textColor }}>
          Profil global
        </h2>
        <span className="text-xs" style={{ color: textColor, opacity: 0.8 }}>
          0–{maxScore} • repère à 50
        </span>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <RcRadarChart data={chartData} outerRadius="75%">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop
                offset="0%"
                stopColor={stroke}
                stopOpacity={highlightBelow50 && avg < 50 ? 0.75 : 0.65}
              />
              <stop
                offset="100%"
                stopColor={stroke}
                stopOpacity={highlightBelow50 && avg < 50 ? 0.45 : 0.35}
              />
            </linearGradient>
          </defs>

          <PolarGrid stroke={gridColor} strokeOpacity={0.8} radialLines />
          <PolarAngleAxis
            dataKey="short"
            tick={{ fontSize: 12, fill: textColor }}
            tickLine={false}
          />
          <PolarRadiusAxis
            domain={[0, maxScore]}
            tickCount={5}
            tick={{ fontSize: 11, fill: textColor }}
            tickLine={false}
            axisLine={false}
          />

          {/* Ligne médiane 50% */}
          <Radar
            dataKey="ring50Score"
            stroke={gridColor}
            strokeOpacity={0.9}
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

          <Tooltip content={<CustomTooltip />} />
        </RcRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
