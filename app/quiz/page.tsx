'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { questions } from '@/lib/questions';
import Results from '@/components/Results';

const scales = [
  { value: 1, label: 'Pas du tout', color: 'text-red-600' },
  { value: 2, label: 'Rarement', color: 'text-orange-600' },
  { value: 3, label: 'Parfois', color: 'text-yellow-600' },
  { value: 4, label: 'Souvent', color: 'text-green-600' },
  { value: 5, label: 'Toujours', color: 'text-emerald-700 font-bold' },
];

const fonctionOptions = [
  "Aide-soignant(e)",
  "Infirmier(ère)",
  "Agent de service hospitalier (ASH)",
  "Aide médico-psychologique (AMP)",
  "Animateur(trice)",
  "Psychologue",
  "Médecin",
  "Administratif",
  "Direction",
  "Autre",
  "Je préfère ne pas répondre",
];

const ageOptions = [
  "Moins de 25 ans",
  "25-34 ans",
  "35-44 ans",
  "45-54 ans",
  "55 ans et plus",
  "Je préfère ne pas répondre",
];

const ancienneteOptions = [
  "Moins de 1 an",
  "1 à 5 ans",
  "5 à 10 ans",
  "Plus de 10 ans",
  "Je préfère ne pas répondre",
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState<'questions' | 'demographics' | 'results'>('questions');
  const [demographics, setDemographics] = useState({
    ehpad: '',
    fonction: '',
    age: '',
    anciennete: '',
  });

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [question.id]: Number(value) };
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setTimeout(() => setCurrent(current + 1), 250);
    } else {
      setStep('demographics');
    }
  };

  const handleDemographicsComplete = () => {
    setStep('results');
  };

  if (step === 'results') {
    return <Results answers={answers} demographics={demographics} />;
  }

  if (step === 'demographics') {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => setStep('questions')}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3">
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="font-medium">Étape finale</span>
            </div>
          </div>
          <Progress value={100} className="h-2" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-10 pt-8"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Quelques infos pour l'analyse collective
            </h2>
            <p className="text-center text-gray-600 mb-8">
              (Tout à fait facultatif, mais ça aide énormément à segmenter les résultats par poste, âge, établissement…)
            </p>

            <div className="space-y-8">
              <div>
                <Label className="text-lg font-medium">Dans quel EHPAD travaillez-vous ?</Label>
                <Input
                  placeholder="Nom de l'établissement (ex: Les Lilas, Saint Joseph...)"
                  value={demographics.ehpad}
                  onChange={(e) => setDemographics({ ...demographics, ehpad: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-lg font-medium">Quelle est votre fonction ?</Label>
                <Select value={demographics.fonction} onValueChange={(v) => setDemographics({ ...demographics, fonction: v })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Sélectionnez..." />
                  </SelectTrigger>
                  <SelectContent>
                    {fonctionOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-lg font-medium">Tranche d'âge ?</Label>
                <Select value={demographics.age} onValueChange={(v) => setDemographics({ ...demographics, age: v })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Sélectionnez..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ageOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-lg font-medium">Ancienneté dans le secteur ?</Label>
                <Select value={demographics.anciennete} onValueChange={(v) => setDemographics({ ...demographics, anciennete: v })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Sélectionnez..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ancienneteOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-8 px-16 text-xl rounded-2xl shadow-xl"
                onClick={handleDemographicsComplete}
              >
                Voir mes résultats
              </Button>
              <p className="text-sm text-gray-500 mt-4">Vous pouvez passer cette étape si vous préférez</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Partie questions (inchangée par rapport à avant)
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <Leaf className="w-6 h-6 text-green-600" />
            <span className="font-medium">{current + 1} / {questions.length}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-1 flex flex-col justify-between px-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-between h-full"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-center px-4 leading-relaxed">
              {question.text}
            </h2>

            <RadioGroup onValueChange={handleAnswer} className="space-y-4">
              {scales.map((scale) => (
                <label
                  key={scale.value}
                  className="flex items-center justify-between p-5 rounded-2xl bg-white border-2 border-gray-200 has-[:checked]:border-green-600 has-[:checked]:bg-green-50 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <span className={`text-xl font-medium ${scale.color}`}>
                    {scale.label}
                  </span>
                  <RadioGroupItem value={scale.value.toString()} className="w-7 h-7" />
                </label>
              ))}
            </RadioGroup>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}