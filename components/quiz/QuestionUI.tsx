"use client";

import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
// ⬇️ on n'utilise plus la barre
// import { Progress } from "@/components/ui/progress";
import { ProgressCircle } from "@/components/ProgressCircle";
import { LikertScale } from "@/components/LikertScale";
import type { Question } from "@/lib/questions";

interface QuestionUIProps {
  step: number;
  total: number;
  value: number;
  question: Question;
  onChange: (v: number) => void;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const QuestionUI: FC<QuestionUIProps> = ({
  step,
  total,
  value,
  onChange,
  onPrev,
  onNext,
  question,
  isFirst,
  isLast,
}) => {
  const progress = ((step + 1) / total) * 100;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 px-4 py-6"
    >
      {/* ✅ Cercle de progression centré */}
      <div className="w-full flex justify-center mb-6">
        <ProgressCircle value={progress} autoColor />
      </div>

      {/* Infos étape en dessous (centrées) */}
      <div className="text-sm text-muted-foreground mb-4 text-center">
        Question <span className="font-medium">{step + 1}</span> / {total}
      </div>

      {/* Contenu principal centré */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center justify-center text-center max-w-2xl space-y-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug mb-3">
              {question.text}
            </h2>
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-2 text-primary" />
              Répondez instinctivement.
            </div>
          </div>

          <LikertScale
            min={question.scale.min}
            max={question.scale.max}
            value={value}
            onChange={onChange}
            labels={question.scale.labels}
          />

          <div className="flex justify-between items-center w-full max-w-lg pt-8">
            <Button
              variant="outline"
              onClick={onPrev}
              disabled={isFirst}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
            </Button>

            <Button
              onClick={onNext}
              disabled={value === 0}
              className="rounded-full bg-gradient-to-r from-primary to-secondary hover:brightness-110"
            >
              {isLast ? "Terminer" : "Suivant"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Question {step + 1} sur {total}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionUI;
