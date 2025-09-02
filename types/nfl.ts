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
