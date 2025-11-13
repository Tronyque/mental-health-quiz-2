// app/api/report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { buildWellbeingPrompt } from '@/lib/reportPrompt';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { results, locale = 'fr' } = (await req.json()) as {
      results: Array<{ label: string; value: number }>;
      locale?: 'fr'|'en';
    };

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: 'Résultats manquants' }, { status: 400 });
    }

    const prompt = buildWellbeingPrompt(results, locale);

    const key = process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ error: 'OPENAI_API_KEY manquante' }, { status: 500 });

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'Tu es un assistant de bien-être au travail, empathique et prudent.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 450,
      }),
    });

    const raw = await resp.text();
    let data: any = null;
    try { data = JSON.parse(raw); } catch {}

    if (!resp.ok) {
      const msg = data?.error?.message || raw || 'Erreur OpenAI';
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const report = data?.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ report });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
