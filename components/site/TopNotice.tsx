'use client';

import { Sparkles } from 'lucide-react';

export default function TopNotice() {
  return (
    <div className="bg-primary/10 border-border border-b">
      <div className="text-muted-foreground container flex h-9 items-center justify-center gap-2 text-xs">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Questionnaire anonyme, résultats immédiats, couleurs apaisantes.</span>
      </div>
    </div>
  );
}
