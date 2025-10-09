import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface ProgressCircleProps {
  value: number;
}

export function ProgressCircle({ value }: ProgressCircleProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="relative w-28 h-28 flex items-center justify-center"
    >
      <Progress
        value={value}
        className="w-full h-full rounded-full bg-background/50 rotate-[-90deg] [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent [&>div]:transition-all [&>div]:duration-500"
      />
      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
        {Math.round(value)}%
      </div>
    </motion.div>
  );
}