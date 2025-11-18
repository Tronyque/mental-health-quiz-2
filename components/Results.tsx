'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Share2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { questions } from '@/lib/questions';

export default function Results({ 
  answers, 
  demographics 
}: { 
  answers: Record<string, number>; 
  demographics?: { 
    ehpad?: string; 
    fonction?: string; 
    age?: string; 
    anciennete?: string; 
  } 
}) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const resultsForAI = Object.entries(answers).map(([id, score]) => ({
          dimension: questions.find((q: any) => q.id === id)?.dimension || "Autre",
          value: score,
        }));

        const res = await fetch('/api/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            results: resultsForAI,
            locale: 'fr',
            demographics,
          }),
        });

        const data = await res.json();
        if (data.ok) {
          setReport(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [answers, demographics]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center space-y-8">
          <Leaf className="w-20 h-20 text-green-600 animate-pulse mx-auto" />
          <p className="text-2xl font-medium text-gray-700">Génération de votre rapport personnalisé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <Leaf className="w-16 h-16 text-green-600 mx-auto" />
          <h1 className="text-5xl font-bold text-gray-800">Votre rapport personnalisé</h1>
        </div>

        <Card className="shadow-2xl">
          <CardContent className="pt-8 space-y-8">
            <h2 className="text-3xl font-bold text-center text-green-700">Synthèse globale</h2>
            <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
              <ReactMarkdown>
                {report?.multidim || "Analyse en cours..."}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-800">Analyse par dimension</h2>
          {report?.dimensionAnalyses && Object.entries(report.dimensionAnalyses).map(([dim, text]: [string, any]) => (
            <Card key={dim} className="shadow">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-4 text-green-700">
                  {dim}
                </h3>
                <div className="prose text-gray-700">
                  <ReactMarkdown>
                    {text}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-8 pt-12">
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Merci infiniment pour votre participation.<br />
            Vos réponses restent totalement anonymes et contribuent à améliorer le bien-être de tous au sein des établissements.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            <Button size="lg" variant="outline" className="flex items-center gap-3">
              <Share2 className="w-5 h-5" /> Partager mes résultats (anonyme)
            </Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 flex items-center gap-3">
              <Download className="w-5 h-5" /> Télécharger le rapport PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}