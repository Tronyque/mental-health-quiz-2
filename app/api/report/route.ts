// app/api/report/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import {
  buildReportMessages,
  type Result as ReportResult,
} from "@/lib/reportPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Validation du payload reçu
const BodySchema = z.object({
  locale: z.enum(["fr", "en"]).optional().default("fr"),
  results: z
    .array(
      z.object({
        label: z.string().optional(),
        dimension: z.string().optional(),
        value: z.number().optional(),
        score: z.number().optional(),
      })
    )
    .min(
      1,
      "Au moins une dimension est nécessaire pour générer un compte rendu."
    ),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "OPENAI_API_KEY manquante. Configure-la dans Vercel → Project Settings → Environment Variables.",
        },
        { status: 500 }
      );
    }

    const json = await req.json();
    const parsed = BodySchema.parse(json);

    const { locale } = parsed;

    // Normalisation en { label, value }
    const results: ReportResult[] = parsed.results.map((r, index) => {
      const label = r.label ?? r.dimension;
      const value = r.value ?? r.score;

      if (!label || typeof value !== "number") {
        throw new Error(
          `Entrée incomplète à l’index ${index}: chaque résultat doit contenir une dimension et un score numérique.`
        );
      }

      return { label, value };
    });

    // Génération des messages pour GPT à partir du prompt
    const messages = buildReportMessages(results, locale);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: messages as any,
      temperature: 0.2, // stable et analytique
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "GPT n’a pas renvoyé de rapport JSON. Le contenu est vide ou invalide.",
        },
        { status: 502 }
      );
    }

    let parsedJSON: any = null;
    try {
      parsedJSON = JSON.parse(content);
    } catch (e) {
      console.error("JSON GPT invalide :", content);
      return NextResponse.json(
        {
          ok: false,
          error:
            "GPT a renvoyé un format non JSON. Vérifie le prompt système.",
        },
        { status: 502 }
      );
    }

    // On vérifie que les deux clés principales existent
    if (
      !parsedJSON.dimensionAnalyses ||
      typeof parsedJSON.dimensionAnalyses !== "object" ||
      !parsedJSON.globalSynthesis ||
      typeof parsedJSON.globalSynthesis !== "string"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Le JSON renvoyé n’est pas complet. Il doit contenir { dimensionAnalyses: {}, globalSynthesis: \"...\" }",
        },
        { status: 502 }
      );
    }

    // Tout est OK → on renvoie directement l’objet structuré
    return NextResponse.json(
      {
        ok: true,
        multidim: parsedJSON.globalSynthesis,
        dimensionAnalyses: parsedJSON.dimensionAnalyses,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Erreur /api/report :", e);

    if (e instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Payload invalide",
          issues: e.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: e?.message ?? "Erreur interne lors de la génération du rapport.",
      },
      { status: 500 }
    );
  }
}
