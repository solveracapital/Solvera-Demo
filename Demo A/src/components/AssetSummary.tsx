import React from 'react';
import { formatIDR, formatPercent } from '../lib/utils';
import type { SimulationResult } from '../hooks/useSimulation';
import { TrendingUp, PieChart, Wallet } from 'lucide-react';

interface AssetSummaryProps {
    results: SimulationResult;
    tokenizedEquity: number;
}

export const AssetSummary: React.FC<AssetSummaryProps> = ({ results, tokenizedEquity }) => {
    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            <SummaryCard
                title="Kapitalisasi Pasar (Post-Money)"
                value={formatIDR(results.currentValuation)}
                icon={<TrendingUp className="w-5 h-5 text-solvera-highlight" />}
                subtext="Valuasi Startup Simulasi"
            />
            <SummaryCard
                title="Float Tokenisasi"
                value={`${tokenizedEquity}%`}
                icon={<PieChart className="w-5 h-5 text-solvera-highlight" />}
                subtext={`Nilai: ${formatIDR(results.currentValuation * (tokenizedEquity / 100))}`}
            />
            <SummaryCard
                title="IRR Investor (Ekspektasi)"
                value={formatPercent(results.tokenized.netIRR)}
                icon={<Wallet className="w-5 h-5 text-solvera-positive" />}
                highlight
                subtext="Imbal Hasil Proyeksi (Net)"
            />
        </div>
    );
};

const SummaryCard = ({ title, value, icon, subtext, highlight }: { title: string, value: string, icon: React.ReactNode, subtext?: string, highlight?: boolean }) => (
    <div className={`glass-card p-6 rounded-xl border ${highlight ? 'border-solvera-positive/20 bg-solvera-positive/5' : 'border-white/5'}`}>
        <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-solvera-text/60">{title}</span>
            <div className="p-2 rounded-lg bg-white/5">{icon}</div>
        </div>
        <div className={`text-3xl font-mono font-bold ${highlight ? 'text-solvera-positive' : 'text-white'}`}>
            {value}
        </div>
        {subtext && <div className="mt-2 text-xs text-solvera-text/40">{subtext}</div>}
    </div>
);
