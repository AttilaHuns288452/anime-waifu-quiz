"use client";

// Play the real "Baka!" sound from MyInstants
export function playBakaSound() {
  try {
    const audio = new Audio("https://www.myinstants.com/media/sounds/baka-m.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {
      // Fallback to synthesized if can't load MP3
      playBakaSynth();
    });
  } catch {
    playBakaSynth();
  }
}

// Keep synthesized as fallback
function playBakaSynth() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;

    const playTone = (startTime: number, freq: number, endFreq: number, duration: number, type: OscillatorType = 'sawtooth', volume: number = 0.3) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    playTone(now, 180, 220, 0.12, 'sawtooth', 0.35);
    playTone(now + 0.08, 140, 160, 0.1, 'triangle', 0.25);
    playTone(now + 0.22, 350, 380, 0.08, 'square', 0.3);
    playTone(now + 0.26, 330, 400, 0.12, 'sawtooth', 0.35);

    const bufferSize = audioContext.sampleRate * 0.08;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();
    noise.buffer = buffer;
    noiseGain.gain.setValueAtTime(0.15, now + 0.22);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    noise.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    noise.start(now + 0.22);
    noise.stop(now + 0.3);
  } catch (e) {}
}

// Detect tsundere characters by name or series
export function isTsundere({
  archetype,
  name,
  series,
}: {
  archetype?: string;
  name?: string;
  series?: string;
}): boolean {
  if (archetype) {
    const tsundereArchetypes = ['tsundere_soul', 'tsundere', 'fearless_fighter', 'ice_fire_prince'];
    if (tsundereArchetypes.includes(archetype)) return true;
  }

  if (series) {
    const tsundereSeries = ['Nisekoi', 'Kaguya-sama', 'Toradora', 'Shakugan no Shana', 'Maid-Sama!', 'Toradora!'];
    if (tsundereSeries.includes(series)) return true;
  }

  if (name) {
    const knownTsunderes = [
      'Taiga Aisaka', 'Chitoge Kirisaki', 'Misaki Ayuzawa', 'Kyouko Hori',
      'Shizuku Mizutani', 'Louise Françoise Le Blanc de La Vallière',
      'Asuka Langley Soryu', 'Yuno Gasai', 'Rin Tohsaka', 'Kagome',
      'Maki Nishikino', 'Nobara Kugisaki', 'Erza Scarlet',
    ];
    if (knownTsunderes.includes(name)) return true;
  }

  return false;
}
