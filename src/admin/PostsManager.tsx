import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { api, ApiError, send, uploadFile } from '../lib/api';
import type { AdminPost, AdminPostSummary } from '../shared/types';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export default function PostsManager() {
  const editor = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<AdminPostSummary[]>([]);
  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');

  const refresh = useCallback(() => {
    api<AdminPostSummary[]>('/api/admin/posts').then(setList).catch(() => setMsg('Não foi possível listar os artigos.'));
  }, []);
  useEffect(refresh, [refresh]);

  const cmd = (c: string, v?: string) => { editor.current?.focus(); document.execCommand(c, false, v); };

  const addMedia = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      setMsg('Enviando arquivo…');
      const url = await uploadFile(f);
      const tag = f.type.startsWith('image/') ? `<img src="${url}" alt="${esc(f.name)}" />`
        : f.type.startsWith('video/') ? `<video src="${url}" controls></video>`
        : `<audio src="${url}" controls></audio>`;
      cmd('insertHTML', tag + '<p><br></p>');
      setMsg('');
    } catch (x) { setMsg(x instanceof ApiError ? x.message : 'Falha no envio.'); }
  };

  const addLink = () => {
    const u = prompt('Endereço do link (https://...)');
    if (u && /^(https?:|mailto:)/i.test(u)) cmd('createLink', u);
    else if (u) setMsg('Use um endereço começando com https://');
  };

  const save = async (published: boolean) => {
    if (!title.trim()) return setMsg('Dê um título ao artigo.');
    const pid = id ?? crypto.randomUUID();
    try {
      await send('PUT', `/api/admin/posts/${pid}`, { title, html: editor.current?.innerHTML ?? '', published });
      setId(pid);
      setMsg(published ? 'Artigo publicado.' : 'Rascunho salvo.');
      refresh();
    } catch (x) { setMsg(x instanceof ApiError ? x.message : 'Falha ao salvar.'); }
  };

  const open = async (pid: string) => {
    try {
      const p = await api<AdminPost>(`/api/admin/posts/${pid}`);
      setId(p.id); setTitle(p.title);
      if (editor.current) editor.current.innerHTML = p.html;
    } catch { setMsg('Não foi possível abrir o artigo.'); }
  };
  const fresh = () => { setId(null); setTitle(''); if (editor.current) editor.current.innerHTML = ''; };
  const remove = async (pid: string) => {
    if (!confirm('Excluir este artigo?')) return;
    await send('DELETE', `/api/admin/posts/${pid}`);
    if (id === pid) fresh();
    refresh();
  };

  return (
    <>
      <input className="title-input" placeholder="Título do artigo" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} />
      <div className="toolbar" role="toolbar" aria-label="Formatação">
        <button onClick={() => cmd('bold')}><b>N</b></button>
        <button onClick={() => cmd('italic')}><i>I</i></button>
        <button onClick={() => cmd('formatBlock', 'h2')}>Título</button>
        <button onClick={() => cmd('formatBlock', 'p')}>Texto</button>
        <button onClick={() => cmd('insertUnorderedList')}>Lista</button>
        <button onClick={() => cmd('formatBlock', 'blockquote')}>Citação</button>
        <button onClick={addLink}>Link</button>
        <label className="file-btn">Imagem / vídeo / mp3
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,audio/mpeg" hidden onChange={addMedia} />
        </label>
      </div>
      <div ref={editor} className="editor content" contentEditable suppressContentEditableWarning aria-label="Texto do artigo" />
      <div className="links">
        <button className="btn" onClick={() => save(true)}>Publicar</button>
        <button className="btn ghost" onClick={() => save(false)}>Salvar rascunho</button>
        <button className="btn ghost" onClick={fresh}>Novo</button>
      </div>
      {msg && <p role="status" className="note">{msg}</p>}
      <h2>Meus artigos</h2>
      <ul className="list">
        {list.map((p) => (
          <li key={p.id}>
            <span>{p.title} <em>{p.published ? '(publicado)' : '(rascunho)'}</em></span>
            <span><button className="link" onClick={() => open(p.id)}>Editar</button>{' '}<button className="link" onClick={() => remove(p.id)}>Excluir</button></span>
          </li>
        ))}
      </ul>
    </>
  );
}
