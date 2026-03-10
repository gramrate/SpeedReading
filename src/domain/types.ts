export type TokenType = 'word' | 'punctuation';

export interface Token {
  type: TokenType;
  value: string;
}

export interface Chunk {
  id: number;
  text: string;
  words: string[];
  pauseMultiplier: number;
}

export type PlayerState = 'idle' | 'playing' | 'paused' | 'stopped';

export interface ReaderSettings {
  wpm: number;
}

export interface ProcessedBook {
  rawText: string;
  normalizedText: string;
  tokens: Token[];
  chunks: Chunk[];
}
