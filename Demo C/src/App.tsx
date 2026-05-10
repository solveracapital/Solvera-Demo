import { useState, useMemo } from 'react';
import { KpiHeader } from './components/KpiHeader';
import { ValueCreationRoadmap } from './components/ValueCreationRoadmap';
import { WaterfallChart } from './components/ExitValuationSimulator';
import { SensitivityAnalysis } from './components/SensitivityAnalysis';
import { AuditModal } from './components/AuditModal';
import { INITIATIVES } from './data/initiatives';
import type { KPIMetrics } from './types';
import { ArrowUpRight } from 'lucide-react';
import SolveraLogo from './assets/Solvera.svg';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [activeInitiatives, setActiveInitiatives] = useState<string[]>([]);
  const [exitYear, setExitYear] = useState<number>(5);
  const [marketMultiple, setMarketMultiple] = useState<number>(10); // 10x EBITDA
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Constants (in Billions IDR for simplicity, displayed as M/T)
  // Let's use Billions. 1.5 T = 1500.
  const ENTRY_VALUATION = 1000; // 1 Trillion
  const BASE_GROWTH_RATE = 0.15; // 15% CAGR

  // Derived State
  const organicGrowth = useMemo(() => {
    // FV = PV * (1+r)^n - PV
    return ENTRY_VALUATION * Math.pow((1 + BASE_GROWTH_RATE), exitYear) - ENTRY_VALUATION;
  }, [exitYear]);

  const operationalUplift = useMemo(() => {
    // Calculate total impact multiple from active initiatives
    const totalImpactMultiple = activeInitiatives.reduce((acc, id) => {
      const init = INITIATIVES.find(i => i.id === id);
      return acc + (init?.impact_multiple || 0);
    }, 0);

    // Uplift applies to the final valuation multiple or base?
    // Simplified: Uplift = Entry * ImpactMultiple * (Multiplier factor based on Market Multiple)
    // Let's say Impact adds directly to Multiple.
    // Enhanced Value = (EBITDA * (BaseMultiple + ImpactMultiple))
    // Here we simplify: Uplift Amount = Entry * TotalImpactMultiple
    return ENTRY_VALUATION * totalImpactMultiple;
  }, [activeInitiatives]);

  // Calculate dynamic KPIs based on active initiatives
  const kpiMetrics = useMemo<KPIMetrics>(() => {
    const finalValuation = ENTRY_VALUATION + organicGrowth + operationalUplift;

    // MOIC: Base 2.1x + 0.1x per active initiative
    const moic = 2.1 + (activeInitiatives.length * 0.1);

    // TVPI: Scales proportionally with valuation uplift
    const baseTVPI = 1.85;
    const tvpi = baseTVPI * (1 + operationalUplift / ENTRY_VALUATION);

    // DPI: Keep constant for now (could be made dynamic based on distributions)
    const dpi = 0.45;

    return {
      tvpi,
      dpi,
      moic,
      totalValuation: finalValuation
    };
  }, [activeInitiatives, organicGrowth, operationalUplift]);

  const toggleInitiative = (id: string) => {
    setActiveInitiatives(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-solvera-text font-sans p-6 md:p-12">
      <header className="mb-10 border-b border-gray-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <a href="https://solvera-web-dun.vercel.app/#portfolio" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            {t('Kembali', 'Back')}
          </a>
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <img src={SolveraLogo} alt="Solvera Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-solvera-text mb-2 tracking-tight">
              <span className="text-solvera-navy">Solvera</span> Investor Performance Lab
            </h1>
            <p className="text-gray-400 max-w-2xl">
              {t('Private Equity / VC Portfolio Simulator', 'Private Equity / VC Portfolio Simulator')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-right">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
            <button 
                onClick={() => setLanguage('id')}
                className={`px-2 py-1 text-xs font-bold rounded ${language === 'id' ? 'bg-solvera-navy text-white' : 'text-gray-400 hover:text-white'}`}
            >
                ID
            </button>
            <button 
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-bold rounded ${language === 'en' ? 'bg-solvera-navy text-white' : 'text-gray-400 hover:text-white'}`}
            >
                EN
            </button>
          </div>
          <div className="hidden md:block">
            <div className="text-xs text-solvera-lime flex items-center justify-end gap-1">
              <span className="w-2 h-2 bg-solvera-lime rounded-full animate-pulse"></span>
              LIVE DEMO
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden bg-solvera-navy text-white px-4 py-2 rounded font-medium"
          >
            {t('Book Audit', 'Book Audit')}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        <section>
          <KpiHeader {...kpiMetrics} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Col: Initiative Roadmap */}
          <div className="lg:col-span-5 bg-solvera-bg rounded-xl border border-gray-800 p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-solvera-cyan rounded-full"></span>
              {t('Value Creation Roadmap', 'Value Creation Roadmap')}
            </h2>
            <div className="flex-grow">
              <ValueCreationRoadmap
                initiatives={INITIATIVES}
                activeInitiatives={activeInitiatives}
                onToggle={toggleInitiative}
              />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800 text-sm text-gray-500">
              {t('*Estimasi biaya dan dampak berdasarkan benchmark industri regional.', '*Cost and impact estimates are based on regional industry benchmarks.')}
            </div>
          </div>

          {/* Right Col: Exit Simulator */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-solvera-bg rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-solvera-lime rounded-full"></span>
                {t('Simulator Valuasi Exit', 'Exit Valuation Simulator')}
              </h2>
              <WaterfallChart
                entryValuation={ENTRY_VALUATION}
                organicGrowth={organicGrowth}
                operationalUplift={operationalUplift}
              />
            </div>

            <SensitivityAnalysis
              exitYear={exitYear}
              setExitYear={setExitYear}
              marketMultiple={marketMultiple}
              setMarketMultiple={setMarketMultiple}
            />
          </div>
        </div>
      </main>

      {/* Static Footer CTA for Desktop */}
      <footer className="mt-12 bg-solvera-bg/90 backdrop-blur-md border-t border-gray-800 p-6 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h3 className="font-bold text-white text-lg">{t('Optimalkan Valuasi Portofolio Anda', 'Optimize Your Portfolio Valuation')}</h3>
            <p className="text-sm text-gray-400">{t('Implementasikan strategi engineering yang terukur.', 'Implement measurable engineering strategies.')}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-solvera-cyan text-solvera-bg font-bold px-8 py-3 rounded hover:bg-[#5adbf7] transition-colors flex items-center gap-2"
          >
            {t('Jadwalkan Audit: Operational Engineering', 'Schedule Audit: Operational Engineering')} <ArrowUpRight size={20} />
          </button>
        </div>
      </footer>

      <AuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
