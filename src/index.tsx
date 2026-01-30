import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import './i18n';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { THEME_STORAGE_KEY } from './themes/storage';

const preloadTheme = () => {
  try {
    const theme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (theme) {
      document.documentElement.dataset.theme = theme;
    }
  } catch (error) {
    console.warn('[theme] failed to preload theme', error);
  }
};

preloadTheme();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
