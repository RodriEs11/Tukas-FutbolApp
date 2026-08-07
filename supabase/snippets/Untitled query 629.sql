-- ==========================================
-- 1. CREAR USUARIOS (auth.users)
-- ==========================================
-- Se utiliza pgcrypto para encriptar la contraseña (password123 para todos)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
-- 2 ADMINS
('a0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'admin1@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Admin", "last_name": "Principal", "nickname": "Master"}'),
('a0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'admin2@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Admin", "last_name": "Secundario", "nickname": "SubMaster"}'),
-- 13 PLAYERS
('b0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'player1@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Juan", "last_name": "Perez", "nickname": "Juampi"}'),
('b0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'player2@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Carlos", "last_name": "Gomez", "nickname": "Charly"}'),
('b0000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'player3@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Miguel", "last_name": "Rodriguez", "nickname": "Migue"}'),
('b0000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'player4@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Luis", "last_name": "Fernandez", "nickname": "Lucho"}'),
('b0000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'player5@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Pedro", "last_name": "Lopez", "nickname": "Peter"}'),
('b0000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated', 'player6@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Jorge", "last_name": "Martinez", "nickname": "Jorgito"}'),
('b0000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated', 'player7@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Raul", "last_name": "Garcia", "nickname": "Rulo"}'),
('b0000000-0000-0000-0000-000000000008', 'authenticated', 'authenticated', 'player8@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Diego", "last_name": "Sanchez", "nickname": "Diegote"}'),
('b0000000-0000-0000-0000-000000000009', 'authenticated', 'authenticated', 'player9@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Matias", "last_name": "Diaz", "nickname": "Mati"}'),
('b0000000-0000-0000-0000-000000000010', 'authenticated', 'authenticated', 'player10@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Franco", "last_name": "Romero", "nickname": "Fran"}'),
('b0000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated', 'player11@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Nico", "last_name": "Suarez", "nickname": "Nico"}'),
('b0000000-0000-0000-0000-000000000012', 'authenticated', 'authenticated', 'player12@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Tomas", "last_name": "Alvarez", "nickname": "Tomi"}'),
('b0000000-0000-0000-0000-000000000013', 'authenticated', 'authenticated', 'player13@tukas.com', crypt('password123', gen_salt('bf')), now(), '{"first_name": "Lucas", "last_name": "Ruiz", "nickname": "Luquitas"}');

-- ==========================================
-- 2. ASCENDER A LOS 2 PRIMEROS A "ADMIN"
-- ==========================================
-- El trigger ya los creó en public.user_profiles, ahora actualizamos su rol.
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE id IN ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002');

-- ==========================================
-- 3. CREAR 5 CANCHAS DE PRUEBA (fields)
-- ==========================================
INSERT INTO public.fields (id, name, location, surface_type, description, is_active, created_by)
VALUES 
('c0000000-0000-0000-0000-000000000001', 'Cancha Central', 'Sede Norte', 'sintético', 'Cancha principal de césped sintético 5v5', true, 'a0000000-0000-0000-0000-000000000001'),
('c0000000-0000-0000-0000-000000000002', 'Cancha 2', 'Sede Norte', 'césped', 'Cancha de césped natural al aire libre', true, 'a0000000-0000-0000-0000-000000000001'),
('c0000000-0000-0000-0000-000000000003', 'Cancha Sur', 'Sede Sur', 'cemento', 'Cancha de futsal cemento', true, 'a0000000-0000-0000-0000-000000000002'),
('c0000000-0000-0000-0000-000000000004', 'El Potrero', 'Sede Este', 'tierra', 'Cancha rústica de tierra 7v7', true, 'a0000000-0000-0000-0000-000000000002'),
('c0000000-0000-0000-0000-000000000005', 'Cancha Techada', 'Sede Central', 'sintético', 'Cancha cubierta sintética', true, 'a0000000-0000-0000-0000-000000000001');

-- ==========================================
-- 4. CREAR 6 PARTIDOS (matches)
-- ==========================================
INSERT INTO public.matches (id, field_id, match_date, status, score_team_a, score_team_b, notes, created_by)
VALUES
-- Partidos Futuros (scheduled)
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', now() + interval '2 days', 'scheduled', 0, 0, 'Amistoso del fin de semana', 'a0000000-0000-0000-0000-000000000001'),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', now() + interval '5 days', 'scheduled', 0, 0, 'Torneo relámpago', 'b0000000-0000-0000-0000-000000000001'),

-- Partidos Jugados (played)
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', now() - interval '10 days', 'played', 5, 3, 'Gran partido de la semana pasada', 'b0000000-0000-0000-0000-000000000002'),
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', now() - interval '3 days', 'played', 2, 2, 'Empate muy trabado', 'b0000000-0000-0000-0000-000000000003'),
('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', now() - interval '1 month', 'played', 10, 1, 'Goleada histórica', 'a0000000-0000-0000-0000-000000000002'),

-- Partido Cancelado (cancelled)
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', now() - interval '1 day', 'cancelled', 0, 0, 'Suspendido por lluvia', 'a0000000-0000-0000-0000-000000000001');

-- ==========================================
-- 5. ASIGNAR JUGADORES A PARTIDOS (match_players)
-- ==========================================
INSERT INTO public.match_players (match_id, player_id, team, goals, attended)
VALUES
-- Jugadores para el Partido 1 (Programado)
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'A', 0, true),
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'A', 0, true),
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'B', 0, true),
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'B', 0, true),

-- Jugadores para el Partido 3 (Jugado, resultado 5-3)
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000005', 'A', 3, true),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000006', 'A', 2, true),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000007', 'B', 1, true),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000008', 'B', 2, true),

-- Jugadores para el Partido 4 (Jugado, empate 2-2)
('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000009', 'A', 2, true),
('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000010', 'B', 2, true),
('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000011', 'B', 0, true), -- Jugó pero no hizo gol
('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000012', 'A', 0, false); -- Faltó