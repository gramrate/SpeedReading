import { useRef } from 'react';
import type { ChangeEvent } from 'react';

interface FileLoaderProps {
  fileName: string | null;
  onFileSelected: (file: File) => void;
}

export function FileLoader({ fileName, onFileSelected }: FileLoaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    onFileSelected(file);
    event.target.value = '';
  };

  return (
    <section className="panel panel-upload">
      <div>
        <p className="eyebrow">TXT import</p>
        <h1>Speed Reading</h1>
        <p className="muted">
          Загрузите локальный `.txt` и читайте книгу chunk-ами в одном темпе.
        </p>
      </div>

      <div className="upload-actions">
        <button
          className="button button-primary"
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          Выбрать TXT
        </button>
        <span className="file-name">{fileName ?? 'Файл пока не загружен'}</span>
      </div>

      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept=".txt,text/plain"
        onChange={handleChange}
      />
    </section>
  );
}
