import type { Chunk, Token } from './types';

const SERVICE_WORDS = new Set([
  'а',
  'без',
  'бы',
  'в',
  'во',
  'для',
  'до',
  'же',
  'за',
  'и',
  'из',
  'или',
  'к',
  'ко',
  'ли',
  'на',
  'над',
  'не',
  'ни',
  'но',
  'о',
  'об',
  'от',
  'по',
  'под',
  'при',
  'про',
  'с',
  'со',
  'у',
  'уж'
]);

const LONG_WORD_LENGTH = 8;

const PUNCTUATION_PAUSE: Record<string, number> = {
  ',': 1.35,
  ';': 1.45,
  ':': 1.45,
  '.': 1.7,
  '!': 1.9,
  '?': 1.9,
  '…': 2.1,
  '—': 1.25,
  '-': 1.15,
  '(': 1.1,
  ')': 1.1,
  '"': 1.1,
  '«': 1.1,
  '»': 1.1
};

function isWord(token: Token | undefined): token is Token {
  return Boolean(token && token.type === 'word');
}

function isLongWord(word: string): boolean {
  return word.length >= LONG_WORD_LENGTH;
}

function shouldBindToNext(word: string): boolean {
  const normalized = word.toLowerCase();
  return SERVICE_WORDS.has(normalized) || normalized.length <= 2;
}

function computePauseMultiplier(punctuation: string): number {
  return punctuation.split('').reduce((multiplier, symbol) => {
    return multiplier * (PUNCTUATION_PAUSE[symbol] ?? 1.08);
  }, 1);
}

function flushChunk(
  chunks: Chunk[],
  words: string[],
  trailingPunctuation: string,
  pauseMultiplier: number
): void {
  if (words.length === 0) {
    return;
  }

  const text = `${words.join(' ')}${trailingPunctuation}`;

  chunks.push({
    id: chunks.length,
    text,
    words: [...words],
    pauseMultiplier
  });
}

export function createChunks(tokens: Token[]): Chunk[] {
  const chunks: Chunk[] = [];
  let words: string[] = [];
  let trailingPunctuation = '';
  let pauseMultiplier = 1;
  let closedByPunctuation = false;

  const flushCurrent = (): void => {
    flushChunk(chunks, words, trailingPunctuation, pauseMultiplier);
    words = [];
    trailingPunctuation = '';
    pauseMultiplier = 1;
    closedByPunctuation = false;
  };

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (token.type === 'punctuation') {
      if (words.length > 0) {
        trailingPunctuation += token.value;
        pauseMultiplier *= computePauseMultiplier(token.value);
        closedByPunctuation = true;
      }
      continue;
    }

    if (closedByPunctuation) {
      flushCurrent();
    }

    const word = token.value;

    if (words.length === 0) {
      words.push(word);

      if (isLongWord(word)) {
        const nextToken = tokens[index + 1];
        if (!nextToken || nextToken.type === 'word') {
          flushCurrent();
        }
      }

      continue;
    }

    const firstWord = words[0];
    const currentHasLongWord = words.some(isLongWord);
    const nextToken = tokens[index + 1];
    const joinByPrefixRule =
      words.length === 1 &&
      !currentHasLongWord &&
      shouldBindToNext(firstWord) &&
      !isLongWord(word);

    const joinByShortCurrent =
      words.length === 1 &&
      !currentHasLongWord &&
      firstWord.length <= 2 &&
      !isLongWord(word);

    if (isLongWord(word)) {
      flushCurrent();
      words.push(word);

      if (!nextToken || isWord(nextToken)) {
        flushCurrent();
      }
      continue;
    }

    if (joinByPrefixRule || joinByShortCurrent) {
      words.push(word);

      if (!isWord(nextToken)) {
        flushCurrent();
      }
      continue;
    }

    flushCurrent();
    words.push(word);

    if (isLongWord(word) && (!nextToken || isWord(nextToken))) {
      flushCurrent();
    }
  }

  flushCurrent();

  return chunks;
}
