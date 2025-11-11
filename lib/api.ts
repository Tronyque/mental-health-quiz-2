// lib/api.ts
export type AnswerPayload = {
  question_id: string; // id question côté UI
  score: number; // valeur 1..5
};

export type ProfileData = {
  facility: string;
  job: string;
  age: string;
  seniority: string;
  comment?: string;
};

type SubmitResponse =
  | { submissionId?: string; scores: Record<string, number>; persisted: boolean }
  | { error: string };

export async function submitQuiz(
  pseudo: string,
  answers: AnswerPayload[],
  profile: ProfileData,
  consent = true,
  context: Record<string, unknown> = {},
): Promise<SubmitResponse> {
  const payload = {
    pseudo: pseudo.trim(),
    answers: answers.map((a) => ({
      questionId: a.question_id,
      value: a.score,
    })),
    consent,
    profile,
    context,
  };

  const res = await fetch('/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = 'Erreur lors de la soumission';
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      msg = await res.text();
    }
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return (await res.json()) as SubmitResponse;
}
