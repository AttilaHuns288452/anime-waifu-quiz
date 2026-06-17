// Personality quiz questions
// Each answer shifts the 5 axes (E, L, V, P, N) by a modifier

export interface Answer {
  text: string;
  modifier: { e: number; l: number; v: number; p: number; n: number };
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "How do you recharge after a long day?",
    answers: [
      { text: "Alone time with a good anime/game 🎮", modifier: { e: -2, l: 0, v: 0, p: 0, n: 0 } },
      { text: "Hanging out with close friends 👥", modifier: { e: 2, l: 0, v: 1, p: 0, n: 1 } },
      { text: "Doing something productive 🛠️", modifier: { e: 0, l: 1, v: 0, p: 2, n: 0 } },
      { text: "Eating good food and relaxing 🍜", modifier: { e: 0, l: -1, v: 1, p: -1, n: 0 } },
    ],
  },
  {
    id: 2,
    question: "What matters more when making a decision?",
    answers: [
      { text: "Logic and facts 📊", modifier: { e: 0, l: 2, v: 0, p: 0, n: 0 } },
      { text: "How I feel about it 💖", modifier: { e: 0, l: -2, v: 1, p: 0, n: 1 } },
      { text: "What's best for everyone involved 🌍", modifier: { e: 1, l: 0, v: 0, p: 0, n: 2 } },
      { text: "My gut instinct 🧠", modifier: { e: 0, l: 0, v: 1, p: 1, n: 0 } },
    ],
  },
  {
    id: 3,
    question: "Choose your ideal weekend:",
    answers: [
      { text: "Big adventure or event 🎉", modifier: { e: 2, l: 0, v: 2, p: 1, n: 0 } },
      { text: "Cozy at home with a blanket and anime 🛋️", modifier: { e: -2, l: 0, v: 0, p: -1, n: 0 } },
      { text: "Working on personal projects 💻", modifier: { e: -1, l: 1, v: 0, p: 1, n: 0 } },
      { text: "Outdoors in nature 🌿", modifier: { e: 1, l: -1, v: 0, p: 0, n: 0 } },
    ],
  },
  {
    id: 4,
    question: "What describes your vibe the best?",
    answers: [
      { text: "Chaotic gremlin energy 🔥", modifier: { e: 2, l: 0, v: 3, p: 2, n: -1 } },
      { text: "Cool and collected 😎", modifier: { e: -1, l: 2, v: -2, p: 0, n: 0 } },
      { text: "Soft and gentle 🌸", modifier: { e: -1, l: -2, v: -1, p: -1, n: 1 } },
      { text: "Energetic and bubbly ✨", modifier: { e: 3, l: 0, v: 2, p: 1, n: 0 } },
    ],
  },
  {
    id: 5,
    question: "How do you handle conflict?",
    answers: [
      { text: "Confront it head-on 💪", modifier: { e: 1, l: 0, v: 0, p: 3, n: 0 } },
      { text: "Avoid it as much as possible 🙈", modifier: { e: -1, l: 0, v: 0, p: -2, n: 0 } },
      { text: "Try to resolve it calmly 🕊️", modifier: { e: -1, l: 1, v: -1, p: 0, n: 2 } },
      { text: "Use humor to defuse it 😂", modifier: { e: 2, l: 0, v: 2, p: 0, n: 0 } },
    ],
  },
  {
    id: 6,
    question: "Your friends would describe you as:",
    answers: [
      { text: "The responsible one 👑", modifier: { e: 0, l: 1, v: -1, p: 2, n: 2 } },
      { text: "The funny one 🤡", modifier: { e: 2, l: 0, v: 3, p: 1, n: 0 } },
      { text: "The quiet one 🤫", modifier: { e: -3, l: 0, v: -1, p: 0, n: 0 } },
      { text: "The supportive one 🫂", modifier: { e: 0, l: -2, v: 0, p: 0, n: 2 } },
    ],
  },
  {
    id: 7,
    question: "What kind of partner do you prefer?",
    answers: [
      { text: "Strong and protective 🛡️", modifier: { e: 0, l: 1, v: -1, p: 2, n: 1 } },
      { text: "Kind and gentle soul 🕊️", modifier: { e: 0, l: -2, v: 0, p: -1, n: 2 } },
      { text: "Funny and keeps me laughing 😂", modifier: { e: 2, l: 0, v: 2, p: 1, n: 0 } },
      { text: "Mysterious and intriguing 🕵️", modifier: { e: -1, l: 1, v: 0, p: 1, n: -1 } },
    ],
  },
  {
    id: 8,
    question: "What's your approach to life?",
    answers: [
      { text: "Go with the flow 🌊", modifier: { e: 0, l: -1, v: 1, p: -2, n: 0 } },
      { text: "Plan everything meticulously 📋", modifier: { e: -1, l: 2, v: -1, p: 2, n: 1 } },
      { text: "Seize every opportunity 🚀", modifier: { e: 2, l: 0, v: 2, p: 2, n: 0 } },
      { text: "Live simply and enjoy the moment 🌅", modifier: { e: -1, l: -1, v: 0, p: -1, n: 0 } },
    ],
  },
  {
    id: 9,
    question: "What's your ideal relationship dynamic?",
    answers: [
      { text: "Partners in crime — equals 👫", modifier: { e: 0, l: 0, v: 1, p: 0, n: 1 } },
      { text: "I prefer to take care of them 🏡", modifier: { e: 0, l: -1, v: 0, p: 1, n: 2 } },
      { text: "I want someone to take care of me 🥺", modifier: { e: -1, l: -2, v: 0, p: -1, n: 2 } },
      { text: "Independent but connected 🌟", modifier: { e: 0, l: 1, v: 0, p: 0, n: -1 } },
    ],
  },
  {
    id: 10,
    question: "What's your favorite anime genre?",
    answers: [
      { text: "Action/Adventure — intense fights! ⚔️", modifier: { e: 0, l: 0, v: 0, p: 3, n: 0 } },
      { text: "Romance/Slice of Life 💕", modifier: { e: 0, l: -2, v: 1, p: -1, n: 1 } },
      { text: "Psychological/Thriller 🧠", modifier: { e: 0, l: 2, v: -1, p: 1, n: 0 } },
      { text: "Comedy — just make me laugh 😂", modifier: { e: 1, l: 0, v: 3, p: 0, n: 0 } },
    ],
  },
  {
    id: 11,
    question: "How do you react to a plot twist?",
    answers: [
      { text: "Called it! I saw it coming 🕵️", modifier: { e: 0, l: 2, v: 0, p: 0, n: 0 } },
      { text: "WHAT?! No way! Full shock 😱", modifier: { e: 2, l: -1, v: 2, p: 0, n: 0 } },
      { text: "Quietly impressed — nice writing 🤔", modifier: { e: -1, l: 1, v: 0, p: 0, n: 0 } },
      { text: "Crying if it's sad 😭", modifier: { e: 0, l: -3, v: 0, p: 0, n: 1 } },
    ],
  },
  {
    id: 12,
    question: "What's your power fantasy?",
    answers: [
      { text: "Overwhelming strength — one punch 🦾", modifier: { e: 0, l: 1, v: 1, p: 3, n: 0 } },
      { text: "Incredible intelligence — outsmart everyone 🧠", modifier: { e: 0, l: 3, v: 0, p: 1, n: 0 } },
      { text: "Protecting the ones I love 🛡️", modifier: { e: 0, l: -1, v: 0, p: 1, n: 3 } },
      { text: "Freedom to do whatever I want 🕊️", modifier: { e: 1, l: 0, v: 2, p: 0, n: -2 } },
    ],
  },
  {
    id: 13,
    question: "Pick a motto to live by:",
    answers: [
      { text: "I'll keep moving forward 🌊", modifier: { e: 0, l: 0, v: 0, p: 2, n: 1 } },
      { text: "Do what makes you happy 🌈", modifier: { e: 1, l: -2, v: 2, p: 0, n: 0 } },
      { text: "Think before you act 🤔", modifier: { e: -1, l: 2, v: -1, p: 0, n: 0 } },
      { text: "Protect what matters 🛡️", modifier: { e: 0, l: 0, v: 0, p: 1, n: 3 } },
    ],
  },
  {
    id: 14,
    question: "What's your ideal vacation?",
    answers: [
      { text: "Exploring a new country 🌍", modifier: { e: 2, l: 0, v: 2, p: 1, n: 0 } },
      { text: "Anime convention! 🎌", modifier: { e: 2, l: 0, v: 3, p: 1, n: 0 } },
      { text: "Remote cabin in the woods 🌲", modifier: { e: -3, l: 0, v: 0, p: -1, n: 0 } },
      { text: "Staycation — sleep and game all day 🎮", modifier: { e: -2, l: 0, v: 1, p: -2, n: 0 } },
    ],
  },
  {
    id: 15,
    question: "Which trait do you value most in others?",
    answers: [
      { text: "Loyalty — never betray a friend 🤝", modifier: { e: 0, l: 0, v: 0, p: 0, n: 3 } },
      { text: "Honesty — say it like it is 🗣️", modifier: { e: 0, l: 1, v: 0, p: 1, n: 0 } },
      { text: "Kindness — treat everyone with warmth 💛", modifier: { e: 0, l: -2, v: 0, p: 0, n: 1 } },
      { text: "Ambition — strive to be great 💪", modifier: { e: 1, l: 1, v: 0, p: 2, n: 0 } },
    ],
  },
];
