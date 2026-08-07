-- seed.sql: Script para generar datos de prueba en la base de datos de Tukas-FutbolApp
-- Este script inserta usuarios (administradores y jugadores), canchas, partidos y asocia jugadores a los partidos.
-- Puedes correr este script en el SQL Editor de Supabase.

-- ==============================================================================
-- 1. CREACIÓN DE USUARIOS (auth.users)
-- ==============================================================================
-- Al insertar en auth.users, el trigger 'on_auth_user_created' creará automáticamente 
-- los registros correspondientes en 'public.user_profiles'.

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
-- Administrador
(
  '11111111-1111-1111-1111-111111111111', 
  '00000000-0000-0000-0000-000000000000', 
  'authenticated', 
  'authenticated', 
  'admin@tukas.com', 
  crypt('password123', gen_salt('bf')), 
  NOW(), 
  '{"provider":"email","providers":["email"]}', 
  '{"first_name": "Juan", "last_name": "Admin", "nickname": "TukasAdmin"}', 
  NOW(), 
  NOW(),
  '', '', '', ''
),
-- Jugador 1
(
  '22222222-2222-2222-2222-222222222221', 
  '00000000-0000-0000-0000-000000000000', 
  'authenticated', 
  'authenticated', 
  'jugador1@tukas.com', 
  crypt('password123', gen_salt('bf')), 
  NOW(), 
  '{"provider":"email","providers":["email"]}', 
  '{"first_name": "Carlos", "last_name": "Perez", "nickname": "Carlitos"}', 
  NOW(), 
  NOW(),
  '', '', '', ''
),
-- Jugador 2
(
  '22222222-2222-2222-2222-222222222222', 
  '00000000-0000-0000-0000-000000000000', 
  'authenticated', 
  'authenticated', 
  'jugador2@tukas.com', 
  crypt('password123', gen_salt('bf')), 
  NOW(), 
  '{"provider":"email","providers":["email"]}', 
  '{"first_name": "Lionel", "last_name": "Messi", "nickname": "LaPulga"}', 
  NOW(), 
  NOW(),
  '', '', '', ''
),
-- Jugador 3
(
  '22222222-2222-2222-2222-222222222223', 
  '00000000-0000-0000-0000-000000000000', 
  'authenticated', 
  'authenticated', 
  'jugador3@tukas.com', 
  crypt('password123', gen_salt('bf')), 
  NOW(), 
  '{"provider":"email","providers":["email"]}', 
  '{"first_name": "Cristiano", "last_name": "Ronaldo", "nickname": "Bicho"}', 
  NOW(), 
  NOW(),
  '', '', '', ''
),
-- Jugador 4
(
  '22222222-2222-2222-2222-222222222224', 
  '00000000-0000-0000-0000-000000000000', 
  'authenticated', 
  'authenticated', 
  'jugador4@tukas.com', 
  crypt('password123', gen_salt('bf')), 
  NOW(), 
  '{"provider":"email","providers":["email"]}', 
  '{"first_name": "Neymar", "last_name": "Jr", "nickname": "Ney"}', 
  NOW(), 
  NOW(),
  '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 2. ASIGNACIÓN DE ROLES EN user_profiles
-- ==============================================================================
-- El trigger ya creó los perfiles, ahora actualizamos el rol del administrador.

UPDATE public.user_profiles
SET role = 'admin'
WHERE id = '11111111-1111-1111-1111-111111111111';

-- ==============================================================================
-- 3. CREACIÓN DE CANCHAS (fields)
-- ==============================================================================

INSERT INTO public.fields (
  id,
  name,
  location,
  surface_type,
  description,
  is_active,
  created_by
) VALUES 
(
  '33333333-3333-3333-3333-333333333331',
  'Cancha Central',
  'Polideportivo Norte',
  'sintético',
  'Cancha principal de césped sintético para 11 vs 11.',
  true,
  '11111111-1111-1111-1111-111111111111'
),
(
  '33333333-3333-3333-3333-333333333332',
  'Cancha Rápida',
  'Club del Sur',
  'cemento',
  'Cancha de fútbol sala (5 vs 5).',
  true,
  '11111111-1111-1111-1111-111111111111'
),
(
  '33333333-3333-3333-3333-333333333333',
  'La Olla',
  'Barrio Oeste',
  'tierra',
  'Cancha de barrio para torneos relámpago.',
  true,
  '11111111-1111-1111-1111-111111111111'
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 4. CREACIÓN DE PARTIDOS (matches)
-- ==============================================================================

INSERT INTO public.matches (
  id,
  field_id,
  match_date,
  status,
  score_team_a,
  score_team_b,
  notes,
  created_by
) VALUES 
-- Partido Programado (Futuro)
(
  '44444444-4444-4444-4444-444444444441',
  '33333333-3333-3333-3333-333333333331',
  (NOW() + interval '2 days'),
  'scheduled',
  0,
  0,
  'Partido de liga - Jornada 10.',
  '11111111-1111-1111-1111-111111111111'
),
-- Partido Jugado (Pasado)
(
  '44444444-4444-4444-4444-444444444442',
  '33333333-3333-3333-3333-333333333332',
  (NOW() - interval '3 days'),
  'played',
  5,
  3,
  'Amistoso súper competitivo.',
  '11111111-1111-1111-1111-111111111111'
),
-- Partido Cancelado
(
  '44444444-4444-4444-4444-444444444443',
  '33333333-3333-3333-3333-333333333333',
  (NOW() - interval '1 days'),
  'cancelled',
  0,
  0,
  'Suspendido por lluvia.',
  '11111111-1111-1111-1111-111111111111'
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 5. ASIGNACIÓN DE JUGADORES A PARTIDOS (match_players)
-- ==============================================================================

INSERT INTO public.match_players (
  id,
  match_id,
  player_id,
  team,
  goals,
  attended
) VALUES 
-- Jugadores en el Partido 1 (Programado)
(
  gen_random_uuid(),
  '44444444-4444-4444-4444-444444444441',
  '22222222-2222-2222-2222-222222222221', -- Carlitos
  'A',
  0,
  true
),
(
  gen_random_uuid(),
  '44444444-4444-4444-4444-444444444441',
  '22222222-2222-2222-2222-222222222222', -- Messi
  'A',
  0,
  true
),
(
  gen_random_uuid(),
  '44444444-4444-4444-4444-444444444441',
  '22222222-2222-2222-2222-222222222223', -- Cristiano
  'B',
  0,
  true
),

-- Jugadores en el Partido 2 (Jugado - Resultado 5 a 3)
(
  gen_random_uuid(),
  '44444444-4444-4444-4444-444444444442',
  '22222222-2222-2222-2222-222222222222', -- Messi
  'A',
  3,
  true
),
(
  gen_random_uuid(),
  '44444444-4444-4444-4444-444444444442',
  '22222222-2222-2222-2222-222222222224', -- Neymar
  'A',
  2,
  true
),
(
  gen_random_uuid(),
  '44444444-4444-4444-4444-444444444442',
  '22222222-2222-2222-2222-222222222223', -- Cristiano
  'B',
  3,
  true
),
(
  gen_random_uuid(),
  '44444444-4444-4444-4444-444444444442',
  '22222222-2222-2222-2222-222222222221', -- Carlitos (No asistió)
  'B',
  0,
  false
)
ON CONFLICT DO NOTHING;
