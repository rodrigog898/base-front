# base-front

Frontend base con **Nuxt 4 + Vue 3 + Tailwind**, con logs **JSON estructurados** (el mismo esquema que el backend) y cabeceras de seguridad OWASP alineadas a **ISO/IEC 27001:2022** ([SECURITY.md](SECURITY.md)).

## Arquitectura (estructura Nuxt 4)

```
app/
├── app.vue
├── assets/css/main.css
├── components/dashboard/   # UI del dashboard de ejemplo
├── composables/
│   ├── useAuth.ts          # sesión (access token en memoria + refresh por cookie HttpOnly)
│   ├── useApi.ts           # cliente HTTP: Bearer, X-Request-Id, refresh ante 401, errores normalizados
│   └── useLogger.ts        # logger JSON
├── layouts/  dashboard.vue · auth.vue
├── middleware/auth.global.ts   # protege todas las rutas salvo las públicas
├── pages/  index.vue · login.vue
└── plugins/01.logger.ts    # captura de errores Vue/window y envío al backend
server/
├── plugins/logger.ts       # Nitro → JSON: consola, access log, errores
├── plugins/security.ts     # connect-src de la CSP desde la configuración de runtime
└── utils/logger.ts
shared/utils/log.ts         # esquema de log común (navegador + servidor)
docs/LOGGING.md             # estándar de logs (común con el backend)
```

## Uso en páginas

```ts
const api = useApi()
const log = useLogger({ module: 'clientes' })

const clientes = await api.get<{ data: Cliente[] }>('/api/clientes')
log.info('Clientes cargados', { total: clientes.data.length })
```

Rutas públicas: se agrega `definePageMeta({ public: true })` en la página.

## Desarrollo

```bash
cp .env.example .env
npm install
npm run dev        # http://localhost:4000 (backend en :3000)
```

| Script | |
|---|---|
| `npm run lint` · `typecheck` · `build` | Lo mismo corre en CI |
| `npm run preview` | Build de producción local |

Requiere Node `^22.21` o `>=24.11`.

## Docker

```bash
docker build -t base-front .
docker run -e NUXT_PUBLIC_API_BASE=https://api.midominio.com -p 3000:3000 base-front
```
