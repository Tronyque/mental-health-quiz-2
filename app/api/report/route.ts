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

// Validation du payload
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
    .min(1, "Au moins une dimension est nécessaire pour générer un compte rendu."),
});

export async function POST(req: NextRequest) {
  try {
    // On check d’abord la clé → si elle manque, on retourne une erreur propre sans instancier OpenAI
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "OPENAI_API_KEY manquante. Configure-la dans Vercel → Environment Variables (ou désactive temporairement la route).",
        },
        { status: 500 }
      );
    }

    // On instancie OpenAI UNIQUEMENT ici, au runtime de la requête
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const json = await req.json();
    const parsed = BodySchema.parse(json);
    const { locale } = parsed;

    // Normalisation des résultats
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

    const messages = buildReportMessages(results, locale);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ← j’ai mis gpt-4o-mini, c’est le nom actuel (plus rapide et moins cher que gpt-4.1-mini qui n’existe plus)
      messages: messages as any,
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        {
          ok: false,
          error: "GPT n’a pas renvoyé de rapport JSON.",
        },
        { status: 502 }
      );
    }

    let parsedJSON: any;
    try {
      parsedJSON = JSON.parse(content);
    } catch (e) {
      console.error("JSON GPT invalide :", content);
      return NextResponse.json(
        {
          ok: false,
          error: "GPT a renvoyé un format non JSON.",
        },
        { status: 502 }
      );
    }

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
            "Le JSON renvoyé n’est pas complet (manque dimensionAnalyses ou globalSynthesis).",
        },
        { status: 502 }
      );
    }

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
        error: e?.message ?? "Erreur interne.",
      },
      { status: 500 }
    );
  }
}