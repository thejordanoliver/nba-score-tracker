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
  fullName: string;
  logo: any;
  logoLight?: any;
  inverse?: any;
  constantBlack?: string;
  constantLogoLight?: any;
  color?: string;
  firstSeason?: string; // ✅ number type
  transparentColor?: string;
  secondaryColor?: string;
};
