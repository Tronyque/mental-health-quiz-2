import { motion } from 'framer-motion';

interface ProgressCircleProps {
  value: number;
}

export function ProgressCircle({ value }: ProgressCircleProps) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - value / 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-28 h-28 flex items-center justify-center"
    >
      <svg width="100%" height="100%" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="10"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#A7C7E7" // Bleu pastel
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-foreground">
        {Math.round(value)}%
      </div>
    </motion.div>
  );
}