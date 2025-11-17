"use client";

import * as React from "react";
import ResultsRadar from "@/components/ResultsRadar";
import ReportGenerator from "@/components/ReportGenerator";

type Result = {
  dimension: string;
  score: number; // 0–100
};

type Props = {
  results: Result[];
  locale?: "fr" | "en";
};

export default function ResultsView({ results, locale = "fr" }: Props) {
  const hasData = Array.isArray(results) && results.length > 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* HEADER GLOBAL */}
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          {locale === "fr"
            ? "Votre lecture personnalisée du bien-être au travail"
            : "Your personalised work wellbeing profile"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {locale === "fr"
            ? "Cette page présente une lecture descriptive de vos réponses, à partir de différentes dimensions de votre expérience au travail."
            : "This page provides a descriptive reading of your answers, based on several dimensions of your work experience."}
        </p>
      </header>

      {!hasData && (
        <p className="text-xs text-amber-600">
          {locale === "fr"
            ? "Les résultats ne sont pas disponibles. Veuillez terminer le questionnaire."
            : "Results are not available. Please complete the questionnaire first."}
        </p>
      )}

      {hasData && (
        <>
          {/* BLOC 1 : SYNTHÈSE MULTIDIMENSIONNELLE + DÉTAIL DIMENSIONS */}
          <section className="space-y-4">
            <ReportGenerator results={results} locale={locale} />

            <p className="text-[11px] text-muted-foreground">
              {locale === "fr" ? (
                <>
                  Les éléments ci-dessous décrivent vos réponses au
                  questionnaire, sur une échelle de 0 à 100 pour chaque
                  dimension.
                </>
              ) : (
                <>
                  The elements below describe your questionnaire results, on a
                  0–100 scale for each dimension.
                </>
              )}
            </p>
          </section>

          {/* BLOC 2 : RADAR GLOBAL */}
          <section className="space-y-3">
            <ResultsRadar data={results} />
            <p className="text-[11px] text-muted-foreground mt-1">
              {locale === "fr" ? (
                <>
                  Le graphique illustre vos scores pour chaque dimension (0 à
                  100). Le cercle pointillé correspond à un niveau intermédiaire
                  autour de 50.
                </>
              ) : (
                <>
                  The chart shows your scores for each dimension (0–100). The
                  dotted circle represents an intermediate level around 50.
                </>
              )}
            </p>
          </section>
        </>
      )}
    </div>
  );
}
