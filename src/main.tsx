import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './styles.css';

registerSW({
  immediate: true,
  onRegisteredSW(swUrl: string, registration?: globalThis.ServiceWorkerRegistration) {
    if (!registration) {
      return;
    }

    window.setInterval(() => {
      registration.update().catch(() => undefined);
    }, 60 * 60 * 1000);

    console.info(`Service worker registered: ${swUrl}`);
  },
  onOfflineReady() {
    console.info('Speed Reading is ready for offline use.');
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
