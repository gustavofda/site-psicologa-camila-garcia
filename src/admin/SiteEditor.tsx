import { useEffect, useState, type ChangeEvent } from 'react';
import { api, ApiError, send, uploadFile } from '../lib/api';
import type { SiteContent } from '../shared/types';
import ListEditor from './ListEditor';

type TextKey = 'name' | 'title' | 'tagline' | 'email' | 'whatsapp' | 'story';

export default function SiteEditor() {
  const [d, setD] = useState<SiteContent | null>(null);
  const [slots, setSlots] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api<SiteContent>('/api/content').then((c) => { setD(c); setSlots(c.slots.join(', ')); }).catch(() => setMsg('Não foi possível carregar.'));
  }, []);
  if (!d) return <p>{msg || 'Carregando…'}</p>;

  const text = (k: TextKey, label: string, multiline = false) => (
    <label>{label}
      {multiline
        ? <textarea value={d[k]} onChange={(e) => setD({ ...d, [k]: e.target.value })} />
        : <input value={d[k]} onChange={(e) => setD({ ...d, [k]: e.target.value })} />}
    </label>
  );

  const onPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try { setD({ ...d, photoUrl: await uploadFile(f) }); setMsg('Foto enviada. Clique em Salvar para aplicar.'); }
    catch (x) { setMsg(x instanceof ApiError ? x.message : 'Falha no envio.'); }
  };

  const save = async () => {
    const list = slots.split(',').map((s) => s.trim()).filter(Boolean);
    try {
      await send('PUT', '/api/admin/content', { ...d, slots: list });
      setMsg('Alterações salvas e publicadas no site.');
    } catch (x) {
      setMsg(x instanceof ApiError && x.status === 401 ? 'Sessão expirada. Recarregue e entre novamente.'
        : 'Dados inválidos. Confira WhatsApp (só dígitos com DDI/DDD), links (https://) e horários (HH:MM, separados por vírgula).');
    }
  };

  return (
    <>
      <div className="edit-block">
        <h2>Identidade e contato</h2>
        {text('name', 'Nome')}{text('title', 'Título profissional')}{text('tagline', 'Frase de destaque')}
        {text('email', 'E-mail')}{text('whatsapp', 'WhatsApp (só dígitos, com DDI e DDD)')}
        <div className="avatar-row">
          {d.photoUrl && <img className="photo" style={{ width: 90 }} src={d.photoUrl} alt="Foto atual" />}
          <label className="file-btn">Enviar foto de perfil<input type="file" accept="image/*" hidden onChange={onPhoto} /></label>
          {d.photoUrl && <button className="btn ghost" onClick={() => setD({ ...d, photoUrl: '' })}>Remover foto</button>}
        </div>
      </div>
      <div className="edit-block"><h2>Minha história</h2>{text('story', 'Texto', true)}</div>
      <div className="edit-block">
        <h2>Horários de atendimento</h2>
        <label>Horários oferecidos (HH:MM, separados por vírgula)<input value={slots} onChange={(e) => setSlots(e.target.value)} /></label>
      </div>
      <ListEditor title="Experiência de estágio" items={d.experiences} fields={[{ key: 'area', label: 'Área' }, { key: 'where', label: 'Local' }]}
        empty={{ area: '', where: '' }} onChange={(experiences) => setD({ ...d, experiences })} />
      <ListEditor title="Habilidades" items={d.skills} fields={[{ key: 'title', label: 'Título' }, { key: 'description', label: 'Descrição', multiline: true }]}
        empty={{ title: '', description: '' }} onChange={(skills) => setD({ ...d, skills })} />
      <ListEditor title="Projetos e escrita" items={d.projects} fields={[{ key: 'title', label: 'Título' }, { key: 'description', label: 'Descrição', multiline: true }]}
        empty={{ title: '', description: '' }} onChange={(projects) => setD({ ...d, projects })} />
      <ListEditor title="Redes sociais" items={d.socials} fields={[{ key: 'label', label: 'Rede (Instagram, LinkedIn…)' }, { key: 'url', label: 'Link (https://...)' }]}
        empty={{ label: '', url: 'https://' }} onChange={(socials) => setD({ ...d, socials })} />
      <div className="savebar">
        <button className="btn" onClick={save}>Salvar e publicar</button>
        {msg && <span role="status" className="note">{msg}</span>}
      </div>
    </>
  );
}
