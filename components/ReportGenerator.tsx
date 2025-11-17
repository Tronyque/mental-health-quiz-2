"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";

type Result = { dimension: string; score: number };

type Props = {
  results: Result[];
  locale?: "fr" | "en";
  endpoint?: string;
  onReport?: (data: ApiResponse) => void;
};

// Structure renvoyée par l’API
type ApiResponse = {
  multidim: string;
  dimensionAnalyses: Record<
    string,
    {
      definition: string;
      interpretation: string;
    }
  >;
};

function getScoreColor(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-rose-500";
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "tendance plutôt favorable";
  if (score >= 40) return "niveau intermédiaire, équilibré";
  return "dimension plus sensible dans ce profil";
}

export default function ReportGenerator({
  results,
  locale = "fr",
  endpoint = "/api/report",
  onReport,
}: Props) {
  const [loading, setLoading] = React.useState(false);

  const [multidim, setMultidim] = React.useState("");
  const [dimensionAnalyses, setDimensionAnalyses] = React.useState<
    ApiResponse["dimensionAnalyses"]
  >({});

  const [error, setError] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const [autoKey, setAutoKey] = React.useState<string | null>(null);

  const hasData = Array.isArray(results) && results.length > 0;

  // ---------- API CALL ----------
  const generate = React.useCallback(async () => {
    if (!hasData) return;

    try {
      setLoading(true);
      setError("");

      const payload = {
        locale,
        results: results.map((r) => ({
          label: r.dimension,
          value: r.score,
        })),
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json: any = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || `Erreur (${res.status})`);
      }

      const multidim = json?.multidim?.toString() ?? "";
      const dims = json?.dimensionAnalyses ?? {};

      setMultidim(multidim);
      setDimensionAnalyses(dims);
      onReport?.({ multidim, dimensionAnalyses: dims });
    } catch (e: any) {
      setError(
        e?.message ?? "Une erreur s’est produite pendant la génération."
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint, hasData, locale, onReport, results]);

  // ---------- AUTO-GENERATION ----------
  React.useEffect(() => {
    const key = JSON.stringify(results);
    if (hasData && key !== autoKey) {
      setAutoKey(key);
      void generate();
    }
  }, [generate, hasData, results, autoKey]);

  // ---------- COPY ----------
  const onCopy = async () => {
    const text = multidim;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const title =
    locale === "fr"
      ? "Lecture multidimensionnelle de votre profil"
      : "Your multidimensional profile";

  return (
    <div className="mt-6 space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">
            {locale === "fr"
              ? "Analyse générée automatiquement à partir de vos résultats."
              : "Analysis automatically generated based on your scores."}
          </p>
        </div>

        <button
          onClick={onCopy}
          disabled={!multidim}
          className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent/20 disabled:opacity-50"
        >
          {copied ? "Copié ✓" : "Copier la synthèse"}
        </button>
      </div>

      {/* STATE */}
      <div aria-live="polite" className="text-xs">
        {!hasData && (
          <p className="text-amber-600">
            {locale === "fr"
              ? "Les résultats doivent être calculés avant d’afficher le profil."
              : "Results must be computed before displaying the profile."}
          </p>
        )}
        {loading && (
          <p className="text-muted-foreground">
            {locale === "fr" ? "Analyse en cours…" : "Analysis in progress..."}
          </p>
        )}
        {error && <p className="text-red-600">{error}</p>}
      </div>

      {/* MULTIDIMENSIONAL SUMMARY + CONFIDENTIALITÉ */}
      {multidim && (
        <>
          <article className="prose prose-sm max-w-none rounded-2xl border bg-card/40 p-4 dark:prose-invert">
            <ReactMarkdown>{multidim}</ReactMarkdown>
          </article>

          <p className="text-[11px] text-muted-foreground border-l border-muted-foreground/30 pl-3">
            {locale === "fr" ? (
              <>
                Ces informations sont strictement confidentielles : elles ne
                sont visibles que par vous, ne sont transmises à personne et ne
                sont associées à aucune identité nominative.
              </>
            ) : (
              <>
                This information is strictly confidential: it is only visible to
                you, is not shared with anyone else and is not linked to any
                nominative identity.
              </>
            )}
          </p>
        </>
      )}

      {/* PER-DIMENSION CARDS */}
      {hasData && (
        <section className="space-y-4">
          <h3 className="text-sm font-semibold">
            {locale === "fr"
              ? "Détails de chaque dimension"
              : "Details for each dimension"}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {results.map((r) => {
              const score = Math.round(r.score * 10) / 10;
              const barColor = getScoreColor(score);
              const scoreLabel = getScoreLabel(score);

              const block = dimensionAnalyses[r.dimension];

              const definition = block?.definition ?? "";
              const interpretation = block?.interpretation ?? "";

              return (
                <div
                  key={r.dimension}
                  className="flex flex-col gap-3 rounded-2xl border bg-card/30 p-4 text-xs"
                >
                  {/* TITLE & SCORE */}
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-semibold text-[13px]">
                      {r.dimension}
                    </h4>

                    <span className="font-medium">
                      {score.toLocaleString("fr-FR", {
                        maximumFractionDigits: 1,
                      })}
                      {" / 100"}
                    </span>
                  </div>

                  {/* SCORE BAR */}
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${barColor}`}
                        style={{
                          width: `${Math.max(0, Math.min(100, score))}%`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {scoreLabel}
                    </p>
                  </div>

                  {/* DEFINITION GPT */}
                  {definition && (
                    <p className="text-[11px] leading-snug text-foreground/90">
                      <strong>Définition :</strong> {definition}
                    </p>
                  )}

                  {/* INTERPRETATION GPT */}
                  {interpretation && (
                    <p className="text-[11px] leading-snug text-foreground/80">
                      <strong>Lecture du score :</strong> {interpretation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
