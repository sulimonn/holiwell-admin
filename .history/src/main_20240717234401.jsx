import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';

import App from './app';
// eslint-disable-next-line import/no-unresolved
import { AuthProvider } from './contexts/AuthContext';
import { store } from 'store';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <ReduxProvider store={store}>
        <AuthProvider>
          <Suspense>
            <App />
          </Suspense>
        </AuthProvider>
      </ReduxProvider>
    </BrowserRouter>
  </HelmetProvider>
);
