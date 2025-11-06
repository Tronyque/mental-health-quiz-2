"use client";

import { Sparkles } from "lucide-react";

export default function TopNotice() {
  return (
    <div className="bg-primary/10 border-b border-border">
      <div className="container h-9 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Questionnaire anonyme, résultats immédiats, couleurs apaisantes.</span>
      </div>
    </div>
  );
}
