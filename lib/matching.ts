import { Character, CHARACTERS, getCharactersByGender } from "./characters";
import { QUESTIONS } from "./questions";

export interface QuizAnswer {
  questionId: number;
  answerIndex: number;
}

export interface QuizResult {
  character: Character;
  compatibility: number;
  certainty: number; // how confident we are (0-100)
  runnerUp: { character: Character; compatibility: number } | null;
  profile: {
    e: number;
    l: number;
    v: number;
    p: number;
    n: number;
  };
}

// Calculate user's personality vector from answers
function calculateUserProfile(answers: QuizAnswer[]): { e: number; l: number; v: number; p: number; n: number } {
  const profile = { e: 0, l: 0, v: 0, p: 0, n: 0 };
  let totalQuestions = 0;

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
    totalQuestions++;
  }

  if (totalQuestions === 0) return { e: 0, l: 0, v: 0, p: 0, n: 0 };

  // Normalize to -3 to +3 range based on total questions
  const maxPerAxis = totalQuestions * 3;
  const normalize = (val: number) => Math.round((Math.max(-3, Math.min(3, (val / maxPerAxis) * 3))) * 10) / 10;

  return {
    e: normalize(profile.e),
    l: normalize(profile.l),
    v: normalize(profile.v),
    p: normalize(profile.p),
    n: normalize(profile.n),
  };
}

// Weighted Euclidean distance - more accurate than cosine similarity for personality matching
// Each axis can be weighted differently based on how well it discriminates characters
function weightedDistance(
  user: { e: number; l: number; v: number; p: number; n: number },
  character: { e: number; l: number; v: number; p: number; n: number }
): number {
  // Weights: some axes matter more for differentiation
  const weights = { e: 1.2, l: 1.0, v: 1.3, p: 1.1, n: 1.4 };
  
  const squaredDiff = 
    weights.e * Math.pow(user.e - character.e, 2) +
    weights.l * Math.pow(user.l - character.l, 2) +
    weights.v * Math.pow(user.v - character.v, 2) +
    weights.p * Math.pow(user.p - character.p, 2) +
    weights.n * Math.pow(user.n - character.n, 2);
  
  const maxPossibleDist = weights.e * 36 + weights.l * 36 + weights.v * 36 + weights.p * 36 + weights.n * 36;
  
  // Convert distance to similarity (0-100)
  // Lower distance = higher similarity
  return Math.round((1 - Math.sqrt(squaredDiff) / Math.sqrt(maxPossibleDist)) * 100);
}

// Fuzzy matching: if user's score is within 0.5 of the character on any axis,
// that's considered a "close match" for that axis
function axisMatchCount(
  user: { e: number; l: number; v: number; p: number; n: number },
  character: { e: number; l: number; v: number; p: number; n: number }
): number {
  let count = 0;
  if (Math.abs(user.e - character.e) <= 0.8) count++;
  if (Math.abs(user.l - character.l) <= 0.8) count++;
  if (Math.abs(user.v - character.v) <= 0.8) count++;
  if (Math.abs(user.p - character.p) <= 0.8) count++;
  if (Math.abs(user.n - character.n) <= 0.8) count++;
  return count;
}

// Calculate a certainty score based on how much the top match differs from the rest
function calculateCertainty(scored: { compatibility: number }[]): number {
  if (scored.length < 2) return 100;
  
  const topScore = scored[0].compatibility;
  const secondScore = scored[1].compatibility;
  const gap = topScore - secondScore;
  
  // If gap is 0, certainty is low. If gap is 20+, very certain
  return Math.min(100, Math.round((gap / 25) * 100));
}

export function findMatches(answers: QuizAnswer[], preferredGender: "waifu" | "husbando" | "both"): QuizResult {
  const userProfile = calculateUserProfile(answers);
  const candidates = getCharactersByGender(preferredGender);

  // Score each character using weighted distance
  const scored = candidates.map(character => {
    const distCompatibility = weightedDistance(userProfile, character.traits);
    const axisMatches = axisMatchCount(userProfile, character.traits);
    // Bonus for matching on multiple axes
    const axisBonus = (axisMatches / 5) * 15;
    const finalCompatibility = Math.min(99, distCompatibility + axisBonus);
    
    return { character, compatibility: Math.round(finalCompatibility) };
  });

  // Sort by compatibility descending
  scored.sort((a, b) => b.compatibility - a.compatibility);

  return {
    character: scored[0].character,
    compatibility: scored[0].compatibility,
    certainty: calculateCertainty(scored),
    runnerUp: scored[1]
      ? { character: scored[1].character, compatibility: scored[1].compatibility }
      : null,
    profile: userProfile,
  };
}

export function getPersonalityDescription(profile: { e: number; l: number; v: number; p: number; n: number }): string {
  const parts: string[] = [];

  if (profile.e < -1) parts.push("🎭 Introverted — you recharge alone");
  else if (profile.e > 1) parts.push("🌟 Extroverted — you thrive with others");
  else parts.push("⚖️ Balanced — you adapt to any situation");

  if (profile.l < -1) parts.push("💖 Heart-Driven — you follow your feelings");
  else if (profile.l > 1) parts.push("🧠 Logic-Driven — you think things through");
  else parts.push("🤝 Balanced Thinker — head and heart in harmony");

  if (profile.v < -1) parts.push("📚 Serious-minded — you take things seriously");
  else if (profile.v > 1) parts.push("🎉 Playful — you bring the fun energy");
  else parts.push("😌 Measured — you know when to be serious or playful");

  if (profile.p < -1) parts.push("🌊 Relaxed — you go with the flow");
  else if (profile.p > 1) parts.push("🔥 Driven — you chase your goals hard");
  else parts.push("⏸️ Steady — you move at your own pace");

  if (profile.n < -1) parts.push("🦅 Independent — you walk your own path");
  else if (profile.n > 1) parts.push("🤝 Loyal — your bonds are everything");
  else parts.push("🔄 Flexible — you adapt to people and situations");

  return parts.join("\n");
}
