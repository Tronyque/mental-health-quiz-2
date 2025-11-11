// hooks/useQuizFlow.ts
'use client';

import { useState } from 'react';
import { questions } from '@/lib/questions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function useQuizFlow() {
  // ————————————————————————————————————————————————
  // 🔹 États principaux du flux
  // ————————————————————————————————————————————————
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'profile' | 'results' | 'final'>('intro');
  const [pseudo, setPseudo] = useState('');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    facility: '',
    job: '',
    age: '',
    seniority: '',
    comment: '',
    consent: false,
  });

  // ————————————————————————————————————————————————
  // 🧮 Progression
  // ————————————————————————————————————————————————
  const progress = Math.round(((step + 1) / questions.length) * 100);
  const currentQuestion = questions[step];

  // ————————————————————————————————————————————————
  // 🧠 Navigation entre les phases
  // ————————————————————————————————————————————————
  const startQuiz = () => {
    if (!pseudo.trim()) {
      setError('Merci d’entrer un pseudo.');
      return;
    }
    setError('');
    setPhase('quiz');
  };

  const nextQuestion = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setPhase('profile');
    }
  };

  const prevQuestion = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // ————————————————————————————————————————————————
  // 🧾 Soumission finale (vers Supabase via API)
  // ————————————————————————————————————————————————
  const submitQuiz = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudo,
          answers: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value,
          })),
          consent: profile.consent,
          profile: {
            facility: profile.facility,
            job: profile.job,
            age: profile.age,
            seniority: profile.seniority,
            comment: profile.comment,
          },
          context: {
            questionnaireVersion: 'v1',
            durationSeconds: null,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erreur de soumission');
      setPhase('results');
    } catch (err: any) {
      console.error('❌ submitQuiz error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ————————————————————————————————————————————————
  // 🔁 Réinitialisation complète
  // ————————————————————————————————————————————————
  const reset = () => {
    setPhase('intro');
    setPseudo('');
    setAnswers({});
    setStep(0);
    setProfile({
      facility: '',
      job: '',
      age: '',
      seniority: '',
      comment: '',
      consent: false,
    });
    setError('');
  };

  // ————————————————————————————————————————————————
  // 🧩 Données et actions exportées
  // ————————————————————————————————————————————————
  return {
    phase,
    setPhase,
    pseudo,
    setPseudo,
    step,
    answers,
    currentQuestion,
    progress,
    profile,
    setProfile,
    loading,
    error,
    handleAnswer,
    nextQuestion,
    prevQuestion,
    startQuiz,
    submitQuiz,
    reset,
  };
}
