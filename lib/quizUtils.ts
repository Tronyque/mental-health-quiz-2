// lib/quizUtils.ts
import { questions, normalizeScore } from "@/lib/questions";

export type DimensionScore = {
  dimension: string;
  average: number;
  count: number;
};

export function computeDimensionScores(
  responses: Record<string, number>
): DimensionScore[] {
  const grouped: Record<string, { total: number; count: number }> = {};

  for (const q of questions) {
    const raw = responses[q.id];
    if (raw == null) continue;

    const normalized = normalizeScore(raw, q.scale.min, q.scale.max, q.inverted);
    (grouped[q.dimension] ??= { total: 0, count: 0 }).total += normalized;
    grouped[q.dimension].count++;
  }

  return Object.entries(grouped).map(([dimension, { total, count }]) => ({
    dimension,
    average: Math.round(total / count),
    count,
  }));
}
