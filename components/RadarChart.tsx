import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface Props {
  data: number[];
  dimensions: string[];
}

export default function RadarChartComponent({ data, dimensions }: Props) {
  const chartData = dimensions.map((dim, i) => ({ dimension: dim, score: data[i] || 0 }));

  return (
    <ResponsiveContainer width="100%" height={500}>
      <RadarChart data={chartData} outerRadius="80%">
        <PolarGrid />
        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: '#4B5563' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Votre Score" dataKey="score" stroke="#3B82F6" fill="#93C5FD" fillOpacity={0.6} />
        <Tooltip formatter={(value) => `${value}%`} />
      </RadarChart>
    </ResponsiveContainer>
  );
}