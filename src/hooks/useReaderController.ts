import { useEffect, useRef, useState } from 'react';
import { ReaderPlayer } from '../domain/player';
import type { Chunk, PlayerState } from '../domain/types';

export function useReaderController(chunks: Chunk[], wpm: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerState, setPlayerState] = useState<PlayerState>('idle');
  const chunksRef = useRef(chunks);
  const wpmRef = useRef(wpm);
  const playerRef = useRef<ReaderPlayer | null>(null);

  chunksRef.current = chunks;
  wpmRef.current = wpm;

  useEffect(() => {
    const player = new ReaderPlayer({
      getChunks: () => chunksRef.current,
      getWpm: () => wpmRef.current,
      onIndexChange: setCurrentIndex,
      onStateChange: setPlayerState
    });

    playerRef.current = player;

    return () => {
      player.destroy();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    if (chunks.length === 0) {
      player.reset();
      return;
    }

    if (currentIndex >= chunks.length) {
      player.seek(chunks.length - 1);
    }
  }, [chunks, currentIndex]);

  return {
    currentIndex,
    playerState,
    play: (index?: number) => playerRef.current?.play(index),
    pause: () => playerRef.current?.pause(),
    resume: () => playerRef.current?.resume(),
    stop: () => playerRef.current?.stop(),
    next: () => playerRef.current?.next(),
    previous: () => playerRef.current?.previous(),
    seek: (index: number) => playerRef.current?.seek(index)
  };
}
