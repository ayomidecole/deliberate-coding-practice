import { createRoot } from 'react-dom/client';

import { App } from './app/app';
import './styles.css';

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import('./testing/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

function renderApp() {
  const rootElement = document.getElementById('root');

  if (rootElement === null) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(<App />);
}

void enableMocking().then(renderApp);
