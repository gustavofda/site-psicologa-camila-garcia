# Site da Camila — React + TypeScript + Express + Drizzle (SQLite)

Dois front-ends no mesmo projeto: site público (`/`) e painel da dona (`/admin/`, com login).

## Instalar (o npm resolve as versões; confira no npmjs.com e fixe com o package-lock.json)
```
npm install react react-dom react-router-dom express drizzle-orm better-sqlite3 bcryptjs jsonwebtoken \
  cookie-parser helmet express-rate-limit zod multer sanitize-html tsx
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/node \
  @types/express @types/better-sqlite3 @types/jsonwebtoken @types/cookie-parser @types/multer @types/sanitize-html
```
(Se o npm avisar que algum pacote `@types/...` está obsoleto porque a biblioteca já traz tipos, remova-o.)
Requer Node com suporte a `--env-file` (20.6+); confirme a versão LTS em nodejs.org.

## Configurar
1. `cp .env.example .env`
2. `npm run hash -- "sua senha com 10+ caracteres"` e cole o resultado em `ADMIN_PASSWORD_HASH` (entre aspas simples).
3. Defina `JWT_SECRET` (32+ caracteres aleatórios) e `ADMIN_EMAIL`.

## Desenvolvimento (dois terminais)
```
npm run dev:api     # API em :3001
npm run dev:web     # site em :5173  (painel em :5173/admin/)
npm run typecheck
```

## Produção
```
npm run build       # gera dist/
# no .env: NODE_ENV=production
npm run start       # Express serve API + site + /admin/ + /uploads
```
Use HTTPS (proxy reverso) e, atrás de proxy, configure `trust proxy` no Express.
Faça backup de `data.db` e da pasta `uploads/`.
