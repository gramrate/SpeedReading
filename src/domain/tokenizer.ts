import type { Token } from './types';

const TOKEN_REGEX =
  /([A-Za-zА-Яа-яЁё0-9]+(?:[-'][A-Za-zА-Яа-яЁё0-9]+)*)|([.,!?;:()[\]{}"«»…—-])/gu;

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];

  for (const match of text.matchAll(TOKEN_REGEX)) {
    const [value, word] = match;

    tokens.push({
      type: word ? 'word' : 'punctuation',
      value
    });
  }

  return tokens;
}
