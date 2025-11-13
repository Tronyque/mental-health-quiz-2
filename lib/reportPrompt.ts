// lib/reportPrompt.ts
export type Result = { label: string; value: number };

export function buildWellbeingPrompt(results: Result[], locale: 'fr'|'en' = 'fr') {
  // a) classe les scores
  const strengths = results.filter(r => r.value >= 60).map(r => `${r.label}: ${r.value}`);
  const watch = results.filter(r => r.value < 40).map(r => `${r.label}: ${r.value}`);

  // b) relations multi-dim (exemples : Charge élevée + Reconnaissance basse)
  const hasHighLoad = results.some(r => /Charge/i.test(r.label) && r.value < 40);
  const lowRecognition = results.some(r => /Reconnaissance/i.test(r.label) && r.value < 40);
  const lowSupport = results.some(r => /Management|Dispositifs/i.test(r.label) && r.value < 40);

  const flags: string[] = [];
  if (hasHighLoad && lowRecognition) flags.push('charge_travail + faible reconnaissance');
  if (hasHighLoad && lowSupport) flags.push('charge_travail + soutien perçu faible');
  if (lowRecognition && lowSupport) flags.push('faible reconnaissance + dispositifs/management perçus faibles');

  const lang = locale === 'fr' ? 'français' : 'anglais';

  return `
Tu es un assistant en bien-être au travail. Rédige un compte rendu bref (180–260 mots), ${lang}, bienveillant, non médicalisant.
Consignes essentielles :
- Valorise 2–3 points forts (scores ≥ 60).
- Mentionne 2–3 pistes concrètes d’amélioration (scores < 40), formulées comme des suggestions.
- Interprète les combinaisons multi-dimensionnelles si présentes (ex. charge élevée + faible reconnaissance).
- Rappelle que ce n’est pas un diagnostic médical et qu’en cas de difficulté, l’échange avec un professionnel est recommandé.
- Style : chaleureux, simple, respectueux. Jamais d’injonctions, ni de jugement.

Données (0–100) :
${results.map(r => `- ${r.label}: ${r.value}`).join('\n')}

Points forts (≥60) :
${strengths.length ? strengths.join(', ') : 'aucun mis en évidence'}

Points de vigilance (<40) :
${watch.length ? watch.join(', ') : 'aucun'}

Combinaisons multi-dimensionnelles :
${flags.length ? flags.join(' | ') : 'aucune détectée'}

Structure attendue :
1) Accroche empathique + rappel non-diagnostic
2) Forces observées (2–3 idées)
3) Pistes d’amélioration concrètes (2–3 actions réalisables)
4) Suggestion de ressources/échanges (ex. pair, manager, professionnel)
5) Clôture encourageante ("Prenez soin de vous")

Ton texte doit rester généraliste (pas de termes médicaux), s’adresser à la 2e personne du singulier, et ne pas dépasser ~260 mots.
`;
}
