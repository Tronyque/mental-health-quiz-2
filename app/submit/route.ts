// app/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { questions, normalizeScore } from "@/lib/questions";

const AnswerSchema = z.object({
  questionId: z.string(),
  value: z.number().int(),
});

const ProfileSchema = z.object({
  facility: z.string().min(1, "EHPAD requis"),
  job: z.string().min(1, "Emploi requis"),
  age: z.string().min(1, "Âge requis"),
  seniority: z.string().min(1, "Ancienneté requise"),
  comment: z.string().optional(),
});

/* 🧍 Pseudo */
const PseudoSchema = z
  .string()
  .min(2, "Pseudo trop court")
  .max(32, "Pseudo trop long")
  .regex(/^[A-Za-z0-9_\-\p{L}]+$/u, "Caractères spéciaux non autorisés");

const PayloadSchema = z.object({
  pseudo: PseudoSchema,
  answers: z.array(AnswerSchema).min(1),
  consent: z.boolean(),
  profile: ProfileSchema,
  context: z
    .object({
      questionnaireVersion: z.string().default("v1"),
      durationSeconds: z.number().int().optional(),
      locale: z.string().optional(),
      department: z.string().optional(),
    })
    .partial()
    .default({}),
});

type ByDim = Record<string, number[]>;

/** 🧮 Calcule les scores normalisés et agrégés par dimension
 *  ➜ on suit EXCLUSIVEMENT le flag `q.inverted` défini dans lib/questions.ts
 */
function computeScores(input: z.infer<typeof PayloadSchema>) {
  const dict = new Map<string, (typeof questions)[number]>();
  for (const q of questions) dict.set(q.id.toString(), q);

  const perQuestion = input.answers.map((a) => {
    const q = dict.get(a.questionId.toString());
    if (!q) throw new Error(`Unknown questionId: ${a.questionId}`);

    if (a.value < q.scale.min || a.value > q.scale.max) {
      throw new Error(`Out-of-range value for ${a.questionId}`);
    }

    // ✅ inversion uniquement si la question a `inverted: true`
    const invert = !!q.inverted;

    const normalized = normalizeScore(
      a.value,
      q.scale.min,
      q.scale.max,
      invert
    );

    return {
      ...a,                 // ⬅️ spread normal (questionId, value)
      dimension: q.dimension,
      normalized,
      inverted: invert,     // on stocke l’info réelle
    };
  });

  const bucket: ByDim = {};
  for (const r of perQuestion) {
    bucket[r.dimension] ??= [];
    bucket[r.dimension].push(r.normalized);
  }

  const scores: Record<string, number> = {};
  for (const [dim, arr] of Object.entries(bucket)) {
    const avg = Math.round(arr.reduce((s, n) => s + n, 0) / arr.length);
    scores[dim] = avg;
  }

  return { perQuestion, scores };
}

/** 🧾 Endpoint principal */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = PayloadSchema.parse(body);

    if (!payload.consent) {
      return NextResponse.json({ error: "Consent required" }, { status: 400 });
    }

    const { perQuestion, scores } = computeScores(payload);

    // === Connexion Supabase ===
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      console.warn("⚠️ Supabase non configuré, scores non persistés.");
      return NextResponse.json({ scores, persisted: false });
    }

    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });

    // 1️⃣ Insertion de la soumission (profil + pseudo)
    const { data: sub, error: subErr } = await supabase
      .from("quiz_submissions")
      .insert({
        pseudo: payload.pseudo.trim(),
        questionnaire_version: payload.context.questionnaireVersion ?? "v1",
        duration_seconds: payload.context.durationSeconds ?? null,
        context: payload.context ?? {},
        facility_name: payload.profile.facility,
        job_category: payload.profile.job,
        age_category: payload.profile.age,
        seniority_category: payload.profile.seniority,
        free_text: payload.profile.comment ?? null,
      })
      .select("id")
      .single();

    if (subErr) throw subErr;

    // 2️⃣ Réponses question par question
    const answersRows = perQuestion.map((r) => ({
      submission_id: sub.id,
      question_id: r.questionId,
      dimension: r.dimension,
      raw_value: r.value,
      normalized: r.normalized,
      inverted: r.inverted,
    }));

    const { error: ansErr } = await supabase.from("quiz_answers").insert(answersRows);
    if (ansErr) throw ansErr;

    // 3️⃣ Scores agrégés
    const { error: scoErr } = await supabase
      .from("quiz_scores")
      .insert({ submission_id: sub.id, scores });
    if (scoErr) throw scoErr;

    return NextResponse.json({
      submissionId: sub.id,
      scores,
      persisted: true,
    });
  } catch (e: any) {
    console.error("❌ submit route error:", e);
    const msg = e?.message ?? "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
