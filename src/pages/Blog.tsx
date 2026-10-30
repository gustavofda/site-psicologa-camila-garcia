import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { PostSummary } from '../shared/types';

export default function Blog() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [q, setQ] = useState('');
  useEffect(() => { api<PostSummary[]>('/api/posts').then(setPosts).catch(() => setPosts([])); }, []);
  const shown = useMemo(() => (posts ?? []).filter((p) => p.title.toLowerCase().includes(q.trim().toLowerCase())), [posts, q]);
  return (
    <section className="section">
      <h1>Blog</h1>
      <input className="search" type="search" placeholder="Buscar artigos…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar artigos" />
      {posts === null && <p>Carregando…</p>}
      {posts && shown.length === 0 && <p>{posts.length ? 'Nenhum artigo encontrado.' : 'Nenhum artigo publicado ainda.'}</p>}
      <div className="grid">
        {shown.map((p) => (
          <Link key={p.id} to={`/blog/${p.id}`} className="card post-card">
            <h3>{p.title}</h3><small>{new Date(p.date).toLocaleDateString('pt-BR')}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
