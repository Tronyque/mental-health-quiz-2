'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { questions } from '@/lib/questions';
import { Leaf, Share2, Download } from 'lucide-react';
import { useState } from 'react';

const dimensionLabels: Record<string, string> = {
  charge: "Charge de travail",
  autonomie: "Autonomie & sens",
  reconnaissance: "Reconnaissance",
  ambiance: "Ambiance d'équipe",
  formation: "Formation & évolution",
  equilibre: "Équilibre vie pro/perso",
  management: "Management de proximité",
  ressources: "Moyens & ressources",
};

export default function Results({ answers }: { answers: Record<string, number> }) {
// Calcul du nombre de questions par dimension (dynamique = toujours juste)
  const questionCountPerDim = questions.reduce((acc, q) => {
    const dim = q.dimension;
    if (dim) acc[dim] = (acc[dim] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Scores par dimension
  const dimensionScores = Object.entries(answers).reduce((acc, [id, score]) => {
    const dim = questions.find(q => q.id === id)?.dimension;
    if (dim) acc[dim] = (acc[dim] || 0) + score;
    return acc;
  }, {} as Record<string, number>);

  // Normalisation en % (parfait même si 2, 3 ou 4 questions par dim)
  const data = Object.entries(dimensionLabels).map(([key, label]) => {
    const count = questionCountPerDim[key] || 1;
    const maxForDim = count * 5;
    const rawScore = dimensionScores[key] || 0;
    return {
      dimension: label,
      score: Math.round((rawScore / maxForDim) * 100),
    };
  });

  const globalScore = Math.round(
    data.reduce((sum, d) => sum + d.score, 0) / data.length
  );
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <Leaf className="w-16 h-16 text-green-600 mx-auto" />
          <h1 className="text-5xl font-bold text-gray-800">Vos résultats</h1>
          <p className="text-2xl text-green-700 font-bold">Score global : {globalScore}/100</p>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {globalScore >= 80 ? "Vous semblez très épanoui·e dans votre travail !" : globalScore >= 60 ? "Des points positifs, mais aussi quelques leviers d'amélioration." : "Votre bien-être au travail semble fragilisé. Parler-en peut vraiment aider."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {data.map((item) => (
            <Card key={item.dimension} className="hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{item.dimension}</h3>
                  <span className="text-2xl font-bold text-green-700">{item.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div
                    className="bg-gradient-to-r from-green-600 to-emerald-600 h-8 rounded-full transition-all duration-1000"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-6">
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Merci infiniment d’avoir pris le temps de répondre. <br />
            <strong>Vos réponses restent totalement anonymes</strong> et vont permettre d'améliorer concrètement les conditions de travail dans nos établissements.
          </p>

          <div className="flex justify-center gap-6">
            <Button size="lg" variant="outline">
              <Share2 className="mr-2" /> Partager (anonyme)
            </Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Download className="mr-2" /> Télécharger mon rapport personnel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}