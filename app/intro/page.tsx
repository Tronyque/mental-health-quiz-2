"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function IntroPage() {
  const router = useRouter();

  async function acceptAndStart() {
    try {
      localStorage.setItem("mhq-consent", "true");
      await fetch("/api/consent", { method: "POST" });
    } catch (e) {
      console.error("consent POST failed:", e);
    }
    router.push("/quiz");
  }

  async function decline() {
    try {
      localStorage.setItem("mhq-consent", "false");
      await fetch("/api/consent", { method: "DELETE" });
    } catch (e) {
      console.error("consent DELETE failed:", e);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-dvh bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-4 pb-10"
    >
      <div className="w-full max-w-[760px] rounded-3xl border border-border/60 shadow-soft bg-card/90 supports-[backdrop-filter]:bg-card/70 backdrop-blur z-10
          bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">        
          <div className="p-6 md:p-10 space-y-8">
          <header className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
              🌿 Questionnaire Bien-Être au Travail
            </h1>
            <p className="text-base text-muted-foreground">
              Vous qui contribuez à <strong>prendre soin</strong> de vos résidents, <strong>prenez soin de vous</strong> en participant à cette démarche collective d’amélioration du bien-être dans nos
              établissements. 
              </p>
              <p className="text-base text-muted-foreground">
                Votre contribution est <strong>anonyme</strong> et précieuse.
            </p>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <article className="rounded-2xl border border-border bg-background/60 p-4">
              <h3 className="font-semibold">Respect du RGPD & anonymat</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Aucune donnée personnelle identifiante n’est collectée. Les réponses sont
                pseudonymisées et hébergées en Europe.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-background/60 p-4">
              <h3 className="font-semibold">Une démarche bienveillante</h3>
              <p className="text-sm text-muted-foreground mt-1">
                L’objectif est de mieux comprendre vos besoins, pas d’évaluer les individus.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-background/60 p-4">
              <h3 className="font-semibold">Analyses collectives</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Les résultats sont analysés de manière agrégée afin d’orienter des actions concrètes.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-background/60 p-4">
              <h3 className="font-semibold">Impact positif</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Votre voix contribue directement à l’amélioration durable des conditions de travail.
              </p>
            </article>
          </section>

          <section className="rounded-2xl border border-accent/30 bg-accent/10 p-4">
            <p className="text-sm leading-relaxed">
              En cliquant sur « <strong>Je consens et je commence</strong> », vous acceptez que vos
              réponses anonymes soient transmises pour analyse collective. Si vous ne consentez pas,
              vous ne pourrez pas remplir le questionnaire. Pour plus d’informations, consultez la{" "}
              <Link href="/privacy" className="underline text-primary">
                Politique de confidentialité
              </Link>
              .
            </p>
          </section>

          <div className="space-y-3 text-center">
            <Button
              onClick={acceptAndStart}
              className="rounded-full h-11 px-6 text-base font-semibold bg-primary text-primary-foreground
                bg-primary text-primary-foreground
                bg-blue-600 text-white hover:brightness-110"
            >
              Je consens et je commence
            </Button>

            <button
              type="button"
              onClick={decline}
              className="block w-full text-center text-xs text-muted-foreground underline hover:text-primary"
            >
              Je ne consens pas
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
