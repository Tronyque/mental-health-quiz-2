// lib/questions.ts
// ———————————————————————————————————————————
// 🧠 Questionnaire Bien-Être au Travail — Version complète
// Harmonisé sur une échelle Likert 1 à 5
// Inclut 13 dimensions et 38 questions
// Les sources sont internes (non affichées à l'utilisateur)
// ———————————————————————————————————————————

export type Question = {
  id: string; // identifiant technique (ex: "q2_3")
  num: number; // numéro séquentiel (1 à 38)
  text: string; // texte de la question
  dimension: string; // catégorie de rattachement
  scale: {
    min: number;
    max: number;
    labels: string[];
  };
  inverted?: boolean; // score inversé
  source?: string; // source ou référence psychométrique
};

// ✅ Échelle standard Likert 1 à 5
const likertScale = {
  min: 1,
  max: 5,
  labels: [
    'Pas du tout d’accord',
    'Plutôt pas d’accord',
    'Neutre',
    'Plutôt d’accord',
    'Tout à fait d’accord',
  ],
};

// ✅ Dimensions principales (13)
export const dimensions = [
  'Satisfaction globale',
  'Optimisme professionnel',
  'Stress et détente',
  'Énergie et engagement',
  'Efficacité personnelle',
  'Satisfaction dans le rôle',
  'Relations interpersonnelles',
  'Sens du travail',
  'Reconnaissance et valorisation',
  'Charge de travail',
  'Santé au travail – perception des dispositifs',
  'Management – cadre de santé et direction',
  'Équilibre vie privée / personnelle',
];

// ✅ Ensemble des 38 questions
export const questions: Question[] = [
  {
    id: 'q0_1',
    num: 1,
    text: 'De manière générale, je suis satisfait(e) de mon travail.',
    dimension: 'Satisfaction globale',
    scale: likertScale,
    source: '',
  },
  {
    id: 'q1_1',
    num: 2,
    text: 'Je suis confiant(e) dans ma capacité à réussir professionnellement.',
    dimension: 'Optimisme professionnel',
    scale: likertScale,
    source: 'LOT-R abrégé',
  },
  {
    id: 'q1_2',
    num: 3,
    text: 'Je vois mon avenir professionnel avec optimisme.',
    dimension: 'Optimisme professionnel',
    scale: likertScale,
    source: 'LOT-R abrégé',
  },
  {
    id: 'q1_3',
    num: 4,
    text: 'Je m’attends à ce que les choses se passent bien dans mon travail.',
    dimension: 'Optimisme professionnel',
    scale: likertScale,
    source: 'LOT-R abrégé',
  },
  {
    id: 'q2_1',
    num: 5,
    text: 'Je me sens détendu(e) pendant mes journées de travail.',
    dimension: 'Stress et détente',
    scale: likertScale,
    source: 'PSS-4',
  },
  {
    id: 'q2_2',
    num: 6,
    text: 'Je ressens du stress dans mon activité professionnelle.',
    dimension: 'Stress et détente',
    scale: likertScale,
    inverted: true,
    source: 'PSS-4',
  },
  {
    id: 'q2_3',
    num: 7,
    text: 'Je parviens à gérer les imprévus sans trop de tension.',
    dimension: 'Stress et détente',
    scale: likertScale,
    source: 'PSS-4',
  },
  {
    id: 'q2_4',
    num: 8,
    text: 'Je me sens dépassé(e) par mes responsabilités.',
    dimension: 'Stress et détente',
    scale: likertScale,
    inverted: true,
    source: 'PSS-4',
  },
  {
    id: 'q3_1',
    num: 9,
    text: 'Je me sens plein(e) d’énergie dans mon travail.',
    dimension: 'Énergie et engagement',
    scale: likertScale,
    source: 'UWES-3',
  },
  {
    id: 'q3_2',
    num: 10,
    text: 'Je suis enthousiaste à l’idée de commencer ma journée de travail.',
    dimension: 'Énergie et engagement',
    scale: likertScale,
    source: 'UWES-3',
  },
  {
    id: 'q3_3',
    num: 11,
    text: 'Mon travail m’absorbe complètement.',
    dimension: 'Énergie et engagement',
    scale: likertScale,
    source: 'UWES-3',
  },
  {
    id: 'q4_1',
    num: 12,
    text: 'Je suis capable de prendre des décisions efficacement dans mon travail.',
    dimension: 'Efficacité personnelle',
    scale: likertScale,
    source: 'GSE-6',
  },
  {
    id: 'q4_2',
    num: 13,
    text: 'Je trouve des solutions même face à des difficultés professionnelles.',
    dimension: 'Efficacité personnelle',
    scale: likertScale,
    source: 'GSE-6',
  },
  {
    id: 'q4_3',
    num: 14,
    text: 'Je me sens compétent(e) pour accomplir mes missions.',
    dimension: 'Efficacité personnelle',
    scale: likertScale,
    source: 'GSE-6',
  },
  {
    id: 'q5_1',
    num: 15,
    text: 'Je suis satisfait(e) de mon rôle professionnel.',
    dimension: 'Satisfaction dans le rôle',
    scale: likertScale,
    source: 'JSS abrégé',
  },
  {
    id: 'q5_2',
    num: 16,
    text: 'Je me sens bien dans mon poste actuel.',
    dimension: 'Satisfaction dans le rôle',
    scale: likertScale,
    source: 'JSS abrégé',
  },
  {
    id: 'q5_3',
    num: 17,
    text: 'Mon travail correspond à ce que j’aime faire.',
    dimension: 'Satisfaction dans le rôle',
    scale: likertScale,
    source: 'JSS abrégé',
  },
  {
    id: 'q6_1',
    num: 18,
    text: 'Je me sens proche de mes collègues.',
    dimension: 'Relations interpersonnelles',
    scale: likertScale,
    source: 'COPSOQ abrégé',
  },
  {
    id: 'q6_2',
    num: 19,
    text: 'J’ai des relations positives avec les personnes avec qui je travaille.',
    dimension: 'Relations interpersonnelles',
    scale: likertScale,
    source: 'COPSOQ abrégé',
  },
  {
    id: 'q6_3',
    num: 20,
    text: 'Je me sens en confiance dans mon équipe ou avec ma hiérarchie.',
    dimension: 'Relations interpersonnelles',
    scale: likertScale,
    source: 'COPSOQ abrégé',
  },
  {
    id: 'q6_4',
    num: 21,
    text: 'Je peux compter sur le soutien de mes collègues en cas de besoin.',
    dimension: 'Relations interpersonnelles',
    scale: likertScale,
    source: 'COPSOQ abrégé',
  },
  {
    id: 'q7_1',
    num: 22,
    text: 'J’ai le sentiment que mon travail a du sens.',
    dimension: 'Sens du travail',
    scale: likertScale,
    source: 'WAMI abrégé',
  },
  {
    id: 'q7_2',
    num: 23,
    text: 'Mon activité professionnelle est alignée avec mes valeurs.',
    dimension: 'Sens du travail',
    scale: likertScale,
    source: 'WAMI abrégé',
  },
  {
    id: 'q7_3',
    num: 24,
    text: 'Ce que je fais au travail est important pour moi.',
    dimension: 'Sens du travail',
    scale: likertScale,
    source: 'WAMI abrégé',
  },
  {
    id: 'q8_1',
    num: 25,
    text: 'Je me sens valorisé(e) pour ce que je fais.',
    dimension: 'Reconnaissance et valorisation',
    scale: likertScale,
    source: 'Brun & Dugas (adapté)',
  },
  {
    id: 'q8_2',
    num: 26,
    text: 'Mon travail est reconnu à sa juste valeur.',
    dimension: 'Reconnaissance et valorisation',
    scale: likertScale,
    source: 'Brun & Dugas (adapté)',
  },
  {
    id: 'q8_3',
    num: 27,
    text: 'Je reçois des signes de reconnaissance de la part de mes collègues ou de ma hiérarchie.',
    dimension: 'Reconnaissance et valorisation',
    scale: likertScale,
    source: 'Brun & Dugas (adapté)',
  },
  {
    id: 'q9_1',
    num: 28,
    text: 'Je trouve que ma charge de travail est raisonnable.',
    dimension: 'Charge de travail',
    scale: likertScale,
    source: 'COPSOQ + Karasek (adapté)',
  },
  {
    id: 'q9_2',
    num: 29,
    text: 'Je dispose du temps nécessaire pour accomplir mes missions correctement.',
    dimension: 'Charge de travail',
    scale: likertScale,
    source: 'COPSOQ + Karasek (adapté)',
  },
  {
    id: 'q9_3',
    num: 30,
    text: 'Je ressens une pression liée au volume de travail.',
    dimension: 'Charge de travail',
    scale: likertScale,
    inverted: true,
    source: 'COPSOQ + Karasek (adapté)',
  },
  {
    id: 'q10_1',
    num: 31,
    text: 'Je suis satisfait(e) des actions mises en place pour favoriser la santé et le bien-être au travail.',
    dimension: 'Santé au travail – perception des dispositifs',
    scale: likertScale,
    source: 'COPSOQ + QVT (adapté)',
  },
  {
    id: 'q10_2',
    num: 32,
    text: 'Les dispositifs proposés par mon établissement répondent à mes besoins en matière de qualité de vie au travail.',
    dimension: 'Santé au travail – perception des dispositifs',
    scale: likertScale,
    source: 'COPSOQ + QVT (adapté)',
  },
  {
    id: 'q10_3',
    num: 33,
    text: 'Je me sens impliqué(e) ou consulté(e) dans les démarches liées à la prévention des risques psychosociaux.',
    dimension: 'Santé au travail – perception des dispositifs',
    scale: likertScale,
    source: 'COPSOQ + QVT (adapté)',
  },
  {
    id: 'q11_1',
    num: 34,
    text: 'Je me sens soutenu(e) par mon cadre de santé dans mon travail quotidien.',
    dimension: 'Management – cadre de santé et direction',
    scale: likertScale,
    source: 'Leadership participatif (adapté COPSOQ)',
  },
  {
    id: 'q11_2',
    num: 35,
    text: 'La direction montre de l’intérêt pour les conditions de travail des équipes.',
    dimension: 'Management – cadre de santé et direction',
    scale: likertScale,
    source: 'Leadership participatif (adapté COPSOQ)',
  },
  {
    id: 'q11_3',
    num: 36,
    text: 'Les décisions managériales sont expliquées de manière claire et transparente.',
    dimension: 'Management – cadre de santé et direction',
    scale: likertScale,
    source: 'Leadership participatif (adapté COPSOQ)',
  },
  {
    id: 'q11_4',
    num: 37,
    text: 'Je peux exprimer mes idées ou préoccupations auprès du management sans crainte.',
    dimension: 'Management – cadre de santé et direction',
    scale: likertScale,
    source: 'Leadership participatif (adapté COPSOQ)',
  },
  {
    id: 'q12_1',
    num: 38,
    text: 'Je parviens à préserver un bon équilibre entre ma vie privée et ma vie professionnelle.',
    dimension: 'Équilibre vie privée / personnelle',
    scale: likertScale,
    source: 'adaptation interne',
  },
];

// ✅ Fonction de normalisation (1–5 → 0–100)
export function normalizeScore(
  value: number,
  min: number,
  max: number,
  inverted?: boolean,
): number {
  if (!value) return 0;
  const score = ((value - min) / (max - min)) * 100;
  return inverted ? 100 - score : score;
}

// ✅ Fonction utilitaire — regroupe les questions par dimension
export function getQuestionsByDimension(dimension: string): Question[] {
  return questions.filter((q) => q.dimension === dimension);
}
