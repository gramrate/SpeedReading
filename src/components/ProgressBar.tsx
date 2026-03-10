interface ProgressBarProps {
  currentIndex: number;
  total: number;
  onSeek: (index: number) => void;
}

export function ProgressBar({ currentIndex, total, onSeek }: ProgressBarProps) {
  const max = Math.max(total - 1, 0);
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  return (
    <section className="panel">
      <div className="progress-header">
        <span>Прогресс</span>
        <span>
          {total === 0 ? '0 / 0' : `${currentIndex + 1} / ${total}`}
        </span>
      </div>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <input
        className="progress-range"
        type="range"
        min={0}
        max={max}
        value={Math.min(currentIndex, max)}
        disabled={total === 0}
        onChange={(event) => onSeek(Number(event.target.value))}
      />
    </section>
  );
}
