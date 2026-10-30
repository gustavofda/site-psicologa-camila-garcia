import { useEffect, useState, type FormEvent } from 'react';
import { api, ApiError, send } from '../lib/api';
import SiteEditor from './SiteEditor';
import PostsManager from './PostsManager';
import Appointments from './Appointments';

type Tab = 'site' | 'posts' | 'agenda';

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try { await send('POST', '/api/auth/login', { email, password }); onDone(); }
    catch (x) { setErr(x instanceof ApiError ? x.message : 'Erro de conexão'); }
  };
  return (
    <form className="card login" onSubmit={submit}>
      <h1>Painel</h1>
      <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /></label>
      <label>Senha<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
      <button className="btn" type="submit">Entrar</button>
      {err && <p role="alert" className="err">{err}</p>}
    </form>
  );
}

export default function AdminApp() {
  const [auth, setAuth] = useState<'loading' | 'in' | 'out'>('loading');
  const [tab, setTab] = useState<Tab>('site');
  useEffect(() => { api('/api/auth/me').then(() => setAuth('in')).catch(() => setAuth('out')); }, []);

  if (auth === 'loading') return <p style={{ padding: '2rem' }}>Carregando…</p>;
  if (auth === 'out') return <Login onDone={() => setAuth('in')} />;

  const logout = async () => { await send('POST', '/api/auth/logout'); setAuth('out'); };
  const tabs: [Tab, string][] = [['site', 'Editar site'], ['posts', 'Artigos'], ['agenda', 'Agendamentos']];
  return (
    <div className="section">
      <div className="links" style={{ justifyContent: 'space-between' }}>
        <strong>Painel da Camila</strong>
        <span><a href="/" target="_blank" rel="noreferrer">Ver site</a> · <button className="link" onClick={logout}>Sair</button></span>
      </div>
      <div className="tabs" role="tablist">
        {tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      {tab === 'site' && <SiteEditor />}
      {tab === 'posts' && <PostsManager />}
      {tab === 'agenda' && <Appointments />}
    </div>
  );
}
