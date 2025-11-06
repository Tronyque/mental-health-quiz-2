'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LegalPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-6"
    >
      <Card className="max-w-3xl w-full rounded-3xl shadow-soft border border-accent/10 bg-card backdrop-blur">
        <CardContent className="p-8 space-y-6">
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-primary text-center"
          >
            Mentions légales
          </motion.h1>

          <p className="text-muted-foreground text-center">
            Conformément aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l’Économie Numérique (LCEN).
          </p>

          <section className="space-y-4 text-sm text-foreground leading-relaxed">
            <h2 className="text-xl font-semibold text-primary">1. Éditeur du site</h2>
            <p>
              Le présent site, <strong>Questionnaire Bien-Être</strong>, est édité à titre non commercial
              par :
            </p>
            <ul className="list-none space-y-1 text-muted-foreground">
              <li><strong>Responsable du projet :</strong> Antoine Multedo</li>
              <li><strong>Contact :</strong> <a href="mailto:contact@ton-site.fr" className="underline text-primary hover:text-secondary">contact@ton-site.fr</a></li>
              <li><strong>Siège social :</strong> [à compléter si applicable]</li>
            </ul>

            <h2 className="text-xl font-semibold text-primary mt-4">2. Hébergement</h2>
            <p>
              Le site est hébergé par :
            </p>
            <ul className="list-none space-y-1 text-muted-foreground">
              <li><strong>Vercel Inc.</strong></li>
              <li>340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
              <li><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-secondary">https://vercel.com</a></li>
            </ul>
            <p>
              Les données applicatives sont hébergées par <strong>Supabase</strong> (infrastructure européenne) :
            </p>
            <ul className="list-none space-y-1 text-muted-foreground">
              <li><strong>Supabase Europe</strong></li>
              <li>Regus Business Center, Dusseldorf, Allemagne</li>
              <li><a href="https://supabase.com/security" target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-secondary">https://supabase.com/security</a></li>
            </ul>

            <h2 className="text-xl font-semibold text-primary mt-4">3. Propriété intellectuelle</h2>
            <p>
              L’ensemble des éléments graphiques, textuels, et techniques de ce site (logo, questionnaire,
              design, code source, etc.) sont protégés par le droit de la propriété intellectuelle.
              Toute reproduction, diffusion ou exploitation sans autorisation est interdite.
            </p>

            <h2 className="text-xl font-semibold text-primary mt-4">4. Responsabilité</h2>
            <p>
              L’éditeur s’efforce d’assurer l’exactitude des informations publiées, mais ne saurait être tenu
              responsable des erreurs, omissions ou interruptions de service.  
              Le site n’a aucune visée médicale : il constitue un outil de sensibilisation et d’évaluation du
              bien-être professionnel.
            </p>

            <h2 className="text-xl font-semibold text-primary mt-4">5. Données personnelles</h2>
            <p>
              Ce site respecte la réglementation <strong>RGPD (Règlement UE 2016/679)</strong>.  
              Les données collectées sont anonymisées et ne permettent pas d’identifier les utilisateurs.
              Pour plus d’informations, consultez la{' '}
              <Link href="/privacy" className="underline text-primary hover:text-secondary">
                politique de confidentialité
              </Link>.
            </p>

            <h2 className="text-xl font-semibold text-primary mt-4">6. Contact</h2>
            <p>
              Pour toute question relative au site ou à son contenu, vous pouvez écrire à :<br />
              <a
                href="mailto:contact@ton-site.fr"
                className="underline text-primary hover:text-secondary"
              >
                contact@ton-site.fr
              </a>
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
