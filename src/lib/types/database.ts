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
  is_active: boolean;
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
  pitch_position?: string | null;
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

export interface ScorerStat {
  player: UserProfile;
  matches_played: number;
  goals: number;
  goals_per_match: number;
}

export interface PaternityStat {
  father: UserProfile;
  sons: {
    son: UserProfile;
    net_wins: number;
  }[];
}

export interface CommentMedia {
  id: string;
  comment_id: string;
  file_key: string;
  file_type: 'image' | 'video';
  file_name: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface MatchComment {
  id: string;
  match_id: string;
  parent_id?: string | null;
  nickname: string;
  content: string;
  created_at: string;
  // Joined data
  comment_media?: CommentMedia[];
  replies?: MatchComment[];
}

// Supabase Database type helper
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at' | 'is_active'> & { is_active?: boolean };
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
      match_comments: {
        Row: MatchComment;
        Insert: Omit<MatchComment, 'id' | 'created_at' | 'comment_media'>;
        Update: Partial<Omit<MatchComment, 'id' | 'created_at' | 'comment_media'>>;
      };
      comment_media: {
        Row: CommentMedia;
        Insert: Omit<CommentMedia, 'id' | 'created_at'>;
        Update: Partial<Omit<CommentMedia, 'id' | 'created_at'>>;
      };
    };
    Views: {
      paternities: {
        Row: {
          father_id: string;
          son_id: string;
          net_wins: number;
        };
      };
    };
  };
}
