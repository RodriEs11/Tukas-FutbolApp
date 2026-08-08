export type UserRole = 'player' | 'admin';
export type MatchStatus = 'scheduled' | 'played' | 'cancelled';
export type SurfaceType = 'césped' | 'sintético' | 'tierra' | 'cemento' | 'otro';
export type Team = 'A' | 'B';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  nickname: string;
  role: UserRole;
  avatar_url: string;
  preferred_foot?: string;
  position?: string;
  created_at: string;
  updated_at: string;
}

export interface Field {
  id: string;
  name: string;
  location: string;
  surface_type: SurfaceType;
  description: string;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  field_id: string | null;
  match_date: string;
  status: MatchStatus;
  score_team_a: number;
  score_team_b: number;
  notes: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  field?: Field;
  match_players?: MatchPlayer[];
}

export interface MatchPlayer {
  id: string;
  match_id: string;
  player_id: string;
  team: Team;
  goals: number;
  attended: boolean;
  created_at: string;
  // Joined data
  player?: UserProfile;
}

// Player stats (computed)
export interface PlayerStats {
  player: UserProfile;
  matches_played: number;
  goals: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
}

// Supabase Database type helper
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;
      };
      fields: {
        Row: Field;
        Insert: Omit<Field, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Field, 'id' | 'created_at' | 'updated_at'>>;
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, 'id' | 'created_at' | 'updated_at' | 'field' | 'match_players'>;
        Update: Partial<Omit<Match, 'id' | 'created_at' | 'updated_at' | 'field' | 'match_players'>>;
      };
      match_players: {
        Row: MatchPlayer;
        Insert: Omit<MatchPlayer, 'id' | 'created_at' | 'player'>;
        Update: Partial<Omit<MatchPlayer, 'id' | 'created_at' | 'player'>>;
      };
    };
  };
}
