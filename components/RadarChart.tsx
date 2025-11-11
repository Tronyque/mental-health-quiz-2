'use client';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useTokenColor } from '@/lib/useTokenColor';

interface Props {
  data: number[];
  dimensions: string[];
  maxScore?: number;
}

export default function RadarChartComponent({ data, dimensions, maxScore = 100 }: Props) {
  const chartData = dimensions.map((dim, i) => ({
    dimension: dim,
    score: data[i] || 0,
  }));

  const primary = useTokenColor('--color-primary', '#7da6d2');
  const ring = useTokenColor('--color-ring', '#6d9bc4');
  const axis = useTokenColor('--color-muted-foreground', '#6b7280');
  const cardBg = useTokenColor('--color-card', '#fff');
  const border = useTokenColor('--color-border', '#e5e7eb');

  return (
    <ResponsiveContainer width="100%" height={420}>
      <RadarChart data={chartData} outerRadius="75%">
        <PolarGrid stroke={ring} opacity={0.4} />
        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: axis }} />
        <PolarRadiusAxis angle={30} domain={[0, maxScore]} stroke={ring} />
        <Radar name="Score" dataKey="score" stroke={primary} fill={primary} fillOpacity={0.35} />
        <Tooltip
          contentStyle={{
            backgroundColor: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 12,
            padding: '8px 12px',
          }}
          itemStyle={{ color: 'var(--color-foreground)' }}
          labelStyle={{ color: 'var(--color-muted-foreground)' }}
          formatter={(value: number) => `${value}%`}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
