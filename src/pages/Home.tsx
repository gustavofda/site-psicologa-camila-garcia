import { useEffect } from 'react';
import { useSite } from '../lib/SiteContent';
import Booking from '../components/Booking';
import Reveal from '../components/Reveal';
import { BrandButton, Sunflower, kindFromLabel } from '../components/Icons';

export default function Home() {
  const c = useSite();
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">{c.title}</p>
            <h1>{c.name}</h1>
            <p className="lead">{c.tagline}</p>
            <div className="links">
              <a className="btn" href="#agendar">Agendar consulta</a>
              <BrandButton kind="wa" href={`https://wa.me/${c.whatsapp}`} label="WhatsApp" />
            </div>
          </div>
          {c.photoUrl ? <img className="photo" src={c.photoUrl} alt={`Foto de ${c.name}`} /> : <Sunflower />}
        </div>
      </section>

      <section id="historia" className="section"><Reveal>
        <h2>Minha história</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{c.story}</p>
      </Reveal></section>

      <section id="experiencia" className="section alt"><Reveal>
        <h2>Experiência de estágio</h2>
        <ul className="timeline">
          {c.experiences.map((e, i) => <li key={i}><strong>{e.area}</strong><span>{e.where}</span></li>)}
        </ul>
      </Reveal></section>

      <section id="habilidades" className="section"><Reveal>
        <h2>Habilidades</h2>
        <div className="grid">
          {c.skills.map((s, i) => <article key={i} className="card"><h3>{s.title}</h3><p>{s.description}</p></article>)}
        </div>
      </Reveal></section>

      <section id="projetos" className="section alt"><Reveal>
        <h2>Projetos e escrita</h2>
        <div className="grid">
          {c.projects.map((p, i) => <article key={i} className="card"><h3>{p.title}</h3><p>{p.description}</p></article>)}
        </div>
      </Reveal></section>

      <section id="agendar" className="section"><Reveal>
        <h2>Agendar consulta</h2>
        <Booking />
      </Reveal></section>

      <section id="contato" className="section alt"><Reveal>
        <h2>Contato e redes</h2>
        <div className="links">
          <BrandButton kind="wa" href={`https://wa.me/${c.whatsapp}`} label="WhatsApp" />
          <BrandButton kind="mail" href={`mailto:${c.email}`} label={c.email} external={false} />
          {c.socials.map((s, i) => <BrandButton key={i} kind={kindFromLabel(s.label)} href={s.url} label={s.label} />)}
        </div>
      </Reveal></section>
    </>
  );
}
