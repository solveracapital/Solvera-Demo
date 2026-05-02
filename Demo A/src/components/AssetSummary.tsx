import React from 'react';
import { formatCurrency, formatPercent } from '../lib/utils';
import type { SimulationResult } from '../hooks/useSimulation';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, PieChart, Wallet } from 'lucide-react';

interface AssetSummaryProps {
    results: SimulationResult;
    tokenizedEquity: number;
}

export const AssetSummary: React.FC<AssetSummaryProps> = ({ results, tokenizedEquity }) => {
    const { language, t } = useLanguage();
    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            <SummaryCard
                title={t('Kapitalisasi Pasar (Post-Money)', 'Market Capitalization (Post-Money)')}
                value={formatCurrency(results.currentValuation, language)}
                icon={<TrendingUp className="w-5 h-5 text-solvera-highlight" />}
                subtext={t('Valuasi Startup Simulasi', 'Simulated Startup Valuation')}
            />
            <SummaryCard
                title={t('Float Tokenisasi', 'Tokenized Float')}
                value={`${tokenizedEquity}%`}
                icon={<PieChart className="w-5 h-5 text-solvera-highlight" />}
                subtext={`${t('Nilai:', 'Value:')} ${formatCurrency(results.currentValuation * (tokenizedEquity / 100), language)}`}
            />
            <SummaryCard
                title={t('IRR Investor (Ekspektasi)', 'Investor IRR (Expected)')}
                value={formatPercent(results.tokenized.netIRR)}
                icon={<Wallet className="w-5 h-5 text-solvera-positive" />}
                highlight
                subtext={t('Imbal Hasil Proyeksi (Net)', 'Projected Returns (Net)')}
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
