'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, HeartHandshake, BarChart3, Leaf } from 'lucide-react';

/** Voyants debug visibles à l’écran (LS + Cookie) */
function ConsentDebug() {
  const [ls, setLs] = useState<string | null>(null);
  const [hasCookie, setHasCookie] = useState(false);

  useEffect(() => {
    try {
      setLs(localStorage.getItem('mhq-consent'));
      setHasCookie(document.cookie.split('; ').includes('mhq-consent=true'));
    } catch {
      setLs(null);
      setHasCookie(false);
    }
  }, []);

  return (
    <div className="text-muted-foreground mt-2 text-[11px]">
      LS: {String(ls)} — COOKIE: {hasCookie ? 'OK' : 'ABSENT'}
    </div>
  );
}

export default function IntroConsentPage() {
  const [declined, setDeclined] = useState(false);

  const acceptAndStart = async () => {
    try {
      localStorage.setItem('mhq-consent', 'true');
      await fetch('/api/consent', { method: 'POST' });
      // petit délai pour laisser le cookie s’écrire avant la redirection
      await new Promise((resolve) => setTimeout(resolve, 400));
    } catch (err) {
      console.error('set consent failed:', err);
    }
    window.location.assign('/quiz');
  };

  const decline = async () => {
    try {
      localStorage.setItem('mhq-consent', 'false');
      await fetch('/api/consent', { method: 'DELETE' });
    } catch {}
    setDeclined(true);
  };

  if (declined) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="from-background via-secondary/10 to-accent/10 flex min-h-dvh items-center justify-center bg-gradient-to-br p-4"
      >
        <Card className="border-border/60 bg-card/90 supports-[backdrop-filter]:bg-card/70 w-full max-w-[720px] rounded-3xl border shadow-2xl">
          <CardContent className="space-y-6 p-8 text-center md:p-10">
            <h1 className="text-primary text-2xl font-semibold md:text-3xl">
              Merci pour votre réponse 🌿
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Vous avez choisi de ne pas transmettre vos réponses.
              <br />
              Aucune donnée ne sera collectée ni enregistrée.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/"
                className="border-border bg-card hover:bg-accent/20 inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-medium"
              >
                Retour à l’accueil
              </a>
              <a
                href="/intro"
                className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium hover:brightness-110"
              >
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
      className="from-background via-secondary/10 to-accent/10 flex min-h-dvh items-center justify-center bg-gradient-to-br p-4"
    >
      <Card className="border-border/60 bg-card/90 supports-[backdrop-filter]:bg-card/70 w-full max-w-[720px] rounded-3xl border shadow-2xl">
        <CardContent className="space-y-7 p-6 md:p-10">
          {/* Titre + sous-titre */}
          <div className="space-y-3 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-primary text-3xl font-semibold md:text-4xl"
            >
              Questionnaire Bien-être Mental
            </motion.h1>
            <p className="text-muted-foreground mx-auto max-w-prose text-sm md:text-base">
              Quelques minutes pour mieux comprendre vos besoins et vous proposer des pistes
              adaptées. Vos réponses restent anonymes.
            </p>
          </div>

          {/* Points clés / garanties */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-border bg-background/60 rounded-2xl border p-4">
              <div className="text-foreground flex items-center gap-2 font-medium">
                <ShieldCheck className="text-primary h-4 w-4" />
                Respect &amp; confidentialité
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Pas de données identifiantes. Vos réponses servent à des analyses collectives.
              </p>
            </div>

            <div className="border-border bg-background/60 rounded-2xl border p-4">
              <div className="text-foreground flex items-center gap-2 font-medium">
                <Leaf className="text-primary h-4 w-4" />
                Expérience sereine
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Un rythme calme, des questions claires, possibilité d’arrêter à tout moment.
              </p>
            </div>

            <div className="border-border bg-background/60 rounded-2xl border p-4">
              <div className="text-foreground flex items-center gap-2 font-medium">
                <HeartHandshake className="text-primary h-4 w-4" />
                Une démarche bienveillante
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                L’objectif est de mieux comprendre vos besoins, pas d’évaluer les individus.
              </p>
            </div>

            <div className="border-border bg-background/60 rounded-2xl border p-4">
              <div className="text-foreground flex items-center gap-2 font-medium">
                <BarChart3 className="text-primary h-4 w-4" />
                Analyses collectives
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Des tendances globales pour améliorer l’accompagnement et les ressources.
              </p>
            </div>
          </div>

          {/* Consentement + actions */}
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Je consens au traitement <strong>anonyme</strong> de mes réponses dans le cadre
              d’analyses collectives. Aucune donnée identifiante n’est collectée.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={acceptAndStart}
                className="bg-primary text-primary-foreground focus-visible:ring-ring/50 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium hover:brightness-110 focus:outline-none focus-visible:ring-2"
              >
                Je consens et je commence
              </button>

              <Link
                href="/privacy"
                className="border-border bg-card hover:bg-accent/20 inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium"
              >
                En savoir plus
              </Link>

              <button
                type="button"
                onClick={decline}
                className="text-muted-foreground hover:text-primary ml-auto text-xs underline"
              >
                Je ne consens pas
              </button>
            </div>

            {/* Voyants debug optionnels */}
            <ConsentDebug />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
