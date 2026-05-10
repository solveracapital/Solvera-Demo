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
import Solvera from "./assets/Solvera.svg"
import { useLanguage } from './contexts/LanguageContext';

// --- Types & Interfaces ---

interface CashFlowDataPoint {
    month: string;
    actual?: number;
    forecast?: number;
    baseline?: number;
    projected?: number;
}

interface BudgetVarianceDataPoint {
    category: string;
    budget: number;
    realisasi: number;
}

interface AgingDataItem {
    id: number;
    vendor: string;
    type: string;
    amount: number;
    due: string;
    status: string;
    baseDueDays: number; // Days until due (negative = overdue)
}

const BASE_NET_CASH = 15000000000; // Rp 15 Miliar
const MONTHLY_OPEX = 2500000000; // Rp 2.5 Miliar
const BASE_MONTHLY_BURN_RATE = 850000000; // Rp 850 Juta
const BASE_WORKING_CAPITAL = 4200000000; // Rp 4.2 Miliar
const MONTHLY_REVENUE = 3500000000; // Rp 3.5 Miliar (assumed)
const DAILY_REVENUE = MONTHLY_REVENUE / 30;

// --- Baseline Data (will be modified by sliders) ---

const BASE_CASH_FLOW: CashFlowDataPoint[] = [
    { month: 'Jan', actual: 12500000000, forecast: 12500000000 },
    { month: 'Feb', actual: 11800000000, forecast: 11800000000 },
    { month: 'Mar', actual: 10200000000, forecast: 11200000000 },
    { month: 'Apr', actual: 9500000000,  forecast: 10500000000 },
    { month: 'May', actual: 9000000000,  forecast: 9800000000 }, // Investment month
    { month: 'Jun', actual: 8500000000,  forecast: 9100000000 },
    { month: 'Jul', actual: 8000000000,  forecast: 8400000000 },
];

const BASE_BUDGET_VARIANCE: BudgetVarianceDataPoint[] = [
    { category: 'Cloud AWS', budget: 450, realisasi: 520 },
    { category: 'Payroll', budget: 1200, realisasi: 1150 },
    { category: 'Marketing', budget: 300, realisasi: 280 },
    { category: 'General', budget: 150, realisasi: 180 },
];

const BASE_AGING_DATA: AgingDataItem[] = [
    { id: 1, vendor: 'PT Awan Digital', type: 'Cloud', amount: 150000000, due: '2 Hari', status: 'Jatuh Tempo', baseDueDays: 2 },
    { id: 2, vendor: 'Gedung Sentral', type: 'Sewa', amount: 450000000, due: '14 Hari', status: 'Lancar', baseDueDays: 14 },
    { id: 3, vendor: 'CV Kreatif', type: 'Jasa', amount: 25000000, due: '30 Hari', status: 'Baru', baseDueDays: 30 },
    { id: 4, vendor: 'Server Corp', type: 'Hardware', amount: 850000000, due: 'Overdue', status: 'Kritis', baseDueDays: -5 },
];

// --- Formatting Utils ---

const formatCurrency = (value: number, language: 'id' | 'en' = 'id') => {
    if (language === 'en') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        }).format(value / 16000);
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(value);
};

const formatMillions = (value: number, language: 'id' | 'en' = 'id') => {
    if (language === 'en') {
        return `$${(value / 16000 / 1000000).toFixed(1)}M`;
    }
    return `Rp ${(value / 1000000).toFixed(0)} jt`;
};

// --- Main Component ---

export default function CFODashboard() {
    const { language, setLanguage, t } = useLanguage();
    // ROI Engine State
    const [investment, setInvestment] = useState(500000000); // 500 Juta
    const [efficiency, setEfficiency] = useState(15); // 15%
    const [dsoReduction, setDsoReduction] = useState(10); // 10 days

    // Modal State
    const [isAuditOpen, setIsAuditOpen] = useState(false);

    // Shared Calculations
    const annualOpex = MONTHLY_OPEX * 12;
    const annualSavings = annualOpex * (efficiency / 100);
    const monthlySavings = annualSavings / 12;
    const dynamicBurnRate = BASE_MONTHLY_BURN_RATE - monthlySavings;

    // Derived Calculations with useMemo
    const calculatedMetrics = useMemo(() => {
        // 1. Net Cash Calculation
        // - Investment reduces net cash (cash out)
        // - Efficiency improvements gradually add savings (simulated as immediate for simplicity)
        const netCash = BASE_NET_CASH - investment + (monthlySavings * 3); // Assumes 3 months of accumulated savings

        // 2. Working Capital Calculation
        // - DSO reduction increases working capital (cash collected faster)
        const workingCapital = BASE_WORKING_CAPITAL + (DAILY_REVENUE * dsoReduction);

        // 3. Payback Period
        const paybackYears = investment / annualSavings;
        const paybackText = paybackYears < 1
            ? `${(paybackYears * 12).toFixed(1)} ${t('Bulan', 'Months')}`
            : `${paybackYears.toFixed(1)} ${t('Tahun', 'Years')}`;

        // 4. NPV (5 Year Horizon, 10% Discount Rate)
        let npv = -investment;
        for (let i = 1; i <= 5; i++) {
            npv += annualSavings / Math.pow(1.1, i);
        }

        // 5. Runway Calculation
        const runwayMonths = dynamicBurnRate > 0 ? (netCash / dynamicBurnRate) : 999;

        return {
            netCash,
            workingCapital,
            annualSavings,
            paybackText,
            npv,
            runwayMonths
        };
    }, [investment, dsoReduction, monthlySavings, annualSavings, dynamicBurnRate, t]);

    // Dynamic Budget Variance Data (reacts to efficiency and investment)
    const budgetVarianceData = useMemo(() => {
        const investmentInJuta = investment / 1000000;

        return BASE_BUDGET_VARIANCE.map(item => {
            // 1. Efisiensi menghemat pengeluaran (menurunkan realisasi)
            let currentRealisasi = item.realisasi * (1 - (efficiency / 100));

            // 2. Investasi Engineering adalah BIAYA yang menambah pengeluaran aktual (realisasi)
            // Asumsi: 30% investasi lari ke Cloud AWS, 70% lari ke Payroll (Tenaga IT/Konsultan)
            if (item.category === 'Cloud AWS') {
                currentRealisasi += investmentInJuta * 0.3;
            } else if (item.category === 'Payroll') {
                currentRealisasi += investmentInJuta * 0.7;
            }

            return {
                ...item,
                realisasi: Math.round(currentRealisasi)
            };
        });
    }, [efficiency, investment]);

    // Dynamic Cash Flow Data (reacts to efficiency slider, investment, and dsoReduction)
    const cashFlowData = useMemo(() => {
        // Projected starts diverging from Baseline in May (Investment Month)
        let accumulatedSavings = 0;
        let hasInvested = false;
        const cashFreedFromDso = DAILY_REVENUE * dsoReduction; // Cash injected from faster AR collection

        return BASE_CASH_FLOW.map(point => {
            const baselineValue = point.actual ?? point.forecast ?? 0; // Fallback to forecast if actual was null, and 0 if both are null
            let projectedValue = baselineValue;

            if (point.month === 'May' || hasInvested) {
                if (!hasInvested) {
                    // First month of investment: subtract CapEx, but add the one-time cash freed from DSO reduction
                    projectedValue = baselineValue - investment + cashFreedFromDso;
                    hasInvested = true;
                } else {
                    // Subsequent months add accumulated savings onto the post-investment baseline (with DSO cash still retained)
                    accumulatedSavings += monthlySavings;
                    projectedValue = baselineValue - investment + cashFreedFromDso + accumulatedSavings;
                }
            }

            return {
                month: point.month,
                baseline: baselineValue,
                projected: projectedValue
            };
        });
    }, [investment, monthlySavings, dsoReduction]);

    // Dynamic Aging Data (reacts to dsoReduction slider)
    const agingData = useMemo(() => {
        return BASE_AGING_DATA.map(item => {
            // Simulate DSO reduction: add dsoReduction days to each item's due days
            const adjustedDueDays = item.baseDueDays + dsoReduction;

            let newStatus = item.status;
            let newDue = item.due;

            // Update status based on adjusted due days
            if (adjustedDueDays < 0) {
                // Still overdue
                newStatus = 'Kritis';
                newDue = 'Overdue';
            } else if (adjustedDueDays <= 3) {
                // Almost due
                newStatus = 'Jatuh Tempo';
                newDue = `${adjustedDueDays} ${t('Hari', 'Days')}`;
            } else if (adjustedDueDays <= 15) {
                // Normal/on track
                newStatus = 'Lancar';
                newDue = `${adjustedDueDays} ${t('Hari', 'Days')}`;
            } else if (adjustedDueDays > 15) {
                // Well ahead - could be marked as paid/early
                newStatus = item.baseDueDays > 25 ? 'Baru' : 'Lancar';
                newDue = `${adjustedDueDays} ${t('Hari', 'Days')}`;
            }

            // If DSO improved significantly and item was critical, mark as paid
            if (item.status === 'Kritis' && adjustedDueDays > 5) {
                newStatus = 'Lancar';
            }

            return {
                ...item,
                due: newDue,
                status: newStatus
            };
        });
    }, [dsoReduction]);

    return (
        <div className="min-h-screen bg-solvera-bg text-solvera-cream font-sans pb-20">

            {/* Header */}
            <header className="bg-solvera-bg border-b border-gray-800 sticky top-0 z-10 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => { window.close(); setTimeout(() => { window.location.href = "https://solvera-web-dun.vercel.app/#portfolio"; }, 300); }} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                            {t('Kembali', 'Back')}
                        </button>
                        <div className="w-12 h-12 flex items-center justify-center">
                            <img src={Solvera} alt="Solvera" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
                            <button 
                                onClick={() => setLanguage('id')}
                                className={`px-2 py-1 text-xs font-bold rounded ${language === 'id' ? 'bg-solvera-cyan text-solvera-bg' : 'text-gray-400 hover:text-white'}`}
                            >
                                ID
                            </button>
                            <button 
                                onClick={() => setLanguage('en')}
                                className={`px-2 py-1 text-xs font-bold rounded ${language === 'en' ? 'bg-solvera-cyan text-solvera-bg' : 'text-gray-400 hover:text-white'}`}
                            >
                                EN
                            </button>
                        </div>
                        <span>PT Demo Finansial Tbk</span>
                        <div className="h-8 w-8 rounded-full bg-solvera-cyan/20 border border-solvera-cyan flex items-center justify-center text-solvera-cyan">
                            CFO
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* 1. Executive CFO View (Cards) - NOW DYNAMIC */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title={t("Kas Bersih (Net Cash)", "Net Cash")}
                        value={formatCurrency(calculatedMetrics.netCash, language)}
                        icon={<Wallet className="text-solvera-cyan" />}
                    />
                    <MetricCard
                        title={t("Burn Rate Bulanan", "Monthly Burn Rate")}
                        value={dynamicBurnRate > 0 ? formatCurrency(dynamicBurnRate, language) : t("Profitable", "Profitable")}
                        subtext={dynamicBurnRate < BASE_MONTHLY_BURN_RATE ? t("Menurun", "Decreasing") : t("Stabil", "Stable")}
                        icon={<TrendingDown className={dynamicBurnRate < BASE_MONTHLY_BURN_RATE ? "text-solvera-lime" : "text-orange-400"} />}
                    />
                    <MetricCard
                        title="Runway"
                        value={calculatedMetrics.runwayMonths === 999 ? t('Tak Terhingga', 'Infinite') : `${calculatedMetrics.runwayMonths.toFixed(1)} ${t('Bulan', 'Months')}`}
                        subtext={calculatedMetrics.runwayMonths > 12 ? t("Aman (>12 Bulan)", "Safe (>12 Months)") : t("Kritis (<12 Bulan)", "Critical (<12 Months)")}
                        textColor={calculatedMetrics.runwayMonths > 12 ? "text-solvera-lime" : "text-red-400"}
                        icon={<Clock className={calculatedMetrics.runwayMonths > 12 ? "text-solvera-lime" : "text-red-400"} />}
                    />
                    <MetricCard
                        title="Working Capital"
                        value={formatCurrency(calculatedMetrics.workingCapital, language)}
                        subtext={`Ratio ${(calculatedMetrics.workingCapital / 2000000000).toFixed(1)}`}
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
                                <p className="text-gray-400 text-sm mt-1">{t('Simulasi dampak investasi teknologi terhadap OPEX', 'Simulation of technology investment impact on OPEX')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Inputs */}
                            <div className="space-y-6">
                                <SliderInput
                                    label={t("Investasi Engineering", "Engineering Investment")}
                                    value={investment}
                                    min={100000000}
                                    max={5000000000}
                                    step={10000000}
                                    format={(val: number) => formatMillions(val, language)}
                                    onChange={setInvestment}
                                />
                                <SliderInput
                                    label={t("Est. Efisiensi Operasional", "Est. Operational Efficiency")}
                                    value={efficiency}
                                    min={5}
                                    max={40}
                                    appended="%"
                                    onChange={setEfficiency}
                                />
                                <SliderInput
                                    label={t("Pengurangan DSO (Hari)", "DSO Reduction (Days)")}
                                    value={dsoReduction}
                                    min={0}
                                    max={30}
                                    appended={t(" Hari", " Days")}
                                    onChange={setDsoReduction}
                                />
                            </div>

                            {/* Outputs */}
                            <div className="bg-solvera-bg/50 rounded-xl p-4 border border-gray-700 space-y-4">
                                <ResultRow
                                    label={t("Total Penghematan OPEX (per Tahun)", "Total OPEX Savings (per Year)")}
                                    value={formatCurrency(calculatedMetrics.annualSavings, language)}
                                />
                                <ResultRow
                                    label={t("Payback Period", "Payback Period")}
                                    value={calculatedMetrics.paybackText}
                                    highlight
                                />
                                <ResultRow
                                    label={t("Net Present Value (5 Tahun)", "Net Present Value (5 Years)")}
                                    value={formatCurrency(Math.abs(calculatedMetrics.npv), language)}
                                    highlight
                                />
                            </div>
                        </div>
                    </div>

                    {/* Chart B: Variance Analysis - NOW DYNAMIC */}
                    <div className="bg-solvera-card-bg rounded-xl p-6 border border-gray-800 shadow-xl flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-4">{t('Analisis Varians (Budget vs Real)', 'Variance Analysis (Budget vs Actual)')}</h3>
                        <div className="flex-1 w-full min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={budgetVarianceData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="category" type="category" stroke="#9ca3af" width={80} tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#181B21', borderColor: '#374151', color: '#F3EED8' }}
                                        itemStyle={{ color: '#F3EED8' }}
                                        formatter={(val: any) => formatMillions(Number(val) * 1000000, language).replace(language === 'en' ? '$' : 'Rp ', '')}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Bar dataKey="budget" name="Budget" fill="#0F547D" radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="realisasi" name="Realisasi" fill="#7AE5FF" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                {/* 3. Cash Forecast Chart - NOW DYNAMIC WITH FIXED MARGINS */}
                <section className="bg-solvera-card-bg rounded-xl p-6 border border-gray-800 shadow-xl">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">{t('Cash Flow Forecast (Simulation)', 'Cash Flow Forecast (Simulation)')}</h3>
                            <p className="text-sm text-gray-400">{t('Baseline vs. Projected (with ROI Improvement)', 'Baseline vs. Projected (with ROI Improvement)')}</p>
                        </div>
                        <div className="flex gap-4 text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-solvera-cyan opacity-50 rounded-full"></div> Baseline</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-solvera-lime rounded-full"></div> Projected (ROI)</div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cashFlowData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                                <defs>
                                    <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7AE5FF" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#7AE5FF" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9EFF24" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#9EFF24" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
                                <YAxis 
                                    stroke="#6b7280" 
                                    tickFormatter={(val) => language === 'en' ? `$${(val / 16000 / 1000000).toFixed(1)}M` : `${(val / 1000000000).toFixed(1)}M`} 
                                    tick={{ fontSize: 12 }} 
                                />
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#181B21', borderColor: '#374151', color: '#F3EED8' }}
                                    labelStyle={{ color: '#9ca3af', marginBottom: '0.5rem' }}
                                    formatter={(val: any, name: any) => [
                                        formatCurrency(val || 0, language).replace(new RegExp(language === 'en' ? '\\$' : 'Rp\\s?', 'g'), ''),
                                        name === 'baseline' ? t('Baseline (Current)', 'Baseline (Current)') : t('Projected (+ROI)', 'Projected (+ROI)')
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="projected"
                                    stroke="#9EFF24"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorProjected)"
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="baseline"
                                    stroke="#7AE5FF"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    fillOpacity={1}
                                    fill="url(#colorBaseline)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* 4. Drilldown Table - NOW DYNAMIC */}
                <section className="bg-solvera-card-bg rounded-xl border border-gray-800 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800">
                        <h3 className="text-lg font-bold text-white">AP/AR Aging & Status</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-solvera-bg/50 text-gray-400 font-mono uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">{t('Vendor / Client', 'Vendor / Client')}</th>
                                    <th className="px-6 py-4">{t('Tipe', 'Type')}</th>
                                    <th className="px-6 py-4 text-right">{t('Nilai (IDR)', 'Value')}</th>
                                    <th className="px-6 py-4">{t('Jatuh Tempo', 'Due')}</th>
                                    <th className="px-6 py-4">{t('Status', 'Status')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {agingData.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{item.vendor}</td>
                                        <td className="px-6 py-4 text-gray-400">{item.type}</td>
                                            <td className="px-6 py-4 text-right font-mono text-solvera-cream">
                                                {formatCurrency(item.amount, language)}
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
                    <span>{t('Book Audit: Finance Healthcheck', 'Book Audit: Finance Healthcheck')}</span>
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
                <div className="text-xs text-gray-500 min-h-[16px]">{subtext}</div>
            </div>
        </div>
    );
}

function SliderInput({ label, value, min, max, step = 1, appended = '', format, onChange }: any) {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-300">{label}</label>
                <span className="font-mono text-solvera-cyan font-bold whitespace-nowrap shrink-0">
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
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-solvera-cream hover:opacity-90"
            />
        </div>
    );
}

function ResultRow({ label, value, highlight = false }: any) {
    return (
        <div className="flex justify-between items-center border-b border-gray-700/50 pb-2 last:border-0 last:pb-0 gap-4">
            <span className="text-sm text-gray-400 leading-tight">{label}</span>
            <span className={`font-mono font-bold whitespace-nowrap shrink-0 ${highlight ? 'text-solvera-lime text-lg' : 'text-white'}`}>
                {value}
            </span>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const { t } = useLanguage();
    let colorClass = 'bg-gray-800 text-gray-300';
    let translatedStatus = status;

    if (status === 'Lunas' || status === 'Lancar') {
        colorClass = 'bg-green-900/30 text-green-400 border border-green-900';
        translatedStatus = t(status, status === 'Lunas' ? 'Paid' : 'On Track');
    }
    if (status === 'Jatuh Tempo') {
        colorClass = 'bg-yellow-900/30 text-yellow-400 border border-yellow-900';
        translatedStatus = t(status, 'Due');
    }
    if (status === 'Overdue') {
        colorClass = 'bg-red-900/30 text-red-400 border border-red-900';
        translatedStatus = t(status, 'Overdue');
    }
    if (status === 'Baru') {
        colorClass = 'bg-blue-900/30 text-blue-400 border border-blue-900';
        translatedStatus = t(status, 'New');
    }
    if (status === 'Kritis') {
        colorClass = 'bg-red-950 text-red-500 border border-red-800 animate-pulse';
        translatedStatus = t(status, 'Critical');
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {translatedStatus}
        </span>
    );
}

function AuditModal({ isOpen, onClose }: any) {
    const { t } = useLanguage();
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
                                    {t('Book Audit: Finance Healthcheck', 'Book Audit: Finance Healthcheck')}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400 mb-6">
                                        {t('Tim ahli kami akan melakukan audit menyeluruh terhadap infrastruktur finansial Anda.', 'Our expert team will conduct a thorough audit of your financial infrastructure.')}
                                    </p>

                                    <div className="space-y-4 mb-6">
                                        <CheckItem text={t("Kesiapan Otomatisasi Laporan (Reporting Automation)", "Reporting Automation Readiness")} />
                                        <CheckItem text={t("Pengecekan Kualitas Data (Data Quality Assurance)", "Data Quality Assurance Checks")} />
                                        <CheckItem text={t("Rekomendasi Penghematan Cloud & Infrastruktur", "Cloud & Infrastructure Savings Recommendations")} />
                                    </div>

                                    <div className="p-4 bg-solvera-navy/20 rounded-lg border border-solvera-navy/50 text-center mb-6">
                                        <p className="text-solvera-cyan font-medium text-sm">
                                            {t('"Dapatkan roadmap efisiensi finansial dalam 2 minggu."', '"Get a financial efficiency roadmap in 2 weeks."')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        className="flex-1 justify-center rounded-lg border border-transparent bg-solvera-lime px-4 py-2 text-sm font-bold text-solvera-bg hover:bg-lime-400 transition-colors focus:outline-none"
                                        onClick={onClose}
                                    >
                                        {t('Jadwalkan Sekarang', 'Schedule Now')}
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 justify-center rounded-lg border border-gray-600 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        {t('Batal', 'Cancel')}
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
