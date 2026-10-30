import { useEffect, useState, type ChangeEvent } from 'react';
import { api, ApiError, send } from '../lib/api';
import { useSite } from '../lib/SiteContent';
import type { SlotsInfo } from '../shared/types';
import { BrandButton } from './Icons';

type Form = { name: string; contact: string; modality: 'Online' | 'Presencial' };

export default function Booking() {
  const c = useSite();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState('');
  const [info, setInfo] = useState<SlotsInfo | null>(null);
  const [time, setTime] = useState('');
  const [f, setF] = useState<Form>({ name: '', contact: '', modality: 'Online' });
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!date) return;
    setTime(''); setInfo(null); setErr('');
    api<SlotsInfo>(`/api/slots?date=${date}`).then(setInfo).catch(() => setErr('Não foi possível carregar os horários.'));
  }, [date]);

  const set = (k: keyof Form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const ready = Boolean(date && time && f.name.trim() && f.contact.trim().length >= 3);

  const submit = async () => {
    setState('sending'); setErr('');
    try {
      await send('POST', '/api/appointments', { ...f, date, time });
      setState('done');
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Erro ao enviar. Tente novamente.');
      setState('idle');
    }
  };

  if (state === 'done') {
    const msg = encodeURIComponent(`Olá! Sou ${f.name} e acabei de solicitar uma consulta ${f.modality.toLowerCase()} em ${date.split('-').reverse().join('/')} às ${time}.`);
    return (
      <div className="card booking">
        <h3>Solicitação enviada</h3>
        <p>Você receberá a confirmação pelo contato informado. Se preferir, avise também pelo WhatsApp:</p>
        <BrandButton kind="wa" href={`https://wa.me/${c.whatsapp}?text=${msg}`} label="Avisar pelo WhatsApp" />
      </div>
    );
  }

  return (
    <div className="card booking">
      <label>1. Escolha a data
        <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} />
      </label>
      {date && !info && !err && <p className="note">Carregando horários…</p>}
      {info && (info.slots.length === 0 ? <p className="note">Nenhum horário configurado.</p> : (
        <div>
          <strong>2. Escolha o horário</strong>
          <div className="slots" role="group" aria-label="Horários">
            {info.slots.map((s) => (
              <button key={s} type="button" className={s === time ? 'chip on' : 'chip'} disabled={info.taken.includes(s)} onClick={() => setTime(s)}>{s}</button>
            ))}
          </div>
        </div>
      ))}
      <strong>3. Seus dados</strong>
      <label>Nome<input value={f.name} onChange={set('name')} maxLength={100} /></label>
      <label>WhatsApp ou e-mail para contato<input value={f.contact} onChange={set('contact')} maxLength={120} /></label>
      <label>Modalidade
        <select value={f.modality} onChange={set('modality')}><option>Online</option><option>Presencial</option></select>
      </label>
      <button className="btn" disabled={!ready || state === 'sending'} onClick={submit}>{state === 'sending' ? 'Enviando…' : 'Solicitar consulta'}</button>
      {err && <p role="alert" className="err">{err}</p>}
      <p className="note">Seus dados são usados apenas para o agendamento.</p>
    </div>
  );
}
