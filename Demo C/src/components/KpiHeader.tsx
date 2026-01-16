

const KpiCard = ({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) => {
    return (
        <div className="bg-solvera-bg p-4 rounded-lg border border-gray-800 shadow-md">
            <h3 className="text-gray-400 text-sm font-sans mb-1 uppercase tracking-wider">{label}</h3>
            <div className="text-solvera-text text-3xl font-mono font-medium">{value}</div>
            {sublabel && <div className="text-solvera-cyan text-xs mt-2 font-sans">{sublabel}</div>}
        </div>
    );
};

export const KpiHeader = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
            <KpiCard label="TVPI" value="1.85x" sublabel="Top Quartile" />
            <KpiCard label="DPI" value="0.45x" sublabel="+0.05x QoQ" />
            <KpiCard label="Gross MOIC" value="2.1x" sublabel="Target: 3.0x" />
            <KpiCard label="Total Valuasi Aset" value="Rp 1.5 T" sublabel="Updated: Today" />
        </div>
    );
};
