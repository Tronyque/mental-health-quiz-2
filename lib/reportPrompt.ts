// lib/reportPrompt.ts
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export type Result = {
  label: string; // nom de la dimension
  value: number; // score brut (ex: 12 sur 15 pour une dimension)
};

export function buildReportMessages(
  results: Result[],
  locale: "fr" | "en" = "fr",
  demographics?: {
    ehpad?: string;
    fonction?: string;
    age?: string;
    anciennete?: string;
  }
): ChatCompletionMessageParam[] {
  // on arrondit une fois pour éviter les 45,3333…
  const rounded = results.map((r) => ({
    ...r,
    value: Math.round(r.value * 10) / 10,
  }));

  const messages: ChatCompletionMessageParam[] = [];

  // === CONTEXTE DEMOGRAPHICS (facultatif mais très puissant) ===
  if (demographics && Object.values(demographics).some(v => v && v.trim() !== "" && v !== "Je préfère ne pas répondre")) {
    messages.unshift({
      role: "system",
      content: `CONTEXTE UTILISATEUR (à utiliser pour nuancer les conseils quand c'est pertinent) :
- Établissement : ${demographics.ehpad || "non indiqué"}
- Fonction : ${demographics.fonction || "non indiqué"}
- Tranche d'âge : ${demographics.age || "non indiqué"}
- Ancienneté : ${demographics.anciennete || "non indiqué"}

Adapte les conseils en fonction de ces infos (ex: pour un aide-soignant avec plus de 10 ans d'expérience, insister sur la reconnaissance ; pour un jeune infirmier, parler plus d'intégration, etc.).`,
    });
  }

  // === PROMPT PRINCIPAL (version FR uniquement pour l'instant, on ajoutera EN si besoin) ===
  messages.push(
    {
      role: "system",
      content: `
Tu es un expert bienveillant en bien-être au travail dans le secteur médico-social.
Tu génères des rapports collectifs ou individuels à partir de scores de questionnaire.

RÈGLES STRICTES :
- Réponds UNIQUEMENT avec un JSON valide, rien d'autre.
- Pas de texte avant/après le JSON.
- Pas de \`\`\`json ou markdown.

Structure EXACTE à renvoyer :
{
  "globalSynthesis": string (Markdown, très aéré, chaleureux, professionnel, 8–14 phrases max),
  "dimensionAnalyses": {
    "Charge de travail": string,
    "Autonomie & sens": string,
    "Reconnaissance": string,
    "Ambiance d'équipe": string,
    "Formation & évolution": string,
    "Équilibre vie pro/perso": string,
    "Management de proximité": string,
    "Moyens & ressources": string
  }
}

Pour "dimensionAnalyses" : 
- 1 phrase de définition courte
- 1 phrase d'interprétation du score (positive ou nuancée, jamais culpabilisante)
- Maximum 2 phrases au total par dimension

Pour "globalSynthesis" :
- Utilise du Markdown léger (##, ###, listes, gras)
- Ton chaleureux, humain, encourageant
- Termine toujours par une phrase d'espoir ou de remerciement
- Section obligatoire à la fin : "## 🔒 Confidentialité et anonymat" avec rappel clair que rien n'est transmis ni associé à une identité

Maintenant analyse ces résultats et renvoie uniquement le JSON.
`.trim(),
    },
    {
      role: "user",
      content: `Voici les scores (sur 100) pour chaque dimension :\n\n${rounded
        .map((r) => `• ${r.label} : ${r.value}/100`)
        .join("\n")}

Génère le rapport JSON strict selon les instructions ci-dessus.`,
    }
  );

  return messages;
}