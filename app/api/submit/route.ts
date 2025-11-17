// app/api/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ---- Schemas Zod ----
const AnswerSchema = z.object({
  questionId: z.string().min(2),         // ex: "q2_3"
  score: z.number().int().min(1).max(5), // Likert 1..5
});

const PayloadSchema = z.object({
  facilityId: z.string().uuid(),
  pseudo: z.string().min(1, 'Le pseudo est requis'),
  job: z.string().min(1).max(255),
  ageRange: z.string().min(1).max(255),
  seniority: z.string().min(1).max(255),
  comment: z.string().max(2000).nullable().optional(),
  consented: z.boolean().optional().default(true),
  answers: z.array(AnswerSchema).min(1, 'Au moins une réponse est requise.'),
});

// ---- Client Supabase service-side ----
function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase non configuré. Vérifie NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = PayloadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Payload invalide',
          issues: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const {
      facilityId,
      pseudo,
      job,
      ageRange,
      seniority,
      comment,
      consented,
      answers,
    } = parsed.data;

    const supabase = getSupabaseServerClient();

    // IP + User-Agent depuis les headers
    const ipHeader = req.headers.get('x-forwarded-for') ?? '';
    const clientIp =
      ipHeader.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      null;

    const userAgent = req.headers.get('user-agent') ?? null;

    // Préparer le JSON attendu par submit_quiz :
    // [{ question_id: 'q0_1', score: 4 }, ...]
    const answersJson = answers.map((a) => ({
      question_id: a.questionId,
      score: a.score,
    }));

    const { data, error } = await supabase.rpc('submit_quiz', {
      p_facility_id: facilityId,
      p_answers: answersJson,
      p_pseudo: pseudo,
      p_job: job,
      p_age_range: ageRange,
      p_seniority: seniority,
      p_comment: comment ?? null,
      p_consented: consented ?? false,
      p_client_ip: clientIp,
      p_user_agent: userAgent,
    });

    if (error) {
      console.error('Supabase submit_quiz error:', error);
      return NextResponse.json(
        {
          ok: false,
          error: error.message ?? 'Erreur lors de la soumission du questionnaire.',
        },
        { status: 500 },
      );
    }

    // data = UUID retourné par la fonction submit_quiz
    return NextResponse.json(
      {
        ok: true,
        submissionId: data,
      },
      { status: 201 },
    );
  } catch (e: any) {
    console.error('submit route error:', e);
    return NextResponse.json(
      {
        ok: false,
        error: e?.message ?? 'Erreur serveur lors de la soumission.',
      },
      { status: 500 },
    );
  }
}
