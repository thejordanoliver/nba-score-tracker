// types/nfl.ts
export type NFLGame = {
  id: number;
  date: string;
  league: { id: number; name: string };
  season: { year: number };
  status: { short: string; long: string };
  teams: {
    home: { id: number; name: string; abbreviation: string; score: number };
    away: { id: number; name: string; abbreviation: string; score: number };
  };
};

export type NFLGamesResponse = {
  results: number;
  response: NFLGame[];
};

export type Team = {
  id: number;
  name: string;
  logo: string;
};

export type Game = {
  game: {
    id: number;
    stage: string;
    week: string;
    date: {
      timezone: string;
      date: string;
      time: string;
      timestamp: number;
    };
    venue: {
      name: string;
      city: string;
    };
    status: {
      short: string;
      long: string;
      timer: string | null;
    };
  };
  league: {
    id: number;
    name: string;
    season: string;
    logo: string;
  };
  teams: {
    home: Team;
    away: Team;
  };
  scores: {
    home: Record<string, number | null>;
    away: Record<string, number | null>;
  };
};
