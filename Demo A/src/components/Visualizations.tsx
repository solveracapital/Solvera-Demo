import React from 'react';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart,
    Bar,
    BarChart
} from 'recharts';
import type { SimulationResult } from '../hooks/useSimulation';
import { formatIDR } from '../lib/utils';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';

interface VisualizationsProps {
    results: SimulationResult;
}

export const Visualizations: React.FC<VisualizationsProps> = ({ results }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Top Row: Value Growth & Liquidity */}

            {/* Chart 1: Value Growth */}
            <ChartCard title="Pertumbuhan Nilai Aset" icon={<TrendingUp className="w-4 h-4 text-solvera-highlight" />}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={results.charts} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `Y${value}`}
                        />
                        <YAxis
                            stroke="#ffffff40"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${(value / 1_000_000_000).toFixed(1)}M`}
                        />
                        <Tooltip content={<CustomTooltip type="value" />} />
                        <Area
                            type="monotone"
                            dataKey="tokenizedValue"
                            stroke="#7AE5FF"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTokenized)"
                            name="Nilai Aset"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Chart 2: Liquidity Score */}
            <ChartCard title="Skor Likuiditas" icon={<Activity className="w-4 h-4 text-solvera-positive" />}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={results.charts} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="year"
                            stroke="#ffffff40"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `Y${value}`}
                        />
                        <YAxis
                            stroke="#ffffff40"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                        />
                        <Tooltip content={<CustomTooltip type="liquidity" />} />
                        <Line
                            type="monotone"
                            dataKey="liquidity"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: '#10b981', r: 3 }}
                            activeDot={{ r: 5 }}
                            name="Likuiditas"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Bottom Row: Volume (Full Width) */}
            <div className="md:col-span-2">
                <ChartCard title="Volume Perdagangan Pasar Sekunder" icon={<BarChart3 className="w-4 h-4 text-purple-400" />}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results.charts} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="year"
                                stroke="#ffffff40"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `Y${value}`}
                            />
                            <YAxis
                                stroke="#ffffff40"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)} jt`}
                            />
                            <Tooltip content={<CustomTooltip type="volume" />} />
                            <Bar
                                dataKey="volume"
                                fill="#a78bfa"
                                radius={[4, 4, 0, 0]}
                                name="Volume"
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

const ChartCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/10 p-1 h-[300px] flex flex-col">
        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-t-xl border-b border-white/5">
            {icon}
            <h3 className="text-sm font-medium text-white/80">{title}</h3>
        </div>
        <div className="p-4 flex-1 min-h-0">
            {children}
        </div>
    </div>
);

const CustomTooltip = ({ active, payload, label, type }: any) => {
    if (active && payload && payload.length) {
        let value = payload[0].value;
        let formattedValue = '';

        switch (type) {
            case 'value':
            case 'volume':
                formattedValue = formatIDR(value);
                break;
            case 'liquidity':
                formattedValue = `${value}/100`;
                break;
            default:
                formattedValue = value;
        }

        return (
            <div className="glass-panel p-3 rounded-lg border border-white/10 text-xs shadow-xl backdrop-blur-xl bg-black/80">
                <p className="font-mono text-solvera-text/60 mb-1">Tahun {label}</p>
                <div className="flex items-center gap-2">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: payload[0].color || payload[0].fill }}
                    />
                    <span className="text-white font-medium">
                        {payload[0].name}: {formattedValue}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};
