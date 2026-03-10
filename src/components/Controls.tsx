import type { PlayerState } from '../domain/types';

interface ControlsProps {
  disabled: boolean;
  playerState: PlayerState;
  onTogglePlayPause: () => void;
  onNext: (step?: number) => void;
  onPrevious: (step?: number) => void;
}

export function Controls({
  disabled,
  playerState,
  onTogglePlayPause,
  onNext,
  onPrevious
}: ControlsProps) {
  const isPlaying = playerState === 'playing';
  const playPauseLabel = isPlaying ? 'Pause' : 'Play';

  return (
    <section className="panel controls-panel">
      <button className="button" type="button" onClick={() => onPrevious(10)} disabled={disabled}>
        Prev -10
      </button>
      <button className="button" type="button" onClick={() => onPrevious(1)} disabled={disabled}>
        Prev -1
      </button>
      <button
        className="button button-primary"
        type="button"
        onClick={onTogglePlayPause}
        disabled={disabled}
      >
        {playPauseLabel}
      </button>
      <button className="button" type="button" onClick={() => onNext(1)} disabled={disabled}>
        Next +1
      </button>
      <button className="button" type="button" onClick={() => onNext(10)} disabled={disabled}>
        Next +10
      </button>
    </section>
  );
}
