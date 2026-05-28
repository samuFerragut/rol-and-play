# Rol & Play

Aplicacion web para crear y gestionar personajes de rol.

## Stack

- Backend: NestJS, MongoDB, Mongoose
- Frontend: Vue 3, Vite, Vuetify, Pinia
- Workspace: pnpm

## Puesta en marcha local

Instala dependencias:

```bash
pnpm install
```

Levanta MongoDB y mongo-express:

```bash
pnpm dev:mongo
```

Copia los archivos de entorno y ajusta los valores locales:

```powershell
Copy-Item apps/backend/.env.example apps/backend/.env
Copy-Item apps/role-and-play-frontend/.env.example apps/role-and-play-frontend/.env
```

Carga el contenido base:

```bash
pnpm seed
```

Arranca backend y frontend:

```bash
pnpm dev
```

## Scripts utiles

- `pnpm dev:mongo`: levanta MongoDB y mongo-express.
- `pnpm seed`: reemplaza y carga razas, clases y trasfondos base.
- `pnpm dev`: arranca backend y frontend en modo desarrollo.
- `pnpm dev:backend`: arranca solo NestJS.
- `pnpm dev:frontend`: arranca solo Vite.

## URLs locales

- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3000`
- Mongo Express: `http://localhost:8081`
