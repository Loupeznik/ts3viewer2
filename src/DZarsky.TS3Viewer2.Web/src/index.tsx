import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'flowbite';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN as string,
  integrations: [new BrowserTracing()],
  release: import.meta.env.VITE_VERSION as string,
  enabled: false,

  tracesSampleRate: 1.0,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT as string,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </React.StrictMode>
);
