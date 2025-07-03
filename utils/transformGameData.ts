export type RawNBAGame = {
  isPlayoff: boolean;
  id: number;
  date: {
    stage: number;
    start: string;
  };
  status: {
    long: string;
    short: string;
    clock?: string;
    halftime?: boolean; // <-- Add this
  };
  periods: {
    current: number;
    total: number;
  };
  teams: {
    home: { id: number; name: string; logo: string };
    visitors: { id: number; name: string; logo: string };
  };
  scores: {
    home: { points: number | null };
    visitors: { points: number | null };
  };
};

export type Team = {
  name: string;
  logo: string;
  record: string;
  wins?: number;
  losses?: number;
};

export type Game = {
  id: number;
  home: Team;
  away: Team;
  date: string;
  time: string;
  status: "Scheduled" | "In Progress" | "Final";
  clock?: string;
  period?: string;
  homeScore?: number;
  awayScore?: number;
  isHalftime?: boolean; // <-- Add this
  isPlayoff?: boolean;  // <-- Add this new field
    stage?: number;  // <--- Add this line

};

export type TeamRecordMap = Record<string, { wins: number; losses: number }>;

export function transformGameData(
  raw: RawNBAGame,
  recordsMap?: TeamRecordMap
): Game {
  const period = raw.periods?.current ? `Q${raw.periods.current}` : undefined;
  const clock = raw.status?.clock;

  let status: Game["status"];
  const isHalftime = raw.status?.halftime || raw.status?.long === "Halftime";

  if (isHalftime) {
    status = "In Progress"; // Still considered 'in progress' for logic
  } else {
    switch (raw.status?.long) {
      case "In Play":
        status = "In Progress";
        break;
      case "Finished":
      case "Final":
        status = "Final";
        break;
      default:
        status = "Scheduled";
    }
  }


  const homeRecordObj = recordsMap?.[raw.teams.home.id.toString()];
  const awayRecordObj = recordsMap?.[raw.teams.visitors.id.toString()];

  const formatRecord = (record: { wins: number; losses: number } | undefined) =>
    record && record.wins !== undefined && record.losses !== undefined
      ? `${record.wins}-${record.losses}`
      : "-";

  const homeRecord = formatRecord(homeRecordObj);
  const awayRecord = formatRecord(awayRecordObj);
  return {
    id: raw.id,
    home: {
      name: raw.teams.home.name,
      logo: raw.teams.home.logo,
      record: homeRecord,
      wins: homeRecordObj?.wins,
      losses: homeRecordObj?.losses,
    },
    away: {
      name: raw.teams.visitors.name,
      logo: raw.teams.visitors.logo,
      record: awayRecord,
      wins: awayRecordObj?.wins,
      losses: awayRecordObj?.losses,
    },
    date: raw.date.start,
    time: new Date(raw.date.start).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    status,
    clock: status === "In Progress" ? clock : undefined,
    period: status === "In Progress" ? period : undefined,
    homeScore: status !== "Scheduled" ? raw.scores.home.points ?? 0 : undefined,
    awayScore:
    status !== "Scheduled" ? raw.scores.visitors.points ?? 0 : undefined,
    isHalftime,         // existing field
    isPlayoff: raw.isPlayoff,  // <--- new field to propagate playoff flag
    
    stage: raw.date.stage,  // <-- add this
  };
}
