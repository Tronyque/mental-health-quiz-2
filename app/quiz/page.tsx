"use client";

import { FC, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import { LikertScale } from "@/components/LikertScale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProgressCircle } from "@/components/ProgressCircle";
import { AmbientSoundToggle } from "@/components/site/AmbientSoundToggle";

import { questions, dimensions, normalizeScore } from "@/lib/questions";
import { submitQuiz, type ProfileData, type AnswerPayload } from "@/lib/api";

import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";

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

const getAdvice = (dim: string, score: number) =>
  score > 70
    ? `Super, ${labelForDim(dim)} au top !`
    : score > 50
    ? `${labelForDim(dim)} : à peaufiner.`
    : `${labelForDim(dim)} : à surveiller.`;

/* === Page === */
const QuizPage: FC = () => {
  // Étapes
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(questions.length).fill(0)
  );

  // Intro
  const [pseudo, setPseudo] = useState("");
  const [pseudoEntered, setPseudoEntered] = useState(false);
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState("");

  // Profil / résultats
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Réseau
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    facility: "",
    job: "",
    age: "",
    seniority: "",
    comment: "",
  });

  // Charger le consentement depuis localStorage au montage
  useEffect(() => {
    try {
      const c = localStorage.getItem("mhq-consent") === "true";
      setConsented(c);
    } catch {
      setConsented(false);
    }
  }, []);

  // Démarrer si pseudo + consentement OK
  const startIfReady = async () => {
    if (!pseudo.trim() || !consented) {
      if (!pseudo.trim()) setError("Merci d’entrer un pseudo.");
      return;
    }
    setError("");
    try {
      localStorage.setItem("mhq-consent", "true");
      await fetch("/api/consent", { method: "POST" });
    } catch (e) {
      console.error("consent:", e);
    }
    setPseudoEntered(true);
  };

  /* === Soumission === */
  const submitResponses = async (p: ProfileData) => {
    setError("");
    setLoading(true);
    try {
      const formattedAnswers: AnswerPayload[] = questions.map((q, i) => ({
        question_id: q.id,
        score: answers[i],
      }));

      const consent =
        typeof window !== "undefined"
          ? localStorage.getItem("mhq-consent") === "true"
          : true;

      await submitQuiz(pseudo.trim(), formattedAnswers, p, consent);
      setShowResults(true);
    } catch (err: any) {
      console.error("submitQuiz failed:", err);
      setError(
        err?.message || "Erreur lors de la soumission. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  /* === Navigation === */
  const handleNext = () => {
    if ((answers[step] ?? 0) === 0) return;
    if (step < questions.length - 1) setStep((s) => s + 1);
    else setShowProfileForm(true);
  };

  /* === Loader === */
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-dvh flex items-center justify-center bg-linear-to-br from-background via-secondary/10 to-accent/10"
      >
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </motion.div>
    );
  }

  /* === Étape 3 : Formulaire profil === */
  if (showProfileForm && !showResults) {
    const EHPADS = [
      "Les Jardins du Soleil",
      "Résidence Harmonie",
      "Villa des Lilas",
      "Les Chênes Bleus",
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
        className="min-h-dvh grid grid-rows-[auto,1fr] bg-linear-to-br from-background via-secondary/10 to-accent/10"
      >
        {/* Header simple */}
        <header className="px-4 pt-4 pb-2">
          <h2 className="text-base font-semibold">Dernière étape</h2>
        </header>

        {/* Contenu scrollable */}
        <section className="overflow-y-auto px-4 pb-6 flex items-center justify-center">
          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-soft border border-accent/10 max-w-xl w-full">
            <h2 className="text-2xl font-semibold text-center text-primary mb-4">
              🌿 Avant les résultats
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Ces informations sont <strong>anonymes</strong> et aident à
              comprendre les contextes de travail.
            </p>

            <div className="grid gap-4">
              {/* EHPAD */}
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
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Emploi / Fonction */}
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

              {/* Tranche d’âge */}
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

              {/* Ancienneté */}
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

              {/* Commentaire libre */}
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
                className="rounded-full px-6 py-2"
                disabled={!canSubmit}
              >
                Envoyer et voir mes résultats
              </Button>
            </div>
          </div>
        </section>
      </motion.div>
    );
  }

  /* === Étape 4 : Résultats === */
  if (showResults) {
    const scores = calculateScores(answers);
    const chartData = dimensions.map((dim, i) => ({
      dimension: labelForDim(dim),
      score: Math.min(scores[i], 100),
    }));

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-dvh grid grid-rows-[auto,1fr] bg-linear-to-br from-background via-secondary/10 to-accent/10"
      >
        <header className="px-4 pt-4 pb-2">
          <h1 className="text-base font-semibold">Résultats</h1>
        </header>

        <section className="overflow-y-auto p-4 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4 text-primary text-center">
            Merci pour votre participation 🌼
          </h2>

          <div className="w-full max-w-lg">
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={chartData} outerRadius="75%">
                <defs>
                  <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.55}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-accent)"
                      stopOpacity={0.35}
                    />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="hsl(var(--color-foreground)/0.12)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{
                    fontSize: 12,
                    fill: "hsl(var(--color-foreground)/0.6)",
                  }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "hsl(var(--color-foreground)/0.5)" }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--color-foreground)/0.35)"
                  fill="url(#radarFill)"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--color-border))",
                  }}
                  formatter={(value: number, _n: string, props: any) => [
                    `${value}%`,
                    getAdvice(props.payload.dimension, value),
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <Button variant="secondary" asChild className="mt-6 rounded-full">
            <a href="/">Revenir à l’accueil</a>
          </Button>
        </section>
      </motion.div>
    );
  }

  /* === Étape 1 & 2 : Intro (pseudo + consentement) puis Questions === */
  const current = questions[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // Layout 100 % viewport : header / contenu scrollable / footer sticky
      className="min-h-dvh grid grid-rows-[auto,1fr,auto] bg-linear-to-br from-background via-secondary/10 to-accent/10"
    >
      {/* HEADER */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-base font-semibold">
            {!pseudoEntered ? "Bienvenue" : `Question ${step + 1} sur ${questions.length}`}
          </h1>

          {/* Mini progression (barre fine) visible en phase questions */}
          {pseudoEntered && (
            <div className="h-1 w-28 rounded-full bg-accent/30 overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${Math.round(((step + 1) / questions.length) * 100)}%`,
                }}
              />
            </div>
          )}
        </div>
      </header>

      {/* CONTENU (scrollable localement, pour éviter de scroller toute la page) */}
      <section className="overflow-y-auto px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mx-auto bg-card rounded-2xl shadow-soft p-6 md:p-8 border border-accent/10 max-w-2xl"
        >
          {!pseudoEntered ? (
            // === ÉTAPE : PSEUDO + CONSENTEMENT ===
            <div className="mx-auto max-w-xl text-center space-y-7">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                  Bienvenue, vous qui prenez soin chaque jour 💙
                </h2>
                <p className="text-muted-foreground">
                  Participez à un court questionnaire pour prendre soin aussi de{" "}
                  <strong>votre bien-être au travail</strong>. À la fin, vous
                  recevrez une <strong>synthèse anonyme</strong>, uniquement pour vous.
                </p>
              </div>

              {/* 3 points clés */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl border border-accent/20 bg-background/60 p-3">
                  <div className="font-medium">Anonyme</div>
                  <div className="text-muted-foreground">Aucune donnée identifiante</div>
                </div>
                <div className="rounded-xl border border-accent/20 bg-background/60 p-3">
                  <div className="font-medium">Bienveillant</div>
                  <div className="text-muted-foreground">Zéro jugement individuel</div>
                </div>
                <div className="rounded-xl border border-accent/20 bg-background/60 p-3">
                  <div className="font-medium">Utile</div>
                  <div className="text-muted-foreground">Synthèse visuelle finale</div>
                </div>
              </div>

              {/* Pseudo */}
              <div className="space-y-2">
                <Label htmlFor="pseudo" className="text-base">
                  Choisissez un pseudo (pour rester anonyme)
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

              {/* Consentement RGPD */}
              <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-left space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-input"
                    checked={consented}
                    onChange={async (e) => {
                      const ok = e.currentTarget.checked;
                      setConsented(ok);
                      try {
                        localStorage.setItem("mhq-consent", ok ? "true" : "false");
                        await fetch("/api/consent", { method: ok ? "POST" : "DELETE" });
                      } catch (err) {
                        console.error("consent set failed:", err);
                      }
                    }}
                  />
                  <span className="text-sm leading-relaxed">
                    Je consens au <strong>traitement anonyme</strong> de mes réponses
                    pour des analyses collectives. Aucune donnée identifiante n’est collectée.
                    <br />
                    <Link href="/privacy" className="underline text-primary">
                      En savoir plus (Politique de confidentialité)
                    </Link>
                    .
                  </span>
                </label>
                <p className="text-xs text-muted-foreground">
                  Une <strong>synthèse anonyme</strong> vous sera présentée à la fin.
                </p>
              </div>

              {/* CTA */}
              {error && <p className="text-destructive">{error}</p>}
              <Button
                className="w-full h-11 rounded-full font-semibold"
                disabled={!pseudo.trim() || !consented}
                onClick={startIfReady}
              >
                Je consens et je commence
              </Button>
            </div>
          ) : (
            // === ÉTAPE : QUESTIONS ===
            <div className="space-y-6 text-center">
              {/* Progress circle centré */}
              <div className="w-full flex justify-center">
                <ProgressCircle
                  value={((step + 1) / questions.length) * 100}
                  autoColor
                  size={112}
                  thickness={10}
                />
              </div>

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
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Positionne les hints/progression en texte plus bas */}
              <p className="text-sm text-muted-foreground">
                Question {step + 1} sur {questions.length}
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* FOOTER STICKY (navigation) — uniquement pendant les questions */}
      <footer className="sticky bottom-0 border-t border-accent/30 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 px-4 py-3">
        {!pseudoEntered ? (
          <div className="text-xs text-muted-foreground text-center">
            Cochez le consentement pour commencer.
          </div>
        ) : showProfileForm ? (
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowProfileForm(false);
                setStep(questions.length - 1);
              }}
              className="rounded-full"
            >
              Retour aux questions
            </Button>
            <div className="text-xs text-muted-foreground">Profil</div>
            <div className="w-20" />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-full"
            >
              Précédent
            </Button>
            <div className="text-xs text-muted-foreground">
              {Math.round(((step + 1) / questions.length) * 100)}%
            </div>
            <Button
              onClick={handleNext}
              disabled={!answers[step]}
              className="rounded-full"
            >
              {step === questions.length - 1 ? "Terminer" : "Suivant"}
            </Button>
          </div>
        )}
      </footer>

      {/* Bouton son global (hors flux, toujours accessible) */}
      <div className="fixed bottom-16 right-4 sm:right-6 z-40">
        <AmbientSoundToggle />
      </div>
    </motion.div>
  );
};

export default QuizPage;
