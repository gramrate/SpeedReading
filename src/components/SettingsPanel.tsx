import type { ReaderSettings } from '../domain/types';

interface SettingsPanelProps {
  settings: ReaderSettings;
  totalTokens: number;
  totalChunks: number;
  normalizedLength: number;
  onWpmChange: (wpm: number) => void;
}

export function SettingsPanel({
  settings,
  totalTokens,
  totalChunks,
  normalizedLength,
  onWpmChange
}: SettingsPanelProps) {
  return (
    <section className="panel settings-panel">
      <div className="settings-grid">
        <label className="setting-card">
          <span className="setting-label">Скорость</span>
          <span className="setting-value">{settings.wpm} WPM</span>
          <input
            type="range"
            min={120}
            max={900}
            step={10}
            value={settings.wpm}
            onChange={(event) => onWpmChange(Number(event.target.value))}
          />
        </label>

        <div className="setting-card">
          <span className="setting-label">Токены</span>
          <span className="setting-value">{totalTokens}</span>
        </div>

        <div className="setting-card">
          <span className="setting-label">Chunk-ов</span>
          <span className="setting-value">{totalChunks}</span>
        </div>

        <div className="setting-card">
          <span className="setting-label">Символов</span>
          <span className="setting-value">{normalizedLength}</span>
        </div>
      </div>
    </section>
  );
}
