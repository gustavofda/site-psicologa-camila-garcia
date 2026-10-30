import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useSite } from './lib/SiteContent';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Post from './pages/Post';
import { WhatsAppIcon } from './components/Icons';

export default function App() {
  const c = useSite();
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { if (!window.location.hash) window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => {
    const on = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <>
      <header className="header">
        <Link to="/" className="brand">{c.name}</Link>
        <button className="burger" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
        <nav className={open ? 'nav open' : 'nav'} onClick={() => setOpen(false)}>
          <a href="/#historia">Sobre</a>
          <a href="/#habilidades">Habilidades</a>
          <a href="/#agendar">Agendar</a>
          <a href="/#contato">Contato</a>
          <NavLink to="/blog">Blog</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Post />} />
          <Route path="*" element={<section className="section"><p>Página não encontrada.</p><Link to="/">Início</Link></section>} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} {c.name} — Psicóloga</footer>
      <a className="fab" href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Conversar no WhatsApp"><WhatsAppIcon size={28} /></a>
      {showTop && <button className="btn ghost" style={{ position: 'fixed', left: '1rem', bottom: '1rem', zIndex: 20 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ Topo</button>}
    </>
  );
}
