SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict 3DJ3QDJSaLxFZNkGILMFBvZsrhhutHmL606l4ehmaY3VRH9JBHO4begbhRuffki

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
	('00000000-0000-0000-0000-000000000000', 'e0b890c1-ab15-4d96-8307-e3d864ea43c9', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"admin@admin.com","user_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","user_phone":""}}', '2026-08-08 15:52:47.898751+00', ''),
	('00000000-0000-0000-0000-000000000000', '9744852d-32f3-4cb6-9a61-c0ee686d8570', '{"action":"login","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-08-08 15:52:56.682941+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c544c33a-1407-4e56-9833-1e544cac3526', '{"action":"token_refreshed","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-08 16:51:06.381943+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c295e72-83fb-4811-bf53-e66129a3d6ee', '{"action":"token_revoked","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-08 16:51:06.393236+00', ''),
	('00000000-0000-0000-0000-000000000000', '177f4218-0683-4a4f-abb3-e5975c8d1e18', '{"action":"token_refreshed","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-08 17:49:21.802219+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0040716-5e71-4c8b-873e-64bd6dc8369f', '{"action":"token_revoked","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-08 17:49:21.804551+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d7f26df-1d3b-4983-90fa-becb74509767', '{"action":"token_refreshed","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-08 18:47:52.235719+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f7468e3-d43d-495a-ae50-c89f426f4e60', '{"action":"token_revoked","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-08 18:47:52.237132+00', ''),
	('00000000-0000-0000-0000-000000000000', '941b2f33-9046-4422-a122-c7dd5450afca', '{"action":"token_refreshed","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-08 19:46:13.67289+00', ''),
	('00000000-0000-0000-0000-000000000000', '831dab4c-893e-4a31-a488-022d12bd07a2', '{"action":"token_revoked","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-08 19:46:13.675347+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a572cec0-242a-4369-9a33-f0d5575dbd64', '{"action":"token_refreshed","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-08 20:54:12.356363+00', ''),
	('00000000-0000-0000-0000-000000000000', '5fc4fcf9-fb24-44f7-9319-3a27bce81978', '{"action":"token_revoked","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-08 20:54:12.35871+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c9dee95-c120-467d-94a7-ac2a4946c238', '{"action":"token_refreshed","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-11 02:55:11.73981+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f05750d-60f2-44d0-b17a-281037fe1737', '{"action":"token_revoked","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-11 02:55:11.741437+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d4a6d74-8597-483e-b367-4bc5806ff1e2', '{"action":"login","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-08-11 03:01:31.366749+00', ''),
	('00000000-0000-0000-0000-000000000000', '00030646-4b26-4ecc-8963-5eb839c69e8b', '{"action":"logout","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"account"}', '2026-08-11 03:01:35.008586+00', ''),
	('00000000-0000-0000-0000-000000000000', '186b420b-652f-4cb5-98e0-7d4ab95dd44f', '{"action":"login","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-08-11 03:01:50.103338+00', ''),
	('00000000-0000-0000-0000-000000000000', '1724bbe0-5d5f-4d0f-9f62-328553853634', '{"action":"logout","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"account"}', '2026-08-11 03:01:53.098726+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a675d656-dfe2-46c1-9696-d038b374016a', '{"action":"login","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-08-11 03:02:05.429096+00', ''),
	('00000000-0000-0000-0000-000000000000', '3cd4aac7-6bc5-43f1-9513-0a18853ac0a7', '{"action":"logout","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"account"}', '2026-08-11 03:02:09.710084+00', ''),
	('00000000-0000-0000-0000-000000000000', '692c670e-0afc-4f2e-a011-1414018d8aaf', '{"action":"login","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-08-11 03:02:32.064196+00', ''),
	('00000000-0000-0000-0000-000000000000', '7926fa63-d432-499a-94b2-ce26ecb23ac4', '{"action":"login","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-08-11 03:28:21.719866+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9f29662-de8f-40e8-9fc3-f203fd14cc3e', '{"action":"token_refreshed","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-11 04:00:47.533637+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b7055088-79f3-469f-92ba-1a4822729e29', '{"action":"token_revoked","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-11 04:00:47.543362+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5f18c5d-5b67-4665-84ef-3b9968e761f7', '{"action":"token_refreshed","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-11 04:34:22.107378+00', ''),
	('00000000-0000-0000-0000-000000000000', '150f2a87-01f0-45ee-8fc4-bfc6bae08ba3', '{"action":"token_revoked","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-11 04:34:22.108457+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ae6f6df-7ff6-43e9-922d-b485722ba582', '{"action":"token_refreshed","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-11 04:59:16.096099+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ce0e9603-687e-473d-ac12-4f8d6e0a4991', '{"action":"token_revoked","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-11 04:59:16.097075+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd586b4f3-f8c9-4fba-ae9f-319bf83f67bd', '{"action":"token_refreshed","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-11 05:32:25.993834+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1ae9a52-bb2b-4fe2-b426-5c9d10ae45ae', '{"action":"token_revoked","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-11 05:32:25.995382+00', ''),
	('00000000-0000-0000-0000-000000000000', '7370dd6d-6217-4e51-8cf7-895f17ca6f25', '{"action":"token_refreshed","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-11 05:57:43.187096+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c65c9258-4d2c-4e72-a72b-ba6e4c445a38', '{"action":"token_revoked","actor_id":"bb65e7f8-56f5-40d9-b086-fb68d19102eb","actor_username":"admin@admin.com","actor_via_sso":false,"log_type":"token"}', '2026-08-11 05:57:43.188043+00', '');


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
	('00000000-0000-0000-0000-000000000000', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'authenticated', 'authenticated', 'admin@tukas-test.com', '$2a$06$dxYbd9BNtWWkotmbzi.uHOy7SeAp6VYHIJrnIOBLsrBoNrmfV2BNu', '2026-08-08 15:51:37.89401+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"last_name": "Tukas", "first_name": "Admin"}', NULL, '2026-08-08 15:51:37.89401+00', '2026-08-08 15:51:37.89401+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'authenticated', 'authenticated', 'player@tukas-test.com', '$2a$06$GyLWMPFxIs1kTiCHVh6RnuIgYL5xcH5eTiMSllSecqToXBAXwc0Ia', '2026-08-08 15:51:37.89401+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"last_name": "Test", "first_name": "Jugador"}', NULL, '2026-08-08 15:51:37.89401+00', '2026-08-08 15:51:37.89401+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', 'authenticated', 'authenticated', 'admin@admin.com', '$2a$10$3LYHXU8CrFUReyqZ01RSa.tkhmyT4YQcKIybrWHqyOssBjIWsvKvu', '2026-08-08 15:52:47.900119+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-08-11 03:28:21.720821+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-08-08 15:52:47.895116+00', '2026-08-11 05:57:43.190981+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '{"sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "email": "admin@tukas-test.com"}', 'email', '2026-08-08 15:51:37.89401+00', '2026-08-08 15:51:37.89401+00', '2026-08-08 15:51:37.89401+00', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
	('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', '{"sub": "b2c3d4e5-f6a7-8901-bcde-f12345678901", "email": "player@tukas-test.com"}', 'email', '2026-08-08 15:51:37.89401+00', '2026-08-08 15:51:37.89401+00', '2026-08-08 15:51:37.89401+00', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'),
	('bb65e7f8-56f5-40d9-b086-fb68d19102eb', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '{"sub": "bb65e7f8-56f5-40d9-b086-fb68d19102eb", "email": "admin@admin.com", "email_verified": false, "phone_verified": false}', 'email', '2026-08-08 15:52:47.897788+00', '2026-08-08 15:52:47.897808+00', '2026-08-08 15:52:47.897808+00', '60bd8001-8c62-4f02-bb4d-2a0607e13390');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('9248ab58-0803-4ad8-b5e3-d7f46ea2f2b6', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '2026-08-11 03:28:21.720931+00', '2026-08-11 05:32:26.000204+00', NULL, 'aal1', NULL, '2026-08-11 05:32:26.000167', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '172.19.0.1', NULL, NULL, NULL, NULL, NULL),
	('c6c739dc-fef2-4f11-b705-c8fa35dfa417', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '2026-08-11 03:02:32.065503+00', '2026-08-11 05:57:43.192477+00', NULL, 'aal1', NULL, '2026-08-11 05:57:43.192425', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', '172.19.0.1', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('c6c739dc-fef2-4f11-b705-c8fa35dfa417', '2026-08-11 03:02:32.068742+00', '2026-08-11 03:02:32.068742+00', 'password', '7378c511-67ad-4157-9244-3f9fb990e230'),
	('9248ab58-0803-4ad8-b5e3-d7f46ea2f2b6', '2026-08-11 03:28:21.723774+00', '2026-08-11 03:28:21.723774+00', 'password', '12dd66e3-4fa6-4fca-9765-5f01249bad86');


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

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 11, '4nmggksiukee', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', true, '2026-08-11 03:02:32.067023+00', '2026-08-11 04:00:47.543947+00', NULL, 'c6c739dc-fef2-4f11-b705-c8fa35dfa417'),
	('00000000-0000-0000-0000-000000000000', 12, 'po2kd6iod2nc', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', true, '2026-08-11 03:28:21.722264+00', '2026-08-11 04:34:22.109019+00', NULL, '9248ab58-0803-4ad8-b5e3-d7f46ea2f2b6'),
	('00000000-0000-0000-0000-000000000000', 13, 'lzjfn6i4va2m', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', true, '2026-08-11 04:00:47.544918+00', '2026-08-11 04:59:16.097785+00', '4nmggksiukee', 'c6c739dc-fef2-4f11-b705-c8fa35dfa417'),
	('00000000-0000-0000-0000-000000000000', 14, '5l4n2yyyvwt5', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', true, '2026-08-11 04:34:22.109923+00', '2026-08-11 05:32:25.996182+00', 'po2kd6iod2nc', '9248ab58-0803-4ad8-b5e3-d7f46ea2f2b6'),
	('00000000-0000-0000-0000-000000000000', 16, 'gzd4qe77btzd', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', false, '2026-08-11 05:32:25.997021+00', '2026-08-11 05:32:25.997021+00', '5l4n2yyyvwt5', '9248ab58-0803-4ad8-b5e3-d7f46ea2f2b6'),
	('00000000-0000-0000-0000-000000000000', 15, 'oijbdahuzqlg', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', true, '2026-08-11 04:59:16.098437+00', '2026-08-11 05:57:43.18868+00', 'lzjfn6i4va2m', 'c6c739dc-fef2-4f11-b705-c8fa35dfa417'),
	('00000000-0000-0000-0000-000000000000', 17, '2q7yot74ivsk', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', false, '2026-08-11 05:57:43.18969+00', '2026-08-11 05:57:43.18969+00', 'oijbdahuzqlg', 'c6c739dc-fef2-4f11-b705-c8fa35dfa417');


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

INSERT INTO "public"."user_profiles" ("id", "first_name", "last_name", "nickname", "role", "avatar_url", "created_at", "updated_at", "preferred_foot", "position", "is_active") VALUES
	('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Jugador', 'Test', 'TestPlayer', 'player', '', '2026-08-08 15:51:37.89401+00', '2026-08-08 15:51:37.89401+00', NULL, NULL, true),
	('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Mario', 'Gómez', 'El Tanque', 'player', '', '2026-08-08 15:51:37.89401+00', '2026-08-08 15:51:37.89401+00', NULL, NULL, true),
	('e5f6a7b8-c9d0-1234-efab-345678901234', 'Diego', 'López', '', 'player', '', '2026-08-08 15:51:37.89401+00', '2026-08-08 15:51:37.89401+00', NULL, NULL, true),
	('bb65e7f8-56f5-40d9-b086-fb68d19102eb', '', '', '', 'admin', '', '2026-08-08 15:52:47.894879+00', '2026-08-08 16:21:21.055394+00', NULL, NULL, true),
	('d4e5f6a7-b8c9-0123-defa-234567890123', 'Lucas', 'Fernández', 'Luquitas', 'player', '', '2026-08-08 15:51:37.89401+00', '2026-08-11 03:47:38.960783+00', NULL, NULL, true),
	('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Admin', 'Tukas', 'TestAdmin', 'admin', '', '2026-08-08 15:51:37.89401+00', '2026-08-11 03:48:05.642126+00', NULL, NULL, true),
	('6055845c-2c4b-4c22-bba5-f0c0cd5e9115', 'Martin', 'Garrix', '', 'player', 'http://192.168.100.174:54321/storage/v1/object/public/avatars/6055845c-2c4b-4c22-bba5-f0c0cd5e9115-1786420159543.jpg', '2026-08-11 03:48:28.173001+00', '2026-08-11 03:49:26.13172+00', 'Ambas', 'Mediocampista', false),
	('f6a7b8c9-d0e1-2345-fabc-456789012345', 'Matías', 'Rodríguez', 'Mati', 'player', 'http://192.168.100.174:54321/storage/v1/object/public/avatars/f6a7b8c9-d0e1-2345-fabc-456789012345-1786420190331.jpg', '2026-08-08 15:51:37.89401+00', '2026-08-11 03:49:50.36536+00', NULL, NULL, true),
	('417ed23d-48bf-4fe6-9595-30d202118edb', 'prueba', 'aaaaaaaaaaaa', 'asdasdasd', 'player', '', '2026-08-08 15:53:32.24226+00', '2026-08-11 04:17:45.548002+00', 'Ambas', 'Delantero', true),
	('8e8a6586-6d86-434d-8401-04e69435dda4', '1111', 'ssssd', '', 'player', '', '2026-08-11 05:14:41.049119+00', '2026-08-11 05:14:41.049119+00', 'Ambas', 'Mediocampista', true),
	('ee5178bc-7632-4597-a9e3-449a270d7e5a', 'Cristiano', 'Espindola', 'TestAdmin', 'player', '', '2026-08-11 05:14:50.675266+00', '2026-08-11 05:14:50.675266+00', 'Ambas', 'Delantero', true),
	('4924ec87-d529-4dd4-980e-c3abe852beea', 'prueba', 'Tukas', '', 'player', 'http://192.168.100.174:54321/storage/v1/object/public/avatars/4924ec87-d529-4dd4-980e-c3abe852beea-1786425302169.jpg', '2026-08-11 05:15:02.167572+00', '2026-08-11 05:15:02.235827+00', 'Ambas', 'Arquero', true);


--
-- Data for Name: fields; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."fields" ("id", "name", "location", "surface_type", "description", "is_active", "created_by", "created_at", "updated_at") VALUES
	('f1e2d3c4-b5a6-7890-fedc-ba0987654321', 'Cancha Test', 'Buenos Aires Test', 'césped', 'Cancha de prueba para E2E', true, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2026-08-08 15:51:37.89401+00', '2026-08-08 15:51:37.89401+00');


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."matches" ("id", "field_id", "match_date", "status", "score_team_a", "score_team_b", "notes", "created_by", "created_at", "updated_at") VALUES
	('efb5a74d-ba4a-41f2-ac0c-8e26c39e816f', 'f1e2d3c4-b5a6-7890-fedc-ba0987654321', '2026-08-04 18:00:00+00', 'played', 3, 3, '', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '2026-08-08 15:54:26.021846+00', '2026-08-11 03:05:10.326114+00'),
	('8385837e-013f-4752-8458-9547df227980', 'f1e2d3c4-b5a6-7890-fedc-ba0987654321', '2026-08-21 01:00:00+00', 'played', 5, 0, '', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '2026-08-08 20:15:32.046536+00', '2026-08-11 03:52:20.328316+00'),
	('c3181adb-6456-45b0-abc7-c2b8091a68eb', 'f1e2d3c4-b5a6-7890-fedc-ba0987654321', '2026-08-21 00:00:00+00', 'played', 4, 0, '', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '2026-08-11 03:52:08.465311+00', '2026-08-11 03:52:39.045134+00'),
	('b53336bc-6d26-4214-bc83-8d84df0a42af', 'f1e2d3c4-b5a6-7890-fedc-ba0987654321', '2026-09-06 18:30:00+00', 'played', 4, 0, '', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '2026-08-11 03:52:46.10128+00', '2026-08-11 03:52:55.3991+00'),
	('2b75b6ed-bf8a-4f6d-8deb-450bdf749a7c', 'f1e2d3c4-b5a6-7890-fedc-ba0987654321', '2026-08-13 00:00:00+00', 'played', 0, 0, '', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '2026-08-11 04:55:56.681507+00', '2026-08-11 05:17:25.457997+00'),
	('61191967-2250-4360-bd0a-c1ba9adebd88', 'f1e2d3c4-b5a6-7890-fedc-ba0987654321', '2026-08-22 18:00:00+00', 'played', 1, 0, '', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '2026-08-11 05:17:32.214002+00', '2026-08-11 05:33:44.099601+00'),
	('11c50734-4a76-4d9f-9ca6-2648da9f7c4f', 'f1e2d3c4-b5a6-7890-fedc-ba0987654321', '2026-10-17 00:00:00+00', 'scheduled', 0, 0, '', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '2026-08-11 05:36:55.663083+00', '2026-08-11 06:02:42.565724+00');


--
-- Data for Name: match_players; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."match_players" ("id", "match_id", "player_id", "team", "goals", "attended", "created_at", "pitch_position") VALUES
	('3255e042-817f-4a84-aec9-42bc2ff63bba', 'efb5a74d-ba4a-41f2-ac0c-8e26c39e816f', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'A', 1, true, '2026-08-11 03:05:00.690852+00', NULL),
	('21a4b847-b916-4a8d-bc83-6ae412ab6ac4', 'efb5a74d-ba4a-41f2-ac0c-8e26c39e816f', 'd4e5f6a7-b8c9-0123-defa-234567890123', 'A', 1, true, '2026-08-11 03:05:00.690852+00', NULL),
	('87fbae9c-0801-4e60-a8a2-51cf6a808621', 'efb5a74d-ba4a-41f2-ac0c-8e26c39e816f', 'e5f6a7b8-c9d0-1234-efab-345678901234', 'A', 1, true, '2026-08-11 03:05:00.690852+00', NULL),
	('6af6b27c-939a-452d-a0d0-e0d4bb3040f3', 'efb5a74d-ba4a-41f2-ac0c-8e26c39e816f', '417ed23d-48bf-4fe6-9595-30d202118edb', 'B', 1, true, '2026-08-11 03:05:06.216917+00', NULL),
	('d665efbe-2acf-4fc0-8b3f-bce563363de0', 'efb5a74d-ba4a-41f2-ac0c-8e26c39e816f', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'B', 1, true, '2026-08-11 03:05:06.216917+00', NULL),
	('038b409c-3f89-46f5-ac1c-d75ba48083dc', 'efb5a74d-ba4a-41f2-ac0c-8e26c39e816f', 'f6a7b8c9-d0e1-2345-fabc-456789012345', 'B', 1, true, '2026-08-11 03:05:06.216917+00', NULL),
	('6e3c5564-61d0-4e13-abf2-2b19c12fd647', '8385837e-013f-4752-8458-9547df227980', 'f6a7b8c9-d0e1-2345-fabc-456789012345', 'B', 0, true, '2026-08-11 03:52:16.144951+00', NULL),
	('119b39d5-0761-405d-a940-199ae6224e1a', '8385837e-013f-4752-8458-9547df227980', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'B', 0, true, '2026-08-11 03:52:16.144951+00', NULL),
	('1b4e485a-6934-4bc0-8d3b-827e00d701d3', '8385837e-013f-4752-8458-9547df227980', 'e5f6a7b8-c9d0-1234-efab-345678901234', 'A', 5, true, '2026-08-11 03:52:14.109958+00', NULL),
	('6d78cf7b-e5a6-408a-9b35-30f2feb4707a', 'c3181adb-6456-45b0-abc7-c2b8091a68eb', 'd4e5f6a7-b8c9-0123-defa-234567890123', 'B', 0, true, '2026-08-11 03:52:36.259263+00', NULL),
	('02590303-f643-4f5f-9699-b3ff151e3ea9', 'c3181adb-6456-45b0-abc7-c2b8091a68eb', 'e5f6a7b8-c9d0-1234-efab-345678901234', 'A', 4, true, '2026-08-11 03:52:34.754647+00', NULL),
	('a8a20179-bb1d-48d5-8cb2-328bb7de57bd', 'b53336bc-6d26-4214-bc83-8d84df0a42af', 'd4e5f6a7-b8c9-0123-defa-234567890123', 'B', 0, true, '2026-08-11 03:52:52.062236+00', NULL),
	('063da274-9065-4cc4-b27f-93964c6cf9cf', 'b53336bc-6d26-4214-bc83-8d84df0a42af', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'B', 0, true, '2026-08-11 03:52:52.062236+00', NULL),
	('cd6432a5-ea4a-4c7a-9cd8-4df02b056132', 'b53336bc-6d26-4214-bc83-8d84df0a42af', 'f6a7b8c9-d0e1-2345-fabc-456789012345', 'B', 0, true, '2026-08-11 03:52:52.062236+00', NULL),
	('84e9ec1d-7b1e-4828-93d7-95d9d83ad989', 'b53336bc-6d26-4214-bc83-8d84df0a42af', 'e5f6a7b8-c9d0-1234-efab-345678901234', 'A', 4, true, '2026-08-11 03:52:50.369203+00', NULL),
	('8c8685ee-9f3d-47a8-b079-de5d870c3f5c', '11c50734-4a76-4d9f-9ca6-2648da9f7c4f', '417ed23d-48bf-4fe6-9595-30d202118edb', 'B', 0, true, '2026-08-11 06:14:47.08294+00', NULL),
	('69175e7c-7f3e-4e68-bd9f-ef115f279363', '11c50734-4a76-4d9f-9ca6-2648da9f7c4f', '4924ec87-d529-4dd4-980e-c3abe852beea', 'B', 0, true, '2026-08-11 06:14:47.08294+00', NULL),
	('e6e43a32-7da8-4552-bf64-967f3ec873dc', '2b75b6ed-bf8a-4f6d-8deb-450bdf749a7c', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', 'A', 0, true, '2026-08-11 05:16:59.535845+00', NULL),
	('f907fc1a-3b24-4ac5-b70a-cd7319fd0984', '2b75b6ed-bf8a-4f6d-8deb-450bdf749a7c', '8e8a6586-6d86-434d-8401-04e69435dda4', 'A', 0, true, '2026-08-11 05:16:59.535845+00', NULL),
	('3d3fd2c2-97a7-45f9-b2e4-63de51aeb138', '2b75b6ed-bf8a-4f6d-8deb-450bdf749a7c', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'A', 0, true, '2026-08-11 05:16:59.535845+00', NULL),
	('880c4529-4bf8-4f0e-a4c7-a75b0511742a', '2b75b6ed-bf8a-4f6d-8deb-450bdf749a7c', 'ee5178bc-7632-4597-a9e3-449a270d7e5a', 'A', 0, true, '2026-08-11 05:16:59.535845+00', NULL),
	('e1e585d9-6e77-4884-84ee-b996d968644a', '2b75b6ed-bf8a-4f6d-8deb-450bdf749a7c', 'e5f6a7b8-c9d0-1234-efab-345678901234', 'A', 0, true, '2026-08-11 05:16:59.535845+00', NULL),
	('afcf2519-d608-4644-aa78-4dbdc2da509a', '2b75b6ed-bf8a-4f6d-8deb-450bdf749a7c', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'A', 0, true, '2026-08-11 05:16:59.535845+00', NULL),
	('d9a103b2-7a3e-449e-8924-b32b1cc77211', '2b75b6ed-bf8a-4f6d-8deb-450bdf749a7c', 'd4e5f6a7-b8c9-0123-defa-234567890123', 'A', 0, true, '2026-08-11 05:17:09.651068+00', NULL),
	('940b54f4-d593-4833-985f-3fbc1d4d91b9', '2b75b6ed-bf8a-4f6d-8deb-450bdf749a7c', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'A', 0, true, '2026-08-11 05:17:09.651068+00', NULL),
	('76598077-a130-43fb-86a7-c1ca84564167', '61191967-2250-4360-bd0a-c1ba9adebd88', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'B', 0, true, '2026-08-11 05:17:41.352972+00', NULL),
	('7291b2b2-6b56-4ff6-ac0e-b7f15c032fa6', '61191967-2250-4360-bd0a-c1ba9adebd88', 'e5f6a7b8-c9d0-1234-efab-345678901234', 'B', 0, true, '2026-08-11 05:17:41.352972+00', NULL),
	('cfd904c2-7bac-45c1-81fd-06b0dfdd00ff', '61191967-2250-4360-bd0a-c1ba9adebd88', 'd4e5f6a7-b8c9-0123-defa-234567890123', 'B', 0, true, '2026-08-11 05:17:41.352972+00', NULL),
	('3010cfc8-2012-4860-86ee-562218466580', '11c50734-4a76-4d9f-9ca6-2648da9f7c4f', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'A', 0, true, '2026-08-11 06:09:23.453495+00', NULL),
	('98e1b7a7-0703-47d3-8583-5c8ec4bad687', '11c50734-4a76-4d9f-9ca6-2648da9f7c4f', 'ee5178bc-7632-4597-a9e3-449a270d7e5a', 'A', 0, true, '2026-08-11 06:09:23.453495+00', NULL),
	('0cbefd4f-72de-4d47-989f-4dd4c0a7cb74', '11c50734-4a76-4d9f-9ca6-2648da9f7c4f', 'e5f6a7b8-c9d0-1234-efab-345678901234', 'A', 0, true, '2026-08-11 06:09:23.453495+00', NULL),
	('cc705dc5-fb6e-4edb-92d1-2ff5f3c151fd', '11c50734-4a76-4d9f-9ca6-2648da9f7c4f', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'A', 0, true, '2026-08-11 06:09:23.453495+00', NULL),
	('aab1754c-4c00-41b9-badc-c568ee0dfdb4', '61191967-2250-4360-bd0a-c1ba9adebd88', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', 'A', 0, true, '2026-08-11 05:33:22.27836+00', NULL),
	('a898aed5-9753-4d6f-8df2-e01b278293a5', '61191967-2250-4360-bd0a-c1ba9adebd88', '8e8a6586-6d86-434d-8401-04e69435dda4', 'A', 1, true, '2026-08-11 05:33:22.27836+00', 'mid-c'),
	('465b863e-f81a-4bf8-ac2a-1839dacc885f', '11c50734-4a76-4d9f-9ca6-2648da9f7c4f', 'd4e5f6a7-b8c9-0123-defa-234567890123', 'A', 0, true, '2026-08-11 06:09:23.453495+00', NULL),
	('aaa3632a-3fad-4217-84af-154a881a9ee6', '11c50734-4a76-4d9f-9ca6-2648da9f7c4f', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'A', 0, true, '2026-08-11 06:09:23.453495+00', NULL),
	('983df4fe-887f-4fe9-a8a0-870faf63d582', '11c50734-4a76-4d9f-9ca6-2648da9f7c4f', '8e8a6586-6d86-434d-8401-04e69435dda4', 'B', 0, true, '2026-08-11 06:14:47.08294+00', NULL),
	('2fc4bcc6-77ac-434a-a0a3-6e6700c88e7f', '11c50734-4a76-4d9f-9ca6-2648da9f7c4f', 'f6a7b8c9-d0e1-2345-fabc-456789012345', 'B', 0, true, '2026-08-11 06:14:47.08294+00', NULL);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('avatars', 'avatars', NULL, '2026-08-11 03:48:51.8915+00', '2026-08-11 03:48:51.8915+00', true, false, NULL, NULL, NULL, 'STANDARD');


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

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('ce10cab6-cf2c-418c-9161-0d0a0b80bbb9', 'avatars', '6055845c-2c4b-4c22-bba5-f0c0cd5e9115-1786420159543.jpg', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '2026-08-11 03:49:19.591453+00', '2026-08-11 03:49:19.591453+00', '2026-08-11 03:49:19.591453+00', '{"eTag": "\"02d9814394468be327480fc4c883e4be\"", "size": 19018, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-11T03:49:19.577Z", "contentLength": 19018, "httpStatusCode": 200}', 'ded2bfce-2e4d-4da7-ba6e-87f2b98c99ae', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '{}'),
	('d84da0e6-c786-4158-8e22-75aab76def54', 'avatars', 'f6a7b8c9-d0e1-2345-fabc-456789012345-1786420190331.jpg', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '2026-08-11 03:49:50.351459+00', '2026-08-11 03:49:50.351459+00', '2026-08-11 03:49:50.351459+00', '{"eTag": "\"efff9c45f53d2f3135021c5bd795d5e0\"", "size": 28446, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-11T03:49:50.346Z", "contentLength": 28446, "httpStatusCode": 200}', '74995c97-77d2-40f0-acef-bf29d4eedde8', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '{}'),
	('087dce00-cbb0-4f23-a5ef-373bb46f4a10', 'avatars', '4924ec87-d529-4dd4-980e-c3abe852beea-1786425302169.jpg', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '2026-08-11 05:15:02.222942+00', '2026-08-11 05:15:02.222942+00', '2026-08-11 05:15:02.222942+00', '{"eTag": "\"a32e555a523c44a979b559bae5d031c7\"", "size": 100171, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-11T05:15:02.214Z", "contentLength": 100171, "httpStatusCode": 200}', '9640ed84-71d6-4a5c-aee4-b165eff85d95', 'bb65e7f8-56f5-40d9-b086-fb68d19102eb', '{}');


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 17, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict 3DJ3QDJSaLxFZNkGILMFBvZsrhhutHmL606l4ehmaY3VRH9JBHO4begbhRuffki

RESET ALL;
