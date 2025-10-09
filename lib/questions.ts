export interface Question {
  id: string;
  text: string;
  dimension: string;
  scale: { min: number; max: number; labels?: string[] };
  inverted: boolean;
  source?: string;
}

export const questions: Question[] = [
  { id: 'q0_1', text: 'De manière générale, je suis satisfait(e) de mon travail.', dimension: 'Satisfaction globale', scale: { min: 1, max: 5 }, inverted: false, source: '' },
  { id: 'q1_1', text: 'Je suis confiant(e) dans ma capacité à réussir professionnellement.', dimension: 'Optimisme professionnel', scale: { min: 1, max: 5 }, inverted: false, source: 'LOT-R abrégé' },
  { id: 'q1_2', text: 'Je vois mon avenir professionnel avec optimisme.', dimension: 'Optimisme professionnel', scale: { min: 1, max: 5 }, inverted: false, source: 'LOT-R abrégé' },
  { id: 'q1_3', text: 'Je m’attends à ce que les choses se passent bien dans mon travail.', dimension: 'Optimisme professionnel', scale: { min: 1, max: 5 }, inverted: false, source: 'LOT-R abrégé' },
  { id: 'q2_1', text: 'Je me sens détendu(e) pendant mes journées de travail.', dimension: 'Stress et détente', scale: { min: 1, max: 5 }, inverted: false, source: 'PSS-4' },
  { id: 'q2_2', text: 'Je ressens du stress dans mon activité professionnelle.', dimension: 'Stress et détente', scale: { min: 1, max: 5 }, inverted: true, source: 'PSS-4' },
  { id: 'q2_3', text: 'Je parviens à gérer les imprévus sans trop de tension.', dimension: 'Stress et détente', scale: { min: 1, max: 5 }, inverted: false, source: 'PSS-4' },
  { id: 'q2_4', text: 'Je me sens dépassé(e) par mes responsabilités.', dimension: 'Stress et détente', scale: { min: 1, max: 5 }, inverted: true, source: 'PSS-4' },
  { id: 'q3_1', text: 'Je me sens plein(e) d’énergie dans mon travail.', dimension: 'Énergie et engagement', scale: { min: 1, max: 7, labels: ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Très souvent', 'Presque toujours', 'Toujours'] }, inverted: false, source: 'UWES-3' },
  { id: 'q3_2', text: 'Je suis enthousiaste à l’idée de commencer ma journée de travail.', dimension: 'Énergie et engagement', scale: { min: 1, max: 7, labels: ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Très souvent', 'Presque toujours', 'Toujours'] }, inverted: false, source: 'UWES-3' },
  { id: 'q3_3', text: 'Mon travail m’absorbe complètement.', dimension: 'Énergie et engagement', scale: { min: 1, max: 7, labels: ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Très souvent', 'Presque toujours', 'Toujours'] }, inverted: false, source: 'UWES-3' },
  { id: 'q4_1', text: 'Je suis capable de prendre des décisions efficacement dans mon travail.', dimension: 'Efficacité personnelle', scale: { min: 1, max: 4, labels: ['Pas du tout vrai', 'Plutôt faux', 'Plutôt vrai', 'Tout à fait vrai'] }, inverted: false, source: 'GSE-6' },
  { id: 'q4_2', text: 'Je trouve des solutions même face à des difficultés professionnelles.', dimension: 'Efficacité personnelle', scale: { min: 1, max: 4, labels: ['Pas du tout vrai', 'Plutôt faux', 'Plutôt vrai', 'Tout à fait vrai'] }, inverted: false, source: 'GSE-6' },
  { id: 'q4_3', text: 'Je me sens compétent(e) pour accomplir mes missions.', dimension: 'Efficacité personnelle', scale: { min: 1, max: 4, labels: ['Pas du tout vrai', 'Plutôt faux', 'Plutôt vrai', 'Tout à fait vrai'] }, inverted: false, source: 'GSE-6' },
  { id: 'q5_1', text: 'Je suis satisfait(e) de mon rôle professionnel.', dimension: 'Satisfaction dans le rôle', scale: { min: 1, max: 5 }, inverted: false, source: 'JSS abrégé' },
  { id: 'q5_2', text: 'Je me sens bien dans mon poste actuel.', dimension: 'Satisfaction dans le rôle', scale: { min: 1, max: 5 }, inverted: false, source: 'JSS abrégé' },
  { id: 'q5_3', text: 'Mon travail correspond à ce que j’aime faire.', dimension: 'Satisfaction dans le rôle', scale: { min: 1, max: 5 }, inverted: false, source: 'JSS abrégé' },
  { id: 'q6_1', text: 'Je me sens proche de mes collègues.', dimension: 'Relations interpersonnelles', scale: { min: 1, max: 5 }, inverted: false, source: 'COPSOQ abrégé' },
  { id: 'q6_2', text: 'J’ai des relations positives avec les personnes avec qui je travaille.', dimension: 'Relations interpersonnelles', scale: { min: 1, max: 5 }, inverted: false, source: 'COPSOQ abrégé' },
  { id: 'q6_3', text: 'Je me sens en confiance dans mon équipe ou avec ma hiérarchie.', dimension: 'Relations interpersonnelles', scale: { min: 1, max: 5 }, inverted: false, source: 'COPSOQ abrégé' },
  { id: 'q6_4', text: 'Je peux compter sur le soutien de mes collègues en cas de besoin.', dimension: 'Relations interpersonnelles', scale: { min: 1, max: 5 }, inverted: false, source: 'COPSOQ abrégé' },
  { id: 'q7_1', text: 'J’ai le sentiment que mon travail a du sens.', dimension: 'Sens du travail', scale: { min: 1, max: 5 }, inverted: false, source: 'WAMI abrégé' },
  { id: 'q7_2', text: 'Mon activité professionnelle est alignée avec mes valeurs.', dimension: 'Sens du travail', scale: { min: 1, max: 5 }, inverted: false, source: 'WAMI abrégé' },
  { id: 'q7_3', text: 'Ce que je fais au travail est important pour moi.', dimension: 'Sens du travail', scale: { min: 1, max: 5 }, inverted: false, source: 'WAMI abrégé' },
  { id: 'q8_1', text: 'Je me sens valorisé(e) pour ce que je fais.', dimension: 'Reconnaissance et valorisation', scale: { min: 1, max: 5 }, inverted: false, source: 'Brun & Dugas (adapté)' },
  { id: 'q8_2', text: 'Mon travail est reconnu à sa juste valeur.', dimension: 'Reconnaissance et valorisation', scale: { min: 1, max: 5 }, inverted: false, source: 'Brun & Dugas (adapté)' },
  { id: 'q8_3', text: 'Je reçois des signes de reconnaissance de la part de mes collègues ou de ma hiérarchie.', dimension: 'Reconnaissance et valorisation', scale: { min: 1, max: 5 }, inverted: false, source: 'Brun & Dugas (adapté)' },
  { id: 'q9_1', text: 'Je trouve que ma charge de travail est raisonnable.', dimension: 'Charge de travail', scale: { min: 1, max: 5 }, inverted: false, source: 'COPSOQ + Karasek (adapté)' },
  { id: 'q9_2', text: 'Je dispose du temps nécessaire pour accomplir mes missions correctement.', dimension: 'Charge de travail', scale: { min: 1, max: 5 }, inverted: false, source: 'COPSOQ + Karasek (adapté)' },
  { id: 'q9_3', text: 'Je ressens une pression liée au volume de travail.', dimension: 'Charge de travail', scale: { min: 1, max: 5 }, inverted: true, source: 'COPSOQ + Karasek (adapté)' },
  { id: 'q10_1', text: 'Je suis satisfait(e) des actions mises en place pour favoriser la santé et le bien-être au travail.', dimension: 'Santé au travail – perception des dispositifs', scale: { min: 1, max: 5 }, inverted: false, source: 'COPSOQ + QVT (adapté)' },
  { id: 'q10_2', text: 'Les dispositifs proposés par mon établissement répondent à mes besoins en matière de qualité de vie au travail.', dimension: 'Santé au travail – perception des dispositifs', scale: { min: 1, max: 5 }, inverted: false, source: 'COPSOQ + QVT (adapté)' },
  { id: 'q10_3', text: 'Je me sens impliqué(e) ou consulté(e) dans les démarches liées à la prévention des risques psychosociaux.', dimension: 'Santé au travail – perception des dispositifs', scale: { min: 1, max: 5 }, inverted: false, source: 'COPSOQ + QVT (adapté)' },
  { id: 'q11_1', text: 'Je me sens soutenu(e) par mon cadre de santé dans mon travail quotidien.', dimension: 'Management – cadre de santé et direction', scale: { min: 1, max: 5 }, inverted: false, source: 'adaptation COPSOQ + leadership participatif' },
  { id: 'q11_2', text: 'La direction montre de l’intérêt pour les conditions de travail des équipes.', dimension: 'Management – cadre de santé et direction', scale: { min: 1, max: 5 }, inverted: false, source: 'adaptation COPSOQ + leadership participatif' },
  { id: 'q11_3', text: 'Les décisions managériales sont expliquées de manière claire et transparente.', dimension: 'Management – cadre de santé et direction', scale: { min: 1, max: 5 }, inverted: false, source: 'adaptation COPSOQ + leadership participatif' },
  { id: 'q11_4', text: 'Je peux exprimer mes idées ou préoccupations auprès du management sans crainte.', dimension: 'Management – cadre de santé et direction', scale: { min: 1, max: 5 }, inverted: false, source: 'adaptation COPSOQ + leadership participatif' },
];

export const dimensions: string[] = [
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
];

export function normalizeScore(raw: number, min: number, max: number, inverted: boolean): number {
  let score = inverted ? (max - raw + min) : raw;
  return Math.round(((score - min) / (max - min)) * 100);
}