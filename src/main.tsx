import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialize Firebase (only in production mode)
if (import.meta.env.VITE_DEMO_MODE !== 'true') {
  import('./services/firebase').then(({ initFirebase }) => initFirebase());
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
