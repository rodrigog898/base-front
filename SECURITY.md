# Seguridad: base-front

Este documento relaciona los controles técnicos del frontend con **ISO/IEC 27001:2022 (Anexo A)** y **OWASP ASVS 4.0**. El documento equivalente del backend está en `base-back/SECURITY.md`.

> ISO 27001 certifica un sistema de gestión, no un repositorio. Este template cubre los controles **técnicos** del software.

| Control ISO 27001:2022 | Implementación |
|---|---|
| **8.26** Requisitos de seguridad de aplicaciones | `nuxt-security`: CSP con nonce y `strict-dynamic` en SSR, `frame-ancestors 'none'`, `object-src 'none'`, HSTS en producción, `X-Frame-Options: DENY`, `nosniff`, COOP/CORP/COEP, Permissions-Policy restrictiva y SRI en los scripts. |
| **8.5** Autenticación segura | El access token vive **solo en memoria** (nunca en `localStorage`). El refresh token va en una cookie `HttpOnly` gestionada por el backend. Hay renovación transparente ante 401 con un único refresh en vuelo, y la redirección post-login solo acepta rutas internas (sin open redirect). |
| **8.15 / 8.16** Registro y monitoreo | Logs JSON con el mismo esquema que el backend ([docs/LOGGING.md](docs/LOGGING.md)). El SSR (Nitro) escribe en `stdout` incluyendo `consola` y `console.*`, y el navegador envía `warn` y `error` en lotes a `POST /api/logs/client`. `X-Request-Id` se propaga en cada llamada a la API. |
| **5.34** Privacidad / PII | Fuentes autoalojadas (`@nuxt/fonts`): el navegador no hace llamadas a Google. Los logs redactan claves sensibles y eliminan la query string. |
| **8.6** Capacidad / DoS | Rate limiter y límite de tamaño de requests en el servidor Nitro. El envío de logs del cliente tiene backpressure. |
| **8.28** Codificación segura | `xssValidator` en Nitro, ESLint prohíbe `v-html` y `console.log`, y `removeLoggers` elimina `console.*` del bundle de producción. |
| **8.8** Vulnerabilidades técnicas | `npm audit` en CI, Dependabot y `overrides` para dependencias transitivas. |
| **8.2** Privilegios | El contenedor corre como usuario `node`. |
| **8.9** Configuración | Todo se configura con variables `NUXT_PUBLIC_*` en runtime. La CSP agrega `NUXT_PUBLIC_API_BASE` a `connect-src` sin necesidad de reconstruir. |

## Riesgo residual conocido

- `deepmerge` (severidad baja, GHSA-gcqx-w48m-w2h4) es una dependencia interna del build de Nitro/Rollup y no tiene versión parcheada. No se ejecuta con datos de usuarios.

## Checklist de despliegue

- [ ] Servir solo por HTTPS. HSTS se activa con `NODE_ENV=production`.
- [ ] Definir `NUXT_PUBLIC_API_BASE` con el dominio real de la API y agregar el dominio del front a `CORS_ORIGINS` del backend.
- [ ] Mantener front y API en el mismo *site* (por ejemplo `app.dominio.com` y `api.dominio.com`) para que funcione la cookie `SameSite=Strict`.
- [ ] Enviar `stdout` al mismo SIEM que el backend.
