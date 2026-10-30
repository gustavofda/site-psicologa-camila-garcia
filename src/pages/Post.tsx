import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { PublicPost } from '../shared/types';

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PublicPost | null | 'loading'>('loading');
  useEffect(() => {
    if (!id) return setPost(null);
    api<PublicPost>(`/api/posts/${encodeURIComponent(id)}`).then(setPost).catch(() => setPost(null));
  }, [id]);
  if (post === 'loading') return <section className="section"><p>Carregando…</p></section>;
  if (!post) return <section className="section"><p>Artigo não encontrado.</p><Link to="/blog">Voltar</Link></section>;
  return (
    <article className="section">
      <Link to="/blog">← Blog</Link>
      <h1>{post.title}</h1>
      <small>{new Date(post.date).toLocaleDateString('pt-BR')}</small>
      {/* HTML sanitizado no servidor (sanitize-html) antes de ser salvo. */}
      <div className="content" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
