export type MatchStatus = "upcoming" | "live" | "halftime" | "finished";

export type WorldCupMatch = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  status: MatchStatus;
  score: { home: number; away: number };
  round: string;
  venue: string;
  favorite: string;
  underdog: string;
  firstScoringTeam?: string;
  winner?: string;
  liveEvent?: string;
};

export type WorldCupFeed = {
  matches: WorldCupMatch[];
  source: "ESPN public scoreboard" | "deterministic fallback";
  sourceUrl: string;
  fetchedAt: string;
  live: boolean;
  fallbackReason?: string;
};

type EspnCompetitor = {
  homeAway?: "home" | "away";
  score?: string;
  winner?: boolean;
  team?: { displayName?: string };
};

type EspnEvent = {
  id?: string;
  date?: string;
  status?: { type?: { name?: string; detail?: string; completed?: boolean } };
  competitions?: Array<{
    competitors?: EspnCompetitor[];
    venue?: { fullName?: string };
    type?: { text?: string };
  }>;
};

type EspnScoreboard = { events?: EspnEvent[] };

const ESPN_SCOREBOARD = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

export const mockMatches: WorldCupMatch[] = [
  {
    id: "m1",
    homeTeam: "Japan",
    awayTeam: "Brazil",
    kickoff: "2026-06-12T19:00:00-04:00",
    status: "live",
    score: { home: 1, away: 1 },
    round: "Group B",
    venue: "MetLife Stadium",
    favorite: "Brazil",
    underdog: "Japan",
    firstScoringTeam: "Japan",
    liveEvent: "68' Brazil equalized from a set piece"
  },
  {
    id: "m2",
    homeTeam: "USA",
    awayTeam: "Mexico",
    kickoff: "2026-06-13T20:00:00-05:00",
    status: "upcoming",
    score: { home: 0, away: 0 },
    round: "Group A",
    venue: "AT&T Stadium",
    favorite: "USA",
    underdog: "Mexico",
    liveEvent: "Lineups expected 60 minutes before kickoff"
  },
  {
    id: "m3",
    homeTeam: "France",
    awayTeam: "Senegal",
    kickoff: "2026-06-14T16:00:00-04:00",
    status: "halftime",
    score: { home: 0, away: 1 },
    round: "Group D",
    venue: "Mercedes-Benz Stadium",
    favorite: "France",
    underdog: "Senegal",
    firstScoringTeam: "Senegal",
    liveEvent: "Halftime: Senegal lead after a counterattack goal"
  },
  {
    id: "m4",
    homeTeam: "Argentina",
    awayTeam: "Germany",
    kickoff: "2026-06-15T18:00:00-07:00",
    status: "finished",
    score: { home: 2, away: 1 },
    round: "Round of 16",
    venue: "SoFi Stadium",
    favorite: "Argentina",
    underdog: "Germany",
    firstScoringTeam: "Germany",
    winner: "Argentina",
    liveEvent: "Full time: Argentina advanced with a late winner"
  },
  {
    id: "m5",
    homeTeam: "England",
    awayTeam: "Ghana",
    kickoff: "2026-06-16T15:00:00-06:00",
    status: "upcoming",
    score: { home: 0, away: 0 },
    round: "Group F",
    venue: "Empower Field",
    favorite: "England",
    underdog: "Ghana",
    liveEvent: "Fan check-ins are open"
  },
  {
    id: "m6",
    homeTeam: "Spain",
    awayTeam: "Uruguay",
    kickoff: "2026-06-17T21:00:00-04:00",
    status: "finished",
    score: { home: 1, away: 2 },
    round: "Quarterfinal",
    venue: "Hard Rock Stadium",
    favorite: "Spain",
    underdog: "Uruguay",
    firstScoringTeam: "Spain",
    winner: "Uruguay",
    liveEvent: "Full time: Uruguay completed the comeback"
  }
];

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

function normalizeStatus(event: EspnEvent): MatchStatus {
  const name = event.status?.type?.name ?? "";
  if (event.status?.type?.completed || name.includes("FULL_TIME")) return "finished";
  if (name.includes("HALFTIME")) return "halftime";
  if (name.includes("IN_PROGRESS")) return "live";
  return "upcoming";
}

function normalizeEspnEvent(event: EspnEvent): WorldCupMatch | null {
  const competition = event.competitions?.[0];
  const home = competition?.competitors?.find((team) => team.homeAway === "home");
  const away = competition?.competitors?.find((team) => team.homeAway === "away");
  const homeTeam = home?.team?.displayName;
  const awayTeam = away?.team?.displayName;
  if (!event.id || !event.date || !homeTeam || !awayTeam) return null;

  const status = normalizeStatus(event);
  const winner = status === "finished" ? (home?.winner ? homeTeam : away?.winner ? awayTeam : undefined) : undefined;
  return {
    id: `espn-${event.id}`,
    homeTeam,
    awayTeam,
    kickoff: event.date,
    status,
    score: { home: Number(home?.score ?? 0), away: Number(away?.score ?? 0) },
    round: competition?.type?.text ?? (status === "finished" ? "World Cup result" : "World Cup fixture"),
    venue: competition?.venue?.fullName ?? "Venue TBC",
    favorite: homeTeam,
    underdog: awayTeam,
    winner,
    liveEvent: event.status?.type?.detail ?? (status === "finished" ? "Full time" : "Scheduled")
  };
}

export async function getWorldCupFeed(): Promise<WorldCupFeed> {
  const now = new Date();
  const dates = Array.from({ length: 9 }, (_, index) => {
    const date = new Date(now);
    date.setUTCDate(now.getUTCDate() + index - 5);
    return formatDate(date);
  });

  try {
    const responses = await Promise.all(dates.map(async (date) => {
      const response = await fetch(`${ESPN_SCOREBOARD}?dates=${date}&limit=20`, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) throw new Error(`ESPN returned ${response.status}`);
      return (await response.json()) as EspnScoreboard;
    }));
    const unique = new Map<string, WorldCupMatch>();
    responses.flatMap((response) => response.events ?? []).forEach((event) => {
      const match = normalizeEspnEvent(event);
      if (match) unique.set(match.id, match);
    });
    const matches = [...unique.values()].sort((a, b) => a.kickoff.localeCompare(b.kickoff));
    if (matches.length === 0) throw new Error("No World Cup matches in the current date window");
    return {
      matches,
      source: "ESPN public scoreboard",
      sourceUrl: ESPN_SCOREBOARD,
      fetchedAt: new Date().toISOString(),
      live: true
    };
  } catch (error) {
    return {
      matches: mockMatches,
      source: "deterministic fallback",
      sourceUrl: ESPN_SCOREBOARD,
      fetchedAt: new Date().toISOString(),
      live: false,
      fallbackReason: error instanceof Error ? error.message : "World Cup provider unavailable"
    };
  }
}

export async function getWorldCupMatches(): Promise<WorldCupMatch[]> {
  return (await getWorldCupFeed()).matches;
}
