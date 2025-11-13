// lib/api.ts
/** Helpers API — Next.js 16 / Turbopack */

export type ApiError = Error & { status?: number; details?: unknown };

function toApiError(message: string, status?: number, details?: unknown): ApiError {
  const err = new Error(message) as ApiError;
  err.name = 'ApiError';
  if (status) err.status = status;
  if (details !== undefined) err.details = details;
  return err;
}

export async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit,
  timeoutMs = 15000
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    clearTimeout(id);

    // Lire le body UNE seule fois
    const contentType = res.headers.get('content-type') ?? '';
    const raw = await res.text();

    let data: any = null;
    if (contentType.includes('application/json')) {
      try {
        data = JSON.parse(raw);
      } catch {
        /* ignore */
      }
    }

    if (res.ok) {
      return (data ?? (raw as unknown)) as T;
    }

    const msg = (data && (data.error || data.message)) || raw || `HTTP ${res.status} ${res.statusText}`;
    throw toApiError(msg, res.status, data ?? raw);
  } catch (e: any) {
    if (e?.name === 'AbortError') throw toApiError('La requête a expiré (timeout)', 408);
    if (e instanceof Error) throw e as ApiError;
    throw toApiError('Erreur réseau inconnue', undefined, e);
  }
}

/* ----------------------------- Quiz helpers ----------------------------- */

export type AnswerPayload = {
  results: Array<{ label: string; value: number }>;
  meta?: Record<string, unknown>;
  locale?: 'fr' | 'en';
};

export type ProfileData = {
  results?: Array<{ label: string; value: number }>;
  report?: string;
  summary?: string;
  [k: string]: unknown;
};

// Par défaut on cible l’API de génération de compte rendu
const QUIZ_ENDPOINT = '/api/submit';


/**
 * submitQuiz — compatible /api/submit ET /api/report
 * - Si endpoint se termine par '/api/submit' → envoie { pseudo, answers, consent, profile, context }
 * - Sinon (ex. /api/report) → envoie { results, locale, meta }
 *
 * Ancienne signature supportée :
 *   submitQuiz(pseudo, formattedAnswers, profile, consent, endpoint?)
 * Nouvelle signature (payload direct) :
 *   submitQuiz({ results, meta, locale }, endpoint?)    // pour /api/report
 *   submitQuiz({ pseudo, answers, consent, profile, context }, '/api/submit')
 */
export async function submitQuiz<T = ProfileData>(
  a: any,
  b?: any,
  c?: any,
  d?: any,
  e?: any
): Promise<T> {
  // --- Détection payload direct ---
  if (a && typeof a === 'object' && !Array.isArray(a)) {
    const endpoint = (typeof b === 'string' ? b : QUIZ_ENDPOINT) as string;

    // Mode /api/submit (payload “zod”)
    if (endpoint.endsWith('/api/submit')) {
      const payload = a as {
        pseudo: string;
        answers: Array<{ questionId: string; value: number }>;
        consent: boolean;
        profile: { facility: string; job: string; age: string; seniority: string; comment?: string };
        context?: Record<string, unknown>;
      };
      return apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(payload) });
    }

    // Mode /api/report (payload “résultats”)
    const payload = a.results
      ? a
      : { results: Array.isArray(a) ? a : [], locale: 'fr' };
    return apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(payload) });
  }

  // --- Ancienne signature ---
  // submitQuiz(pseudo, formattedAnswers, profile, consent, endpoint?)
  const pseudo = a as string;
  const formattedAnswers = b; // peut être Array ou Record
  const profile = c;
  const consent = typeof d === 'boolean' ? d : true;
  const endpoint = (typeof d === 'string' ? d : typeof e === 'string' ? e : QUIZ_ENDPOINT) as string;

  // Normalisation des réponses en tableau {questionId,value}
  const answers: Array<{ questionId: string; value: number }> = Array.isArray(formattedAnswers)
    ? formattedAnswers.map((x: any) =>
        'questionId' in x && 'value' in x
          ? { questionId: String(x.questionId), value: Number(x.value) }
          : { questionId: String(x?.label ?? x?.[0] ?? ''), value: Number(x?.value ?? x?.[1] ?? 0) }
      )
    : Object.entries(formattedAnswers ?? {}).map(([questionId, value]) => ({
        questionId,
        value: Number(value as any),
      }));

  // Si on cible /api/submit → conforme au schéma zod
  if (endpoint.endsWith('/api/submit')) {
    const payload = {
      pseudo: String(pseudo ?? '').trim(),
      answers,
      consent: Boolean(consent),
      profile: profile ?? {},
      context: { questionnaireVersion: 'v1', locale: 'fr' },
    };
    return apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(payload) });
  }

  // Sinon, /api/report → payload “résultats”
  const results = answers.map((a) => ({ label: a.questionId, value: a.value }));
  const payload = { results, locale: 'fr', meta: { pseudo, profile, wantReport: true } };
  return apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(payload) });
}
