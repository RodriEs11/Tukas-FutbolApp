# ⚽ Tukas - FutbolApp

Tukas es una aplicación web moderna diseñada para la gestión integral de partidos de fútbol amateur o torneos, perfiles de jugadores y canchas. Permite administrar partidos, asignar equipos, llevar el control de goles y asistencias, con roles diferenciados para jugadores regulares y administradores.

## 🚀 Tecnologías (Tech Stack)

Este proyecto está construido con herramientas de vanguardia para asegurar rendimiento y facilidad de desarrollo:

- **Frontend Framework:** [Next.js 16+](https://nextjs.org/) (App Router, Server Actions)
- **Librería UI:** [React 19](https://react.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Base de Datos y Autenticación:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Lenguaje:** TypeScript

---

## 🗄️ Arquitectura de Base de Datos (Supabase)

La base de datos relacional (PostgreSQL) alojada en Supabase está estructurada de la siguiente manera:

### 1. Usuarios y Perfiles
- **`auth.users`**: Gestionada automáticamente por Supabase para la autenticación (Email/Password).
- **`public.user_profiles`**: Perfiles públicos de los usuarios. Se sincroniza automáticamente con un _Trigger_ cuando un nuevo usuario se registra.
  - `id` (uuid, fk a auth.users)
  - `first_name`, `last_name`, `nickname` (text)
  - `role` (text): Puede ser `'player'` o `'admin'`.
  - `avatar_url` (text)

### 2. Canchas (`public.fields`)
Almacena los recintos donde se juegan los partidos.
- `id` (uuid, pk)
- `name`, `location`, `description` (text)
- `surface_type` (enum): `'césped'`, `'sintético'`, `'tierra'`, `'cemento'`, `'otro'`.
- `is_active` (boolean)

### 3. Partidos (`public.matches`)
Gestión central de eventos.
- `id` (uuid, pk)
- `field_id` (uuid, fk a fields)
- `match_date` (timestamp)
- `status` (enum): `'scheduled'`, `'played'`, `'cancelled'`.
- `score_team_a`, `score_team_b` (int)

### 4. Jugadores por Partido (`public.match_players`)
Tabla intermedia que asigna jugadores a partidos específicos, registrando sus estadísticas.
- `id` (uuid, pk)
- `match_id` (uuid, fk a matches)
- `player_id` (uuid, fk a user_profiles)
- `team` (enum): `'A'` o `'B'`
- `goals` (int)
- `attended` (boolean)

*(La base de datos cuenta con **Row Level Security (RLS)** activado. Los administradores tienen permisos CRUD completos, mientras que los jugadores tienen acceso de solo lectura en la mayoría de las tablas, pudiendo editar únicamente su propio perfil).*

---

## 🛠️ Configuración y Puesta en Marcha

Sigue estos pasos para levantar el entorno de desarrollo localmente.

### 1. Requisitos Previos
- [Node.js](https://nodejs.org/) (v20 o superior recomendado)
- npm, yarn, o pnpm
- (Opcional pero recomendado) [Supabase CLI](https://supabase.com/docs/guides/cli) instalado de forma global si deseas correr la base de datos localmente.

### 2. Clonar e Instalar Dependencias
```bash
git clone https://github.com/RodriEs11/Tukas-FutbolApp.git
cd "Tukas v2"
npm install
```

### 3. Variables de Entorno
Copia el archivo de ejemplo para crear tus variables de entorno locales:
```bash
cp .env.example .env.local
```
Edita `.env.local` e inserta las credenciales de tu proyecto Supabase (las encuentras en Project Settings > API):
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 4. Configurar la Base de Datos (Supabase)

Tienes dos opciones para manejar la base de datos:

**Opción A: Supabase en la Nube (Recomendado para Producción/Pruebas rápidas)**
1. Crea un proyecto en [Supabase](https://database.new/).
2. Ve al SQL Editor y corre los scripts que se encuentran en la carpeta `supabase/migrations/` para generar las tablas y políticas RLS.


**Opción B: Supabase Local (Recomendado para Desarrollo)**
Si tienes Docker y Supabase CLI instalados:
```bash
npx supabase start
```
Esto levantará la base de datos local y aplicará las migraciones automáticamente. Una vez levantado, la consola te imprimirá tu `API URL` y `anon key` locales que deberás poner en tu `.env.local`.

---

## 💻 Compilación y Ejecución

Una vez que tengas las dependencias instaladas y el archivo `.env.local` configurado:

**Levantar el servidor de desarrollo:**
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

**Compilar para Producción:**
```bash
npm run build
```
Esto generará los assets estáticos y las rutas optimizadas en el directorio `.next`.

**Ejecutar la versión de Producción:**
```bash
npm run start
```

---

## 📁 Estructura del Proyecto

- `/src/app`: Rutas principales de Next.js (App Router).
- `/src/components`: Componentes reutilizables de UI y lógica.
- `/src/lib`: Utilidades, helpers y configuración cliente/servidor de Supabase.
- `/supabase/migrations`: Archivos SQL de migraciones de la base de datos.
- `/public`: Assets estáticos e imágenes.

---
*Desarrollado para elevar el nivel del fútbol amateur.* ⚽🏆
