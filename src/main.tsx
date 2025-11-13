import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/Map.css'; // o global.css si lo prefieres

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);