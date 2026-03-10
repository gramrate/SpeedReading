import type { Chunk, PlayerState } from '../domain/types';

interface ReaderScreenProps {
  chunk: Chunk | null;
  playerState: PlayerState;
}

export function ReaderScreen({ chunk, playerState }: ReaderScreenProps) {
  return (
    <section className="panel reader-screen">
      <div className="reader-guides" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="reader-meta">
        <span className={`status-pill status-${playerState}`}>{playerState}</span>
      </div>
      <div className="chunk-frame">
        <p className="chunk-text">{chunk?.text ?? 'Загрузите TXT, чтобы начать чтение.'}</p>
      </div>
    </section>
  );
}
