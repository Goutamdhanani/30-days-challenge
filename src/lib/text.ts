export function clampWords(input: string, maxWords: number): { text: string; words: number; clipped: boolean } {
    const words = input.trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return { text: input.trim(), words: words.length, clipped: false };
    const clippedText = words.slice(0, maxWords).join(" ");
    return { text: clippedText, words: maxWords, clipped: true };
  }