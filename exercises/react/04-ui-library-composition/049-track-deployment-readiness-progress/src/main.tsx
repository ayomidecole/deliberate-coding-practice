import { createRoot } from 'react-dom/client';

import { App } from './app/app';
import './styles.css';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(<App />);
