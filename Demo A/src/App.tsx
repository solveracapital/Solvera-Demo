import React from 'react';
import { Header } from './components/Header';
import { AssetSummary } from './components/AssetSummary';
import { ROIComparison } from './components/ROIComparison';
import { Visualizations } from './components/Visualizations';
import { CTAModal } from './components/CTAModal';
import { useSimulation, type GrowthScenario } from './hooks/useSimulation';
import * as Slider from '@radix-ui/react-slider';
import { clsx } from 'clsx';
import { SlidersHorizontal, Info } from 'lucide-react';

function App() {
  const { params, setParams, results } = useSimulation();

  const handleSliderChange = (key: keyof typeof params, value: number[]) => {
    setParams(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleScenarioChange = (scenario: GrowthScenario) => {
    setParams(prev => ({ ...prev, growthScenario: scenario }));
  };

  return (
    <div className="min-h-screen bg-solvera-bg text-solvera-text font-sans pb-32">
      <Header />

      <main className="container mx-auto px-4 py-8">

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-12 bg-solvera-positive rounded-full" />
            <span className="text-xs font-mono text-solvera-positive tracking-wider uppercase">Proyek A - Simulasi</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            PT GreenLogistik Nusantara
          </h1>
          <p className="text-solvera-text/60 max-w-2xl">
            Simulasikan dampak tokenisasi ekuitas untuk startup logistik Seri B.
            Visualisasikan efisiensi, likuiditas, dan peningkatan ROI bersih.
          </p>
        </div>

        {/* Controls Section */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 mb-8 border border-white/10">
          <div className="flex items-center gap-2 mb-6 text-white pb-4 border-b border-white/5">
            <SlidersHorizontal className="w-5 h-5 text-solvera-highlight" />
            <h2 className="text-lg font-bold">Parameter Simulasi</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Input 1: Tokenized Equity */}
            <ControlGroup label="Ekuitas Tokenisasi %" value={`${params.tokenizedEquity}%`}>
              <CustomSlider
                value={[params.tokenizedEquity]}
                min={5}
                max={49}
                step={1}
                onValueChange={(v) => handleSliderChange('tokenizedEquity', v)}
              />
            </ControlGroup>

            {/* Input 2: Exit Horizon */}
            <ControlGroup label="Jangka Waktu Exit" value={`${params.exitHorizon} Tahun`}>
              <CustomSlider
                value={[params.exitHorizon]}
                min={3}
                max={10}
                step={1}
                onValueChange={(v) => handleSliderChange('exitHorizon', v)}
              />
            </ControlGroup>

            {/* Input 3: Growth Scenario */}
            <div>
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-solvera-text/70 font-medium">Skenario Pertumbuhan</span>
              </div>
              <div className="flex bg-white/5 p-1 rounded-lg">
                {(['bear', 'base', 'bull'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleScenarioChange(s)}
                    className={clsx(
                      "flex-1 py-1.5 rounded-md text-xs font-bold uppercase transition-all",
                      params.growthScenario === s
                        ? s === 'bear' ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : s === 'bull' ? "bg-solvera-positive/20 text-solvera-positive border border-solvera-positive/30"
                            : "bg-solvera-primary text-white"
                        : "text-solvera-text/40 hover:text-white"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Read-only Cost Info */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/5 flex flex-col justify-center">
              <div className="text-xs text-solvera-text/50 mb-1 flex items-center gap-1">
                Penghematan Biaya Emisi
                <Info className="w-3 h-3" />
              </div>
              <div className="text-lg font-mono font-bold text-solvera-highlight">
                {params.issuanceCostTraditional}% vs {params.issuanceCostTokenized}%
              </div>
              <div className="text-xs text-solvera-positive mt-1">
                Anda hemat {(params.issuanceCostTraditional - params.issuanceCostTokenized)}% di awal
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <AssetSummary results={results} tokenizedEquity={params.tokenizedEquity} />

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 xl:col-span-5">
            <ROIComparison
              results={results}
              issuanceCostTraditional={params.issuanceCostTraditional}
              issuanceCostTokenized={params.issuanceCostTokenized}
            />
          </div>
          <div className="lg:col-span-12 xl:col-span-7">
            <Visualizations results={results} />
          </div>
        </div>

      </main>

      <CTAModal />
    </div>
  );
}

const ControlGroup = ({ label, value, children }: { label: string, value: string, children: React.ReactNode }) => (
  <div>
    <div className="flex justify-between mb-3 text-sm">
      <span className="text-solvera-text/70 font-medium">{label}</span>
      <span className="font-mono font-bold text-white">{value}</span>
    </div>
    {children}
  </div>
);

const CustomSlider = (props: React.ComponentProps<typeof Slider.Root>) => (
  <Slider.Root
    className="relative flex items-center select-none touch-none w-full h-5"
    {...props}
  >
    <Slider.Track className="bg-white/10 relative grow rounded-full h-[3px]">
      <Slider.Range className="absolute bg-solvera-highlight rounded-full h-full" />
    </Slider.Track>
    <Slider.Thumb
      className="block w-5 h-5 bg-white shadow-lg rounded-full hover:bg-solvera-highlight focus:outline-none focus:ring-2 focus:ring-solvera-highlight/50 transition-colors cursor-grab active:cursor-grabbing"
      aria-label="Volume"
    />
  </Slider.Root>
);

export default App;
