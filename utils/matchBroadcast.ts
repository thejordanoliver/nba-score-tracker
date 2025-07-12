// utils/matchBroadcast.ts

type SimpleTeam = {
  name: string;
};

type SimpleGame = {
  date: string;
  home: SimpleTeam;
  away: SimpleTeam;
};

type BroadcastEntry = {
  gameId: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  name: string;
  status: string;
  broadcasts: {
    market: any;
    type?: any;
    name?: string;
    network?: string | null;
  }[];
};

export function normalizeTeamName(name: string): string {
  return name?.toLowerCase().replace(/[^a-z]/g, "");
}

export function matchBroadcastToGame(
  game: SimpleGame,
  broadcastData: BroadcastEntry[]
) {
  const gameDate = game.date.split("T")[0];

  const awayName = normalizeTeamName(game.away.name);
  const homeName = normalizeTeamName(game.home.name);

  return broadcastData.find((b) => {
    const dateMatch = b.date === gameDate;
    const homeMatch = normalizeTeamName(b.homeTeam).includes(homeName);
    const awayMatch = normalizeTeamName(b.awayTeam).includes(awayName);

    // Optional: for debug
    // console.log(`Checking broadcast: ${b.date} ${b.homeTeam} vs ${b.awayTeam} => dateMatch: ${dateMatch}, homeMatch: ${homeMatch}, awayMatch: ${awayMatch}`);

    return dateMatch && homeMatch && awayMatch;
  });
}
