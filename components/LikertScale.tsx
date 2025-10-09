import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { FaRegFrown, FaRegMeh, FaRegSmile, FaRegGrin, FaRegLaughBeam } from 'react-icons/fa';

interface LikertProps {
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  labels?: string[];
  useEmojis?: boolean;
}

export function LikertScale({ min, max, value, onChange, labels, useEmojis = true }: LikertProps) {
  const marks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const getEmoji = (val: number) => {
    const normalized = (val - min) / (max - min);
    if (normalized < 0.2) return <FaRegFrown className="text-red-400 text-2xl" />;
    if (normalized < 0.4) return <FaRegMeh className="text-orange-400 text-2xl" />;
    if (normalized < 0.6) return <FaRegSmile className="text-yellow-400 text-2xl" />;
    if (normalized < 0.8) return <FaRegGrin className="text-green-300 text-2xl" />;
    return <FaRegLaughBeam className="text-green-500 text-2xl" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 p-6 bg-card rounded-3xl shadow-soft border border-accent/20"
    >
      <motion.div animate={{ scale: value > 0 ? 1.05 : 1 }} transition={{ duration: 0.2 }}> {/* Animation scale sur slider change */}
        <Slider
          min={min}
          max={max}
          step={1}
          value={[value]}
          onValueChange={(v) => onChange(v[0])}
          className="w-full"
        />
      </motion.div>
      <div className="flex justify-between text-sm text-muted-foreground">
        {marks.map((mark) => (
          <div key={mark} className="flex flex-col items-center">
            <div className="h-3 w-1 bg-border rounded-full" />
            <span>{useEmojis ? getEmoji(mark) : mark}</span>
          </div>
        ))}
      </div>
      {labels && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.3 }} className="flex justify-between text-xs text-muted-foreground flex-wrap mt-2">
          {labels.map((label, i) => (
            <span key={i} className="text-center font-medium text-secondary" style={{ flexBasis: `${100 / labels.length}%` }}>
              {label} {/* Commentaire fixé : Plus coloré */}
            </span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}