import React, { useEffect, useState, useMemo } from 'react';
import { generateLeaderboard, calculateGlobalMetrics } from './services/dataService';
import { TraderDetail, GlobalMetrics, TimeRange } from './types';
import { LeaderboardTable } from './components/LeaderboardTable';
import { TraderDetailView } from './components/TraderDetailView';
import { TickerTape } from './components/TickerTape';
import { Card } from './components/Card';
import { Activity, BarChart3, DollarSign, Percent, Zap, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [traders, setTraders] = useState<TraderDetail[]>([]);
  const [metrics, setMetrics] = useState<GlobalMetrics | null>(null);
  const [selectedTrader, setSelectedTrader] = useState<TraderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');

  useEffect(() => {
    // Simulate data fetching from Hyperliquid pipeline
    const fetchData = () => {
      setLoading(true);
      // Slightly faster debounce for time range switches
      setTimeout(() => {
        const data = generateLeaderboard(100, timeRange);
        setTraders(data);
        setMetrics(calculateGlobalMetrics(data));
        setLoading(false);
      }, 600);
    };

    fetchData();
  }, [timeRange]);

  const topGainers = useMemo(() => {
      return [...traders].sort((a,b) => b.pnl - a.pnl).slice(0, 3);
  }, [traders]);

  const timeRangeOptions: TimeRange[] = ['24H', '7D', '30D', 'YTD', 'ALL'];

  return (
    <div className="min-h-screen bg-hl-dark text-hl-text font-sans selection:bg-hl-accent selection:text-white pb-20">
      {/* Navbar */}
      <nav className="border-b border-hl-border bg-hl-dark/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-hl-green w-6 h-6 fill-current" />
            <span className="font-bold text-xl tracking-tight">Hyper<span className="text-hl-green">Pulse</span></span>
          </div>
          <div className="flex items-center gap-4">
              <button className="hidden md:block text-sm text-hl-muted hover:text-white transition-colors">Documentation</button>
              <div className="text-xs font-mono text-hl-green bg-hl-green/10 px-2 py-1 rounded border border-hl-green/20 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                LIVE
              </div>
          </div>
        </div>
        {/* Integrated Ticker Tape */}
        <TickerTape />
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Intro Text & Time Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Leaderboard Analytics</h1>
                <p className="text-hl-muted max-w-2xl">
                    Real-time tracking of top performing accounts on Hyperliquid. Analyze PnL, ROI, and discover smart money strategies with AI-powered insights.
                </p>
            </div>
            
            {/* Time Range Toggle */}
            <div className="bg-hl-card border border-hl-border rounded-lg p-1 flex items-center">
                {timeRangeOptions.map((option) => (
                    <button
                        key={option}
                        onClick={() => setTimeRange(option)}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                            timeRange === option 
                            ? 'bg-hl-border text-white shadow-sm' 
                            : 'text-hl-muted hover:text-white'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>

        {loading || !metrics ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hl-green"></div>
          </div>
        ) : (
          <>
            {/* Global Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-5 border-l-4 border-l-hl-accent">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-hl-muted text-xs font-bold uppercase tracking-wider">Total Vol (Top 100)</span>
                    <DollarSign className="w-4 h-4 text-hl-accent" />
                 </div>
                 <div className="text-2xl font-mono text-white font-medium">
                    ${(metrics.totalVolume / 1000000).toFixed(1)}M
                 </div>
              </Card>
              
              <Card className="p-5 border-l-4 border-l-hl-green">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-hl-muted text-xs font-bold uppercase tracking-wider">Avg ROI ({timeRange})</span>
                    <Percent className="w-4 h-4 text-hl-green" />
                 </div>
                 <div className="text-2xl font-mono text-hl-green font-medium">
                    +{metrics.averageRoi.toFixed(1)}%
                 </div>
              </Card>

              <Card className="p-5 border-l-4 border-l-orange-500">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-hl-muted text-xs font-bold uppercase tracking-wider">Market Bias</span>
                    <Activity className="w-4 h-4 text-orange-500" />
                 </div>
                 <div className="flex items-center gap-4 mt-1">
                    <div className="flex flex-col">
                        <span className="text-xs text-hl-green">Longs</span>
                        <span className="text-xl font-mono font-medium">{metrics.longPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-8 w-[1px] bg-hl-border"></div>
                    <div className="flex flex-col">
                        <span className="text-xs text-hl-red">Shorts</span>
                        <span className="text-xl font-mono font-medium">{metrics.shortPercentage.toFixed(0)}%</span>
                    </div>
                 </div>
              </Card>

               <Card className="p-5 border-l-4 border-l-purple-500">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-hl-muted text-xs font-bold uppercase tracking-wider">Top Asset</span>
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                 </div>
                 <div className="text-2xl font-mono text-white font-medium">
                    {metrics.topTradedCoins[0]?.name || 'N/A'}
                 </div>
                 <div className="text-xs text-hl-muted mt-1">
                    Most traded by winners
                 </div>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Leaderboard Section */}
                <div className="lg:col-span-3">
                    <Card className="bg-hl-dark border-none ring-1 ring-hl-border flex flex-col">
                        <LeaderboardTable 
                            traders={traders} 
                            onSelectTrader={setSelectedTrader} 
                            timeRange={timeRange}
                        />
                    </Card>
                </div>

                {/* Side Panel: Top Gainers Spotlight */}
                <div className="lg:col-span-1 flex flex-col gap-4 sticky top-24 h-fit">
                    <h3 className="text-sm font-bold text-hl-muted uppercase tracking-wider">Spotlight ({timeRange})</h3>
                    {topGainers.map((trader) => (
                        <Card 
                            key={trader.address} 
                            className="p-4 hover:ring-1 hover:ring-hl-accent cursor-pointer transition-all bg-gradient-to-b from-hl-card to-hl-dark group"
                            onClick={() => setSelectedTrader(trader)}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-500/30">
                                    Rank #{trader.rank}
                                </span>
                                <span className="text-hl-green font-mono text-sm">+{trader.roi.toFixed(0)}%</span>
                            </div>
                            <div className="font-mono text-white text-sm truncate mb-2 group-hover:text-hl-accent transition-colors">{trader.address}</div>
                            <div className="flex justify-between text-xs text-hl-muted mt-2 pt-2 border-t border-hl-border">
                                <span>Profit</span>
                                <span className="text-white font-mono">${(trader.pnl / 1000).toFixed(1)}k</span>
                            </div>
                        </Card>
                    ))}
                    
                    <div className="mt-4 p-6 rounded-xl border border-dashed border-hl-border text-center bg-hl-card/50">
                        <p className="text-sm font-bold text-white mb-1">Connect Wallet</p>
                        <p className="text-xs text-hl-muted mb-4">Unlock advanced filters and copy-trading features.</p>
                        <button className="text-xs bg-white hover:bg-gray-200 text-black font-bold px-4 py-2 rounded transition-colors w-full">
                            Connect
                        </button>
                    </div>
                </div>
            </div>
          </>
        )}
      </main>

      {selectedTrader && (
        <TraderDetailView 
            trader={selectedTrader} 
            onClose={() => setSelectedTrader(null)} 
        />
      )}
    </div>
  );
};

export default App;