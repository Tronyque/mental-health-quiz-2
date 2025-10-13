'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LikertScale } from '@/components/LikertScale';
import { questions, dimensions, normalizeScore } from '@/lib/questions';
import { createClient } from '@supabase/supabase-js';
import { BarChart, Bar, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
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
    if (!employeeId.trim()) {
      setError('Merci de renseigner votre pseudo avant de continuer.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('employees')
        .select('id, completed')
        .eq('employee_id', employeeId.trim())
        .maybeSingle();

      if (fetchError) {
        console.error('Supabase auth lookup failed', fetchError);
        console.info('analytics:event', { name: 'auth_lookup_failed', reason: fetchError.message });
        throw fetchError;
      }

      if (data) {
        if (data.completed) {
          setError('Ce questionnaire a déjà été complété pour ce pseudo.');
          return;
        }
        setAuthenticated(true);
        return;
      }

      const { data: newEmp, error: insertError } = await supabase
        .from('employees')
        .insert({ employee_id: employeeId.trim() })
        .select('id')
        .single();

      if (insertError) {
        console.error('Supabase employee creation failed', insertError);
        console.info('analytics:event', { name: 'employee_create_failed', reason: insertError.message });
        throw insertError;
      }

      if (newEmp) {
        setAuthenticated(true);
      }
    } catch (authError) {
      console.error('Authentication error', authError);
      setError("Une erreur est survenue lors de l'authentification. Merci de réessayer dans quelques instants.");
    } finally {
      setLoading(false);
    }
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
    setError('');

    try {
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('id')
        .eq('employee_id', employeeId.trim())
        .maybeSingle();

      if (employeeError) {
        console.error('Supabase employee fetch failed', employeeError);
        console.info('analytics:event', { name: 'employee_fetch_failed', reason: employeeError.message });
        throw employeeError;
      }

      if (!employee) {
        setError('Pseudo introuvable. Merci de vérifier votre saisie.');
        return;
      }

      const responsePayload = questions.map((question, index) => ({
        employee_id: employee.id,
        question_id: question.id,
        score: answers[index],
      }));

      const { error: responsesError } = await supabase.from('responses').insert(responsePayload);

      if (responsesError) {
        console.error('Supabase responses insert failed', responsesError);
        console.info('analytics:event', { name: 'responses_insert_failed', reason: responsesError.message });
        throw responsesError;
      }

      const { error: completionError } = await supabase
        .from('employees')
        .update({ completed: true })
        .eq('employee_id', employeeId.trim());

      if (completionError) {
        console.error('Supabase employee completion flag failed', completionError);
        console.info('analytics:event', { name: 'employee_completion_failed', reason: completionError.message });
        throw completionError;
      }

      setShowResults(true);
    } catch (submissionError) {
      console.error('Submission error', submissionError);
      setError('Impossible de soumettre vos réponses. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
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
    if (score > 70) return '#B2D8B2';
    if (score > 50) return '#FFD3E0';
    return '#A7C7E7';
  };

  const getAdvice = (dim: string, score: number) => {
    if (score > 70) return `Super, ${dim} au top !`;
    if (score > 50) return `${dim} : à peaufiner.`;
    return `${dim} : à surveiller.`;
  };

  const progress = ((step + 1) / questions.length) * 100;

  if (showResults) {
    const scores = calculateScores();
    const chartData = dimensions.map((dim, i) => ({
      dimension: dim,
      score: Math.min(scores[i], 100),
      fill: getColor(scores[i]),
    }));

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex flex-col items-center p-4"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          className="text-3xl font-bold mb-4 text-primary drop-shadow-soft"
        >
          Vos Résultats
        </motion.h1>
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-muted-foreground mb-8 text-center max-w-md"
        >
          Vos réponses en un coup d’œil. Survolez pour des conseils courts et adaptés !
        </motion.p>
        
        {/* Radar global animé */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <ResponsiveContainer width="100%" height={350}>
            {/* @ts-ignore pour contourner erreur TS sur isAnimationActive */}
            <RadarChart data={chartData} outerRadius="80%" isAnimationActive={true}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: '#4B5563' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Votre Score" dataKey="score" stroke="#3B82F6" fill="#93C5FD" fillOpacity={0.6} />
              <Tooltip
                contentStyle={{ maxWidth: '200px', whiteSpace: 'normal', fontSize: '14px' }}
                formatter={(value: number, name: string, props: any) => [`${value}%`, getAdvice(props.payload.dimension, value)]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
        
        {/* Bar charts par dimension */}
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl font-semibold mt-8 mb-4 text-foreground"
        >
          Détails
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          {chartData.map((item, index) => (
            <motion.div
              key={item.dimension}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.4, type: 'spring', stiffness: 80 }}
              whileHover={{ scale: 1.02 }}
              className="bg-card p-4 rounded-3xl shadow-soft"
            >
              <h3 className="text-lg font-medium mb-2 text-foreground truncate">{item.dimension}</h3>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={[item]} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
                  <Bar dataKey="score" fill={item.fill} radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Tooltip
                    contentStyle={{ maxWidth: '150px', whiteSpace: 'normal', fontSize: '12px' }}
                    formatter={(value: number) => [`${value}%`, getAdvice(item.dimension, value)]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center"
      >
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-lg w-full bg-card rounded-3xl shadow-soft p-8 border border-accent/10"
      >
        {!authenticated ? (
          <div className="space-y-6">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
              className="text-2xl font-bold text-center text-primary"
            >
              Bienvenue au Questionnaire Bien-Être
            </motion.h1>
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-muted-foreground text-center px-4"
            >
              Ce questionnaire anonyme et bienveillant vous aide à évaluer votre santé mentale au travail. Il est rapide, confidentiel, et nous permettra d’améliorer les conditions pour tous. Prenez votre temps !
            </motion.p>
            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <Label htmlFor="employeeId" className="text-lg block text-foreground">Entrez un pseudo (unique)</Label>
              <Input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Ex: MonPseudo123"
                className="transition-all duration-300 focus:ring-2 focus:ring-secondary rounded-full"
              />
            </motion.div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-destructive text-center"
              >
                {error}
              </motion.p>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={handleAuth}
                disabled={!employeeId}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all duration-300 shadow-md rounded-full"
              >
                Commencer
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
              className="flex justify-center mb-6"
            >
              <ProgressCircle value={progress} />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.h2
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={handleNext}
                disabled={answers[step] === 0}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all duration-300 shadow-md rounded-full"
              >
                {step === questions.length - 1 ? 'Terminer et Voir Résultats' : 'Suivant'}
              </Button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-sm text-muted-foreground text-center"
            >
              Question {step + 1} sur {questions.length}
            </motion.p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}