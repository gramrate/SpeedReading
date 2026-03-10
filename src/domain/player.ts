import type { Chunk, PlayerState } from './types';

export interface ReaderPlayerCallbacks {
  getChunks: () => Chunk[];
  getWpm: () => number;
  onIndexChange: (index: number) => void;
  onStateChange: (state: PlayerState) => void;
}

const SPEED_CALIBRATION = 0.62;
const MIN_CHUNK_DURATION = 45;
const MAX_PAUSE_MULTIPLIER = 1.55;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateChunkDuration(chunk: Chunk, wpm: number): number {
  const safeWpm = Math.max(wpm, 60);
  const wordsCount = Math.max(chunk.words.length, 1);
  const pauseMultiplier = Math.min(chunk.pauseMultiplier, MAX_PAUSE_MULTIPLIER);
  const baseDuration = (wordsCount / safeWpm) * 60_000 * SPEED_CALIBRATION;
  return Math.max(baseDuration * pauseMultiplier, MIN_CHUNK_DURATION);
}

export class ReaderPlayer {
  private state: PlayerState = 'idle';
  private index = 0;
  private timerId: number | null = null;
  private pendingStop = false;

  constructor(private readonly callbacks: ReaderPlayerCallbacks) {}

  getState(): PlayerState {
    return this.state;
  }

  getIndex(): number {
    return this.index;
  }

  play(startIndex = 0): void {
    const chunks = this.callbacks.getChunks();
    if (chunks.length === 0) {
      return;
    }

    this.pendingStop = false;
    this.clearTimer();
    this.index = clamp(startIndex, 0, chunks.length - 1);
    this.emitIndex();
    this.setState('playing');
    this.scheduleCurrentChunk();
  }

  pause(): void {
    if (this.state !== 'playing') {
      return;
    }

    this.pendingStop = false;
    this.clearTimer();
    this.setState('paused');
  }

  resume(): void {
    if (this.state !== 'paused') {
      return;
    }

    this.pendingStop = false;
    this.setState('playing');
    this.scheduleCurrentChunk();
  }

  stop(): void {
    if (this.state === 'playing') {
      this.pendingStop = true;
      return;
    }

    this.clearTimer();
    this.pendingStop = false;
    this.index = 0;
    this.emitIndex();
    this.setState('stopped');
  }

  next(): void {
    this.step(1);
  }

  nextBy(step: number): void {
    this.step(Math.max(step, 1));
  }

  previous(): void {
    this.step(-1);
  }

  previousBy(step: number): void {
    this.step(-Math.max(step, 1));
  }

  refresh(): void {
    if (this.state !== 'playing') {
      return;
    }

    this.clearTimer();
    this.scheduleCurrentChunk();
  }

  private step(delta: number): void {
    const chunks = this.callbacks.getChunks();
    if (chunks.length === 0) {
      return;
    }

    this.pendingStop = false;
    this.clearTimer();
    this.index = clamp(this.index + delta, 0, chunks.length - 1);
    this.emitIndex();

    if (this.state === 'playing') {
      this.scheduleCurrentChunk();
    }
  }

  seek(index: number): void {
    const chunks = this.callbacks.getChunks();
    if (chunks.length === 0) {
      return;
    }

    this.pendingStop = false;
    this.clearTimer();
    this.index = clamp(index, 0, chunks.length - 1);
    this.emitIndex();

    if (this.state === 'playing') {
      this.scheduleCurrentChunk();
    }
  }

  reset(): void {
    this.clearTimer();
    this.pendingStop = false;
    this.index = 0;
    this.emitIndex();
    this.setState('idle');
  }

  destroy(): void {
    this.clearTimer();
  }

  private scheduleCurrentChunk(): void {
    const chunks = this.callbacks.getChunks();
    const currentChunk = chunks[this.index];

    if (!currentChunk) {
      this.setState('stopped');
      return;
    }

    const duration = calculateChunkDuration(currentChunk, this.callbacks.getWpm());
    this.timerId = window.setTimeout(() => {
      const currentChunks = this.callbacks.getChunks();
      const nextIndex = this.index + 1;

      if (this.pendingStop) {
        this.pendingStop = false;
        this.clearTimer();
        this.index = 0;
        this.emitIndex();
        this.setState('stopped');
        return;
      }

      if (nextIndex >= currentChunks.length) {
        this.clearTimer();
        this.setState('stopped');
        return;
      }

      this.index = nextIndex;
      this.emitIndex();
      this.scheduleCurrentChunk();
    }, duration);
  }

  private emitIndex(): void {
    this.callbacks.onIndexChange(this.index);
  }

  private setState(state: PlayerState): void {
    this.state = state;
    this.callbacks.onStateChange(state);
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
