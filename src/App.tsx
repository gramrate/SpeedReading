import { useState } from 'react';
import { FileLoader } from './components/FileLoader';
import { Controls } from './components/Controls';
import { ProgressBar } from './components/ProgressBar';
import { ReaderScreen } from './components/ReaderScreen';
import { SettingsPanel } from './components/SettingsPanel';
import { parseTxtFile } from './domain/parser';
import type { ProcessedBook, ReaderSettings } from './domain/types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useReaderController } from './hooks/useReaderController';

const DEFAULT_SETTINGS: ReaderSettings = {
  wpm: 320
};

function App() {
  const [settings, setSettings] = useLocalStorage<ReaderSettings>(
    'speed-reading-settings',
    DEFAULT_SETTINGS
  );
  const [book, setBook] = useState<ProcessedBook | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const chunks = book?.chunks ?? [];
  const {
    currentIndex,
    playerState,
    play,
    pause,
    resume,
    next,
    previous,
    seek
  } = useReaderController(chunks, settings.wpm);

  const currentChunk = chunks[currentIndex] ?? null;

  const stats = {
    totalTokens: book?.tokens.length ?? 0,
    totalChunks: chunks.length,
    normalizedLength: book?.normalizedText.length ?? 0
  };

  const handleFileSelected = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const parsedBook = await parseTxtFile(file);
      setBook(parsedBook);
      setFileName(file.name);
      seek(0);
    } catch (unknownError) {
      const message =
        unknownError instanceof Error ? unknownError.message : 'Не удалось обработать файл.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    play(currentIndex);
  };

  const handleTogglePlayPause = () => {
    if (playerState === 'playing') {
      pause();
      return;
    }

    if (playerState === 'paused') {
      resume();
      return;
    }

    handleStart();
  };

  return (
    <div className="app-shell">
      <div className="background-glow" aria-hidden="true" />

      <main className="app-layout">
        <ReaderScreen chunk={currentChunk} playerState={playerState} />

        <ProgressBar currentIndex={currentIndex} total={chunks.length} onSeek={seek} />

        <Controls
          disabled={chunks.length === 0}
          playerState={playerState}
          onTogglePlayPause={handleTogglePlayPause}
          onNext={next}
          onPrevious={previous}
        />

        <SettingsPanel
          settings={settings}
          totalTokens={stats.totalTokens}
          totalChunks={stats.totalChunks}
          normalizedLength={stats.normalizedLength}
          onWpmChange={(wpm) => setSettings({ ...settings, wpm })}
        />

        {(loading || error) && (
          <section className="panel info-panel">
            {loading && <p className="muted">Файл загружается и разбирается…</p>}
            {error && <p className="error-text">{error}</p>}
          </section>
        )}

        <FileLoader fileName={fileName} onFileSelected={handleFileSelected} />
      </main>
    </div>
  );
}

export default App;
