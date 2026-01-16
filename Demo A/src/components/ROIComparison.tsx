import React from 'react';
import type { SimulationResult } from '../hooks/useSimulation';
import { formatIDR, formatPercent } from '../lib/utils';
import { ArrowDown, Check, X } from 'lucide-react';

interface ROIComparisonProps {
    results: SimulationResult;
    issuanceCostTraditional: number;
    issuanceCostTokenized: number;
}

export const ROIComparison: React.FC<ROIComparisonProps> = ({
    results,
    issuanceCostTraditional,
    issuanceCostTokenized
}) => {
    return (
        <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/10 mb-8">
            {/* Traditional Side */}
            <div className="p-8 bg-solvera-bg/60 relative group">
                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <h3 className="text-xl font-bold mb-6 text-solvera-text/80">Ekuitas Swasta Tradisional</h3>

                <div className="space-y-6">
                    <MetricRow
                        label="Biaya Emisi"
                        value={`${issuanceCostTraditional}%`}
                        subValue={formatIDR(results.traditional.issuanceCostAmount)}
                        negative
                    />
                    <MetricRow
                        label="Total Modal Ditempatkan"
                        value={formatIDR(results.traditional.investorCost)}
                        desc="(Basis Biaya Hangus)"
                    />
                    <StatusRow label="Likuiditas" status="Tidak Likuid (Kunci 5-7thn)" negative />
                    <div className="pt-4 border-t border-white/5">
                        <MetricRow
                            label="IRR Bersih"
                            value={formatPercent(results.traditional.netIRR)}
                            isLarge
                        />
                    </div>
                </div>
            </div>

            {/* Tokenized Side */}
            <div className="p-8 bg-gradient-to-br from-solvera-primary/20 to-solvera-bg relative border-l border-white/10">
                <div className="absolute top-0 right-0 p-2 bg-solvera-positive/20 text-solvera-positive text-xs font-bold rounded-bl-xl border-l border-b border-solvera-positive/20">
                    SOLVERA OPTIMIZED
                </div>

                <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                    Dana Pertumbuhan Tokenisasi
                    <span className="px-2 py-0.5 rounded-full bg-solvera-highlight/10 text-solvera-highlight text-xs border border-solvera-highlight/20">
                        Live
                    </span>
                </h3>

                <div className="space-y-6">
                    <MetricRow
                        label="Biaya Emisi"
                        value={`${issuanceCostTokenized}%`}
                        subValue={formatIDR(results.tokenized.issuanceCostAmount)}
                        delta={`-${issuanceCostTraditional - issuanceCostTokenized}% Biaya`}
                        positive
                    />
                    <MetricRow
                        label="Total Modal Ditempatkan"
                        value={formatIDR(results.tokenized.investorCost)}
                        desc="(Lebih Efisien)"
                    />
                    <StatusRow label="Likuiditas" status="Pasar Sekunder (24/7)" positive />

                    <div className="pt-4 border-t border-white/10 p-4 rounded-xl bg-solvera-positive/5 border border-solvera-positive/10 mt-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-solvera-text/60 mb-1">IRR Bersih (Proyeksi)</div>
                                <div className="text-4xl font-mono font-bold text-solvera-positive">
                                    {formatPercent(results.tokenized.netIRR)}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-solvera-positive uppercase tracking-wider font-bold mb-1">Kenaikan</div>
                                <div className="flex items-center justify-end text-solvera-positive font-bold text-lg">
                                    <ArrowDown className="w-4 h-4 rotate-180 mr-1" />
                                    {results.tokenized.liquidityUplift.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricRow = ({ label, value, subValue, desc, delta, negative, positive, isLarge }: any) => (
    <div>
        <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm text-solvera-text/60">{label}</span>
            <div className="text-right">
                <span className={`font-mono font-medium ${isLarge ? 'text-2xl' : 'text-lg'} ${negative ? 'text-red-400' : positive ? 'text-solvera-positive' : 'text-white'}`}>
                    {value}
                </span>
                {delta && (
                    <span className="ml-2 text-xs font-bold py-0.5 px-1.5 rounded bg-solvera-positive/20 text-solvera-positive">
                        {delta}
                    </span>
                )}
            </div>
        </div>
        <div className="flex justify-between text-xs text-solvera-text/40">
            <span>{desc}</span>
            <span>{subValue}</span>
        </div>
    </div>
);

const StatusRow = ({ label, status, negative, positive }: any) => (
    <div className="flex justify-between items-center py-2">
        <span className="text-sm text-solvera-text/60">{label}</span>
        <span className={`text-sm font-medium flex items-center gap-1.5 ${negative ? 'text-red-400' : positive ? 'text-solvera-highlight' : 'text-white'}`}>
            {negative ? <X className="w-4 h-4" /> : positive ? <Check className="w-4 h-4" /> : null}
            {status}
        </span>
    </div>
);
