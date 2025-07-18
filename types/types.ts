// types.ts

export type User = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  profile_image?: string;
  banner_image?: string | null; // add this
  bio?: string | null;
  favorites?: string[];
};

export type Follow = {
  followersCount: number;
  followingCount: number;
  isDark: boolean;
  currentUserId: string;
  targetUserId: string;
  onFollowersPress: () => void;
  onFollowingPress: () => void;
};

export type PlayerStats = {
  playerId: number;
  name: string;
  gamesPlayed: number;
  minutesPlayed: number;
  totalPoints: number;
  totalRebounds: number;
  totalAssists: number;
  totalSteals: number;
  totalBlocks: number;
  totalTurnovers: number;
  totalFouls: number;
  totalFGM: number;
  totalFGA: number;
  totalFGP: number; // string percentage if you want, else calculate per game
  total3PM: number;
  total3PA: number;
  total3PP: number; // 3-point percentage if you want
  totalFTM: number;
  totalFTA: number;
  totalFTP: number; // free throw percentage
  totalOffReb: number;
  totalDefReb: number;
  plusMinus: number;
};

export type PlayerInfo = {
  player_id: number;
  first_name: string;
  last_name: string;
  jersey_number: string;
  headshot_url?: string;
};

export type Props = {
  rosterStats: PlayerStats[];
  playersDb: PlayerInfo[];
  teamId: string; // Add this
};

export type Team = {
  id: string;
  name: string;
  fullName?: string; // <-- optional now
  logo?: any; // make optional
  logoLight?: any;
  inverse?: any;
  constantBlack?: string;
  constantLogoLight?: any;
  color?: string;
  firstSeason?: string; // ✅ number type
  transparentColor?: string;
  secondaryColor?: string;
  record?: string;
  wins?: number; // ✅ Add this
  losses?: number; // ✅ Add this
  code?: string;
};

export type Game = {
  id: number;
  date: string;
  time: string;
  status: "Scheduled" | "Final" | "In Progress";
  home: Team;
  away: Team;
  homeScore?: number;
  awayScore?: number;
  period?: string;
  clock?: string;
  isPlayoff?: boolean;
  stage?: number;
  isHalftime?: boolean;
  linescore?: {
    home: string[];
    away: string[];
  };

  // ✅ Add this
  periods?: {
    current: number;
    total: number;
    endOfPeriod: boolean;
  };
};

export interface GameStatus {
  long: string; // e.g. "Not Started", "Game Finished", "Game Started"
  short: string; // e.g. "NS", "FT" , "GS"
  timer: string | null;
}

export interface summerGame {
  id: number;
  date: string;
  time: string;
  status: GameStatus; // <-- use the new typed status
  period?: number;
  clock?: string;
  timezone?: string;
  homeScore?: number;
  awayScore?: number;
  isHalftime?: boolean;
  stage?: number;
  league?: {
    name: string;
  };
  home: {
    id: string; // or number depending on your ID decision
    name: string;
    record?: string;
    logo?: any;
    fullName?: string;
  };
  away: {
    id: string;
    name: string;
    record?: string;
    logo?: any;
    fullName?: string;
  };
}
