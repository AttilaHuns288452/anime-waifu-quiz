import { Character, CHARACTERS, getCharactersByGender } from "./characters";
import { QUESTIONS } from "./questions";

export interface QuizAnswer {
  questionId: number;
  answerIndex: number;
}

export interface QuizResult {
  character: Character;
  compatibility: number;
  runnerUp: { character: Character; compatibility: number } | null;
  profile: {
    e: number; // Introvert → Extrovert
    l: number; // Heart → Head
    v: number; // Serious → Playful
    p: number; // Relaxed → Driven
    n: number; // Independent → Loyal
  };
}

// Calculate user's personality vector from answers
function calculateUserProfile(answers: QuizAnswer[]): { e: number; l: number; v: number; p: number; n: number } {
  const profile = { e: 0, l: 0, v: 0, p: 0, n: 0 };

  for (const answer of answers) {
    const question = QUESTIONS.find(q => q.id === answer.questionId);
    if (!question) continue;
    const selectedAnswer = question.answers[answer.answerIndex];
    if (!selectedAnswer) continue;

    profile.e += selectedAnswer.modifier.e;
    profile.l += selectedAnswer.modifier.l;
    profile.v += selectedAnswer.modifier.v;
    profile.p += selectedAnswer.modifier.p;
    profile.n += selectedAnswer.modifier.n;
  }

  // Normalize to -3 to +3 range
  const maxPerAxis = QUESTIONS.length * 3;
  const normalize = (val: number) => Math.round((Math.max(-3, Math.min(3, (val / maxPerAxis) * 3))) * 10) / 10;

  return {
    e: normalize(profile.e),
    l: normalize(profile.l),
    v: normalize(profile.v),
    p: normalize(profile.p),
    n: normalize(profile.n),
  };
}

// Calculate cosine similarity between two personality vectors
function cosineSimilarity(
  a: { e: number; l: number; v: number; p: number; n: number },
  b: { e: number; l: number; v: number; p: number; n: number }
): number {
  const dotProduct = a.e * b.e + a.l * b.l + a.v * b.v + a.p * b.p + a.n * b.n;
  const magnitudeA = Math.sqrt(a.e * a.e + a.l * a.l + a.v * a.v + a.p * a.p + a.n * a.n);
  const magnitudeB = Math.sqrt(b.e * b.e + b.l * b.l + b.v * b.v + b.p * b.p + b.n * b.n);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return Math.round((dotProduct / (magnitudeA * magnitudeB)) * 100);
}

// Calculate compatibility with all characters and return top matches
export function findMatches(answers: QuizAnswer[], preferredGender: "waifu" | "husbando" | "both"): QuizResult {
  const userProfile = calculateUserProfile(answers);
  const candidates = getCharactersByGender(preferredGender);

  const scored = candidates.map(character => ({
    character,
    compatibility: cosineSimilarity(userProfile, character.traits),
  }));

  scored.sort((a, b) => b.compatibility - a.compatibility);

  return {
    character: scored[0].character,
    compatibility: Math.max(0, Math.min(100, 50 + scored[0].compatibility * 0.5)),
    runnerUp: scored[1]
      ? { character: scored[1].character, compatibility: Math.max(0, Math.min(100, 50 + scored[1].compatibility * 0.5)) }
      : null,
    profile: userProfile,
  };
}

// Get personality type description from profile
export function getPersonalityDescription(profile: { e: number; l: number; v: number; p: number; n: number }): string {
  const parts: string[] = [];

  if (profile.e < -1) parts.push("Introverted");
  else if (profile.e > 1) parts.push("Extroverted");
  else parts.push("Balanced");

  if (profile.l < -1) parts.push("Heart-Driven");
  else if (profile.l > 1) parts.push("Logic-Driven");
  else parts.push("Balanced Thinker");

  if (profile.v < -1) parts.push("Serious-minded");
  else if (profile.v > 1) parts.push("Playful");
  else parts.push("Measured");

  if (profile.p < -1) parts.push("Relaxed");
  else if (profile.p > 1) parts.push("Driven");
  else parts.push("Steady");

  if (profile.n < -1) parts.push("Independent");
  else if (profile.n > 1) parts.push("Loyal");
  else parts.push("Flexible");

  return parts.join(" · ");
}
