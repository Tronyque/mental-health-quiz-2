'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Leaf } from 'lucide-react';
import { useState } from 'react';
import questions from '@/lib/questions';
import Results from '@/components/Results';

const scales = [
  { value: 1, label: 'Pas du tout, color: 'text-red-600' },
  { value: 2, label: 'Rarement', color: 'text-orange-600' },
  { value: 3, label: 'Parfois', color: 'text-yellow-600' },
  { value: 4, label: 'Souvent', color: 'text-green-600' },
  { value: 5, label: 'Toujours', color: 'text-emerald-700 font-bold' },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const question = questions[current];

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [question.id]: Number(value) });
    if (current < questions.length - 1) {
      setTimeout(() => setCurrent(current + 1), 300);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) return <Results answers={answers} />;

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Leaf className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-green-700 font-medium">Question {current + 1} sur {questions.length}</p>
          <Progress value={progress} className="h-3" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            <Card className="border-none shadow-2xl bg-white/95 backdrop-blur">
              <CardContent className="pt-10 pb-12 px-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12 leading-relaxed">
                  {question.text}
                </h2>

                <RadioGroup onValueChange={handleAnswer} className="space-y-6">
                  {scales.map((scale) => (
                    <Label
                      key={scale.value}
                      className="flex items-center justify-between p-6 rounded-2xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 cursor-pointer transition-all duration-300 has-[:checked]:border-green-600 has-[:checked]:bg-green-50"
                    >
                      <span className={`text-lg font-medium ${scale.color}`}>
                        {scale.label}
                      </span>
                      <RadioGroupItem value={scale.value.toString()} className="w-6 h-6" />
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="text-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="text-gray-500"
          >
            ← Précédent
          </Button>
        </div>
      </div>
    </div>
  );
}