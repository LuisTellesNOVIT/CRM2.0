# CRM Novit · Sharky

CRM web para la operación comercial conjunta de **NOVIT** y **SHARKY**. Construido a partir del prototipo HTML/React en `../prototype/`, replicando los design tokens, modelo de datos y comportamientos descritos en `../README.md`.

## Stack

- **Vite 5** + **React 18** + **TypeScript** strict
- **React Router v6** (data router)
- **Zustand** con `persist` middleware (localStorage)
- **CSS Modules + variables CSS** (tokens replicados de `design-tokens.css`)
- **`@dnd-kit/core`** para drag & drop del Kanban
- **`lucide-react`** para iconos
- **`cmdk`** para command palette ⌘K
- **`date-fns`** con locale `es`
- **Vitest** para tests unitarios (motor de recomendaciones, stores)

## Instalación

```bash
npm install
```

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el dev server en `http://localhost:5173` |
| `npm run build` | Compila TypeScript y genera el bundle de producción |
| `npm run preview` | Sirve el bundle de producción localmente |
| `npm run lint` | Corre ESLint sobre `src/` |
| `npm run format` | Formatea con Prettier |
| `npm test` | Corre los tests con Vitest |
| `npm run test:watch` | Modo watch |

## Estructura

```
src/
├── App.tsx                 # router + providers
├── main.tsx                # entry point
├── styles/                 # tokens.css + global.css
├── types/                  # tipos de dominio (User, Client, Opportunity, …)
├── data/                   # mock.ts (port de data.js)
├── lib/                    # helpers puros: money, dates, calc, lookups, recommendations, useApplyTheme
├── stores/                 # 5 stores Zustand: auth, opportunities, tasks, interactions, ui
├── components/
│   ├── ui/                 # primitives: Avatar, Badge, Button, Card, CompanyTag, Money, Pills, Sparkline, StatusPill
│   ├── layout/             # Sidebar, TopBar, AppShell
│   ├── command/            # CommandPalette (cmdk)
│   └── icons/              # wrapper sobre lucide-react con los 33 nombres del prototipo
├── features/
│   ├── dashboard/          # KPIs, Funnel, Donut, ProjectionChart, RecommendationItem
│   ├── kanban/             # KanbanBoard + DnD
│   ├── opportunities/      # LeadsView (tabla) + LeadDrawer (5 tabs)
│   ├── clients/            # ClientsView (cards agrupados)
│   ├── tasks/              # TasksView
│   ├── settings/           # 5 secciones (Apariencia, Usuarios, Plantillas, Integraciones, Pipeline)
│   └── auth/               # Login simulado
└── routes/                 # config React Router
```

## Login (modo demo)

Cualquier credencial entra. Si el email coincide con uno del seed (`USERS` en `data/mock.ts`), inicia como ese usuario; en caso contrario, default a Diego Ramírez (Admin).

## Persistencia

Todos los stores usan `zustand/middleware/persist` con localStorage. Las claves:

- `crm:auth` — usuario logueado
- `crm:opportunities` — oportunidades (drag&drop, cambio de estado, edición)
- `crm:tasks` — tareas (creación, completar)
- `crm:interactions` — timeline (envíos de WhatsApp/Email)
- `crm:ui` — preferencias (PEN/USD, theme, accent, density, colores marca)

Para resetear a los seeds, llama `useOpportunitiesStore.getState().reset()` (idem en `useTasksStore` y `useInteractionsStore`) o limpia las claves del localStorage.

## Cuando llegue el backend real

El prototipo y este código viven sobre datos mock. La transición a backend se hace reemplazando los stores Zustand por hooks de fetching (TanStack Query es la opción natural) que llamen los endpoints sugeridos en `../README.md`:

```
GET    /api/me
POST   /api/auth/login
GET    /api/opportunities
POST   /api/opportunities
PATCH  /api/opportunities/:id        ← drag&drop
GET    /api/opportunities/:id/interactions
POST   /api/opportunities/:id/interactions
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id
GET    /api/clients
GET    /api/users
```

Mantener `lib/recommendations.ts` como función pura — puede correr en frontend o moverse al backend sin cambios.

## Atajos de teclado

| Atajo | Acción |
|---|---|
| `⌘K` / `Ctrl+K` | Abrir command palette |
| `Esc` | Cerrar drawer / palette |

## Tests

```bash
npm test
```

Cubre:
- `lib/recommendations.test.ts` — 8 reglas del motor de recomendaciones.
- `stores/useOpportunitiesStore.test.ts` — `setStatus` y `update`.

## Notas de fidelidad con el prototipo

- Tokens CSS replicados 1:1 desde `../design-tokens.css`, normalizados a `--surface-2`, `--text-2`, `--text-3` (el prototipo mezclaba `--surface2` sin guion).
- Tipografía Geist cargada vía Google Fonts en `index.html`.
- Iconos: el prototipo dibuja SVG inline; aquí se usa `lucide-react` (estilo idéntico, stroke 1.6).
- HTML5 native drag del prototipo reemplazado por `@dnd-kit/core` (mejor accesibilidad).
- Tweaks panel del prototipo no se incluye — sus controles viven en Settings → Apariencia.
