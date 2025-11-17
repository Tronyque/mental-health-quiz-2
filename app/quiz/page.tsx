"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LikertScale } from "@/components/LikertScale";
import { ProgressCircle } from "@/components/ProgressCircle";
import { AmbientSoundToggle } from "@/components/site/AmbientSoundToggle";
import { questions, dimensions, normalizeScore } from "@/lib/questions";
import ResultsRadar from "@/components/ResultsRadar";
import ReportGenerator from "@/components/ReportGenerator";
import ResultsView from "@/components/ResultsView";


/* === Helpers === */
function calculateScores(answers: number[]) {
  return dimensions.map((dim) => {
    const qs = questions.filter((q) => q.dimension === dim);
    const total = qs.reduce((sum, q) => {
      const idx = questions.findIndex((qq) => qq.id === q.id);
      const raw = answers[idx] ?? 0;
      return sum + normalizeScore(raw, q.scale.min, q.scale.max, !!q.inverted);
    }, 0);
    return total / Math.max(qs.length, 1);
  });
}

const labelForDim = (dim: string) =>
  dim === "Stress et détente" ? "Détente (↗ mieux)" : dim;

/* === Types locaux === */
type ProfileForm = {
  facility: string; // sera l’UUID de l’EHPAD
  job: string;
  age: string;
  seniority: string;
  comment?: string;
};

// ⚠️ L’API /api/submit attend { questionId, score }
type AnswerRow = { questionId: string; score: number };

/* === Page === */
const QuizPage: FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(questions.length).fill(0)
  );

  // Pseudo uniquement ici (le consentement a été traité avant)
  const [pseudo, setPseudo] = useState("");
  const [pseudoEntered, setPseudoEntered] = useState(false);

  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState<ProfileForm>({
    facility: "",
    job: "",
    age: "",
    seniority: "",
    comment: "",
  });

  const startIfReady = () => {
    if (!pseudo.trim()) {
      setError("Merci d’entrer un pseudo.");
      return;
    }
    setError("");
    setPseudoEntered(true);
  };

  const handleNext = () => {
    if ((answers[step] ?? 0) === 0) return;
    if (step < questions.length - 1) setStep((s) => s + 1);
    else setShowProfileForm(true);
  };

  const submitResponses = async (p: ProfileForm) => {
    setError("");
    setLoading(true);
    try {
      // ✅ tableau { questionId, score } attendu par /api/submit
      const formattedAnswers: AnswerRow[] = questions
        .map((q, i) => ({
          questionId: q.id,
          score: Number(answers[i] ?? 0), // IMPORTANT: score numérique 1..5
        }))
        // on filtre les non-réponses si min > 0
        .filter((row) => {
          const q = questions.find((qq) => qq.id === row.questionId)!;
          return row.score >= q.scale.min;
        });

      const payload = {
        facilityId: p.facility, // ⚠️ doit être l’UUID de l’EHPAD
        pseudo: pseudo.trim(),
        job: p.job,
        ageRange: p.age,
        seniority: p.seniority,
        comment: p.comment?.trim() || null,
        consented: true,
        answers: formattedAnswers,
      };

      console.log("submit payload", payload);

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      console.log("RAW /api/submit response:", res.status, rawText);

      let body: any = {};
      try {
        body = rawText ? JSON.parse(rawText) : {};
      } catch (e) {
        console.warn("Impossible de parser le JSON de /api/submit:", e);
      }

      console.log("PARSED /api/submit body:", body);

      if (!res.ok || body.ok === false) {
        console.error("submitQuiz failed raw parsed:", body);
        throw new Error(body.error || "Erreur lors de l’envoi du questionnaire");
      }

      console.log("Submission ok, id =", body.submissionId);
    } catch (err: any) {
      console.error("submitQuiz failed:", err?.message || err);
      setError(
        "Envoi momentanément indisponible — affichage des résultats locaux."
      );
    } finally {
      setLoading(false);
      setShowResults(true); // ✅ on affiche quand même les résultats locaux
    }
  };

  /* === Loader global === */
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-accent/10"
      >
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </motion.div>
    );
  }

  /* === Étape 3 : Profil === */
  if (showProfileForm && !showResults) {
    const EHPADS = [
      {
        id: "a5eeb954-463a-426a-8d57-09fe0abbc0b7",
        label: "Les Jardins du Soleil",
      },
      {
        id: "3242e4db-1a1e-44a3-b52f-375abb9de91e",
        label: "Résidence Harmonie",
      },
      {
        id: "d74b346f-96d7-4c4f-bbb4-f4339c39c11e",
        label: "Villa des Lilas",
      },
      {
        id: "8568d623-d2b9-4b26-81a1-dfefeaa86a0e",
        label: "Les Chênes Bleus",
      },
    ];

    const JOBS = [
      "Aide-soignant(e)",
      "Infirmier(e)",
      "Agent de service",
      "Animateur(trice)",
      "Cuisinier(e)",
      "Direction / Administration",
    ];
    const AGE_RANGES = [
      "Moins de 25 ans",
      "25-35 ans",
      "36-50 ans",
      "51 ans et plus",
    ];
    const SENIORITY = ["Moins d’un an", "1 à 3 ans", "4 à 7 ans", "8 ans et +"];

    const canSubmit =
      !!profile.facility &&
      !!profile.job &&
      !!profile.age &&
      !!profile.seniority;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-accent/10 p-4"
      >
        <div className="bg-card rounded-2xl shadow-soft border border-accent/10 p-6 md:p-8 max-w-xl w-full
                        bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
          <h2 className="text-2xl font-semibold text-center text-primary mb-4">
            🌿 Avant les résultats
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            Ces informations sont <strong>anonymes</strong> et aident à
            comprendre les contextes de travail.
          </p>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="facility">EHPAD / Établissement</Label>
              <select
                id="facility"
                value={profile.facility}
                onChange={(e) =>
                  setProfile({ ...profile, facility: e.target.value })
                }
                className="w-full mt-1 border border-input rounded-lg p-2 bg-background"
              >
                <option value="">Sélectionnez</option>
                {EHPADS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="job">Emploi / Fonction</Label>
              <select
                id="job"
                value={profile.job}
                onChange={(e) =>
                  setProfile({ ...profile, job: e.target.value })
                }
                className="w-full mt-1 border border-input rounded-lg p-2 bg-background"
              >
                <option value="">Sélectionnez</option>
                {JOBS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="age">Tranche d’âge</Label>
              <select
                id="age"
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: e.target.value })
                }
                className="w-full mt-1 border border-input rounded-lg p-2 bg-background"
              >
                <option value="">Sélectionnez</option>
                {AGE_RANGES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="seniority">Ancienneté</Label>
              <select
                id="seniority"
                value={profile.seniority}
                onChange={(e) =>
                  setProfile({ ...profile, seniority: e.target.value })
                }
                className="w-full mt-1 border border-input rounded-lg p-2 bg-background"
              >
                <option value="">Sélectionnez</option>
                {SENIORITY.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="comment">Commentaire libre (facultatif)</Label>
              <textarea
                id="comment"
                value={profile.comment}
                onChange={(e) =>
                  setProfile({ ...profile, comment: e.target.value })
                }
                placeholder="Exprimez-vous librement…"
                className="w-full min-h-[100px] p-3 rounded-xl border border-accent/30 bg-background text-foreground shadow-inner focus:ring-2 focus:ring-primary focus:outline-none resize-none transition-all"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => void submitResponses(profile)}
              disabled={!canSubmit}
              className="rounded-full px-6 py-2 font-semibold
                        bg-primary text-primary-foreground
                        bg-blue-600 text-white hover:brightness-110
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voir mes résultats
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  /* === Étape 4 : Résultats === */
  if (showResults) {
    const scores = calculateScores(answers);
    const chartData = dimensions.map((dim, i) => {
      const raw = Math.min(scores[i], 100);
      const rounded = Math.round(raw * 10) / 10;
      return {
        dimension: labelForDim(dim),
        score: rounded,
      };
    });

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-dvh flex flex-col items-center p-4 bg-gradient-to-br from-background via-secondary/10 to-accent/10"
      >
        <h1 className="text-3xl font-bold mb-4 text-primary text-center">
          Merci pour votre participation 🌼
        </h1>

        <ResultsView results={chartData} locale="fr" />
      </motion.div>
    );
  }
  /* === Étape 1 & 2 : PSEUDO puis QUESTIONS === */
  const current = questions[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/10 to-accent/10"
    >
      <div
        className="w-full mx-auto bg-card rounded-2xl shadow-soft p-6 md:p-8 border border-accent/10 max-w-2xl
                   bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {!pseudoEntered ? (
          // === PSEUDO SEUL ===
          <div className="mx-auto max-w-xl text-center space-y-7">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                Entrez votre pseudo pour commencer
              </h2>
              <p className="text-muted-foreground">
                Le consentement a été recueilli sur la page précédente.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pseudo" className="text-base">
                Pseudo (pour rester anonyme)
              </Label>
              <Input
                id="pseudo"
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Ex : SoleilCalme"
                className="h-11 rounded-full text-center"
              />
            </div>

            {error && <p className="text-destructive">{error}</p>}
            <Button
              className="w-full h-11 rounded-full font-semibold
                         bg-primary text-primary-foreground
                         bg-blue-600 text-white hover:brightness-110"
              disabled={!pseudo.trim()}
              onClick={startIfReady}
            >
              Je commence
            </Button>
          </div>
        ) : (
          // === QUESTIONS ===
          <div className="space-y-6 text-center">
            {/* Cercle de progression */}
            {(() => {
              const pct = ((step + 1) / questions.length) * 100;
              console.log("progress % =", pct);
              return (
                <div className="w-full flex justify-center">
                  <ProgressCircle value={pct} autoColor />
                </div>
              );
            })()}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col items-center justify-center w-full text-center"
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground/90 mb-6 leading-relaxed">
                  {current.text}
                </h2>

                <div className="flex justify-center w-full">
                  <LikertScale
                    min={current.scale.min}
                    max={current.scale.max}
                    value={answers[step] ?? 0}
                    onChange={(val) => {
                      const next = [...answers];
                      next[step] = val;
                      setAnswers(next);
                    }}
                    labels={current.scale.labels}
                    dense
                  />
                </div>

                {/* BOUTONS */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="rounded-full"
                  >
                    Précédent
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!answers[step]}
                    className="rounded-full font-semibold
                              bg-primary text-primary-foreground
                              bg-blue-600 text-white hover:brightness-110
                              disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {step === questions.length - 1 ? "Terminer" : "Suivant"}
                  </Button>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Question {step + 1} sur {questions.length}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bouton son flottant */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <AmbientSoundToggle />
      </div>
    </motion.div>
  );
};

export default QuizPage;
