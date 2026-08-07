CREATE OR REPLACE VIEW public.paternities WITH (security_invoker = true) AS
WITH match_results AS (
  SELECT 
    m.id AS match_id,
    p1.player_id AS player_a_id,
    p2.player_id AS player_b_id,
    CASE 
      WHEN (p1.team = 'A' AND m.score_team_a > m.score_team_b) OR (p1.team = 'B' AND m.score_team_b > m.score_team_a) THEN 1
      WHEN (p1.team = 'A' AND m.score_team_a < m.score_team_b) OR (p1.team = 'B' AND m.score_team_b < m.score_team_a) THEN -1
      ELSE 0
    END AS result_a_vs_b
  FROM public.match_players p1
  JOIN public.match_players p2 ON p1.match_id = p2.match_id AND p1.team != p2.team
  JOIN public.matches m ON p1.match_id = m.id
  WHERE m.status = 'played'
)
SELECT 
  player_a_id AS father_id,
  player_b_id AS son_id,
  SUM(result_a_vs_b) AS net_wins
FROM match_results
GROUP BY player_a_id, player_b_id
HAVING SUM(result_a_vs_b) >= 3;

GRANT SELECT ON public.paternities TO authenticated;
GRANT SELECT ON public.paternities TO anon;
GRANT SELECT ON public.paternities TO service_role;
