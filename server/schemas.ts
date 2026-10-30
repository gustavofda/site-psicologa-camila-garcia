import { z } from 'zod';
import type { SiteContent } from '../src/shared/types';

const str = (max: number) => z.string().trim().max(max);
const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const contentSchema = z.object({
  name: str(80).min(1),
  title: str(120),
  tagline: str(200),
  email: z.string().trim().email().max(120),
  whatsapp: z.string().regex(/^\d{10,15}$/),
  photoUrl: z.string().max(300).refine((v) => v === '' || v.startsWith('/uploads/')),
  story: str(4000),
  slots: z.array(hhmm).max(30),
  experiences: z.array(z.object({ area: str(120), where: str(160) })).max(30),
  skills: z.array(z.object({ title: str(80), description: str(300) })).max(30),
  projects: z.array(z.object({ title: str(120), description: str(800) })).max(30),
  socials: z.array(z.object({ label: str(40), url: z.string().trim().max(300).url().refine((u) => /^https?:\/\//i.test(u)) })).max(12),
}) satisfies z.ZodType<SiteContent>;

export const postSchema = z.object({ title: str(160).min(1), html: z.string().max(5_000_000), published: z.boolean() });
export const loginSchema = z.object({ email: z.string().email().max(200), password: z.string().min(1).max(200) });
export const dateSchema = ymd;
export const appointmentSchema = z.object({
  name: str(100).min(1), contact: str(120).min(3), date: ymd, time: hhmm, modality: z.enum(['Online', 'Presencial']),
});
export const idSchema = z.string().uuid();
