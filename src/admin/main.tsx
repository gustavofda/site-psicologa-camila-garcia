import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AdminApp from './AdminApp';
import '../styles.css';

const el = document.getElementById('root');
if (!el) throw new Error('Elemento #root não encontrado');
createRoot(el).render(<StrictMode><AdminApp /></StrictMode>);
