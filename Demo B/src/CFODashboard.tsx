import { useState, useMemo, Fragment } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import {
    Wallet, TrendingDown, Clock, Activity,
    ChevronRight, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

// --- Types & Data ---

// Mock Data for Charts
const cashFlowData = [
    { month: 'Jan', actual: 12.5, forecast: 12.5 },
    { month: 'Feb', actual: 11.8, forecast: 11.8 },
    { month: 'Mar', actual: 10.2, forecast: 11.2 },
    { month: 'Apr', actual: 9.5, forecast: 10.5 },
    { month: 'May', actual: null, forecast: 9.8 },
    { month: 'Jun', actual: null, forecast: 9.1 },
    { month: 'Jul', actual: null, forecast: 8.4 },
];

const budgetVarianceData = [
    { category: 'Cloud AWS', budget: 450, realisasi: 520 },
    { category: 'Payroll', budget: 1200, realisasi: 1150 },
    { category: 'Marketing', budget: 300, realisasi: 280 },
    { category: 'General', budget: 150, realisasi: 180 },
];

const agingData = [
    { id: 1, vendor: 'PT Awan Digital', type: 'Cloud', amount: 150000000, due: '2 Hari', status: 'Jatuh Tempo' },
    { id: 2, vendor: 'Gedung Sentral', type: 'Sewa', amount: 450000000, due: '14 Hari', status: 'Lancar' },
    { id: 3, vendor: 'CV Kreatif', type: 'Jasa', amount: 25000000, due: '30 Hari', status: 'Baru' },
    { id: 4, vendor: 'Server Corp', type: 'Hardware', amount: 850000000, due: 'Overdue', status: 'Kritis' },
];

// Formatting Utils
const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(value);
};

const formatMillions = (value: number) => {
    return `Rp ${(value / 1000000).toFixed(0)} jt`;
};

export default function CFODashboard() {
    // ROI Engine State
    const [investment, setInvestment] = useState(500000000); // 500 Juta
    const [efficiency, setEfficiency] = useState(15); // 15%
    const [dsoReduction, setDsoReduction] = useState(10); // 10 days

    // Modal State
    const [isAuditOpen, setIsAuditOpen] = useState(false);

    // Derived Calculations
    const calculatedMetrics = useMemo(() => {
        // Mock baseline opex
        const monthlyOpex = 2500000000; // 2.5 Miliar
        const annualOpex = monthlyOpex * 12;

        const annualSavings = annualOpex * (efficiency / 100);
        // const totalSavingsWithDSO = annualSavings + (dsoReduction * (monthlyOpex / 30) * 0.5); // DSO impact (mock logic)

        // Simple Payback Period (Years)
        const paybackYears = investment / annualSavings;
        const paybackText = paybackYears < 1
            ? `${(paybackYears * 12).toFixed(1)} Bulan`
            : `${paybackYears.toFixed(1)} Tahun`;

        // Simple NPV (5 Year Horizon, 10% Discount Rate - simplified)
        let npv = -investment;
        for (let i = 1; i <= 5; i++) {
            npv += annualSavings / Math.pow(1.1, i);
        }

        return {
            annualSavings,
            paybackText,
            npv
        };
    }, [investment, efficiency]); // dsoReduction impact temporarily removed from metric

    return (
        <div className="min-h-screen bg-solvera-bg text-solvera-cream font-sans pb-20">

            {/* Header */}
            <header className="bg-solvera-navy border-b border-solvera-navy/50 sticky top-0 z-10 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-solvera-lime rounded-lg flex items-center justify-center text-solvera-bg font-bold font-mono">
                            S
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Solvera <span className="text-solvera-cyan font-light mx-2">|</span> Enterprise Cash Ops
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span>PT Demo Finansial Tbk</span>
                        <div className="h-8 w-8 rounded-full bg-solvera-cyan/20 border border-solvera-cyan flex items-center justify-center text-solvera-cyan">
                            CFO
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* 1. Executive CFO View (Cards) */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Kas Bersih (Net Cash)"
                        value="Rp 15.000.000.000"
                        subtext="+5% vs Bulan Lalu"
                        icon={<Wallet className="text-solvera-cyan" />}
                    />
                    <MetricCard
                        title="Burn Rate Bulanan"
                        value="Rp 850.000.000"
                        subtext="Stabil"
                        icon={<TrendingDown className="text-orange-400" />}
                    />
                    <MetricCard
                        title="Runway"
                        value="18 Bulan"
                        subtext="Aman (>12 Bulan)"
                        textColor="text-solvera-lime"
                        icon={<Clock className="text-solvera-lime" />}
                    />
                    <MetricCard
                        title="Working Capital"
                        value="Rp 4.200.000.000"
                        subtext="Ratio 2.1"
                        icon={<Activity className="text-purple-400" />}
                    />
                </section>

                {/* 2. ROI Engine & Variance Analysis (Split Layout) */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ROI Engine */}
                    <div className="lg:col-span-2 bg-solvera-card-bg rounded-xl p-6 border border-gray-800 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <ArrowUpRight className="text-solvera-lime" />
                                    ROI Engine: Scenario Simulator
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">Simulasi dampak investasi teknologi terhadap OPEX</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Inputs */}
                            <div className="space-y-6">
                                <SliderInput
                                    label="Investasi Engineering"
                                    value={investment}
                                    min={100000000}
                                    max={5000000000}
                                    step={10000000}
                                    format={formatMillions}
                                    onChange={setInvestment}
                                />
                                <SliderInput
                                    label="Est. Efisiensi Operasional"
                                    value={efficiency}
                                    min={5}
                                    max={40}
                                    appended="%"
                                    onChange={setEfficiency}
                                />
                                <SliderInput
                                    label="Pengurangan DSO (Hari)"
                                    value={dsoReduction}
                                    min={0}
                                    max={30}
                                    appended=" Hari"
                                    onChange={setDsoReduction}
                                />
                            </div>

                            {/* Outputs */}
                            <div className="bg-solvera-bg/50 rounded-xl p-4 border border-gray-700 space-y-4">
                                <ResultRow
                                    label="Total Penghematan OPEX (per Tahun)"
                                    value={formatIDR(calculatedMetrics.annualSavings)}
                                />
                                <ResultRow
                                    label="Payback Period"
                                    value={calculatedMetrics.paybackText}
                                    highlight
                                />
                                <ResultRow
                                    label="Net Present Value (5 Tahun)"
                                    value={formatIDR(calculatedMetrics.npv)}
                                    highlight
                                />
                            </div>
                        </div>
                    </div>

                    {/* Chart B: Variance Analysis */}
                    <div className="bg-solvera-card-bg rounded-xl p-6 border border-gray-800 shadow-xl flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-4">Analisis Varians (Budget vs Real)</h3>
                        <div className="flex-1 w-full min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={budgetVarianceData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="category" type="category" stroke="#9ca3af" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#181B21', borderColor: '#374151', color: '#F3EED8' }}
                                        itemStyle={{ color: '#F3EED8' }}
                                        formatter={(val: any) => formatMillions(Number(val) * 1000000).replace('Rp ', '')}
                                    />
                                    <Legend />
                                    <Bar dataKey="budget" name="Budget" fill="#0F547D" radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="realisasi" name="Realisasi" fill="#7AE5FF" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                {/* 3. Cash Forecast Chart */}
                <section className="bg-solvera-card-bg rounded-xl p-6 border border-gray-800 shadow-xl">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">Cash Flow Forecast</h3>
                            <p className="text-sm text-gray-400">Proyeksi arus kas 6 bulan ke depan (dalam Miliar IDR)</p>
                        </div>
                        <div className="flex gap-4 text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-solvera-cyan rounded-full"></div> Actual</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-solvera-lime rounded-full opacity-50"></div> Forecast</div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7AE5FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7AE5FF" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9EFF24" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#9EFF24" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" tickFormatter={(val) => `${val} M`} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#181B21', borderColor: '#374151', color: '#F3EED8' }}
                                    formatter={(val: any) => `Rp ${val} M`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="forecast"
                                    stroke="#9EFF24"
                                    strokeDasharray="5 5"
                                    fillOpacity={1}
                                    fill="url(#colorForecast)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="actual"
                                    stroke="#7AE5FF"
                                    fillOpacity={1}
                                    fill="url(#colorActual)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* 4. Drilldown Table */}
                <section className="bg-solvera-card-bg rounded-xl border border-gray-800 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800">
                        <h3 className="text-lg font-bold text-white">AP/AR Aging & Status</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-solvera-bg/50 text-gray-400 font-mono uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Vendor / Client</th>
                                    <th className="px-6 py-4">Tipe</th>
                                    <th className="px-6 py-4 text-right">Nilai (IDR)</th>
                                    <th className="px-6 py-4">Jatuh Tempo</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {agingData.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{item.vendor}</td>
                                        <td className="px-6 py-4 text-gray-400">{item.type}</td>
                                        <td className="px-6 py-4 text-right font-mono text-solvera-cream">
                                            {new Intl.NumberFormat('id-ID').format(item.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{item.due}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={item.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </main>

            {/* 5. Sticky CTA */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsAuditOpen(true)}
                    className="bg-solvera-cyan hover:bg-cyan-300 text-solvera-bg font-bold py-3 px-6 rounded-full shadow-[0_0_20px_rgba(122,229,255,0.4)] transition-all transform hover:scale-105 flex items-center gap-2"
                >
                    <span>Book Audit: Finance Healthcheck</span>
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Modal */}
            <AuditModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />

        </div>
    );
}

// --- Sub-components ---

function MetricCard({ title, value, subtext, icon, textColor = 'text-white' }: any) {
    return (
        <div className="bg-solvera-card-bg p-6 rounded-xl border border-gray-800 shadow-lg flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <span className="text-gray-400 text-sm font-medium">{title}</span>
                {icon && <div className="p-2 bg-white/5 rounded-lg">{icon}</div>}
            </div>
            <div>
                <div className={`text-2xl font-bold font-mono ${textColor} mb-1`}>{value}</div>
                <div className="text-xs text-gray-500">{subtext}</div>
            </div>
        </div>
    );
}

function SliderInput({ label, value, min, max, step = 1, appended = '', format, onChange }: any) {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-300">{label}</label>
                <span className="font-mono text-solvera-cyan font-bold">
                    {format ? format(value) : value}{appended}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-solvera-cyan hover:accent-cyan-300"
            />
        </div>
    );
}

function ResultRow({ label, value, highlight = false }: any) {
    return (
        <div className="flex justify-between items-center border-b border-gray-700/50 pb-2 last:border-0 last:pb-0">
            <span className="text-sm text-gray-400">{label}</span>
            <span className={`font-mono font-bold ${highlight ? 'text-solvera-lime text-lg' : 'text-white'}`}>
                {value}
            </span>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    let colorClass = 'bg-gray-800 text-gray-300';
    if (status === 'Lunas' || status === 'Lancar') colorClass = 'bg-green-900/30 text-green-400 border border-green-900';
    if (status === 'Jatuh Tempo' || status === 'Overdue') colorClass = 'bg-red-900/30 text-red-400 border border-red-900';
    if (status === 'Baru') colorClass = 'bg-blue-900/30 text-blue-400 border border-blue-900';
    if (status === 'Kritis') colorClass = 'bg-red-950 text-red-500 border border-red-800 animate-pulse';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {status}
        </span>
    );
}

function AuditModal({ isOpen, onClose }: any) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-solvera-card-bg border border-solvera-navy p-6 text-left align-middle shadow-2xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl font-bold leading-6 text-white mb-2"
                                >
                                    Book Audit: Finance Healthcheck
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400 mb-6">
                                        Tim ahli kami akan melakukan audit menyeluruh terhadap infrastruktur finansial Anda.
                                    </p>

                                    <div className="space-y-4 mb-6">
                                        <CheckItem text="Kesiapan Otomatisasi Laporan (Reporting Automation)" />
                                        <CheckItem text="Pengecekan Kualitas Data (Data Quality Assurance)" />
                                        <CheckItem text="Rekomendasi Penghematan Cloud & Infrastruktur" />
                                    </div>

                                    <div className="p-4 bg-solvera-navy/20 rounded-lg border border-solvera-navy/50 text-center mb-6">
                                        <p className="text-solvera-cyan font-medium text-sm">
                                            "Dapatkan roadmap efisiensi finansial dalam 2 minggu."
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        className="flex-1 justify-center rounded-lg border border-transparent bg-solvera-lime px-4 py-2 text-sm font-bold text-solvera-bg hover:bg-lime-400 transition-colors focus:outline-none"
                                        onClick={onClose}
                                    >
                                        Jadwalkan Sekarang
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 justify-center rounded-lg border border-gray-600 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

function CheckItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3">
            <CheckCircle2 className="text-solvera-lime shrink-0" size={20} />
            <span className="text-sm text-gray-200">{text}</span>
        </div>
    );
}
