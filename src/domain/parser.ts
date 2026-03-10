import type { ProcessedBook } from './types';
import { tokenize } from './tokenizer';
import { createChunks } from './chunker';

export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\u00A0/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/[“”„]/g, '"')
    .replace(/[’‘]/g, "'")
    .replace(/[–]/g, '—')
    .replace(/\s*\n+\s*/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .trim();
}

export function parseBookText(rawText: string): ProcessedBook {
  const normalizedText = normalizeText(rawText);
  const tokens = tokenize(normalizedText);
  const chunks = createChunks(tokens);

  return {
    rawText,
    normalizedText,
    tokens,
    chunks
  };
}

export async function parseTxtFile(file: File): Promise<ProcessedBook> {
  const rawText = await file.text();
  return parseBookText(rawText);
}
