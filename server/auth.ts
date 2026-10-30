import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { CookieOptions, RequestHandler } from 'express';
import { env } from './env';

const DUMMY_HASH = bcrypt.hashSync('senha-ficticia', 10); // mantém o tempo de resposta parecido

export async function checkLogin(email: string, password: string): Promise<boolean> {
  const emailOk = email.toLowerCase() === env.ADMIN_EMAIL;
  const pwOk = await bcrypt.compare(password, emailOk ? env.ADMIN_PASSWORD_HASH : DUMMY_HASH);
  return emailOk && pwOk;
}

export const signToken = (): string => jwt.sign({ role: 'owner' }, env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '7d' });

export const cookieBase: CookieOptions = { httpOnly: true, sameSite: 'strict', secure: env.PROD, path: '/' };
export const cookieOpts: CookieOptions = { ...cookieBase, maxAge: 7 * 24 * 3600 * 1000 };

export const requireAuth: RequestHandler = (req, res, next) => {
  const token: unknown = req.cookies?.token;
  try {
    if (typeof token !== 'string') throw new Error('sem token');
    jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch {
    res.status(401).json({ error: 'Não autorizado' });
  }
};
