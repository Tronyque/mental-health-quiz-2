'use client';
import * as React from 'react';

type Result = { dimension: string; score: number };

type Props = {
  results: Result[];          // [{ dimension, score }]
  locale?: 'fr' | 'en';
  autoGenerate?: boolean;     // génère automatiquement au montage
  onReport?: (text: string) => void; // callback parent
  endpoint?: string;          // override (défaut: /api/report)
  timeoutMs?: number;         // timeout requête (ms)
  retryOn5xx?: boolean;       // réessayer 1x si erreur 5xx
};

export default function ReportGenerator({
  results,
  locale = 'fr',
  autoGenerate = false,
  onReport,
  endpoint = '/api/report',
  timeoutMs = 20000,
  retryOn5xx = true,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [copied, setCopied] = React.useState(false);

  const hasData = Array.isArray(results) && results.length > 0;

  const generate = React.useCallback(async () => {
    if (!hasData) {
      setError("Aucun résultat à interpréter.");
      return;
    }
    const payload = {
      results: results.map((r) => ({ label: r.dimension, value: r.score })),
      locale,
    };

    const doRequest = async (): Promise<Response> => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        return res;
      } finally {
        clearTimeout(id);
      }
    };

    try {
      setLoading(true);
      setError('');
      setText('');

      let res = await doRequest();

      // retry une fois si 5xx réseau/API (optionnel)
      if (retryOn5xx && res.status >= 500) {
        res = await doRequest();
      }

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || `Erreur de génération (${res.status})`);
      }

      const report = (json?.report ?? '').toString().trim();
      setText(report);
      onReport?.(report);
    } catch (e: any) {
      setError(
        e?.name === 'AbortError'
          ? 'La génération a expiré (timeout). Réessaie.'
          : e?.message || 'Erreur inconnue'
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint, hasData, locale, onReport, results, retryOn5xx, timeoutMs]);

  React.useEffect(() => {
    if (autoGenerate) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGenerate]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={generate}
          disabled={loading || !hasData}
          className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50"
        >
          {loading ? 'Génération…' : 'Générer un compte rendu bienveillant'}
        </button>

        <button
          onClick={onCopy}
          disabled={!text}
          className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm hover:bg-accent/20 disabled:opacity-50"
          title="Copier le texte"
        >
          {copied ? 'Copié ✓' : 'Copier'}
        </button>
      </div>

      {/* Zone d’état accessible */}
      <div aria-live="polite" className="text-sm">
        {!hasData && (
          <p className="text-amber-600">
            Ajoute des résultats pour générer un compte rendu.
          </p>
        )}
        {error && <p className="text-red-600">{error}</p>}
      </div>

      {/* Résultat */}
      {text && (
        <article className="prose prose-sm max-w-none dark:prose-invert bg-card/50 rounded-2xl p-4 border">
          {text}
        </article>
      )}
    </div>
  );
}
