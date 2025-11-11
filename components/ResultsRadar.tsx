'use client';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts';

type Props = {
  data: Array<{ dimension: string; score: number }>;
  getAdvice: (dim: string, score: number) => string;
};

export default function ResultsRadar({ data, getAdvice }: Props) {
  return (
    <div className="w-full max-w-lg">
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data} outerRadius="75%">
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.55} />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="hsl(var(--color-foreground)/0.12)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 12, fill: 'hsl(var(--color-foreground)/0.6)' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: 'hsl(var(--color-foreground)/0.5)' }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="hsl(var(--color-foreground)/0.35)"
            fill="url(#radarFill)"
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--color-border))' }}
            formatter={(value: number, _n: string, props: any) => [
              `${value}%`,
              getAdvice(props.payload.dimension, value),
            ]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
