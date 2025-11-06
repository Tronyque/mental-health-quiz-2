"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, HeartHandshake, BarChart3, Leaf } from "lucide-react";

/** Voyants debug visibles à l’écran (LS + Cookie) */
function ConsentDebug() {
  const [ls, setLs] = useState<string | null>(null);
  const [hasCookie, setHasCookie] = useState(false);
  useEffect(() => {
    try {
      setLs(localStorage.getItem("mhq-consent"));
      setHasCookie(document.cookie.split("; ").includes("mhq-consent=true"));
    } catch {
      setLs(null);
      setHasCookie(false);
    }
  }, []);
  return (
    <div className="mt-2 text-[11px] text-muted-foreground">
      LS: {String(ls)} — COOKIE: {hasCookie ? "OK" : "ABSENT"}
    </div>
  );
}

export default function IntroConsentPage() {
  const [declined, setDeclined] = useState(false);

  const acceptAndStart = async () => {
    try {
      localStorage.setItem("mhq-consent", "true");
      await fetch("/api/consent", { method: "POST" });
      await new Promise(resolve => setTimeout(resolve, 500));  // Délai 500ms
    } catch (err) {
      console.error("set consent failed:", err);
    }
    window.location.assign("/quiz");
  };

  const decline = async () => {
    try {
      localStorage.setItem("mhq-consent", "false");
      await fetch("/api/consent", { method: "DELETE" });
    } catch {}
    setDeclined(true);
  };

  if (declined) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-6"
      >
        <Card className="w-full max-w-xl rounded-3xl border border-accent/10 shadow-soft bg-card/90 supports-[backdrop-filter]:bg-card/70">
          <CardContent className="p-8 md:p-10 space-y-6 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-primary">Merci pour votre réponse 🌿</h1>
            <p className="text-muted-foreground">
              Vous avez choisi de ne pas transmettre vos réponses.
              <br />Aucune donnée ne sera collectée ni enregistrée.
            </p>
            <div className="flex justify-center gap-3">
              <a href="/" className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium bg-secondary text-foreground hover:brightness-110">
                Retour à l’accueil
              </a>
              <a href="/intro" className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium bg-primary text-white hover:brightness-110">
                Changer d’avis
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-6"
    >
      <Card className="w-full max-w-3xl rounded-3xl border border-accent/10 shadow-soft bg-card/90 supports-[backdrop-filter]:bg-card/70">
        <CardContent className="p-8 md:p-10 space-y-7">
          <div className="text-center space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-3xl md:text-4xl font-semibold text-primary"
            >
              🌿 Questionnaire Bien-Être au Travail
            </motion.h1>
            <p className="text-muted-foreground">
              Merci de participer à cette démarche collective d’amélioration du bien-être
              dans nos établissements. Votre contribution est <strong>anonyme</strong> et précieuse.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl border border-border p-4 bg-background/60">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Respect du RGPD & anonymat
              </div>
              <p className="mt-2 text-muted-foreground">
                Aucune donnée personnelle identifiante n’est collectée.
                Les réponses sont pseudonymisées et hébergées en Europe.
              </p>
            </div>
            <div className="rounded-2xl border border-border p-4 bg-background/60">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <HeartHandshake className="h-4 w-4 text-primary" />
                Une démarche bienveillante
              </div>
              <p className="mt-2 text-muted-foreground">
                L’objectif est de mieux comprendre vos besoins,
                pas d’évaluer les individus.
              </p>
            </div>
            <div className="rounded-2xl border border-border p-4 bg-background/60">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <BarChart3 className="h-4 w-4 text-primary" />
                Analyses collectives
              </div>
              <p className="mt-2 text-muted-foreground">
                Les résultats sont analysés de manière <strong>agrégée</strong>
                afin d’orienter des actions concrètes.
              </p>
            </div>
            <div className="rounded-2xl border border-border p-4 bg-background/60">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Leaf className="h-4 w-4 text-primary" />
                Impact positif
              </div>
              <p className="mt-2 text-muted-foreground">
                Votre voix contribue directement à l’amélioration durable
                des conditions de travail.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-accent/40 bg-accent/20 p-4 text-sm leading-relaxed">
            <p className="text-foreground">
              En cliquant sur <strong>« Je consens et je commence »</strong>, vous acceptez que vos réponses
              anonymes soient transmises pour analyse collective.  
              Si vous ne consentez pas, vous ne pourrez pas remplir le questionnaire.  
              Pour plus d’informations, consultez la{" "}
              <Link href="/privacy" className="underline text-primary hover:text-secondary">
                Politique de confidentialité
              </Link>.
            </p>
          </div>

          {/* CTA + voyants */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={acceptAndStart}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold bg-blue-600 text-white shadow hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50"
            >
              Je consens et je commence
            </button>

            <button
              type="button"
              onClick={decline}
              className="text-xs text-muted-foreground underline hover:text-primary"
            >
              Je ne consens pas
            </button>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}
