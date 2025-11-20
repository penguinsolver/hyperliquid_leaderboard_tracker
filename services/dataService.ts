import { TraderDetail, Position, GlobalMetrics, CoinPrice, TimeRange } from '../types';

// Utilities
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;
const COINS = ['BTC', 'ETH', 'SOL', 'HYPE', 'ARB', 'SUI', 'TIA', 'WIF', 'PEPE'];

// Generate a random address
const generateAddress = () => '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

// Generate realistic positions
const generatePositions = (accountValue: number): Position[] => {
  const numPositions = Math.floor(randomRange(1, 6));
  const positions: Position[] = [];

  for (let i = 0; i < numPositions; i++) {
    const coin = COINS[Math.floor(Math.random() * COINS.length)];
    const isLong = Math.random() > 0.45; 
    const leverage = Math.floor(randomRange(1, 25));
    const marginUsed = (accountValue * randomRange(0.05, 0.3)); 
    const sizeUSD = marginUsed * leverage;
    
    const basePrice = coin === 'BTC' ? 65000 : coin === 'ETH' ? 3200 : coin === 'SOL' ? 145 : randomRange(1, 20);
    const entryPrice = basePrice * randomRange(0.95, 1.05);
    const markPrice = basePrice * randomRange(0.98, 1.02);
    
    const priceDiffPercent = (markPrice - entryPrice) / entryPrice;
    const pnl = isLong 
      ? sizeUSD * priceDiffPercent 
      : sizeUSD * -priceDiffPercent;

    positions.push({
      coin,
      size: sizeUSD / entryPrice,
      entryPrice,
      markPrice,
      pnl,
      leverage,
      side: isLong ? 'LONG' : 'SHORT',
      marginUsed
    });
  }
  return positions;
};

const generateHistory = (startEquity: number) => {
  const history = [];
  let currentEquity = startEquity;
  const days = 30;
  
  for (let i = 0; i < days; i++) {
    const dailyChange = currentEquity * randomRange(-0.05, 0.08); 
    currentEquity += dailyChange;
    history.push({
      date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pnl: dailyChange,
      equity: currentEquity
    });
  }
  return history;
};

const calculateRiskScore = (leverage: number, winRate: number, drawdown: number): number => {
    let score = 5;
    if (leverage > 15) score += 3;
    else if (leverage > 5) score += 1;
    
    if (winRate < 45) score += 2;
    if (drawdown > 20) score += 2;
    
    return Math.min(10, Math.max(1, score));
};

// Multipliers to simulate different timeframes based on a "Monthly" baseline
const TIME_MULTIPLIERS: Record<TimeRange, number> = {
    '24H': 0.1,
    '7D': 0.3,
    '30D': 1,
    'YTD': 4.5,
    'ALL': 8
};

export const generateLeaderboard = (count: number = 100, timeRange: TimeRange = '30D'): TraderDetail[] => {
  const multiplier = TIME_MULTIPLIERS[timeRange];

  return Array.from({ length: count }).map((_, index) => {
    // Base ROI scaled by timeframe
    const baseRoi = randomRange(-20, 300) * (1 - index * 0.005); 
    const roi = baseRoi * multiplier;

    const totalAccountValue = randomRange(10000, 5000000);
    const pnl = totalAccountValue * (roi / 100);
    const positions = generatePositions(totalAccountValue);
    
    const avgLeverage = positions.length > 0 
        ? positions.reduce((acc, p) => acc + p.leverage, 0) / positions.length 
        : 1;
    
    const winRate = randomRange(40, 90);
    const maxDrawdown = randomRange(5, 35);

    const tags = [];
    if (avgLeverage > 15) tags.push('Degen');
    else if (avgLeverage < 3) tags.push('Safe');
    
    if (roi > (100 * multiplier)) tags.push('Alpha'); // Alpha threshold scales with time
    if (totalAccountValue > 1000000) tags.push('Whale');
    if (tags.length === 0) tags.push('Trader');

    return {
      rank: index + 1,
      address: generateAddress(),
      pnl,
      totalAccountValue,
      roi,
      winRate,
      totalTrades: Math.floor(randomRange(50, 2000) * (multiplier > 1 ? multiplier : 1)), // Scale trade count roughly
      sharpeRatio: randomRange(1, 4),
      positions,
      history: generateHistory(totalAccountValue - pnl),
      tags: tags.slice(0, 2),
      maxDrawdown,
      riskScore: Math.floor(calculateRiskScore(avgLeverage, winRate, maxDrawdown))
    };
  });
};

export const calculateGlobalMetrics = (traders: TraderDetail[]): GlobalMetrics => {
  let totalLongs = 0;
  let totalShorts = 0;
  let totalVolume = 0;
  let totalRoi = 0;
  const coinCounts: Record<string, number> = {};

  traders.forEach(t => {
    totalRoi += t.roi;
    t.positions.forEach(p => {
      const sizeUSD = p.size * p.markPrice;
      totalVolume += sizeUSD;
      if (p.side === 'LONG') totalLongs++;
      else totalShorts++;
      
      coinCounts[p.coin] = (coinCounts[p.coin] || 0) + sizeUSD;
    });
  });

  const sortedCoins = Object.entries(coinCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const totalPositions = totalLongs + totalShorts;

  return {
    totalVolume,
    averageRoi: totalRoi / traders.length,
    longPercentage: totalPositions ? (totalLongs / totalPositions) * 100 : 0,
    shortPercentage: totalPositions ? (totalShorts / totalPositions) * 100 : 0,
    topTradedCoins: sortedCoins
  };
};

export const generateMarketTicker = (): CoinPrice[] => {
    return COINS.map(coin => {
        const basePrice = coin === 'BTC' ? 65000 : coin === 'ETH' ? 3200 : coin === 'SOL' ? 145 : randomRange(1, 20);
        return {
            symbol: coin,
            price: basePrice * randomRange(0.99, 1.01),
            change24h: randomRange(-5, 5)
        };
    });
};