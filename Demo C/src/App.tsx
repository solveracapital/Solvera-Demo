import { useState, useMemo } from 'react';
import { KpiHeader } from './components/KpiHeader';
import { ValueCreationRoadmap } from './components/ValueCreationRoadmap';
import { WaterfallChart } from './components/ExitValuationSimulator';
import { SensitivityAnalysis } from './components/SensitivityAnalysis';
import { AuditModal } from './components/AuditModal';
import { INITIATIVES } from './data/initiatives';
import { ArrowUpRight } from 'lucide-react';

function App() {
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

  const toggleInitiative = (id: string) => {
    setActiveInitiatives(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-solvera-text font-sans p-6 md:p-12 pb-32">
      <header className="mb-10 border-b border-gray-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-solvera-text mb-2 tracking-tight">
            <span className="text-solvera-navy">Solvera</span> Investor Performance Lab
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Simulasi Portfolio Alpha Operasional & Teknikal
          </p>
        </div>
        <div className="flex items-center gap-6 text-right">
          <div className="hidden md:block">
            <div className="text-sm text-gray-500 font-mono">PROJECT C</div>
            <div className="text-xs text-solvera-lime flex items-center justify-end gap-1">
              <span className="w-2 h-2 bg-solvera-lime rounded-full animate-pulse"></span>
              LIVE DEMO
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden bg-solvera-navy text-white px-4 py-2 rounded font-medium"
          >
            Book Audit
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        <section>
          <KpiHeader />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Col: Initiative Roadmap */}
          <div className="lg:col-span-5 bg-solvera-bg rounded-xl border border-gray-800 p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-solvera-cyan rounded-full"></span>
              Value Creation Roadmap
            </h2>
            <div className="flex-grow">
              <ValueCreationRoadmap
                initiatives={INITIATIVES}
                activeInitiatives={activeInitiatives}
                onToggle={toggleInitiative}
              />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800 text-sm text-gray-500">
              *Estimasi biaya dan dampak berdasarkan benchmark industri regional.
            </div>
          </div>

          {/* Right Col: Exit Simulator */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-solvera-bg rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-solvera-lime rounded-full"></span>
                Simulator Valuasi Exit
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

      {/* Sticky Bottom CTA for Desktop */}
      <div className="fixed bottom-0 left-0 right-0 bg-solvera-bg/90 backdrop-blur-md border-t border-gray-800 p-4 z-40 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h3 className="font-bold text-white text-lg">Optimalkan Valuasi Portofolio Anda</h3>
            <p className="text-sm text-gray-400">Implementasikan strategi engineering yang terukur.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-solvera-cyan text-solvera-bg font-bold px-8 py-3 rounded hover:bg-[#5adbf7] transition-colors flex items-center gap-2"
          >
            Jadwalkan Audit: Operational Engineering <ArrowUpRight size={20} />
          </button>
        </div>
      </div>

      <AuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
