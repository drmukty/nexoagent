export type Direction = 'LONG' | 'SHORT';
export type Bias = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type Narrative = 'gemini' | 'template';

export interface AnalyseResult {
  kind: 'analyse';
  analysisId: string;
  symbol: string;
  ca: string;
  chartUrl: string;
  bias: Bias;
  description: string;
  rsi: { value: string; note: string };
  macd: { state: 'flat' | 'rising' | 'falling'; note: string };
  bb: { state: 'squeeze' | 'expanding' | 'normal'; note: string };
  plan: { entry: string; target: string; stop: string; direction: Direction };
  confidence: { score: number; caution: string };
  asOf: string;
  narrative: Narrative;
}

/** null means "Data unavailable" and is rendered as such. Numbers are never invented. */
export interface MindshareResult {
  kind: 'mindshare';
  token: string;
  status: 'ok' | 'unavailable';
  reason?: string;
  metrics?: {
    maigaIq: string | null;
    mindsharePct: string | null;
    hype: string | null;
    loyalty: string | null;
    bullish: string | null;
    neutral: string | null;
    bearish: string | null;
  };
  summary?: string[];
  tweetStats?: { total: string; authors: string; engagement: string; note?: string };
  highlights?: string[];
  interpretation?: { strengths: string; weaknesses: string } | null;
  asOf: string;
}

export interface ReportResult {
  kind: 'report';
  token: string;
  ca: string;
  chartUrl: string;
  trend: string | null;
  rsi: string | null;
  openInterest: string | null;
  funding: string | null;
  fundFlow: string | null;
  sentiment: string | null;
  summary: string;
  narrative: Narrative;
  asOf: string;
}

export interface ErrorResult {
  kind: 'error';
  message: string;
  retryable: boolean;
  command?: string;
  query?: string;
}

export type CommandName = 'analyse' | 'mindshare' | 'report';
export type Result = AnalyseResult | MindshareResult | ReportResult | ErrorResult;

export interface BetDTO {
  id: string;
  analysisId: string;
  status: 'PENDING' | 'WON' | 'LOST';
  userChoice: 'AGREE' | 'DISAGREE';
  xpAwarded: number | null;
  resolvesAt: string;
  createdAt: string;
  tokenSymbol: string;
}

export interface NotificationDTO {
  id: string;
  message: string;
  xpChange: number;
  isRead: boolean;
  createdAt: string;
}

export interface MeDTO {
  address: string;
  xp: number;
  rank: number;
  createdAt: string;
}

export interface LeaderboardDTO {
  top: { rank: number; address: string; xp: number; isMe: boolean }[];
  me: { rank: number; xp: number };
}
