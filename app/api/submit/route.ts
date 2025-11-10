// app/api/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database, TablesInsert } from "@/lib/database.types";

// ---- Schemas ----
const AnswerSchema = z.object({
  questionId: z.string().min(2), // ex: "q2_3"
  value: z.number().int().min(1).max(5),
});

const ProfileSchema = z.object({
  facility: z.string().min(1, "EHPAD requis"),
  job: z.string().min(1, "Emploi requis"),
  age: z.string().min(1, "Âge requis"),
  seniority: z.string().min(1, "Ancienneté requise"),
  comment: z.string().max(2000).optional(),
});

const PseudoSchema = z
  .string()
  .min(2, "Pseudo trop court")
  .max(64, "Pseudo trop long")
  .regex(/^[A-Za-z0-9_\-\p{L}]+$/u, "Caractères spéciaux non autorisés");

const PayloadSchema = z.object({
  pseudo: PseudoSchema,
  answers: z.array(AnswerSchema).min(1),
  consent: z.boolean(),
  profile: ProfileSchema,
  // Contexte optionnel, conservé si tu veux l’écrire ailleurs (logs)
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

// ---- Route ----
export async function POST(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: "Supabase non configuré (URL/Service Role Key manquants)" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const payload = PayloadSchema.parse(body);

    if (!payload.consent) {
      return NextResponse.json({ error: "Consent required" }, { status: 400 });
    }

    const supabase = createClient<Database>(url, serviceKey, {
      auth: { persistSession: false },
    });

    const ua = req.headers.get("user-agent") ?? undefined;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    // 1) Trouver ou créer l’établissement
    const { data: fac, error: facSelErr } = await supabase
      .from("facilities")
      .select("id")
      .eq("name", payload.profile.facility)
      .maybeSingle();
    if (facSelErr) throw facSelErr;

    let facility_id = fac?.id as string | undefined;
    if (!facility_id) {
      const { data: facIns, error: facInsErr } = await supabase
        .from("facilities")
        .insert({ name: payload.profile.facility })
        .select("id")
        .single();
      if (facInsErr) throw facInsErr;
      facility_id = facIns.id;
    }

    // 2) Insert submission (hash du pseudo via trigger)
    const submissionToInsert: TablesInsert<"submissions"> = {
      facility_id,
      pseudo_preimage: payload.pseudo.trim(),
      job: payload.profile.job,
      age_range: payload.profile.age,
      seniority: payload.profile.seniority,
      comment: payload.profile.comment ?? null,
      consented: payload.consent,
      client_ip: ip ?? null,
      user_agent: ua ?? null,
    };

    const { data: sub, error: subErr } = await supabase
      .from("submissions")
      .insert(submissionToInsert)
      .select("id")
      .single();
    if (subErr) throw subErr;

    // 3) Insert responses (valeurs Likert brutes 1..5)
    const rows: TablesInsert<"responses">[] = payload.answers.map((a) => ({
      submission_id: sub.id,
      facility_id,
      question_id: a.questionId,
      score: a.value,
    }));

    const { error: respErr } = await supabase.from("responses").insert(rows);
    if (respErr) throw respErr;

    // Réponse : pas de score calculé ici (les vues DB s’en chargent)
    return NextResponse.json({ ok: true, submissionId: sub.id }, { status: 201 });
  } catch (e: any) {
    console.error("submit route error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Invalid request" },
      { status: 400 }
    );
  }
}
