"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LikertScale } from "@/components/LikertScale";
import { ProgressCircle } from "@/components/ProgressCircle";
import { AmbientSoundToggle } from "@/components/site/AmbientSoundToggle";
import { questions, dimensions, normalizeScore } from "@/lib/questions";
import { useQuizFlow } from "@/hooks/useQuizFlow";

import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";

function calculateScores(answers: Record<string, number>) {
  return dimensions.map((dim) => {
    const qs = questions.filter((q) => q.dimension === dim);
    const total = qs.reduce((sum, q) => {
      const raw = answers[q.id] ?? 0;
      const invert = !!q.inverted || q.dimension === "Stress";
      return sum + normalizeScore(raw, q.scale.min, q.scale.max, invert);
    }, 0);
    return total / qs.length;
  });
}


function getColor(score: number) {
  if (score > 70) return "#B2D8B2";
  if (score > 50) return "#FFD3E0";
  return "#A7C7E7";
}

function getAdvice(dim: string, score: number) {
  if (score > 70) return `Super, ${dim} au top !`;
  if (score > 50) return `${dim} : à peaufiner.`;
  return `${dim} : à surveiller.`;
}

export default function QuizPage() {
  const {
    phase,
    pseudo,
    setPseudo,
    step,
    answers,
    progress,
    profile,
    setProfile,
    loading,
    error,
    handleAnswer,
    nextQuestion,
    startQuiz,
    submitQuiz,
  } = useQuizFlow();

  // ————————————————————————————————————————————————
  // Phase 1 – Pseudo (Intro)
  // ————————————————————————————————————————————————
  if (phase === "intro") {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-4"
        >
          <div className="max-w-lg w-full bg-card rounded-3xl shadow-soft p-8 border border-accent/10 space-y-6">
            <h1 className="text-2xl font-bold text-center text-primary">
              Questionnaire Bien-Être
            </h1>
            <p className="text-muted-foreground text-center px-4">
              Ce questionnaire est <strong>anonyme</strong> et vise à mieux
              comprendre le bien-être au travail. <br />
              Choisissez simplement un pseudo pour commencer.
            </p>
            <div>
              <Label>Pseudo</Label>
              <Input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Ex : SoleilCalme"
                className="rounded-full text-center"
              />
            </div>
            {error && (
              <p className="text-destructive text-center" role="alert">
                {error}
              </p>
            )}
            <Button
              onClick={startQuiz}
              disabled={!pseudo.trim()}
              className="w-full rounded-full bg-gradient-to-r from-primary to-secondary"
            >
              Commencer le questionnaire
            </Button>
          </div>
        </motion.div>
        <AmbientSoundToggle />
      </>
    );
  }

  // ————————————————————————————————————————————————
  // Phase 2 – Questions
  // ————————————————————————————————————————————————
  if (phase === "quiz") {
    return (
      <>
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            background: [
              "linear-gradient(135deg, #ecfdf5, #d1fae5)",
              "linear-gradient(135deg, #e0f2fe, #bae6fd)",
              "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
            ],
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-500"
        >
          <div className="max-w-lg w-full bg-card rounded-3xl shadow-soft p-8 border border-accent/10 flex flex-col items-center">
            <div className="flex justify-center mb-6">
              <ProgressCircle value={progress} autoColor />
            </div>

            <AnimatePresence mode="wait">
              <motion.h2
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-xl font-semibold text-center text-foreground mb-8 leading-relaxed"
              >
                {questions[step].text}
              </motion.h2>
            </AnimatePresence>

            <LikertScale
              min={questions[step].scale.min}
              max={questions[step].scale.max}
              value={answers[questions[step].id] ?? 0}
              onChange={(val) => handleAnswer(questions[step].id, val)}
              labels={[
                questions[step].scale.labels?.[0] ?? "Pas du tout d’accord",
                questions[step].scale.labels?.[1] ?? "Tout à fait d’accord",
              ]}
            
            />

            <Button
              onClick={nextQuestion}
              disabled={!answers[questions[step].id]}
              className="mt-8 w-full rounded-full bg-gradient-to-r from-primary to-secondary hover:brightness-110"
            >
              {step === questions.length - 1 ? "Terminer" : "Suivant"}
            </Button>

            <p className="text-sm text-muted-foreground mt-3">
              Question {step + 1} sur {questions.length}
            </p>
          </div>
        </motion.div>
        <AmbientSoundToggle />
      </>
    );
  }

  // ————————————————————————————————————————————————
  // Phase 3 – Profil anonyme
  // ————————————————————————————————————————————————
  if (phase === "profile") {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/10 to-accent/10"
        >
          <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-soft border border-accent/10 space-y-6">
            <h2 className="text-2xl font-semibold text-center text-primary">
              🌿 Dernière étape
            </h2>
            <p className="text-muted-foreground text-center">
              Ces informations sont <strong>anonymes</strong> et facultatives.
            </p>

            <div className="space-y-4">
              {(
                [
                  ["Établissement", "facility", ["Les Jardins du Soleil", "Résidence Harmonie", "Villa des Lilas", "Les Chênes Bleus"]],
                  ["Fonction / Emploi", "job", ["Aide-soignant(e)", "Infirmier(e)", "Agent de service", "Animateur(trice)", "Cuisinier(e)", "Direction / Administration"]],
                  ["Tranche d’âge", "age", ["Moins de 25 ans", "25-35 ans", "36-50 ans", "51 ans et plus"]],
                  ["Ancienneté", "seniority", ["Moins d’un an", "1 à 3 ans", "4 à 7 ans", "8 ans et +"]],
                ] as [string, keyof typeof profile, string[]][]
              ).map(([label, key, options]) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <select
                    value={profile[key] as string}
                    onChange={(e) =>
                      setProfile({ ...profile, [key]: e.target.value })
                    }
                    className="w-full mt-1 border border-input rounded-lg p-2 bg-background"
                  >
                    <option value="">Sélectionnez</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="consent"
                  checked={profile.consent}
                  onChange={(e) =>
                    setProfile({ ...profile, consent: e.target.checked })
                  }
                />
                <label
                  htmlFor="consent"
                  className="text-sm text-muted-foreground"
                >
                  J’accepte que mes réponses anonymes soient utilisées à des fins internes.
                </label>
              </div>
            </div>

            <Button
              onClick={submitQuiz}
              disabled={
                !profile.facility ||
                !profile.job ||
                !profile.age ||
                !profile.seniority ||
                !profile.consent ||
                loading
              }
              className="w-full bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all duration-300 shadow-md rounded-full"
            >
              {loading ? "Envoi..." : "Voir mes résultats"}
            </Button>
          </div>
        </motion.div>
        <AmbientSoundToggle />
      </>
    );
  }

  // ————————————————————————————————————————————————
  // Phase 4 – Résultats finaux
  // ————————————————————————————————————————————————
  if (phase === "results") {
    const scores = calculateScores(answers);
    const chartData = dimensions.map((dim, i) => ({
      dimension: dim,
      score: Math.min(scores[i], 100),
      fill: getColor(scores[i]),
    }));

    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex flex-col items-center p-4"
        >
          <h1 className="text-3xl font-bold mb-6 text-primary text-center">
            Vos Résultats
          </h1>

          <div className="w-full max-w-lg">
            <ResponsiveContainer width="100%" height={350}>
              {/* @ts-ignore – recharts typings are incomplete */}
                <RadarChart data={chartData} outerRadius="80%" isAnimationActive>

                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Votre Score"
                  dataKey="score"
                  stroke="#3B82F6"
                  fill="#93C5FD"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    maxWidth: "200px",
                    whiteSpace: "normal",
                    fontSize: "14px",
                  }}
                  formatter={(value: number, _name: string, props: any) => [
                    `${value}%`,
                    getAdvice(props.payload.dimension, value),
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <AmbientSoundToggle />
      </>
    );
  }

  return null;
}
