import React, { useEffect, useState } from 'react';
import { generateMarketTicker } from '../services/dataService';
import { CoinPrice } from '../types';

export const TickerTape: React.FC = () => {
    const [prices, setPrices] = useState<CoinPrice[]>([]);

    useEffect(() => {
        setPrices(generateMarketTicker());
        const interval = setInterval(() => {
            setPrices(generateMarketTicker()); // Simulate live updates
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-hl-card border-b border-hl-border overflow-hidden py-2 relative flex">
            <div className="flex animate-marquee whitespace-nowrap gap-8 items-center px-4">
                {[...prices, ...prices].map((coin, idx) => (
                    <div key={`${coin.symbol}-${idx}`} className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-white font-bold">{coin.symbol}</span>
                        <span className="text-hl-muted">${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className={coin.change24h >= 0 ? 'text-hl-green' : 'text-hl-red'}>
                            {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};