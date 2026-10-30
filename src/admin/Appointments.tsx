import { useCallback, useEffect, useState } from 'react';
import { api, send } from '../lib/api';
import type { Appointment } from '../shared/types';

export default function Appointments() {
  const [items, setItems] = useState<Appointment[] | null>(null);
  const load = useCallback(() => { api<Appointment[]>('/api/admin/appointments').then(setItems).catch(() => setItems([])); }, []);
  useEffect(load, [load]);
  const remove = async (id: string) => {
    if (!confirm('Remover esta solicitação? O horário volta a ficar livre.')) return;
    await send('DELETE', `/api/admin/appointments/${id}`);
    load();
  };
  if (!items) return <p>Carregando…</p>;
  if (!items.length) return <p>Nenhuma solicitação ainda.</p>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead><tr><th>Data</th><th>Hora</th><th>Nome</th><th>Contato</th><th>Modalidade</th><th /></tr></thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id}>
              <td>{a.date.split('-').reverse().join('/')}</td><td>{a.time}</td><td>{a.name}</td><td>{a.contact}</td><td>{a.modality}</td>
              <td><button className="link" onClick={() => remove(a.id)}>Remover</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
