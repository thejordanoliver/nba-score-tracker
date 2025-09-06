import NinersLogo from "@/assets/Football/NFL_Logos/49ers.png";
import BearsLogo from "@/assets/Football/NFL_Logos/Bears.png";
import BengalsLogo from "@/assets/Football/NFL_Logos/Bengals.png";
import BillsLogo from "@/assets/Football/NFL_Logos/Bills.png";
import BroncosLogo from "@/assets/Football/NFL_Logos/Broncos.png";
import BrownsLogo from "@/assets/Football/NFL_Logos/Browns.png";
import BuccaneersLogo from "@/assets/Football/NFL_Logos/Buccaneers.png";
import CardinalsLogo from "@/assets/Football/NFL_Logos/Cardinals.png";
import ChargersLogo from "@/assets/Football/NFL_Logos/Chargers.png";
import ChiefsLogo from "@/assets/Football/NFL_Logos/Chiefs.png";
import ColtsLogo from "@/assets/Football/NFL_Logos/Colts.png";
import CommandersLogo from "@/assets/Football/NFL_Logos/Commanders.png";
import CowboysLogo from "@/assets/Football/NFL_Logos/Cowboys.png";
import DolphinsLogo from "@/assets/Football/NFL_Logos/Dolphins.png";
import EaglesLogo from "@/assets/Football/NFL_Logos/Eagles.png";
import FalconsLogo from "@/assets/Football/NFL_Logos/Falcons.png";
import GiantsLogo from "@/assets/Football/NFL_Logos/Giants.png";
import GiantsLogoLight from "@/assets/Football/NFL_Logos/GiantsLight.png";
import JaguarsLogo from "@/assets/Football/NFL_Logos/Jaguars.png";
import JetsLogo from "@/assets/Football/NFL_Logos/Jets.png";
import JetsLogoLight from "@/assets/Football/NFL_Logos/JetsLight.png";
import LionsLogo from "@/assets/Football/NFL_Logos/Lions.png";
import NFLLogo from "@/assets/Football/NFL_Logos/NFL.png";
import PackersLogo from "@/assets/Football/NFL_Logos/Packers.png";
import PanthersLogo from "@/assets/Football/NFL_Logos/Panthers.png";
import PatriotsLogo from "@/assets/Football/NFL_Logos/Patriots.png";
import RaidersLogo from "@/assets/Football/NFL_Logos/Raiders.png";
import RamsLogo from "@/assets/Football/NFL_Logos/Rams.png";
import RavensLogo from "@/assets/Football/NFL_Logos/Ravens.png";
import SaintsLogo from "@/assets/Football/NFL_Logos/Saints.png";
import SeahawksLogo from "@/assets/Football/NFL_Logos/Seahawks.png";
import SteelersLogo from "@/assets/Football/NFL_Logos/Steelers.png";
import TexansLogo from "@/assets/Football/NFL_Logos/Texans.png";
import TitansLogo from "@/assets/Football/NFL_Logos/Titans.png";
import VikingsLogo from "@/assets/Football/NFL_Logos/Vikings.png";

export type NFLTeam = {
  id: number;
  name: string;
  code: string;
  city: string;
  coach: string;
  owner: string;
  stadium: string;
  established: number;
  logo: string;
  logoLight?: string;
  country: {
    name: string;
    code: string;
    flag: string;
  };
  nickname: string;
  color?: string;
};

export const teams: NFLTeam[] = [
  {
    id: 1,
    name: "Las Vegas Raiders",
    code: "LV",
    city: "Las Vegas",
    coach: "Antonio Pierce (interim)",
    owner: "Carol and Mark Davis",
    stadium: "Allegiant Stadium",
    established: 1960,
    logo: RaidersLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Raiders",
    color: "#000000",
  },
  {
    id: 2,
    name: "Jacksonville Jaguars",
    code: "JAX",
    city: "Jacksonville",
    coach: "Doug Pederson",
    owner: "Shahid Khan",
    stadium: "EverBank Stadium",
    established: 1995,
    logo: JaguarsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Jaguars",
    color: "#101820",
  },
  {
    id: 3,
    name: "New England Patriots",
    code: "NE",
    city: "Foxborough",
    coach: "Bill Belichick",
    owner: "Robert Kraft",
    stadium: "Gillette Stadium",
    established: 1960,
    logo: PatriotsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Patriots",
    color: "#002244",
  },
  {
    id: 4,
    name: "New York Giants",
    code: "NYG",
    city: "New York",
    coach: "Brian Daboll",
    owner: "John Mara, Steve Tisch",
    stadium: "MetLife Stadium",
    established: 1925,
    logo: GiantsLogo,
    logoLight: GiantsLogoLight,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Giants",
    color: "#0B2265",
  },
  {
    id: 5,
    name: "Baltimore Ravens",
    code: "BAL",
    city: "Baltimore",
    coach: "John Harbaugh",
    owner: "Steve Bisciotti",
    stadium: "M&T Bank Stadium",
    established: 1996,
    logo: RavensLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Ravens",
    color: "#241773",
  },
  {
    id: 6,
    name: "Tennessee Titans",
    code: "TEN",
    city: "Nashville",
    coach: "Mike Vrabel",
    owner: "Amy Adams Strunk",
    stadium: "Nissan Stadium",
    established: 1960,
    logo: TitansLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Titans",
    color: "#0C2340",
  },
  {
    id: 7,
    name: "Detroit Lions",
    code: "DET",
    city: "Detroit",
    coach: "Dan Campbell",
    owner: "Sheila Ford Hamp",
    stadium: "Ford Field",
    established: 1930,
    logo: LionsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Lions",
    color: "#0076b6",
  },
  {
    id: 8,
    name: "Atlanta Falcons",
    code: "ATL",
    city: "Atlanta",
    coach: "Arthur Smith",
    owner: "Arthur Blank",
    stadium: "Mercedes-Benz Stadium",
    established: 1966,
    logo: FalconsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Falcons",
    color: "#a71930",
  },
  {
    id: 9,
    name: "Cleveland Browns",
    code: "CLE",
    city: "Cleveland",
    coach: "Kevin Stefanski",
    owner: "Dee and Jimmy Haslam",
    stadium: "Cleveland Browns Stadium",
    established: 1946,
    logo: BrownsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Browns",
    color: "#311D00",
  },
  {
    id: 10,
    name: "Cincinnati Bengals",
    code: "CIN",
    city: "Cincinnati",
    coach: "Zac Taylor",
    owner: "Mike Brown",
    stadium: "Paycor Stadium",
    established: 1968,
    logo: BengalsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Bengals",
    color: "#fb4f14",
  },
  {
    id: 11,
    name: "Arizona Cardinals",
    code: "ARI",
    city: "Glendale",
    coach: "Jonathan Gannon",
    owner: "Michael Bidwill",
    stadium: "State Farm Stadium",
    established: 1920,
    logo: CardinalsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Cardinals",
    color: "#97233F",
  },
  {
    id: 12,
    name: "Philadelphia Eagles",
    code: "PHI",
    city: "Philadelphia",
    coach: "Nick Sirianni",
    owner: "Jeffrey Lurie",
    stadium: "Lincoln Financial Field",
    established: 1933,
    logo: EaglesLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Eagles",
    color: "#004C54",
  },
  {
    id: 13,
    name: "New York Jets",
    code: "NYJ",
    city: "New York",
    coach: "Robert Saleh",
    owner: "Robert Wood Johnson IV",
    stadium: "MetLife Stadium",
    established: 1960,
    logo: JetsLogo,
    logoLight: JetsLogoLight,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Jets",
    color: "#125740",
  },
  {
    id: 14,
    name: "San Francisco 49ers",
    code: "SF",
    city: "San Francisco",
    coach: "Kyle Shanahan",
    owner: "Jed York",
    stadium: "Levi's® Stadium",
    established: 1946,
    logo: NinersLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "49ers",
    color: "#AA0000",
  },
  {
    id: 15,
    name: "Green Bay Packers",
    code: "GB",
    city: "Green Bay",
    coach: "Matt LaFleur",
    owner: "Green Bay Packers, Inc.",
    stadium: "Lambeau Field",
    established: 1921,
    logo: PackersLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Packers",
    color: "#203731",
  },
  {
    id: 16,
    name: "Chicago Bears",
    code: "CHI",
    city: "Chicago",
    coach: "Matt Eberflus",
    owner: "Virginia Halas McCaskey",
    stadium: "Soldier Field",
    established: 1920,
    logo: BearsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Bears",
    color: "#0B162A",
  },
  {
    id: 17,
    name: "Kansas City Chiefs",
    code: "KC",
    city: "Kansas City",
    coach: "Andy Reid",
    owner: "Clark Hunt",
    stadium: "GEHA Field at Arrowhead Stadium",
    established: 1960,
    logo: ChiefsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Chiefs",
    color: "#E31837",
  },
  {
    id: 18,
    name: "Washington Commanders",
    code: "WAS",
    city: "Washington",
    coach: "Ron Rivera",
    owner: "Josh Harris",
    stadium: "FedExField",
    established: 1932,
    logo: CommandersLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Commanders",
    color: "#5A1414",
  },
  {
    id: 19,
    name: "Carolina Panthers",
    code: "CAR",
    city: "Charlotte",
    coach: "Chris Tabor (interim)",
    owner: "David Tepper",
    stadium: "Bank of America Stadium",
    established: 1995,
    logo: PanthersLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Panthers",
    color: "#0085CA",
  },
  {
    id: 20,
    name: "Buffalo Bills",
    code: "BUF",
    city: "Buffalo",
    coach: "Sean McDermott",
    owner: "Kim and Terry Pegula",
    stadium: "Highmark Stadium",
    established: 1960,
    logo: BillsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Bills",
    color: "#00338D",
  },
  {
    id: 21,
    name: "Indianapolis Colts",
    code: "IND",
    city: "Indianapolis",
    coach: "Shane Steichen",
    owner: "Jim Irsay",
    stadium: "Lucas Oil Stadium",
    established: 1944,
    logo: ColtsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Colts",
    color: "#002C5F",
  },
  {
    id: 22,
    name: "Pittsburgh Steelers",
    code: "PIT",
    city: "Pittsburgh",
    coach: "Mike Tomlin",
    owner: "Art Rooney II and Family",
    stadium: "Acrisure Stadium",
    established: 1933,
    logo: SteelersLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Steelers",
    color: "#FFB612",
  },
  {
    id: 23,
    name: "Seattle Seahawks",
    code: "SEA",
    city: "Seattle",
    coach: "Pete Carroll",
    owner: "Seattle Seahawks Ownership Trust",
    stadium: "Lumen Field",
    established: 1976,
    logo: SeahawksLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Seahawks",
    color: "#002244",
  },
  {
    id: 24,
    name: "Tampa Bay Buccaneers",
    code: "TB",
    city: "Tampa",
    coach: "Todd Bowles",
    owner: "Bryan Glazer, Edward Glazer, Joel Glazer",
    stadium: "Raymond James Stadium",
    established: 1976,
    logo: BuccaneersLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Buccaneers",
    color: "#D50A0A",
  },
  {
    id: 25,
    name: "Miami Dolphins",
    code: "MIA",
    city: "Miami",
    coach: "Mike McDaniel",
    owner: "Stephen M. Ross",
    stadium: "Hard Rock Stadium",
    established: 1966,
    logo: DolphinsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Dolphins",
    color: "#008E97",
  },
  {
    id: 26,
    name: "Houston Texans",
    code: "HOU",
    city: "Houston",
    coach: "DeMeco Ryans",
    owner: "Janice S. McNair",
    stadium: "NRG Stadium",
    established: 2002,
    logo: TexansLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Texans",
    color: "#03202f",
  },
  {
    id: 27,
    name: "New Orleans Saints",
    code: "NO",
    city: "New Orleans",
    coach: "Dennis Allen",
    owner: "Gayle Benson",
    stadium: "Caesars Superdome",
    established: 1967,
    logo: SaintsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Saints",
    color: "#D3BC8D",
  },
  {
    id: 28,
    name: "Denver Broncos",
    code: "DEN",
    city: "Denver",
    coach: "Sean Payton",
    owner: "Walton-Penner Family Ownership Group",
    stadium: "Empower Field at Mile High",
    established: 1960,
    logo: BroncosLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Broncos",
    color: "#FB4F14",
  },
  {
    id: 29,
    name: "Dallas Cowboys",
    code: "DAL",
    city: "Dallas",
    coach: "Mike McCarthy",
    owner: "Jerry Jones",
    stadium: "AT&T Stadium",
    established: 1960,
    logo: CowboysLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Cowboys",
    color: "#041E42",
  },
  {
    id: 30,
    name: "Los Angeles Chargers",
    code: "LAC",
    city: "Los Angeles",
    coach: "Giff Smith (interim)",
    owner: "Alex Spanos and Family",
    stadium: "SoFi Stadium",
    established: 1960,
    logo: ChargersLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Chargers",
    color: "#0080C6",
  },
  {
    id: 31,
    name: "Los Angeles Rams",
    code: "LA",
    city: "Los Angeles",
    coach: "Sean McVay",
    owner: "Stan Kroenke",
    stadium: "SoFi Stadium",
    established: 1937,
    logo: RamsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Rams",
    color: "#003594",
  },
  {
    id: 32,
    name: "Minnesota Vikings",
    code: "MIN",
    city: "Minneapolis",
    coach: "Kevin O'Connell",
    owner: "Zygi Wilf",
    stadium: "U.S. Bank Stadium",
    established: 1961,
    logo: VikingsLogo,
    country: {
      name: "USA",
      code: "US",
      flag: "https://media.api-sports.io/flags/us.svg",
    },
    nickname: "Vikings",
    color: "#4F2683",
  },
] as const;

export type Arena = {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  arenaCapacity?: string;
  arenaImage: any;
};

export const neutralArenas: Record<string, Arena> = {
  "Corinthians Arena": {
    name: "Corinthians Arena",
    address:
      "Av. Miguel Ignácio Curi, 111 - Vila Carmosina, São Paulo - SP, 08295-005, Brazil",
    latitude: 23.5453,
    longitude: 46.4742,
    arenaCapacity: "49,205",
    arenaImage: require("../assets/Arenas/CorinthiansArena.webp"),
  },
};

export const getTeamInfo = (teamId: number | string) => {
  if (teamId == null) return undefined;
  return teams.find((t) => String(t.id) === String(teamId));
};

export function getNFLTeamsLogo(id: number, isDark: boolean) {
  const team = teams.find((t) => t.id === id);
  if (!team) return NFLLogo; // ✅ use the imported asset directly
  return isDark ? team.logoLight || team.logo : team.logo;
}

export const getTeamName = (teamId: number | string, fallback?: string) => {
  const team = getTeamInfo(teamId);
  return team?.nickname || fallback || "Unknown Team";
};

export const logoMap: Record<string, any> = {
  "RaidersLogo": RaidersLogo,
  "JaguarsLogo": JaguarsLogo,
  "PatriotsLogo": PatriotsLogo,
  "GiantsLogo": GiantsLogo,
  "GiantsLogoLight": GiantsLogoLight,
  "RavensLogo": RavensLogo,
  "TitansLogo": TitansLogo,
  "LionsLogo": LionsLogo,
  "FalconsLogo": FalconsLogo,
  "BrownsLogo": BrownsLogo,
  "BengalsLogo": BengalsLogo,
  "CardinalsLogo": CardinalsLogo,
  "EaglesLogo": EaglesLogo,
  "JetsLogo": JetsLogo,
  "JetsLogoLight": JetsLogoLight,
  "49ersLogo": NinersLogo,
  "PackersLogo": PackersLogo,
  "BearsLogo": BearsLogo,
  "ChiefsLogo": ChiefsLogo,
  "CommandersLogo": CommandersLogo,
  "PanthersLogo": PanthersLogo,
  "BillsLogo": BillsLogo,
  "ColtsLogo": ColtsLogo,
  "SteelersLogo": SteelersLogo,
  "SeahawksLogo": SeahawksLogo,
  "BuccaneersLogo": BuccaneersLogo,
  "DolphinsLogo": DolphinsLogo,
  "TexansLogo": TexansLogo,
  "RamsLogo": RamsLogo,
  "ChargersLogo": ChargersLogo,
  "VikingsLogo": VikingsLogo,
};
