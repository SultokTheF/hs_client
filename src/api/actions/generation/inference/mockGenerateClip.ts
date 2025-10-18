// Мок генерации клипа: имитирует инференс и отдаёт демо-URL + длительность.
const SAMPLE_CLIPS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
];

export type GenerateResult = { clipUrl: string; durationSec: number };

export const mockGenerateClip = async (prompt: string): Promise<GenerateResult> => {
  console.log("Mock generating clip for prompt:", prompt);
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const ms = 1200 + Math.random() * 1400;
  await delay(ms);

  if (Math.random() < 0.06) {
    throw new Error("Model overload. Try again.");
  }

  const clipUrl = SAMPLE_CLIPS[Math.floor(Math.random() * SAMPLE_CLIPS.length)];
  const durationSec = 4 + Math.floor(Math.random() * 5);
  return { clipUrl, durationSec };
};
