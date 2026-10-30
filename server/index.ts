import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import sanitizeHtml from 'sanitize-html';
import { and, desc, eq } from 'drizzle-orm';
import type { ZodType } from 'zod';
import { env } from './env';
import { db } from './db';
import { appointments, posts, settings } from './schema';
import { checkLogin, cookieBase, cookieOpts, requireAuth, signToken } from './auth';
import { appointmentSchema, contentSchema, dateSchema, idSchema, loginSchema, postSchema } from './schemas';
import { DEFAULT_CONTENT } from '../src/shared/defaultContent';
import type { SiteContent } from '../src/shared/types';

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '6mb' }));

type Handler = (req: Request, res: Response) => Promise<void> | void;
const h = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res)).catch(next);
};
function parse<T>(schema: ZodType<T>, data: unknown, res: Response): T | null {
  const r = schema.safeParse(data);
  if (!r.success) { res.status(400).json({ error: 'Dados inválidos' }); return null; }
  return r.data;
}

async function getContent(): Promise<SiteContent> {
  const rows = await db.select().from(settings).where(eq(settings.key, 'content'));
  if (rows[0]) {
    try {
      const p = contentSchema.safeParse(JSON.parse(rows[0].value));
      if (p.success) return p.data;
    } catch { /* valor corrompido: usa o padrão */ }
  }
  return DEFAULT_CONTENT;
}

// ---------- uploads ----------
fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
const EXT: Record<string, string> = {
  'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif',
  'audio/mpeg': '.mp3', 'video/mp4': '.mp4', 'video/webm': '.webm',
};
const upload = multer({
  storage: multer.diskStorage({
    destination: (_r, _f, cb) => cb(null, env.UPLOAD_DIR),
    filename: (_r, f, cb) => cb(null, crypto.randomUUID() + EXT[f.mimetype]),
  }),
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
  fileFilter: (_r, f, cb) => cb(null, f.mimetype in EXT),
});
app.use('/uploads', express.static(env.UPLOAD_DIR, { maxAge: '7d' }));

const SANITIZE: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'video', 'audio', 'h1', 'h2'],
  allowedAttributes: { a: ['href'], img: ['src', 'alt'], video: ['src', 'controls'], audio: ['src', 'controls'] },
  allowedSchemes: ['http', 'https', 'mailto'],
};

// ---------- públicas ----------
app.get('/api/content', h(async (_req, res) => { res.json(await getContent()); }));

app.get('/api/posts', h(async (_req, res) => {
  const rows = await db.select({ id: posts.id, title: posts.title, date: posts.createdAt })
    .from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt));
  res.json(rows);
}));

app.get('/api/posts/:id', h(async (req, res) => {
  const rows = await db.select().from(posts).where(and(eq(posts.id, req.params.id), eq(posts.published, true)));
  const p = rows[0];
  if (!p) { res.status(404).json({ error: 'Artigo não encontrado' }); return; }
  res.json({ id: p.id, title: p.title, html: p.html, date: p.createdAt });
}));

app.get('/api/slots', h(async (req, res) => {
  const date = parse(dateSchema, req.query.date, res);
  if (!date) return;
  const taken = await db.select({ time: appointments.time }).from(appointments).where(eq(appointments.date, date));
  res.json({ slots: (await getContent()).slots, taken: taken.map((t) => t.time) });
}));

const bookingLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
app.post('/api/appointments', bookingLimiter, h(async (req, res) => {
  const b = parse(appointmentSchema, req.body, res);
  if (!b) return;
  if (b.date < new Date().toISOString().slice(0, 10)) { res.status(400).json({ error: 'Escolha uma data futura' }); return; }
  if (!(await getContent()).slots.includes(b.time)) { res.status(400).json({ error: 'Horário indisponível' }); return; }
  const clash = await db.select().from(appointments).where(and(eq(appointments.date, b.date), eq(appointments.time, b.time)));
  if (clash.length) { res.status(409).json({ error: 'Este horário acabou de ser reservado' }); return; }
  try {
    await db.insert(appointments).values({ id: crypto.randomUUID(), ...b, createdAt: Date.now() });
  } catch (e) {
    console.error(e); // o índice único cobre a corrida entre duas solicitações simultâneas
    res.status(409).json({ error: 'Este horário acabou de ser reservado' });
    return;
  }
  res.status(201).json({ ok: true });
}));

// ---------- autenticação ----------
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
app.post('/api/auth/login', loginLimiter, h(async (req, res) => {
  const b = parse(loginSchema, req.body, res);
  if (!b) return;
  if (!(await checkLogin(b.email, b.password))) { res.status(401).json({ error: 'E-mail ou senha incorretos' }); return; }
  res.cookie('token', signToken(), cookieOpts);
  res.json({ ok: true });
}));
app.post('/api/auth/logout', (_req, res) => { res.clearCookie('token', cookieBase); res.json({ ok: true }); });
app.get('/api/auth/me', requireAuth, (_req, res) => { res.json({ ok: true }); });

// ---------- painel (exige login) ----------
app.put('/api/admin/content', requireAuth, h(async (req, res) => {
  const b = parse(contentSchema, req.body, res);
  if (!b) return;
  await db.insert(settings).values({ key: 'content', value: JSON.stringify(b) })
    .onConflictDoUpdate({ target: settings.key, set: { value: JSON.stringify(b) } });
  res.json({ ok: true });
}));

app.get('/api/admin/posts', requireAuth, h(async (_req, res) => {
  res.json(await db.select({ id: posts.id, title: posts.title, published: posts.published, updatedAt: posts.updatedAt })
    .from(posts).orderBy(desc(posts.updatedAt)));
}));
app.get('/api/admin/posts/:id', requireAuth, h(async (req, res) => {
  const rows = await db.select().from(posts).where(eq(posts.id, req.params.id));
  const p = rows[0];
  if (!p) { res.status(404).json({ error: 'Artigo não encontrado' }); return; }
  res.json({ id: p.id, title: p.title, html: p.html, published: p.published });
}));
app.put('/api/admin/posts/:id', requireAuth, h(async (req, res) => {
  const id = parse(idSchema, req.params.id, res);
  const b = parse(postSchema, req.body, res);
  if (!id || !b) return;
  const html = sanitizeHtml(b.html, SANITIZE);
  const now = Date.now();
  await db.insert(posts).values({ id, title: b.title, html, published: b.published, createdAt: now, updatedAt: now })
    .onConflictDoUpdate({ target: posts.id, set: { title: b.title, html, published: b.published, updatedAt: now } });
  res.json({ id });
}));
app.delete('/api/admin/posts/:id', requireAuth, h(async (req, res) => {
  await db.delete(posts).where(eq(posts.id, req.params.id));
  res.json({ ok: true });
}));

app.post('/api/admin/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) { res.status(400).json({ error: 'Arquivo inválido ou tipo não permitido' }); return; }
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.get('/api/admin/appointments', requireAuth, h(async (_req, res) => {
  res.json(await db.select().from(appointments).orderBy(appointments.date, appointments.time));
}));
app.delete('/api/admin/appointments/:id', requireAuth, h(async (req, res) => {
  await db.delete(appointments).where(eq(appointments.id, req.params.id));
  res.json({ ok: true });
}));

app.use('/api', (_req, res) => { res.status(404).json({ error: 'Rota não encontrada' }); });

// ---------- front-end compilado (produção) ----------
if (env.PROD) {
  const dist = path.resolve('dist');
  app.use(express.static(dist));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/admin')) { next(); return; }
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) { res.status(413).json({ error: 'Arquivo muito grande ou inválido' }); return; }
  console.error(err);
  res.status(500).json({ error: 'Erro interno' });
});

app.listen(env.PORT, () => console.log(`API em http://localhost:${env.PORT}`));
