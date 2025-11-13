"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-dvh bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-6"
    >
      <Card className="w-full max-w-3xl rounded-3xl border border-border/60 shadow-2xl bg-card/90 supports-[backdrop-filter]:bg-card/70">
        <CardContent className="p-8 space-y-6">
          <h1 className="text-3xl font-bold text-primary text-center">
            Politique de Confidentialité
          </h1>

          <p className="text-center text-muted-foreground">
            Dernière mise à jour : <strong>10 octobre 2025</strong>
          </p>

          <section className="space-y-3 text-sm leading-relaxed text-foreground">
            <h2 className="mt-2 text-xl font-semibold text-primary">1. Objectif du questionnaire</h2>
            <p>
              Le questionnaire <strong>Bien-Être au Travail</strong> a pour objectif d’évaluer le
              ressenti global des collaborateurs sur leur santé mentale au travail. Il s’agit d’un
              outil de prévention et d’amélioration, sans finalité commerciale.
            </p>

            <h2 className="mt-4 text-xl font-semibold text-primary">2. Données collectées</h2>
            <p>
              Ce questionnaire est <strong>entièrement anonyme</strong>. Aucune donnée personnelle
              directement identifiable (nom, prénom, adresse e-mail, etc.) n’est collectée.
            </p>
            <p>Les seules informations enregistrées sont :</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Un identifiant pseudonymisé choisi par le participant.</li>
              <li>Les réponses aux questions sous forme de scores numériques.</li>
            </ul>

            <h2 className="mt-4 text-xl font-semibold text-primary">3. Hébergement et sécurité</h2>
            <p>
              Les données sont hébergées sur des infrastructures conformes au RGPD. L’accès est
              restreint aux administrateurs autorisés de l’application.
            </p>

            <h2 className="mt-4 text-xl font-semibold text-primary">4. Durée de conservation</h2>
            <p>
              Les données anonymisées sont conservées pendant une durée maximale de <strong>12 mois</strong>,
              afin d’analyser les tendances globales et de produire des rapports statistiques.
            </p>

            <h2 className="mt-4 text-xl font-semibold text-primary">5. Utilisation des données</h2>
            <p>
              Les résultats individuels ne sont pas communiqués à des tiers. Seules des analyses
              agrégées et anonymes peuvent être partagées avec les équipes concernées.
            </p>

            <h2 className="mt-4 text-xl font-semibold text-primary">6. Cookies et traceurs</h2>
            <p>
              Ce site n’utilise <strong>aucun cookie de suivi publicitaire</strong>. Un cookie
              technique peut enregistrer votre consentement.
            </p>

            <h2 className="mt-4 text-xl font-semibold text-primary">7. Droits des utilisateurs</h2>
            <p>
              Conformément au RGPD, vous disposez de droits d’accès, d’effacement et de limitation.
              Pour exercer ces droits :
            </p>
            <p>
              <a
                href="mailto:contact@ton-site.fr"
                className="underline text-primary hover:text-secondary transition"
              >
                contact@ton-site.fr
              </a>
            </p>

            <h2 className="mt-4 text-xl font-semibold text-primary">8. Modifications</h2>
            <p>
              Cette politique peut évoluer. Toute modification importante sera indiquée sur cette page.
            </p>
          </section>

          <div className="pt-6 flex justify-center gap-3">
            <Button asChild variant="outline" className="rounded-full px-4">
              <Link href="/intro" prefetch={false}>Revenir à l’intro</Link>
            </Button>
            <Button asChild className="rounded-full px-5">
              <Link href="/quiz" prefetch={false}>Passer au questionnaire</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
