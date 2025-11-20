export type TimeRange = '24H' | '7D' | '30D' | 'YTD' | 'ALL';

export interface Position {
  coin: string;
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  leverage: number;
  side: 'LONG' | 'SHORT';
  marginUsed: number;
}

export interface TraderStats {
  rank: number;
  address: string;
  pnl: number; // Renamed from monthlyPnl
  totalAccountValue: number;
  roi: number; // Renamed from monthlyRoi
  winRate: number; 
  totalTrades: number;
  sharpeRatio: number;
}

export interface TraderDetail extends TraderStats {
  positions: Position[];
  history: { date: string; pnl: number; equity: number }[];
  tags: string[]; 
  riskScore: number; 
  maxDrawdown: number; 
}

export interface GlobalMetrics {
  totalVolume: number;
  averageRoi: number;
  longPercentage: number;
  shortPercentage: number;
  topTradedCoins: { name: string; value: number }[];
}

export interface CoinPrice {
    symbol: string;
    price: number;
    change24h: number;
}