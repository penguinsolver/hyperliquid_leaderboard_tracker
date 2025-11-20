import React, { useState } from 'react';
import { TraderDetail } from '../types';
import { Card } from './Card';
import { PnlChart, AllocationChart } from './Charts';
import { analyzeTraderStrategy } from '../services/geminiService';
import { X, BrainCircuit, Wallet, TrendingUp, Activity, AlertTriangle, Copy, Check } from 'lucide-react';

interface TraderDetailViewProps {
  trader: TraderDetail;
  onClose: () => void;
}

export const TraderDetailView: React.FC<TraderDetailViewProps> = ({ trader, onClose }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleAiAnalysis = async () => {
    setLoadingAi(true);
    const result = await analyzeTraderStrategy(trader);
    setAnalysis(result);
    setLoadingAi(false);
  };

  const handleCopyTrade = () => {
      setIsCopying(true);
      // Simulate API call
      setTimeout(() => {
          setIsCopying(true); // Stay copied
      }, 1000);
  };

  const longs = trader.positions.filter(p => p.side === 'LONG').length;
  const shorts = trader.positions.filter(p => p.side === 'SHORT').length;

  // Color calculation for Risk Meter
  const getRiskColor = (score: number) => {
      if (score < 4) return 'bg-hl-green';
      if (score < 8) return 'bg-yellow-500';
      return 'bg-hl-red';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-hl-dark border border-hl-border rounded-xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-hl-border bg-hl-card/50 gap-4">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-hl-accent to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/20">
                    #{trader.rank}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white font-mono">{trader.address}</h2>
                    <div className="flex items-center gap-2 text-sm text-hl-muted mt-1">
                        {trader.tags.map(tag => (
                             <span key={tag} className="bg-hl-border px-2 py-0.5 rounded text-xs text-white border border-hl-border/50">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={handleCopyTrade}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                        isCopying 
                        ? 'bg-hl-green/20 text-hl-green border border-hl-green/50 cursor-default' 
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                >
                    {isCopying ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                    {isCopying ? 'Copying' : 'Copy Trade'}
                </button>
                <button 
                    onClick={onClose} 
                    className="p-2 hover:bg-hl-border rounded-lg transition-colors text-hl-muted hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar">
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <Card className="p-4">
                    <div className="text-hl-muted text-xs uppercase font-bold mb-1 flex items-center gap-2"><Wallet className="w-3 h-3"/> Equity</div>
                    <div className="text-xl font-mono text-white">${trader.totalAccountValue.toLocaleString()}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-hl-muted text-xs uppercase font-bold mb-1 flex items-center gap-2"><Activity className="w-3 h-3"/> ROI</div>
                    <div className={`text-xl font-mono ${trader.roi >= 0 ? 'text-hl-green' : 'text-hl-red'}`}>
                        {trader.roi > 0 && '+'}{trader.roi.toFixed(2)}%
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-hl-muted text-xs uppercase font-bold mb-1 flex items-center gap-2"><TrendingUp className="w-3 h-3"/> PnL</div>
                    <div className={`text-xl font-mono ${trader.pnl >= 0 ? 'text-hl-green' : 'text-hl-red'}`}>
                        ${Math.abs(trader.pnl).toLocaleString()}
                    </div>
                </Card>
                <Card className="p-4 relative overflow-hidden">
                    <div className="text-hl-muted text-xs uppercase font-bold mb-1 flex items-center gap-2"><AlertTriangle className="w-3 h-3"/> Risk Score</div>
                    <div className="flex items-end gap-2">
                         <span className="text-xl font-mono text-white font-bold">{trader.riskScore}<span className="text-sm text-hl-muted">/10</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-hl-border mt-3 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full ${getRiskColor(trader.riskScore)} transition-all duration-500`} 
                            style={{ width: `${trader.riskScore * 10}%` }}
                        ></div>
                    </div>
                </Card>
                 <Card className="p-4 md:col-span-1 col-span-2 border-hl-accent/30 bg-hl-accent/5 flex flex-col justify-center">
                     {!analysis ? (
                        <button 
                            onClick={handleAiAnalysis}
                            disabled={loadingAi}
                            className="w-full h-10 bg-hl-accent hover:bg-blue-600 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                        >
                            <BrainCircuit className="w-4 h-4" />
                            {loadingAi ? "Analyzing..." : "Run AI Audit"}
                        </button>
                     ) : (
                         <div className="text-center">
                            <span className="text-hl-accent font-bold text-xs uppercase">Analysis Ready</span>
                            <div className="text-[10px] text-hl-muted">Scroll down to view</div>
                         </div>
                     )}
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Main Chart */}
                <Card className="lg:col-span-2 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-hl-muted">Equity Curve (30d)</h3>
                        <span className="text-xs text-hl-red bg-hl-red/10 px-2 py-1 rounded border border-hl-red/20">Max DD: -{trader.maxDrawdown.toFixed(2)}%</span>
                    </div>
                    <PnlChart data={trader.history} />
                </Card>
                {/* Allocation Pie */}
                <Card className="p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-hl-muted mb-4">Market Exposure</h3>
                    <div className="flex-grow">
                        <AllocationChart longs={longs} shorts={shorts} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                        <div className="bg-hl-dark p-2 rounded border border-hl-border">
                            <div className="text-[10px] text-hl-muted uppercase">Longs</div>
                            <div className="text-hl-green font-mono">{longs}</div>
                        </div>
                        <div className="bg-hl-dark p-2 rounded border border-hl-border">
                            <div className="text-[10px] text-hl-muted uppercase">Shorts</div>
                            <div className="text-hl-red font-mono">{shorts}</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* AI Analysis Section (Conditionally Rendered) */}
            {analysis && (
                <div className="mb-6 animate-in slide-in-from-bottom-4 duration-500">
                    <Card className="p-6 border-hl-accent/30 bg-gradient-to-r from-hl-accent/5 to-transparent">
                        <div className="flex items-center gap-2 mb-4 text-hl-accent">
                            <BrainCircuit className="w-5 h-5" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Gemini Strategy Audit</h3>
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none">
                             <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300 leading-relaxed">
                                {analysis}
                             </pre>
                        </div>
                    </Card>
                </div>
            )}

            {/* Positions Table */}
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                Active Positions
                <span className="text-xs bg-hl-card text-hl-muted px-2 py-0.5 rounded-full border border-hl-border">{trader.positions.length}</span>
            </h3>
            <div className="overflow-x-auto rounded-lg border border-hl-border">
                <table className="w-full text-left text-sm">
                    <thead className="bg-hl-card text-hl-muted uppercase text-xs">
                        <tr>
                            <th className="p-3">Asset</th>
                            <th className="p-3 text-right">Size (USD)</th>
                            <th className="p-3 text-right">Entry</th>
                            <th className="p-3 text-right">Mark</th>
                            <th className="p-3 text-right">Lev</th>
                            <th className="p-3 text-right">PnL</th>
                        </tr>
                    </thead>
                    <tbody className="bg-hl-dark divide-y divide-hl-border">
                        {trader.positions.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-hl-muted">No active positions</td></tr>
                        ) : (
                            trader.positions.map((pos, idx) => (
                                <tr key={idx} className="hover:bg-hl-card/50 transition-colors">
                                    <td className="p-3 font-bold flex items-center gap-2">
                                        <span className={`w-1.5 h-8 rounded-full ${pos.side === 'LONG' ? 'bg-hl-green' : 'bg-hl-red'}`}></span>
                                        <div className="flex flex-col">
                                            <span>{pos.coin}</span>
                                            <span className={`text-[10px] uppercase ${pos.side === 'LONG' ? 'text-hl-green' : 'text-hl-red'}`}>{pos.side}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-right font-mono">${(pos.size * pos.markPrice).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                                    <td className="p-3 text-right font-mono text-hl-muted">${pos.entryPrice.toFixed(pos.entryPrice < 1 ? 4 : 2)}</td>
                                    <td className="p-3 text-right font-mono">${pos.markPrice.toFixed(pos.markPrice < 1 ? 4 : 2)}</td>
                                    <td className="p-3 text-right font-mono">
                                        <span className={`px-1.5 py-0.5 rounded ${pos.leverage > 10 ? 'bg-orange-500/20 text-orange-500' : 'text-hl-muted'}`}>
                                            {pos.leverage}x
                                        </span>
                                    </td>
                                    <td className={`p-3 text-right font-mono font-bold ${pos.pnl >= 0 ? 'text-hl-green' : 'text-hl-red'}`}>
                                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toLocaleString(undefined, {maximumFractionDigits: 0})}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};