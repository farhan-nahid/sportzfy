export type MatchEvent = {
  minute: number;
  type: "GOAL" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION";
  player: string;
  team: string; // "home" or "away"
  detail?: string; // e.g. "Assist by Depay" or "Foul on Messi"
};

export type MatchStats = {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  passes: { home: number; away: number };
  passAccuracy: { home: number; away: number };
};

export type Match = {
  id: string;
  homeTeam: string;
  homeCode: string; // ISO or abbreviation
  homeFlag: string;
  awayTeam: string;
  awayCode: string;
  awayFlag: string;
  homeScore: number;
  awayScore: number;
  status: "LIVE" | "FINISHED" | "SCHEDULED";
  stage: string;
  group?: string;
  minute?: number;
  date: string; // e.g. "2026-06-26"
  time: string; // e.g. "18:00"
  stadium: string;
  city: string;
  broadcastChannel?: string; // channel name matching potential live TV channels
  events: MatchEvent[];
  stats: MatchStats;
  lineups?: {
    home: string[];
    away: string[];
  };
  matchNumber?: number | null;
  attendance?: string | null;
  weather?: {
    temp: number | null;
    humidity: number | null;
    condition: string | null;
  } | null;
  officials?: {
    name: string;
    role: string;
  }[];
};

export type TeamStanding = {
  rank: number;
  team: string;
  code: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type Group = {
  name: string;
  standings: TeamStanding[];
};

export type FifaRanking = {
  rank: number;
  team: string;
  code: string;
  flag: string;
  points: number;
  change: "up" | "down" | "same";
  changeValue: number;
  confederation: string;
};

export const FIFA_RANKINGS: FifaRanking[] = [
  { rank: 1, team: "Argentina", code: "ARG", flag: "🇦🇷", points: 1860.14, change: "same", changeValue: 0, confederation: "CONMEBOL" },
  { rank: 2, team: "France", code: "FRA", flag: "🇫🇷", points: 1845.44, change: "same", changeValue: 0, confederation: "UEFA" },
  { rank: 3, team: "England", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", points: 1800.05, change: "up", changeValue: 1, confederation: "UEFA" },
  { rank: 4, team: "Belgium", code: "BEL", flag: "🇧🇪", points: 1798.24, change: "down", changeValue: 1, confederation: "UEFA" },
  { rank: 5, team: "Brazil", code: "BRA", flag: "🇧🇷", points: 1784.09, change: "same", changeValue: 0, confederation: "CONMEBOL" },
  { rank: 6, team: "Netherlands", code: "NED", flag: "🇳🇱", points: 1742.29, change: "up", changeValue: 1, confederation: "UEFA" },
  { rank: 7, team: "Portugal", code: "POR", flag: "🇵🇹", points: 1740.12, change: "down", changeValue: 1, confederation: "UEFA" },
  { rank: 8, team: "Spain", code: "ESP", flag: "🇪🇸", points: 1729.92, change: "same", changeValue: 0, confederation: "UEFA" },
  { rank: 9, team: "Italy", code: "ITA", flag: "🇮🇹", points: 1718.82, change: "up", changeValue: 2, confederation: "UEFA" },
  { rank: 10, team: "Croatia", code: "CRO", flag: "🇭🇷", points: 1715.44, change: "down", changeValue: 1, confederation: "UEFA" },
  { rank: 11, team: "USA", code: "USA", flag: "🇺🇸", points: 1681.13, change: "up", changeValue: 1, confederation: "CONCACAF" },
  { rank: 12, team: "Germany", code: "GER", flag: "🇩🇪", points: 1672.14, change: "up", changeValue: 4, confederation: "UEFA" },
  { rank: 13, team: "Morocco", code: "MAR", flag: "🇲🇦", points: 1661.42, change: "down", changeValue: 3, confederation: "CAF" },
  { rank: 14, team: "Uruguay", code: "URU", flag: "🇺🇾", points: 1658.30, change: "down", changeValue: 1, confederation: "CONMEBOL" },
  { rank: 15, team: "Japan", code: "JPN", flag: "🇯🇵", points: 1621.88, change: "up", changeValue: 3, confederation: "AFC" },
  { rank: 16, team: "Mexico", code: "MEX", flag: "🇲🇽", points: 1618.22, change: "down", changeValue: 1, confederation: "CONCACAF" },
  { rank: 17, team: "Colombia", code: "COL", flag: "🇨🇴", points: 1612.45, change: "same", changeValue: 0, confederation: "CONMEBOL" },
  { rank: 18, team: "Senegal", code: "SEN", flag: "🇸🇳", points: 1594.31, change: "down", changeValue: 2, confederation: "CAF" },
  { rank: 19, team: "Iran", code: "IRN", flag: "🇮🇷", points: 1582.12, change: "up", changeValue: 1, confederation: "AFC" },
  { rank: 20, team: "Denmark", code: "DEN", flag: "🇩🇰", points: 1576.44, change: "down", changeValue: 1, confederation: "UEFA" },
];

export const WC_GROUPS: Group[] = [
  {
    name: "Group A",
    standings: [
      { rank: 1, team: "Mexico", code: "MEX", flag: "🇲🇽", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 2, goalDifference: 4, points: 7 },
      { rank: 2, team: "South Africa", code: "RSA", flag: "🇿🇦", played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 5 },
      { rank: 3, team: "Sweden", code: "SWE", flag: "🇸🇪", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
      { rank: 4, team: "New Zealand", code: "NZL", flag: "🇳🇿", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 6, goalDifference: -5, points: 0 }
    ]
  },
  {
    name: "Group B",
    standings: [
      { rank: 1, team: "Switzerland", code: "SUI", flag: "🇨🇭", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 2, goalDifference: 3, points: 7 },
      { rank: 2, team: "Canada", code: "CAN", flag: "🇨🇦", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 6, goalsAgainst: 4, goalDifference: 2, points: 6 },
      { rank: 3, team: "Ecuador", code: "ECU", flag: "🇪🇨", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 4 },
      { rank: 4, team: "Oman", code: "OMA", flag: "🇴🇲", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 7, goalDifference: -6, points: 0 }
    ]
  },
  {
    name: "Group C",
    standings: [
      { rank: 1, team: "Brazil", code: "BRA", flag: "🇧🇷", played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 8, goalsAgainst: 1, goalDifference: 7, points: 9 },
      { rank: 2, team: "Japan", code: "JPN", flag: "🇯🇵", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 3, goalDifference: 2, points: 6 },
      { rank: 3, team: "Poland", code: "POL", flag: "🇵🇱", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 5, goalDifference: -2, points: 3 },
      { rank: 4, team: "Ghana", code: "GHA", flag: "🇬🇭", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 8, goalDifference: -7, points: 0 }
    ]
  },
  {
    name: "Group D",
    standings: [
      { rank: 1, team: "England", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 1, goalDifference: 4, points: 7 },
      { rank: 2, team: "Denmark", code: "DEN", flag: "🇩🇰", played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 5 },
      { rank: 3, team: "Chile", code: "CHI", flag: "🇨🇱", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 4, goalDifference: 0, points: 4 },
      { rank: 4, team: "Honduras", code: "HON", flag: "🇭🇳", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 6, goalDifference: -5, points: 0 }
    ]
  },
  {
    name: "Group E",
    standings: [
      { rank: 1, team: "Belgium", code: "BEL", flag: "🇧🇪", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 2, goalDifference: 4, points: 7 },
      { rank: 2, team: "Colombia", code: "COL", flag: "🇨🇴", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 3, goalDifference: 2, points: 6 },
      { rank: 3, team: "Australia", code: "AUS", flag: "🇦🇺", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
      { rank: 4, team: "Morocco (Res)", code: "MAR", flag: "🇲🇦", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 7, goalDifference: -6, points: 0 }
    ]
  },
  {
    name: "Group F",
    standings: [
      { rank: 1, team: "Netherlands", code: "NED", flag: "🇳🇱", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 7, goalsAgainst: 2, goalDifference: 5, points: 7 },
      { rank: 2, team: "Croatia", code: "CRO", flag: "🇭🇷", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 4, goalDifference: 1, points: 6 },
      { rank: 3, team: "South Korea", code: "KOR", flag: "🇰🇷", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 4, goalDifference: 0, points: 4 },
      { rank: 4, team: "Jamaica", code: "JAM", flag: "🇯🇲", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 7, goalDifference: -6, points: 0 }
    ]
  },
  {
    name: "Group G",
    standings: [
      { rank: 1, team: "Spain", code: "ESP", flag: "🇪🇸", played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 9, goalsAgainst: 1, goalDifference: 8, points: 9 },
      { rank: 2, team: "USA", code: "USA", flag: "🇺🇸", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 4 },
      { rank: 3, team: "Cameroon", code: "CMR", flag: "🇨🇲", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 5, goalDifference: -2, points: 4 },
      { rank: 4, team: "Costa Rica", code: "CRC", flag: "🇨🇷", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 8, goalDifference: -7, points: 0 }
    ]
  },
  {
    name: "Group H",
    standings: [
      { rank: 1, team: "Portugal", code: "POR", flag: "🇵🇹", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 3, goalDifference: 3, points: 7 },
      { rank: 2, team: "Uruguay", code: "URU", flag: "🇺🇾", played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 5 },
      { rank: 3, team: "Nigeria", code: "NGA", flag: "🇳🇬", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 4, goalDifference: -1, points: 4 },
      { rank: 4, team: "China", code: "CHN", flag: "🇨🇳", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 2, goalsAgainst: 5, goalDifference: -3, points: 0 }
    ]
  },
  {
    name: "Group I",
    standings: [
      { rank: 1, team: "France", code: "FRA", flag: "🇫🇷", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 7, goalsAgainst: 2, goalDifference: 5, points: 7 },
      { rank: 2, team: "Senegal", code: "SEN", flag: "🇸🇳", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 4, goalDifference: 1, points: 6 },
      { rank: 3, team: "Norway", code: "NOR", flag: "🇳🇴", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 4, goalDifference: 0, points: 4 },
      { rank: 4, team: "Iraq", code: "IRQ", flag: "🇮🇶", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 7, goalDifference: -6, points: 0 }
    ]
  },
  {
    name: "Group J",
    standings: [
      { rank: 1, team: "Germany", code: "GER", flag: "🇩🇪", played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 8, goalsAgainst: 1, goalDifference: 7, points: 9 },
      { rank: 2, team: "Ukraine", code: "UKR", flag: "🇺🇦", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 4, goalDifference: 0, points: 6 },
      { rank: 3, team: "Peru", code: "PER", flag: "🇵🇪", played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 2, goalsAgainst: 5, goalDifference: -3, points: 1 },
      { rank: 4, team: "Canada (Res)", code: "CAN", flag: "🇨🇦", played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 5, goalDifference: -4, points: 1 }
    ]
  },
  {
    name: "Group K",
    standings: [
      { rank: 1, team: "Italy", code: "ITA", flag: "🇮🇹", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 2, goalDifference: 3, points: 7 },
      { rank: 2, team: "Morocco", code: "MAR", flag: "🇲🇦", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 6 },
      { rank: 3, team: "Egypt", code: "EGY", flag: "🇪🇬", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 5, goalDifference: -2, points: 3 },
      { rank: 4, team: "Saudi Arabia", code: "KSA", flag: "🇸🇦", played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 1 }
    ]
  },
  {
    name: "Group L",
    standings: [
      { rank: 1, team: "Argentina", code: "ARG", flag: "🇦🇷", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 1, goalDifference: 5, points: 7 },
      { rank: 2, team: "Austria", code: "AUT", flag: "🇦🇹", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 6 },
      { rank: 3, team: "Tunisia", code: "TUN", flag: "🇹🇳", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 3 },
      { rank: 4, team: "Panama", code: "PAN", flag: "🇵🇦", played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 5, goalDifference: -4, points: 1 }
    ]
  }
];

export const INITIAL_LIVE_MATCHES: Match[] = [
  {
    id: "live-1",
    homeTeam: "Netherlands",
    homeCode: "NED",
    homeFlag: "🇳🇱",
    awayTeam: "Morocco",
    awayCode: "MAR",
    awayFlag: "🇲🇦",
    homeScore: 1,
    awayScore: 1,
    status: "LIVE",
    stage: "Round of 32",
    minute: 68,
    date: "2026-06-26",
    time: "22:00",
    stadium: "MetLife Stadium",
    city: "East Rutherford, NJ",
    broadcastChannel: "Fox Sports 1",
    lineups: {
      home: ["Verbruggen", "Dumfries", "Van Dijk", "Ake", "Blind", "Schouten", "Reijnders", "Simons", "Frimpong", "Gakpo", "Depay"],
      away: ["Bounou", "Hakimi", "Aguerd", "Saiss", "Mazraoui", "Amrabat", "Ounahi", "Ziyech", "Harit", "Adli", "En-Nesyri"]
    },
    stats: {
      possession: { home: 56, away: 44 },
      shots: { home: 11, away: 9 },
      shotsOnTarget: { home: 4, away: 3 },
      fouls: { home: 8, away: 12 },
      yellowCards: { home: 1, away: 2 },
      redCards: { home: 0, away: 0 },
      passes: { home: 420, away: 330 },
      passAccuracy: { home: 88, away: 82 }
    },
    events: [
      { minute: 18, type: "YELLOW_CARD", player: "Sofyan Amrabat", team: "away", detail: "Tactical foul" },
      { minute: 34, type: "GOAL", player: "Cody Gakpo", team: "home", detail: "Assist by Xavi Simons" },
      { minute: 45, type: "YELLOW_CARD", player: "Nathan Ake", team: "home", detail: "Late challenge" },
      { minute: 52, type: "GOAL", player: "Youssef En-Nesyri", team: "away", detail: "Header from Achraf Hakimi cross" },
      { minute: 61, type: "YELLOW_CARD", player: "Nayef Aguerd", team: "away", detail: "Foul on Memphis Depay" }
    ]
  },
  {
    id: "live-2",
    homeTeam: "Brazil",
    homeCode: "BRA",
    homeFlag: "🇧🇷",
    awayTeam: "Japan",
    awayCode: "JPN",
    awayFlag: "🇯🇵",
    homeScore: 2,
    awayScore: 0,
    status: "LIVE",
    stage: "Round of 32",
    minute: 27,
    date: "2026-06-26",
    time: "23:00",
    stadium: "SoFi Stadium",
    city: "Inglewood, CA",
    broadcastChannel: "ESPN HD",
    lineups: {
      home: ["Alisson", "Danilo", "Marquinhos", "Gabriel", "Arana", "Guimaraes", "Gomes", "Paqueta", "Rodrygo", "Vinicius Jr.", "Endrick"],
      away: ["Suzuki", "Sugawara", "Itakura", "Tomiyasu", "Ito", "Endo", "Morita", "Kubo", "Minamino", "Mitoma", "Ueda"]
    },
    stats: {
      possession: { home: 65, away: 35 },
      shots: { home: 7, away: 2 },
      shotsOnTarget: { home: 4, away: 0 },
      fouls: { home: 3, away: 5 },
      yellowCards: { home: 0, away: 1 },
      redCards: { home: 0, away: 0 },
      passes: { home: 180, away: 95 },
      passAccuracy: { home: 92, away: 78 }
    },
    events: [
      { minute: 8, type: "GOAL", player: "Vinicius Jr.", team: "home", detail: "Brilliant solo run" },
      { minute: 14, type: "YELLOW_CARD", player: "Wataru Endo", team: "away", detail: "Foul on Paqueta" },
      { minute: 22, type: "GOAL", player: "Endrick", team: "home", detail: "Tap-in, assist by Rodrygo" }
    ]
  }
];

export const RECENT_RESULTS: Match[] = [
  {
    id: "res-1",
    homeTeam: "Argentina",
    homeCode: "ARG",
    homeFlag: "🇦🇷",
    awayTeam: "Tunisia",
    awayCode: "TUN",
    awayFlag: "🇹🇳",
    homeScore: 3,
    awayScore: 0,
    status: "FINISHED",
    stage: "Group L - Matchday 3",
    date: "2026-06-25",
    time: "19:00",
    stadium: "Hard Rock Stadium",
    city: "Miami, FL",
    stats: {
      possession: { home: 70, away: 30 },
      shots: { home: 18, away: 4 },
      shotsOnTarget: { home: 9, away: 1 },
      fouls: { home: 6, away: 14 },
      yellowCards: { home: 0, away: 3 },
      redCards: { home: 0, away: 0 },
      passes: { home: 680, away: 290 },
      passAccuracy: { home: 91, away: 75 }
    },
    events: [
      { minute: 29, type: "GOAL", player: "Lionel Messi", team: "home", detail: "Direct free kick" },
      { minute: 58, type: "GOAL", player: "Julian Alvarez", team: "home", detail: "Assist by Enzo Fernandez" },
      { minute: 82, type: "GOAL", player: "Lautaro Martinez", team: "home", detail: "Penalty" }
    ]
  },
  {
    id: "res-2",
    homeTeam: "France",
    homeCode: "FRA",
    homeFlag: "🇫🇷",
    awayTeam: "Senegal",
    awayCode: "SEN",
    awayFlag: "🇸🇳",
    homeScore: 2,
    awayScore: 1,
    status: "FINISHED",
    stage: "Group I - Matchday 3",
    date: "2026-06-24",
    time: "21:00",
    stadium: "AT&T Stadium",
    city: "Arlington, TX",
    stats: {
      possession: { home: 54, away: 46 },
      shots: { home: 14, away: 11 },
      shotsOnTarget: { home: 5, away: 4 },
      fouls: { home: 11, away: 15 },
      yellowCards: { home: 2, away: 3 },
      redCards: { home: 0, away: 0 },
      passes: { home: 490, away: 410 },
      passAccuracy: { home: 86, away: 81 }
    },
    events: [
      { minute: 12, type: "GOAL", player: "Kylian Mbappe", team: "home", detail: "Stunning strike" },
      { minute: 39, type: "GOAL", player: "Nicolas Jackson", team: "away", detail: "Deflected shot" },
      { minute: 76, type: "GOAL", player: "Antoine Griezmann", team: "home", detail: "Assist by Ousmane Dembele" }
    ]
  },
  {
    id: "res-3",
    homeTeam: "Germany",
    homeCode: "GER",
    homeFlag: "🇩🇪",
    awayTeam: "Ukraine",
    awayCode: "UKR",
    awayFlag: "🇺🇦",
    homeScore: 3,
    awayScore: 1,
    status: "FINISHED",
    stage: "Group J - Matchday 3",
    date: "2026-06-24",
    time: "16:00",
    stadium: "Mercedes-Benz Stadium",
    city: "Atlanta, GA",
    stats: {
      possession: { home: 62, away: 38 },
      shots: { home: 15, away: 8 },
      shotsOnTarget: { home: 7, away: 3 },
      fouls: { home: 9, away: 10 },
      yellowCards: { home: 1, away: 1 },
      redCards: { home: 0, away: 0 },
      passes: { home: 580, away: 360 },
      passAccuracy: { home: 89, away: 82 }
    },
    events: [
      { minute: 22, type: "GOAL", player: "Jamal Musiala", team: "home", detail: "Assist by Wirtz" },
      { minute: 44, type: "GOAL", player: "Artem Dovbyk", team: "away", detail: "Header" },
      { minute: 67, type: "GOAL", player: "Florian Wirtz", team: "home", detail: "Low shot" },
      { minute: 88, type: "GOAL", player: "Kai Havertz", team: "home", detail: "Tap-in" }
    ]
  },
  {
    id: "res-4",
    homeTeam: "Spain",
    homeCode: "ESP",
    homeFlag: "🇪🇸",
    awayTeam: "Costa Rica",
    awayCode: "CRC",
    awayFlag: "🇨🇷",
    homeScore: 4,
    awayScore: 0,
    status: "FINISHED",
    stage: "Group G - Matchday 3",
    date: "2026-06-23",
    time: "20:00",
    stadium: "Lincoln Financial Field",
    city: "Philadelphia, PA",
    stats: {
      possession: { home: 74, away: 26 },
      shots: { home: 22, away: 2 },
      shotsOnTarget: { home: 11, away: 0 },
      fouls: { home: 5, away: 12 },
      yellowCards: { home: 0, away: 2 },
      redCards: { home: 0, away: 0 },
      passes: { home: 810, away: 210 },
      passAccuracy: { home: 93, away: 68 }
    },
    events: [
      { minute: 14, type: "GOAL", player: "Lamine Yamal", team: "home", detail: "Curler into top corner" },
      { minute: 31, type: "GOAL", player: "Nico Williams", team: "home", detail: "Assist by Yamal" },
      { minute: 56, type: "GOAL", player: "Alvaro Morata", team: "home", detail: "Header" },
      { minute: 85, type: "GOAL", player: "Pedri", team: "home", detail: "Assist by Dani Olmo" }
    ]
  }
];

export const UPCOMING_MATCHES: Match[] = [
  {
    id: "up-1",
    homeTeam: "Canada",
    homeCode: "CAN",
    homeFlag: "🇨🇦",
    awayTeam: "South Africa",
    awayCode: "RSA",
    awayFlag: "🇿🇦",
    homeScore: 0,
    awayScore: 0,
    status: "SCHEDULED",
    stage: "Round of 32",
    date: "2026-06-27",
    time: "18:00",
    stadium: "BC Place",
    city: "Vancouver, Canada",
    broadcastChannel: "Sony Ten 2",
    events: [],
    stats: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 },
      passes: { home: 0, away: 0 },
      passAccuracy: { home: 0, away: 0 }
    }
  },
  {
    id: "up-2",
    homeTeam: "USA",
    homeCode: "USA",
    homeFlag: "🇺🇸",
    awayTeam: "Croatia",
    awayCode: "CRO",
    awayFlag: "🇭🇷",
    homeScore: 0,
    awayScore: 0,
    status: "SCHEDULED",
    stage: "Round of 32",
    date: "2026-06-27",
    time: "21:00",
    stadium: "Lumen Field",
    city: "Seattle, WA",
    broadcastChannel: "Fox Sports 1",
    events: [],
    stats: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 },
      passes: { home: 0, away: 0 },
      passAccuracy: { home: 0, away: 0 }
    }
  },
  {
    id: "up-3",
    homeTeam: "Argentina",
    homeCode: "ARG",
    homeFlag: "🇦🇷",
    awayTeam: "Denmark",
    awayCode: "DEN",
    awayFlag: "🇩🇰",
    homeScore: 0,
    awayScore: 0,
    status: "SCHEDULED",
    stage: "Round of 32",
    date: "2026-06-28",
    time: "15:00",
    stadium: "Gillette Stadium",
    city: "Foxborough, MA",
    broadcastChannel: "ESPN HD",
    events: [],
    stats: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 },
      passes: { home: 0, away: 0 },
      passAccuracy: { home: 0, away: 0 }
    }
  },
  {
    id: "up-4",
    homeTeam: "England",
    homeCode: "ENG",
    homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    awayTeam: "Uruguay",
    awayCode: "URU",
    awayFlag: "🇺🇾",
    homeScore: 0,
    awayScore: 0,
    status: "SCHEDULED",
    stage: "Round of 32",
    date: "2026-06-28",
    time: "19:00",
    stadium: "MetLife Stadium",
    city: "East Rutherford, NJ",
    broadcastChannel: "Fox Sports 1",
    events: [],
    stats: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 },
      passes: { home: 0, away: 0 },
      passAccuracy: { home: 0, away: 0 }
    }
  },
  {
    id: "up-5",
    homeTeam: "Spain",
    homeCode: "ESP",
    homeFlag: "🇪🇸",
    awayTeam: "Colombia",
    awayCode: "COL",
    awayFlag: "🇨🇴",
    homeScore: 0,
    awayScore: 0,
    status: "SCHEDULED",
    stage: "Round of 32",
    date: "2026-06-29",
    time: "17:00",
    stadium: "Levi's Stadium",
    city: "Santa Clara, CA",
    broadcastChannel: "Sony Ten 2",
    events: [],
    stats: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 },
      passes: { home: 0, away: 0 },
      passAccuracy: { home: 0, away: 0 }
    }
  },
  {
    id: "up-6",
    homeTeam: "Germany",
    homeCode: "GER",
    homeFlag: "🇩🇪",
    awayTeam: "Senegal",
    awayCode: "SEN",
    awayFlag: "🇸🇳",
    homeScore: 0,
    awayScore: 0,
    status: "SCHEDULED",
    stage: "Round of 32",
    date: "2026-06-29",
    time: "20:00",
    stadium: "NRG Stadium",
    city: "Houston, TX",
    broadcastChannel: "ESPN HD",
    events: [],
    stats: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 },
      passes: { home: 0, away: 0 },
      passAccuracy: { home: 0, away: 0 }
    }
  }
];
