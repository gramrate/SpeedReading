import type { PlayerState } from '../domain/types';

interface ControlsProps {
  disabled: boolean;
  playerState: PlayerState;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Controls({
  disabled,
  playerState,
  onPlay,
  onPause,
  onResume,
  onStop,
  onNext,
  onPrevious
}: ControlsProps) {
  const canPlay = !disabled && (playerState === 'idle' || playerState === 'stopped');
  const canResume = !disabled && playerState === 'paused';
  const canPause = !disabled && playerState === 'playing';

  return (
    <section className="panel controls-panel">
      <button className="button" type="button" onClick={onPrevious} disabled={disabled}>
        Previous
      </button>
      <button className="button button-primary" type="button" onClick={onPlay} disabled={!canPlay}>
        Play
      </button>
      <button className="button" type="button" onClick={onPause} disabled={!canPause}>
        Pause
      </button>
      <button className="button" type="button" onClick={onResume} disabled={!canResume}>
        Resume
      </button>
      <button className="button" type="button" onClick={onStop} disabled={disabled}>
        Stop
      </button>
      <button className="button" type="button" onClick={onNext} disabled={disabled}>
        Next
      </button>
    </section>
  );
}
