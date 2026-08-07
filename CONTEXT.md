# Nombre del Proyecto
**Tukas (v2)** - Aplicación Web de Gestión de Fútbol Amateur y Profesional.

# Propósito del Proyecto
Una plataforma para administrar partidos de fútbol, llevar estadísticas de jugadores, organizar equipos, registrar resultados y mantener un historial competitivo y organizado.

# Stack Tecnológico
- **Framework Core**: Next.js (App Router, Server Components y Server Actions).
- **Lenguaje**: TypeScript (estricto).
- **Estilos**: Tailwind CSS (con variables CSS personalizadas para modo oscuro/claro) y componentes de UI propios (sin librerías pesadas como MUI o Bootstrap).
- **Base de Datos y Backend**: Supabase (PostgreSQL, Supabase Auth para autenticación de usuarios).
- **Iconografía**: `lucide-react`.

# Arquitectura y Estructura de Carpetas
El proyecto sigue una arquitectura limpia orientada a Next.js App Router:
- `src/app/`: Contiene las rutas. Rutas protegidas agrupadas bajo `(main)` como `/dashboard`, `/matches`, `/players`.
- `src/components/ui/`: Componentes base y reutilizables (Card, Button, Badge, Avatar, BackButton, etc.).
- `src/components/.../`: Componentes específicos por dominio (ej. `PlayerMatchList.tsx`).
- `src/lib/actions/`: Lógica de base de datos y negocio usando **Server Actions** (`matches.ts`, `players.ts`, `stats.ts`, `auth.ts`, etc.).
- `src/lib/supabase/`: Clientes de Supabase para cliente y servidor.
- `src/lib/types/`: Tipados globales, principalmente `database.ts` donde se mapea el esquema de Supabase.

# Entidades Principales (Esquema de Base de Datos)
1. **user_profiles (Jugadores)**: `id`, `first_name`, `last_name`, `nickname`, `role` (admin/player).
2. **matches (Partidos)**: `id`, `match_date`, `field_id`, `status` ('scheduled', 'played', 'cancelled'), `score_team_a`, `score_team_b`, `notes`.
3. **fields (Canchas)**: `id`, `name`, `location`, `surface_type`, `size`.
4. **match_players (Tabla intermedia / Alineaciones)**: Relaciona partidos con jugadores. Campos: `match_id`, `player_id`, `team` ('A' o 'B'), `goals` (goles anotados por el jugador en ese partido), `attended` (boolean).

# Funcionalidades Actuales (Core)
- **Autenticación y Roles**: Login con Supabase. Sistema de roles donde el 'admin' tiene permisos para crear partidos y editar jugadores.
- **Gestión de Partidos**: Creación de partidos asignando cancha, fecha y hora. Asignación de jugadores a Equipo A o Equipo B. Al finalizar, se carga el resultado final y los goles individuales de cada jugador.
- **Perfiles de Jugador**: Vista detallada de cada jugador (`/players/[id]`) que muestra sus estadísticas (partidos jugados, goles, victorias, empates, derrotas, % de victorias) y un listado paginado con su historial de partidos jugados y próximos.
- **Dashboard**: Panel principal con métricas generales y accesos rápidos.

# Reglas de Código y Estilo
1. **Server Actions por defecto**: Toda la mutación de datos (crear, editar, borrar) y la obtención de datos compleja se hace mediante Server Actions (`'use server'`) ubicados en `src/lib/actions/`.
2. **Componentes de Cliente solo cuando es necesario**: Se usa `'use client'` estrictamente para interactividad (estados con `useState`, hooks, eventos `onClick`). La mayoría de las páginas (`page.tsx`) son Server Components.
3. **Revalidación**: Se utiliza `revalidatePath` en las Server Actions luego de mutar datos para actualizar la caché de Next.js.
4. **Estética**: La UI tiene un diseño moderno, oscuro/elegante, con uso de `backdrop-blur`, gradientes sutiles y efectos de "hover" y animaciones (ej. `animate-fade-in`).
5. **Navegación UX**: El manejo del historial (botón volver) contempla que la aplicación es una SPA mediante el uso cuidadoso de `window.history` y el router de Next.js.

Por favor, actúa como mi desarrollador Senior y consultor técnico para este proyecto. Cuando te pida código, asegúrate de respetar este stack, usar Server Actions, escribir TypeScript tipado correctamente y mantener la estética de Tailwind descrita.
