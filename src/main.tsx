import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SiteProvider } from './lib/SiteContent';
import './styles.css';

const el = document.getElementById('root');
if (!el) throw new Error('Elemento #root não encontrado');
createRoot(el).render(
  <StrictMode><BrowserRouter><SiteProvider><App /></SiteProvider></BrowserRouter></StrictMode>
);
