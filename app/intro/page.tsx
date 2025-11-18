'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Heart, Users, TrendingUp, Leaf } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function IntroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Leaf className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
            Questionnaire Bien-Être<br />au Travail
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Vous qui prenez soin des autres chaque jour,<br />
            <span className="font-semibold text-green-700">il est temps qu’on prenne soin de vous.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-green-200 bg-white/90 backdrop-blur hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-8">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-green-100 rounded-2xl">
                  <Shield className="w-10 h-10 text-green-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Anonymat total</h3>
                  <p className="text-gray-600 text-lg">Aucune donnée personnelle. Réponses pseudonymisées, hébergées en Europe.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-white/90 backdrop-blur hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-8">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-emerald-100 rounded-2xl">
                  <Users className="w-10 h-10 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Démarche collective</h3>
                  <p className="text-gray-600 text-lg">Vos réponses servent à améliorer les conditions de tous, jamais à juger les individus.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-200 bg-white/90 backdrop-blur hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-8">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-teal-100 rounded-2xl">
                  <TrendingUp className="w-10 h-10 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Actions concrètes</h3>
                  <p className="text-gray-600 text-lg">Rapport collectif détaillé remis à la direction pour des améliorations réelles.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-cyan-200 bg-white/90 backdrop-blur hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-8">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-cyan-100 rounded-2xl">
                  <Heart className="w-10 h-10 text-cyan-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Prendre soin de soi</h3>
                  <p className="text-gray-600 text-lg">15 minutes de votre temps pour contribuer à un environnement plus humain.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="max-w-xl mx-auto bg-green-200" />

        <div className="text-center space-y-8">
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            En continuant, vous acceptez que vos réponses anonymes soient utilisées pour l’analyse collective.<br />
            Vous pouvez arrêter à tout moment.
          </p>

          <Button
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-8 px-16 text-2xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => router.push('/quiz')}
          >
            Je consens et je commence le questionnaire
          </Button>
        </div>
      </div>
    </div>
  );
}