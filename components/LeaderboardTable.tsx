import React, { useState, useMemo } from 'react';
import { TraderDetail, TimeRange } from '../types';
import { Trophy, Search, HelpCircle } from 'lucide-react';

interface LeaderboardTableProps {
  traders: TraderDetail[];
  onSelectTrader: (trader: TraderDetail) => void;
  timeRange: TimeRange;
}

type FilterType = 'ALL' | 'WHALE' | 'DEGEN' | 'SAFE' | 'ALPHA';

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ traders, onSelectTrader, timeRange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [showLegend, setShowLegend] = useState(false);

  const filteredTraders = useMemo(() => {
      return traders.filter(t => {
          const matchesSearch = t.address.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesFilter = activeFilter === 'ALL' 
            ? true 
            : t.tags.some(tag => tag.toUpperCase() === activeFilter);
          return matchesSearch && matchesFilter;
      });
  }, [traders, searchTerm, activeFilter]);

  return (
    <div className="w-full">
      {/* Search and Filter Toolbar */}
      <div className="p-4 border-b border-hl-border flex flex-col md:flex-row gap-4 justify-between items-center relative">
        <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-hl-muted" />
            <input 
                type="text" 
                placeholder="Search address..." 
                className="w-full bg-hl-dark border border-hl-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-hl-accent transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                {(['ALL', 'WHALE', 'DEGEN', 'SAFE', 'ALPHA'] as FilterType[]).map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-3 py-1.5 text-xs font-bold rounded border transition-all whitespace-nowrap ${
                            activeFilter === filter 
                            ? 'bg-hl-accent border-hl-accent text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-hl-dark border-hl-border text-hl-muted hover:text-white hover:border-hl-muted'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
            
            <div className="relative ml-2">
                <button 
                    className="p-1.5 text-hl-muted hover:text-white transition-colors"
                    onMouseEnter={() => setShowLegend(true)}
                    onMouseLeave={() => setShowLegend(false)}
                >
                    <HelpCircle className="w-5 h-5" />
                </button>
                
                {showLegend && (
                    <div className="absolute right-0 top-8 w-64 bg-hl-card border border-hl-border rounded-lg shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <h4 className="text-sm font-bold text-white mb-3 border-b border-hl-border pb-2">Tag Glossary</h4>
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-hl-accent">WHALE</span>
                                </div>
                                <p className="text-[10px] text-hl-muted">Portfolio value &gt; $1,000,000.</p>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-orange-500">DEGEN</span>
                                </div>
                                <p className="text-[10px] text-hl-muted">Average leverage &gt; 15x. High risk, high reward.</p>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-hl-green">SAFE</span>
                                </div>
                                <p className="text-[10px] text-hl-muted">Average leverage &lt; 3x. Conservative sizing.</p>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-purple-400">ALPHA</span>
                                </div>
                                <p className="text-[10px] text-hl-muted">ROI &gt; 100% in the selected period.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
            <thead>
            <tr className="text-hl-muted text-xs uppercase tracking-wider border-b border-hl-border bg-hl-card/50">
                <th className="py-4 px-4 font-medium">Rank</th>
                <th className="py-4 px-4 font-medium">Trader</th>
                <th className="py-4 px-4 font-medium">PnL ({timeRange})</th>
                <th className="py-4 px-4 font-medium">ROI ({timeRange})</th>
                <th className="py-4 px-4 font-medium">Win Rate</th>
                <th className="py-4 px-4 font-medium">Active Pos</th>
                <th className="py-4 px-4 font-medium text-right">Tags</th>
            </tr>
            </thead>
            <tbody className="text-sm">
            {filteredTraders.length === 0 ? (
                <tr>
                    <td colSpan={7} className="py-12 text-center text-hl-muted">
                        No traders found matching your criteria.
                    </td>
                </tr>
            ) : (
                filteredTraders.map((trader) => (
                    <tr 
                    key={trader.address} 
                    onClick={() => onSelectTrader(trader)}
                    className="border-b border-hl-border hover:bg-hl-border/30 cursor-pointer transition-colors group"
                    >
                    <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-6 text-center font-mono ${trader.rank <= 3 ? 'text-white font-bold' : 'text-hl-muted'}`}>
                                {trader.rank}
                            </div>
                            {trader.rank === 1 && <Trophy className="w-4 h-4 text-yellow-400" />}
                        </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-hl-accent group-hover:underline decoration-hl-accent/50">
                        {trader.address.substring(0, 6)}...{trader.address.substring(trader.address.length - 4)}
                    </td>
                    <td className={`py-4 px-4 font-medium font-mono ${trader.pnl >= 0 ? 'text-hl-green' : 'text-hl-red'}`}>
                        {trader.pnl >= 0 ? '+' : ''}${Math.abs(trader.pnl).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </td>
                    <td className={`py-4 px-4 font-mono ${trader.roi >= 0 ? 'text-hl-green' : 'text-hl-red'}`}>
                        {trader.roi.toFixed(2)}%
                    </td>
                    <td className="py-4 px-4 text-white font-mono">
                        {trader.winRate.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 text-hl-muted font-mono">
                        {trader.positions.length}
                    </td>
                    <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-1">
                            {trader.tags.map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-hl-border text-hl-muted border border-hl-border group-hover:border-hl-muted transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </td>
                    </tr>
                ))
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
};