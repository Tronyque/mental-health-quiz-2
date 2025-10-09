'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LikertScale } from '@/components/LikertScale';
import { questions, dimensions, normalizeScore } from '@/lib/questions';
import { createClient } from '@supabase/supabase-js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ProgressCircle } from '@/components/ProgressCircle';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(0));
  const [employeeId, setEmployeeId] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setLoading(true);
    if (!employeeId) {
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('employees').select('id, completed').eq('employee_id', employeeId);
    if (data && data.length > 0) {
      if (data[0].completed) {
        setError('Ce questionnaire a déjà été complété pour cet ID.');
        setLoading(false);
        return;
      }
      setAuthenticated(true);
    } else {
      const { data: newEmp } = await supabase.from('employees').insert({ employee_id: employeeId }).select();
      if (newEmp) setAuthenticated(true);
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (answers[step] === 0) return;
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      submitResponses();
    }
  };

  const submitResponses = async () => {
    setLoading(true);
    const empRes = await supabase.from('employees').select('id').eq('employee_id', employeeId);
    const empId = empRes.data?.[0].id;
    if (!empId) {
      setError('Erreur ID');
      setLoading(false);
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      await supabase.from('responses').insert({
        employee_id: empId,
        question_id: questions[i].id,
        score: answers[i],
      });
    }
    await supabase.from('employees').update({ completed: true }).eq('employee_id', employeeId);
    setShowResults(true);
    setLoading(false);
  };

  const calculateScores = () => {
    return dimensions.map((dim) => {
      const qs = questions.filter((q) => q.dimension === dim);
      const total = qs.reduce((sum, q) => {
        const qIndex = questions.findIndex((qq) => qq.id === q.id);
        return sum + normalizeScore(answers[qIndex], q.scale.min, q.scale.max, q.inverted);
      }, 0);
      return total / qs.length;
    });
  };

  const getColor = (score: number) => {
    if (score > 70) return '#B2D8B2'; // Vert bienveillant
    if (score > 50) return '#FFD3E0'; // Jaune/rose doux
    return '#A7C7E7'; // Bleu calme pour bas
  };

  const getAdvice = (dim: string, score: number) => {
    if (score > 70) return `Bravo ! Votre ${dim.toLowerCase()} est élevé. Continuez ainsi.`;
    if (score > 50) return `Bien, mais room for improvement en ${dim.toLowerCase()}. Essayez des pauses quotidiennes.`;
    return `À surveiller : Votre ${dim.toLowerCase()} est bas. Parlez-en à un pro pour des conseils adaptés. Prenez soin de vous !`;
  };

  const progress = ((step + 1) / questions.length) * 100;

  if (showResults) {
    const scores = calculateScores();
    const chartData = dimensions.map((dim, i) => ({
      dimension: dim,
      score: scores[i],
      fill: getColor(scores[i]),
    }));

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex flex-col items-center p-4"
      >
        <h1 className="text-3xl font-bold mb-6 text-primary drop-shadow-soft">Vos Résultats Personnels</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">Voici une vue douce de vos réponses. Les couleurs s'adaptent : vert pour fort, jaune pour moyen, bleu pour à améliorer. Survolez pour des conseils bienveillants.</p>
        
        {/* Radar global animé */}
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={chartData} outerRadius="80%">
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: '#4B5563' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Votre Score" dataKey="score" stroke="#3B82F6" fill="#93C5FD" fillOpacity={0.6} />
              <Tooltip formatter={(value: number, name: string, props: any) => [`${value}%`, getAdvice(props.payload.dimension, value)]} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
        
        {/* Complément : Bar charts par dimension, interactifs */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">Détails par Dimension</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {chartData.map((item) => (
            <motion.div key={item.dimension} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="bg-card p-4 rounded-3xl shadow-soft">
                <h3 className="text-lg font-medium mb-2">{item.dimension}</h3>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart data={[item]}>
                    <Bar dataKey="score" fill={item.fill} radius={[4, 4, 0, 0]} />
                    <Tooltip formatter={(value: number) => [`${value}%`, getAdvice(item.dimension, value)]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-lg w-full bg-card rounded-3xl shadow-soft p-8 border border-accent/10"
      >
        {!authenticated ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center text-primary">Bienvenue au Questionnaire Bien-Être</h1>
            <p className="text-muted-foreground text-center px-4">Ce questionnaire anonyme et bienveillant vous aide à évaluer votre santé mentale au travail. Il est rapide, confidentiel, et nous permettra d'améliorer les conditions pour tous. Prenez votre temps !</p>
            <Label htmlFor="employeeId" className="text-lg block text-foreground">Entrez un pseudo (unique)</Label>
            <Input
              id="employeeId"
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Ex: MonPseudo123"
              className="transition-all duration-300 focus:ring-2 focus:ring-secondary rounded-full"
            />
            {error && <p className="text-destructive text-center">{error}</p>}
            <Button
              onClick={handleAuth}
              disabled={!employeeId}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all duration-300 shadow-md rounded-full"
            >
              Commencer
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <ProgressCircle value={progress} />
            </div>
            <AnimatePresence mode="wait">
              <motion.h2
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-semibold text-center text-foreground px-4"
              >
                {questions[step].text}
              </motion.h2>
            </AnimatePresence>
            <LikertScale
              min={questions[step].scale.min}
              max={questions[step].scale.max}
              value={answers[step]}
              onChange={(val) => {
                const newAns = [...answers];
                newAns[step] = val;
                setAnswers(newAns);
              }}
              labels={questions[step].scale.labels}
              useEmojis={true}
            />
            <Button
              onClick={handleNext}
              disabled={answers[step] === 0}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all duration-300 shadow-md rounded-full"
            >
              {step === questions.length - 1 ? 'Terminer et Voir Résultats' : 'Suivant'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">Question {step + 1} sur {questions.length}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}