import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';

interface LikertProps {
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  labels?: string[];
  useEmojis?: boolean;
}

export function LikertScale({ min, max, value, onChange, useEmojis = true }: LikertProps) {
  const marks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const getEmoji = (val: number) => {
    const normalized = (val - min) / (max - min);
    if (normalized < 0.2) return <span className="text-2xl">😞</span>;
    if (normalized < 0.4) return <span className="text-2xl">😐</span>;
    if (normalized < 0.6) return <span className="text-2xl">🙂</span>;
    if (normalized < 0.8) return <span className="text-2xl">😊</span>;
    return <span className="text-2xl">😄</span>;
  };

  const handleMarkClick = (val: number) => {
    onChange(val);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 p-6 bg-card rounded-3xl shadow-soft border border-accent/20"
    >
      <motion.div
        animate={{ scale: value > 0 ? 1.05 : 1, boxShadow: value > 0 ? '0 0 10px rgba(165,199,231,0.5)' : 'none' }}
        transition={{ duration: 0.2 }}
      >
        <Slider
          min={min}
          max={max}
          step={1}
          value={[value]}
          onValueChange={(v) => onChange(v[0])}
          className="w-full [&>div]:h-8 [&>div]:w-8"
        />
      </motion.div>
      <div className="flex justify-between text-sm">
        {marks.map((mark) => (
          <motion.div
            key={mark}
            className="flex flex-col items-center cursor-pointer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMarkClick(mark)}
          >
            <div className="h-3 w-1 bg-border rounded-full" />
            {useEmojis && getEmoji(mark)}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}