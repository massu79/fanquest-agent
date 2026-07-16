import type { WorldCupMatch } from "./worldcup-data";

export type QuestTemplate = {
  id: string;
  title: string;
  description: string;
  basePoints: number;
  type: "prediction" | "action" | "vote";
};

export type FanSubmission = {
  displayName: string;
  winnerPrediction: string;
  firstScoringTeam: string;
  playerOfMatch: string;
  supportComment: string;
  checkedIn: boolean;
};

export type ScoredSubmission = FanSubmission & {
  id: string;
  points: number;
  breakdown: string[];
};

export const questTemplates: QuestTemplate[] = [
  {
    id: "winner",
    title: "Winner Pick Hit",
    description: "Call the final result before the room loses its voice.",
    basePoints: 30,
    type: "prediction"
  },
  {
    id: "first-goal",
    title: "First Goal Bonus",
    description: "Pick who lands the first punch and own the opening roar.",
    basePoints: 20,
    type: "prediction"
  },
  {
    id: "support",
    title: "Supporter Signal",
    description: "Drop a clean rally comment for your side or watch party.",
    basePoints: 5,
    type: "action"
  },
  {
    id: "check-in",
    title: "Watch Party Check-in",
    description: "Confirm you are in the room, Discord, or live thread.",
    basePoints: 10,
    type: "action"
  },
  {
    id: "potm",
    title: "Fan MVP Vote",
    description: "Vote for the player who changed the match rhythm.",
    basePoints: 5,
    type: "vote"
  }
];

export function generateQuests(match: WorldCupMatch): QuestTemplate[] {
  return questTemplates.map((quest) => ({
    ...quest,
    description: `${quest.description} ${match.homeTeam} vs ${match.awayTeam} is the stage.`
  }));
}

export function calculatePoints(match: WorldCupMatch, submission: FanSubmission): ScoredSubmission {
  let points = 0;
  const breakdown: string[] = [];

  if (match.winner && submission.winnerPrediction === match.winner) {
    points += 30;
    breakdown.push("+30 correct winner");
    if (submission.winnerPrediction === match.underdog) {
      points += 15;
      breakdown.push("+15 underdog bonus");
    }
  }

  if (match.firstScoringTeam && submission.firstScoringTeam === match.firstScoringTeam) {
    points += 20;
    breakdown.push("+20 first scoring team");
  }

  if (submission.supportComment.trim().length > 0) {
    points += 5;
    breakdown.push("+5 support comment");
  }

  if (submission.checkedIn) {
    points += 10;
    breakdown.push("+10 watch party check-in");
  }

  if (submission.playerOfMatch.trim().length > 0) {
    points += 5;
    breakdown.push("+5 player of the match vote");
  }

  return {
    ...submission,
    id: `${submission.displayName.toLowerCase().replace(/\W+/g, "-")}-${match.id}`,
    points,
    breakdown: breakdown.length ? breakdown : ["0 points until results are available"]
  };
}

export const demoSubmissions: FanSubmission[] = [
  {
    displayName: "Aiko",
    winnerPrediction: "Uruguay",
    firstScoringTeam: "Spain",
    playerOfMatch: "Valverde",
    supportComment: "Comeback energy only.",
    checkedIn: true
  },
  {
    displayName: "Mateo",
    winnerPrediction: "Spain",
    firstScoringTeam: "Spain",
    playerOfMatch: "Pedri",
    supportComment: "Midfield masterclass incoming.",
    checkedIn: true
  },
  {
    displayName: "Noor",
    winnerPrediction: "Uruguay",
    firstScoringTeam: "Uruguay",
    playerOfMatch: "Nunez",
    supportComment: "Watch party is loud tonight.",
    checkedIn: true
  }
];
