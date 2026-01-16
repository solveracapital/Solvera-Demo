
import React, { useState } from 'react';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart
} from 'recharts';
import type { SimulationResult } from '../hooks/useSimulation';
import { formatIDR } from '../lib/utils';
import { clsx } from 'clsx';

interface VisualizationsProps {
    results: SimulationResult;
}

export const Visualizations: React.FC<VisualizationsProps> = ({ results }) => {
    const [activeTab, setActiveTab] = useState<'growth' | 'liquidity'>('growth');

    return (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10 p-1">
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-t-xl">
                <TabButton
                    active={activeTab === 'growth'}
                    onClick={() => setActiveTab('growth')}
                    label="Pertumbuhan Nilai"
                />
                <TabButton
                    active={activeTab === 'liquidity'}
                    onClick={() => setActiveTab('liquidity')}
                    label="Likuiditas & Volume"
                />
            </div>

            <div className="p-6 h-[400px]">
                {activeTab === 'growth' ? (
                    <GrowthChart data={results.charts} />
                ) : (
                    <LiquidityHeatmap />
                )}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <button
        onClick={onClick}
        className={clsx(
            "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
            active
                ? "bg-solvera-primary/20 text-solvera-highlight shadow-sm border border-solvera-primary/30"
                : "text-solvera-text/60 hover:text-white hover:bg-white/5"
        )}
    >
        {label}
    </button>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel p-3 rounded-lg border border-white/10 text-xs shadow-xl">
                <p className="font-mono text-solvera-text/60 mb-2">Tahun {label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-white font-medium">
                            {entry.name}: {formatIDR(entry.value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const GrowthChart = ({ data }: { data: any[] }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
                <defs>
                    <linearGradient id="colorTokenized" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7AE5FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7AE5FF" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis
                    dataKey="year"
                    stroke="#ffffff40"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Y${value} `}
                />
                <YAxis
                    stroke="#ffffff40"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)} M`}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Traditional Line */}
                <Line
                    type="monotone"
                    dataKey="traditionalValue"
                    stroke="#ffffff40"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Tradisional"
                />

                {/* Tokenized Area */}
                <Area
                    type="monotone"
                    dataKey="tokenizedValue"
                    stroke="#7AE5FF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTokenized)"
                    name="Tokenisasi"
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

const LiquidityHeatmap = () => {
    // Simulate an order book or trade frequency heatmap
    // Grid of cells representing simulated trades
    return (
        <div className="h-full flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 grid grid-cols-12 gap-1 opacity-50">
                {Array.from({ length: 144 }).map((_, i) => {
                    // Create a random intense "heat" map
                    const intensity = Math.random();
                    const isActive = Math.random() > 0.6;
                    return (
                        <div
                            key={i}
                            className={clsx(
                                "rounded-sm transition-all duration-1000",
                                isActive
                                    ? intensity > 0.8 ? "bg-solvera-positive/80"
                                        : intensity > 0.5 ? "bg-solvera-highlight/60"
                                            : "bg-solvera-primary/40"
                                    : "bg-white/5"
                            )}
                            style={{
                                transitionDelay: `${Math.random() * 2000} ms`
                            }}
                        />
                    );
                })}
            </div>
            <div className="z-10 text-center p-6 glass-panel rounded-xl max-w-sm">
                <h4 className="text-xl font-bold text-white mb-2">Likuiditas Pasar Sekunder</h4>
                <p className="text-sm text-solvera-text/70 mb-4">
                    Aset tokenisasi memungkinkan perdagangan fraksional 24/7, menciptakan kolam likuiditas dalam dibandingkan ekuitas swasta yang terkunci.
                </p>
                <div className="flex gap-4 justify-center text-xs font-mono">
                    <div>
                        <span className="block text-solvera-positive font-bold">2.4d</span>
                        <span className="text-white/40">Rata-rata Waktu</span>
                    </div>
                    <div>
                        <span className="block text-solvera-highlight font-bold">$1.2Jt</span>
                        <span className="text-white/40">Vol Harian</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
