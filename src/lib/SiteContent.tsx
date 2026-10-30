import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { SiteContent } from '../shared/types';
import { DEFAULT_CONTENT } from '../shared/defaultContent';
import { api } from './api';

const Ctx = createContext<SiteContent | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [c, setC] = useState<SiteContent | null>(null);
  useEffect(() => {
    api<SiteContent>('/api/content').then(setC).catch(() => setC(DEFAULT_CONTENT));
  }, []);
  if (!c) return <p style={{ padding: '2rem' }}>Carregando…</p>;
  return <Ctx.Provider value={c}>{children}</Ctx.Provider>;
}

export function useSite(): SiteContent {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSite fora de SiteProvider');
  return v;
}
