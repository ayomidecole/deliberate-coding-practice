import { createRoot } from 'react-dom/client';

import { App } from './app/app';
import './styles.css';

function renderApp() {
  const rootElement = document.getElementById('root');

  if (rootElement === null) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(<App />);
}

async function startApp() {
  if (import.meta.env.DEV && 'serviceWorker' in navigator) {
    const oldWorkerUrl = new URL('/mockServiceWorker.js', window.location.origin).href;
    const registrations = await navigator.serviceWorker.getRegistrations();
    const oldWorkers = registrations.filter((registration) =>
      [registration.active, registration.waiting, registration.installing].some(
        (worker) => worker?.scriptURL === oldWorkerUrl,
      ),
    );
    const removed = await Promise.all(oldWorkers.map((registration) => registration.unregister()));
    if (removed.some(Boolean)) {
      window.location.reload();
      return;
    }
  }

  renderApp();
}

void startApp();
