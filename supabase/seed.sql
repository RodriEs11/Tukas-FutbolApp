SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict i2TiyuMZLRhoiEcOnigMoyj7hyWZfSLP2MIOmzYYHUlLQ1LD5rlO1gMTr3LczVc

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'cc5e34f0-f35a-48a7-bfa1-fc87844da0ef', '{"action":"login","actor_id":"11111111-1111-1111-1111-111111111111","actor_username":"admin@tukas.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-08-07 18:19:15.587133+00', ''),
	('00000000-0000-0000-0000-000000000000', '97cae5ff-9352-45e0-8384-dc2f07d7ed3f', '{"action":"login","actor_id":"11111111-1111-1111-1111-111111111111","actor_username":"admin@tukas.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-08-07 18:19:35.564468+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a07c2e7c-4194-48e8-bcba-fc216fb5a36d', '{"action":"login","actor_id":"11111111-1111-1111-1111-111111111111","actor_username":"admin@tukas.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-08-07 18:20:15.83908+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b21e631-b0a0-48f6-abdd-2a279aceead2', '{"action":"login","actor_id":"11111111-1111-1111-1111-111111111111","actor_username":"admin@tukas.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-08-07 18:23:57.45618+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c951ad4-f18d-41f5-9c03-59a2269d775e', '{"action":"logout","actor_id":"11111111-1111-1111-1111-111111111111","actor_username":"admin@tukas.com","actor_via_sso":false,"log_type":"account"}', '2026-08-07 18:24:53.748046+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c6556fc-1341-4563-ba11-bff4c08f3a50', '{"action":"login","actor_id":"11111111-1111-1111-1111-111111111111","actor_username":"admin@tukas.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-08-07 18:27:01.20754+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1fbd78c-effa-4341-a76a-6ddb498eb1ef', '{"action":"login","actor_id":"11111111-1111-1111-1111-111111111111","actor_username":"admin@tukas.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-08-07 18:28:17.990104+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ed57378-b739-42d0-973d-e1ba0dbb99e9', '{"action":"logout","actor_id":"11111111-1111-1111-1111-111111111111","actor_username":"admin@tukas.com","actor_via_sso":false,"log_type":"account"}', '2026-08-07 18:28:30.929386+00', '');


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222221', 'authenticated', 'authenticated', 'jugador1@tukas.com', '$2a$06$6HJyqdpvT4JMwwSzXxwLTOeY8uwSCBMEDahe6EUUYCF48pP9i23KG', '2026-08-07 18:17:25.381589+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"nickname": "Carlitos", "last_name": "Perez", "first_name": "Carlos"}', NULL, '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'jugador2@tukas.com', '$2a$06$AWfABMgGIBzEc5/6QygWneI7Mk6THDGST0kWAV11a2iwitcbrAZ1.', '2026-08-07 18:17:25.381589+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"nickname": "LaPulga", "last_name": "Messi", "first_name": "Lionel"}', NULL, '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222223', 'authenticated', 'authenticated', 'jugador3@tukas.com', '$2a$06$D5PM5qsHC2F8Hwj/zve0.OMcJzp6dZgNA56G971Pj1A/evwlqngH.', '2026-08-07 18:17:25.381589+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"nickname": "Bicho", "last_name": "Ronaldo", "first_name": "Cristiano"}', NULL, '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222224', 'authenticated', 'authenticated', 'jugador4@tukas.com', '$2a$06$YjXJQ.n4M1q.6TL6gH9sO./71y.ZgVniiqU.C.2A7PH1bXbYzh/..', '2026-08-07 18:17:25.381589+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"nickname": "Ney", "last_name": "Jr", "first_name": "Neymar"}', NULL, '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'admin@tukas.com', '$2a$06$Nqk9dffhi1Dj81576fG0seK2lR.86EIRCJaWTadnLYP.Y3wM/IKgm', '2026-08-07 18:17:25.381589+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-08-07 18:28:17.991546+00', '{"provider": "email", "providers": ["email"]}', '{"nickname": "TukasAdmin", "last_name": "Admin", "first_name": "Juan"}', NULL, '2026-08-07 18:17:25.381589+00', '2026-08-07 18:28:17.994086+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_profiles" ("id", "first_name", "last_name", "nickname", "role", "avatar_url", "created_at", "updated_at") VALUES
	('22222222-2222-2222-2222-222222222221', 'Carlos', 'Perez', 'Carlitos', 'player', '', '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00'),
	('22222222-2222-2222-2222-222222222222', 'Lionel', 'Messi', 'LaPulga', 'player', '', '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00'),
	('22222222-2222-2222-2222-222222222223', 'Cristiano', 'Ronaldo', 'Bicho', 'player', '', '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00'),
	('22222222-2222-2222-2222-222222222224', 'Neymar', 'Jr', 'Ney', 'player', '', '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00'),
	('11111111-1111-1111-1111-111111111111', 'Juan', 'Admin', 'TukasAdmin', 'admin', '', '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00');


--
-- Data for Name: fields; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."fields" ("id", "name", "location", "surface_type", "description", "is_active", "created_by", "created_at", "updated_at") VALUES
	('33333333-3333-3333-3333-333333333331', 'Cancha Central', 'Polideportivo Norte', 'sintético', 'Cancha principal de césped sintético para 11 vs 11.', true, '11111111-1111-1111-1111-111111111111', '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00'),
	('33333333-3333-3333-3333-333333333332', 'Cancha Rápida', 'Club del Sur', 'cemento', 'Cancha de fútbol sala (5 vs 5).', true, '11111111-1111-1111-1111-111111111111', '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00'),
	('33333333-3333-3333-3333-333333333333', 'La Olla', 'Barrio Oeste', 'tierra', 'Cancha de barrio para torneos relámpago.', true, '11111111-1111-1111-1111-111111111111', '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00');


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."matches" ("id", "field_id", "match_date", "status", "score_team_a", "score_team_b", "notes", "created_by", "created_at", "updated_at") VALUES
	('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', '2026-08-09 18:17:25.381589+00', 'scheduled', 0, 0, 'Partido de liga - Jornada 10.', '11111111-1111-1111-1111-111111111111', '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00'),
	('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333332', '2026-08-04 18:17:25.381589+00', 'played', 5, 3, 'Amistoso súper competitivo.', '11111111-1111-1111-1111-111111111111', '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00'),
	('44444444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333333', '2026-08-06 18:17:25.381589+00', 'cancelled', 0, 0, 'Suspendido por lluvia.', '11111111-1111-1111-1111-111111111111', '2026-08-07 18:17:25.381589+00', '2026-08-07 18:17:25.381589+00');


--
-- Data for Name: match_players; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."match_players" ("id", "match_id", "player_id", "team", "goals", "attended", "created_at") VALUES
	('bec3312c-a67a-4d23-811f-88cdb38acc4b', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222221', 'A', 0, true, '2026-08-07 18:17:25.381589+00'),
	('362e294c-8031-40a2-878c-577bd30a71c2', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'A', 0, true, '2026-08-07 18:17:25.381589+00'),
	('edc893b7-64b9-4ce2-b741-6ff3708346ea', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222223', 'B', 0, true, '2026-08-07 18:17:25.381589+00'),
	('acc397b2-7383-4e81-b543-f437356f611e', '44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222222', 'A', 3, true, '2026-08-07 18:17:25.381589+00'),
	('b4118018-9e4a-43c7-a8af-7c4e7408b7ee', '44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222224', 'A', 2, true, '2026-08-07 18:17:25.381589+00'),
	('6a1c37ae-3b5a-4c5d-84c2-2e2a5ac6b83f', '44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222223', 'B', 3, true, '2026-08-07 18:17:25.381589+00'),
	('1111406c-4d93-4642-ae06-5cd023e62914', '44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222221', 'B', 0, false, '2026-08-07 18:17:25.381589+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 6, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict i2TiyuMZLRhoiEcOnigMoyj7hyWZfSLP2MIOmzYYHUlLQ1LD5rlO1gMTr3LczVc

RESET ALL;
