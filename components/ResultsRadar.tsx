"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  RadarChart as RcRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";

type Result = { dimension: string; score: number };

type Props = {
  data: Result[];
  highlightBelow50?: boolean;
};

const SHORT_LABELS: Record<string, string> = {
  "Satisfaction globale": "Satisfaction",
  "Optimisme professionnel": "Optimisme",
  "Stress et détente": "Stress",
  "Énergie et engagement": "Énergie",
  "Efficacité personnelle": "Efficacité",
  "Satisfaction dans le rôle": "Rôle",
  "Relations interpersonnelles": "Relations",
  "Sens du travail": "Sens",
  "Reconnaissance et valorisation": "Reconnaissance",
  "Charge de travail": "Charge",
  "Santé au travail – perception des dispositifs": "Dispositifs",
  "Management – cadre de santé et direction": "Management",
  "Équilibre vie privée / personnelle": "Équilibre",
  "Détente (↗ mieux)": "Détente",
};

function toShort(label: string): string {
  return SHORT_LABELS[label] ?? label.split(" ")[0];
}

// Couleur en fonction du score moyen
function baseColor(avg: number) {
  if (avg < 40) return "hsl(10 80% 55%)"; // rouge chaud
  if (avg < 70) return "hsl(40 70% 50%)"; // orange
  return "hsl(145 60% 40%)"; // vert
}

export default function ResultsRadar({
  data,
  highlightBelow50 = true,
}: Props) {
  const chartData = React.useMemo(
    () =>
      (data ?? []).map((d) => ({
        dimension: d.dimension,
        short: toShort(d.dimension),
        score: Math.round((d.score ?? 0) * 10) / 10,
        ring50Score: 50,
      })),
    [data]
  );

  if (!chartData.length) {
    return (
      <div className="w-full max-w-3xl mx-auto text-xs text-muted-foreground">
        Le profil graphique sera affiché une fois les résultats disponibles.
      </div>
    );
  }

  const avg =
    chartData.reduce((sum, d) => sum + d.score, 0) /
    Math.max(1, chartData.length);

  const strokeColor = baseColor(avg);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">Profil global</h2>
        <span className="text-xs text-muted-foreground">
          0–100 • repère à 50
        </span>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <RcRadarChart data={chartData} outerRadius="75%">
          {/* Grille plus visible et plus foncée */}
          <PolarGrid stroke="#64748b" strokeOpacity={0.7} radialLines />

          {/* Libellés des dimensions plus foncés et lisibles */}
          <PolarAngleAxis
            dataKey="short"
            tick={{
              fontSize: 12,
              fill: "#0b0f19", // texte bien foncé
              fontWeight: 500,
            }}
            tickLine={false}
          />

          {/* Axe radial avec labels plus lisibles */}
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#111827" }} // gris très foncé
            tickLine={false}
            axisLine={false}
            tickCount={6}
          />

          {/* Repère 50 */}
          <Radar
            dataKey="ring50Score"
            stroke="#475569" // plus foncé
            strokeOpacity={0.8}
            strokeWidth={1.4}
            strokeDasharray="4 3"
            dot={false}
            fillOpacity={0}
            isAnimationActive={false}
          />

          {/* Zone principale */}
          <Radar
            dataKey="score"
            stroke={strokeColor}
            strokeWidth={2}
            fill={strokeColor}
            fillOpacity={0.25}
            dot={false}
          />

          {/* Tooltip : uniquement la série "score", sans 50 */}
          <Tooltip
            wrapperStyle={{ outline: "none" }}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid hsl(210 10% 35%)",
              background: "hsl(222 47% 9%)",
              color: "white",
              padding: "8px 12px",
              overflow: "hidden",
              maxWidth: "200px",
              whiteSpace: "normal",
              lineHeight: 1.3,
            }}
            content={({ active, payload }: any) => {
              if (!active || !payload || !payload.length) return null;

              // on ne garde QUE la série "score"
              const main = payload.find((p: any) => p.dataKey === "score");
              if (!main) return null;

              const value = Math.round(main.value ?? 0);
              const dim = main.payload?.dimension ?? main.name;

              return (
                <div
                  style={{
                    borderRadius: 10,
                    border: "1px solid hsl(210 10% 35%)",
                    background: "hsl(222 47% 9%)",
                    color: "white",
                    padding: "8px 12px",
                    maxWidth: 200,
                    whiteSpace: "normal",
                    lineHeight: 1.3,
                    fontSize: 11,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{dim}</div>
                  <div>{value} / 100</div>
                </div>
              );
            }}
          />
        </RcRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
