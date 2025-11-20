import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { COLORS } from '../constants';

interface PnlChartProps {
  data: { date: string; equity: number }[];
}

export const PnlChart: React.FC<PnlChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.long} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={COLORS.long} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
        <XAxis 
            dataKey="date" 
            stroke="#888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
        />
        <YAxis 
            stroke="#888" 
            fontSize={12} 
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            tickLine={false}
            axisLine={false}
        />
        <Tooltip 
            contentStyle={{ backgroundColor: COLORS.card, borderColor: '#2a2a2a', color: '#fff' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
        />
        <Area 
            type="monotone" 
            dataKey="equity" 
            stroke={COLORS.long} 
            fillOpacity={1} 
            fill="url(#colorEquity)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

interface AllocationChartProps {
  longs: number;
  shorts: number;
}

export const AllocationChart: React.FC<AllocationChartProps> = ({ longs, shorts }) => {
    const data = [
        { name: 'Longs', value: longs },
        { name: 'Shorts', value: shorts },
    ];

    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    <Cell key="long" fill={COLORS.long} />
                    <Cell key="short" fill={COLORS.short} />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: COLORS.card, borderColor: '#2a2a2a', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
            </PieChart>
        </ResponsiveContainer>
    )
}