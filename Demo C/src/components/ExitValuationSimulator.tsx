import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { formatCurrency } from '../utils';


interface Props {
    entryValuation: number; // in Billions IDR
    organicGrowth: number;
    operationalUplift: number; // calculated from active initiatives
}

export const ExitValuationSimulator: React.FC<Props> = ({ entryValuation, organicGrowth, operationalUplift }) => {

    const finalValuation = entryValuation + organicGrowth + operationalUplift;

    // Waterfall Data Construction
    // 1. Entry Value (Start)
    // 2. Revenue Growth (Stack on Entry)
    // 3. Operational Uplift (Stack on Growth)
    // 4. Final Exit (Total)

    const data = [
        {
            name: 'Entry Value',
            start: 0,
            value: entryValuation,
            total: entryValuation,
            fill: '#64748b' // Slate 500
        },
        {
            name: 'Organic Growth',
            start: entryValuation,
            value: organicGrowth,
            total: entryValuation + organicGrowth,
            fill: '#0F547D' // Solvera Navy
        },
        {
            name: 'Ops. Alpha',
            start: entryValuation + organicGrowth,
            value: operationalUplift,
            total: entryValuation + organicGrowth + operationalUplift,
            fill: '#9EFF24' // Solvera Lime
        },
        {
            name: 'Exit Value',
            start: 0,
            value: finalValuation,
            total: finalValuation,
            isTotal: true,
            fill: '#7AE5FF' // Solvera Cyan
        }
    ];

    const formatCurrency = (val: number) => `Rp ${val} M`;

    // Custom tool tip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            return (
                <div className="bg-gray-800 border border-gray-700 p-3 rounded shadow-xl text-sm">
                    <p className="font-bold text-white mb-1">{dataPoint.name}</p>
                    <p className="text-white">
                        Value: <span className="text-white font-mono">{formatCurrency(dataPoint.value)}</span>
                    </p>
                    {!dataPoint.isTotal && (
                        <p className="text-white text-xs mt-1">
                            Starts at: {formatCurrency(dataPoint.start)}
                        </p>
                    )}
                    <p className="text-white font-bold mt-2 pt-2 border-t border-gray-700">
                        Cumulative: {formatCurrency(dataPoint.total)}
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="h-[400px] w-full bg-gray-900/40 p-4 rounded-lg border border-gray-800/50">
            <div className="flex justify-between items-end mb-4 px-2">
                <div>
                    <div className="text-gray-400 text-sm">Projected Exit Valuation</div>
                    <div className="text-4xl font-mono text-white font-bold">
                        {formatCurrency(finalValuation)}
                    </div>
                    {operationalUplift > 0 && (
                        <div className="text-white text-sm font-medium mt-1">
                            +{formatCurrency(operationalUplift)} from Alpha Initiatives
                        </div>
                    )}
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={60}>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        hide
                        domain={[0, 'dataMax + 100']}
                    />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                    <Bar dataKey="value" stackId="a" radius={[4, 4, 4, 4]}>
                        {data.map((entry, index) => {
                            // Determine if we need to shift the bar visually? 
                            // Recharts doesn't do waterfall natively well without 'stackOffset'.
                            // But simplified: we can use 'Recharts' floating bars if we supply [min, max].
                            // However, standard stacked bar approach with transparent placeholders is common,
                            // OR we just use a helper function to render segments.
                            // 
                            // BETTER APPROACH for Waterfall in Recharts:
                            // Use a single Bar but format the data as [start, end].
                            // dataKey="range" where range is [start, end]

                            return <Cell key={`cell-${index}`} fill={entry.fill} />;
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* 
         NOTE: The above standard bar chart stacks on 0. 
         To make a Waterfall, we normally use a transparent stack (placeholder) + visible stack.
         Let's refactor into 2 bars: 'placeholder' (transparent) + 'actual'.
      */}
        </div>
    );
};

// Refactored Component for Proper Waterfall
export const WaterfallChart: React.FC<Props> = ({ entryValuation, organicGrowth, operationalUplift }) => {
    const finalValuation = entryValuation + organicGrowth + operationalUplift;

    const data = [
        {
            name: 'Nilai Awal',
            uv: entryValuation, // height of visible bar
            pv: 0, // invisible placeholder height
            fill: '#64748b'
        },
        {
            name: 'Pertumbuhan',
            uv: organicGrowth,
            pv: entryValuation,
            fill: '#0F547D'
        },
        {
            name: 'Alpha Ops.',
            uv: operationalUplift,
            pv: entryValuation + organicGrowth,
            fill: '#9EFF24'
        },
        {
            name: 'Nilai Exit',
            uv: finalValuation,
            pv: 0,
            fill: '#7AE5FF'
        }
    ];

    // Calculate dynamic domain with padding to prevent label cutoff
    const maxValue = finalValuation;
    const domainMax = Math.ceil(maxValue * 1.15); // Add 15% padding for labels

    return (
        <div className="h-[400px] w-full bg-gray-900/40 p-4 rounded-lg border border-gray-800/50">
            <div className="flex justify-between items-end mb-4 px-2">
                <div>
                    <div className="text-gray-400 text-sm">Projected Exit Valuation</div>
                    <div className="text-4xl font-mono text-solvera-cyan font-bold">
                        {formatCurrency(finalValuation)}
                    </div>
                    {operationalUplift > 0 && (
                        <div className="text-solvera-lime text-sm font-medium mt-1">
                            +{formatCurrency(operationalUplift)} from Alpha Initiatives
                        </div>
                    )}
                </div>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data} barSize={60}>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                        dy={10}
                    />
                    <YAxis
                        hide
                        domain={[0, domainMax]}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        formatter={(value: any) => formatCurrency(value as number)}
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#ffffff' }}
                        itemStyle={{ color: '#ffffff' }}
                    />

                    {/* Transparent placeholder bar to lift the visible bar */}
                    <Bar dataKey="pv" stackId="a" fill="transparent" />
                    {/* Actual visible bar */}
                    <Bar dataKey="uv" stackId="a" radius={[6, 6, 6, 6]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                        <LabelList
                            dataKey="uv"
                            position="top"
                            fill="#ffffffff"
                            formatter={(val: any) => formatCurrency(val as number)}
                            style={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
