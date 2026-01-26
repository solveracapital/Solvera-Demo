import type { KPIMetrics } from '../types';
import { formatCurrency, formatMultiplier } from '../utils';

const KpiCard = ({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) => {
    return (
        <div className="bg-solvera-bg p-4 rounded-lg border border-gray-800 shadow-md">
            <h3 className="text-gray-400 text-sm font-sans mb-1 uppercase tracking-wider">{label}</h3>
            <div className="text-solvera-text text-3xl font-mono font-medium">{value}</div>
            {sublabel && <div className="text-solvera-cyan text-xs mt-2 font-sans">{sublabel}</div>}
        </div>
    );
};

export const KpiHeader = ({ tvpi, dpi, moic, totalValuation }: KPIMetrics) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
            <KpiCard label="TVPI" value={formatMultiplier(tvpi)} sublabel="Top Quartile" />
            <KpiCard label="DPI" value={formatMultiplier(dpi)} sublabel="+0.05x QoQ" />
            <KpiCard label="Gross MOIC" value={formatMultiplier(moic)} sublabel={`Target: ${formatMultiplier(3.0)}`} />
            <KpiCard label="Total Valuasi Aset" value={formatCurrency(totalValuation)} sublabel="Updated: Today" />
        </div>
    );
};
