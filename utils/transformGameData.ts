import type { Game } from "@/types/types";

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
        endOfPeriod?: boolean;

  };
  teams: {
    home: { id: number; name: string; logo: string };
    visitors: { id: number; name: string; logo: string };
  };
scores: {
    home: {
      points: number | null;
      linescore?: string[];
    };
    visitors: {
      points: number | null;
      linescore?: string[];
    };
  };
};

export type TeamRecordMap = Record<string, { wins: number; losses: number }>;

export function transformGameData(
  raw: RawNBAGame,
  recordsMap?: TeamRecordMap
): Game {
  const period = raw.periods?.current ?? undefined;
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

  const formatRecord = (
    record: { wins: number; losses: number } | undefined
  ) =>
    record && record.wins !== undefined && record.losses !== undefined
      ? `${record.wins}-${record.losses}`
      : "-";

  const homeRecord = formatRecord(homeRecordObj);
  const awayRecord = formatRecord(awayRecordObj);
  return {
    id: raw.id,
    home: {
      id: raw.teams.home.id.toString(), // <-- add this
      name: raw.teams.home.name,
      logo: raw.teams.home.logo,
      record: homeRecord,
      wins: homeRecordObj?.wins,
      losses: homeRecordObj?.losses,
    },
    away: {
      id: raw.teams.visitors.id.toString(), // <-- add this
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
    period:
      status === "In Progress" && period !== undefined
        ? period.toString()
        : undefined,
    homeScore:
      status !== "Scheduled" ? (raw.scores.home.points ?? 0) : undefined,
    awayScore:
      status !== "Scheduled" ? (raw.scores.visitors.points ?? 0) : undefined,
    isHalftime, // existing field
    isPlayoff: raw.isPlayoff, // <--- new field to propagate playoff flag

    stage: raw.date.stage, // <-- add this
     linescore:
      raw.scores.home.linescore && raw.scores.visitors.linescore
        ? {
            home: raw.scores.home.linescore,
            away: raw.scores.visitors.linescore,
          }
        : undefined,

    periods: raw.periods
      ? {
          current: raw.periods.current,
          total: raw.periods.total,
          endOfPeriod: raw.periods.endOfPeriod ?? false,
        }
      : undefined,
  };
}
