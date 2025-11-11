'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-linear-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-6"
    >
      <Card className="max-w-3xl w-full rounded-3xl shadow-soft border border-accent/10 bg-card backdrop-blur">
        <CardContent className="p-8 space-y-6">
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-primary text-center"
          >
            Politique de Confidentialité
          </motion.h1>

          <p className="text-muted-foreground text-center">
            Dernière mise à jour : <strong>10 octobre 2025</strong>
          </p>

          <section className="space-y-3 text-sm text-foreground leading-relaxed">
            <h2 className="text-xl font-semibold text-primary">1. Objectif du questionnaire</h2>
            <p>
              Le questionnaire <strong>Bien-Être au Travail</strong> a pour objectif d’évaluer
              le ressenti global des collaborateurs sur leur santé mentale au travail.
              Il s’agit d’un outil de prévention et d’amélioration, sans finalité commerciale.
            </p>

            <h2 className="text-xl font-semibold text-primary mt-4">2. Données collectées</h2>
            <p>
              Ce questionnaire est <strong>entièrement anonyme</strong>. Aucune donnée personnelle
              directement identifiable (nom, prénom, adresse e-mail, etc.) n’est collectée.
            </p>
            <p>
              Les seules informations enregistrées sont :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Un identifiant pseudonymisé choisi par le participant.</li>
              <li>Les réponses aux questions sous forme de scores numériques.</li>
            </ul>

            <h2 className="text-xl font-semibold text-primary mt-4">3. Hébergement et sécurité</h2>
            <p>
              Les données sont hébergées sur les serveurs européens de <strong>Supabase</strong>,
              respectant la réglementation RGPD. L’accès est restreint aux administrateurs
              autorisés de l’application.
            </p>

            <h2 className="text-xl font-semibold text-primary mt-4">4. Durée de conservation</h2>
            <p>
              Les données anonymisées sont conservées pendant une durée maximale de
              <strong> 12 mois</strong>, afin d’analyser les tendances globales et de produire
              des rapports statistiques.
            </p>

            <h2 className="text-xl font-semibold text-primary mt-4">5. Utilisation des données</h2>
            <p>
              Les résultats individuels ne sont pas communiqués à des tiers.
              Seules des analyses agrégées et anonymes peuvent être partagées avec les équipes RH
              ou les professionnels de santé partenaires.
            </p>

            <h2 className="text-xl font-semibold text-primary mt-4">6. Cookies et traçeurs</h2>
            <p>
              Ce site n’utilise <strong>aucun cookie de suivi publicitaire</strong>.
              Seul un cookie technique est utilisé pour enregistrer le consentement RGPD.
            </p>

            <h2 className="text-xl font-semibold text-primary mt-4">7. Droits des utilisateurs</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
              des droits suivants :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Droit d’accès et de consultation de vos données.</li>
              <li>Droit à l’effacement de vos réponses.</li>
              <li>Droit à la limitation du traitement.</li>
            </ul>
            <p>
              Pour exercer ces droits, vous pouvez contacter le responsable du projet via votre
              service RH ou l’adresse e-mail suivante :
              <br />
              <a
                href="mailto:contact@ton-site.fr"
                className="underline text-primary hover:text-secondary transition"
              >
                contact@ton-site.fr
              </a>
            </p>

            <h2 className="text-xl font-semibold text-primary mt-4">8. Modifications de cette politique</h2>
            <p>
              Cette politique peut être mise à jour en fonction de l’évolution du projet
              ou de la législation. Toute modification importante sera indiquée sur cette page.
            </p>
          </section>

          <div className="pt-6 flex justify-center">
            <Button asChild variant="secondary" className="rounded-full">
              <Link href="/">Retour à l’accueil</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
