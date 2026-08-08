-- ============================================
-- Seed data for E2E tests
-- Run with: supabase db reset (applies seed.sql automatically)
-- Or manually: psql -f supabase/seed.test.sql
-- ============================================

-- Create test admin user
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, aud, role)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '00000000-0000-0000-0000-000000000000',
  'admin@tukas-test.com',
  crypt('TestAdmin123!', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Admin", "last_name": "Tukas"}',
  NOW(),
  NOW(),
  '',
  'authenticated',
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  json_build_object('sub', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'email', 'admin@tukas-test.com'),
  'email',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- The trigger should auto-create the profile, but let's ensure admin role
UPDATE public.user_profiles
SET role = 'admin', first_name = 'Admin', last_name = 'Tukas', nickname = 'TestAdmin'
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Create test player user
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, aud, role)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  '00000000-0000-0000-0000-000000000000',
  'player@tukas-test.com',
  crypt('TestPlayer123!', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Jugador", "last_name": "Test"}',
  NOW(),
  NOW(),
  '',
  'authenticated',
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  json_build_object('sub', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'email', 'player@tukas-test.com'),
  'email',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

UPDATE public.user_profiles
SET role = 'player', first_name = 'Jugador', last_name = 'Test', nickname = 'TestPlayer'
WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

-- Create a test field
INSERT INTO public.fields (id, name, location, surface_type, description, is_active, created_by)
VALUES (
  'f1e2d3c4-b5a6-7890-fedc-ba0987654321',
  'Cancha Test',
  'Buenos Aires Test',
  'césped',
  'Cancha de prueba para E2E',
  true,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
)
ON CONFLICT (id) DO NOTHING;

-- Create additional test players (no auth users, just profiles for testing match assignment)
INSERT INTO public.user_profiles (id, first_name, last_name, nickname, role, avatar_url)
VALUES
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Mario', 'Gómez', 'El Tanque', 'player', ''),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Lucas', 'Fernández', 'Luquitas', 'player', ''),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Diego', 'López', '', 'player', ''),
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'Matías', 'Rodríguez', 'Mati', 'player', '')
ON CONFLICT (id) DO NOTHING;
