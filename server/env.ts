const need = (k: string): string => {
  const v = process.env[k];
  if (!v) throw new Error(`Variável ${k} ausente no .env`);
  return v;
};

export const env = {
  PORT: Number(process.env.PORT ?? 3001),
  PROD: process.env.NODE_ENV === 'production',
  JWT_SECRET: need('JWT_SECRET'),
  ADMIN_EMAIL: need('ADMIN_EMAIL').toLowerCase(),
  ADMIN_PASSWORD_HASH: need('ADMIN_PASSWORD_HASH'),
  DB_FILE: process.env.DB_FILE ?? 'data.db',
  UPLOAD_DIR: process.env.UPLOAD_DIR ?? 'uploads',
};
if (env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET deve ter ao menos 32 caracteres');
