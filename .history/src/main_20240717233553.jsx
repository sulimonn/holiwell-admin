import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
// eslint-disable-next-line import/no-unresolved
import { AuthProvider } from './contexts/AuthContext';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <Suspense>
          <App />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>
);