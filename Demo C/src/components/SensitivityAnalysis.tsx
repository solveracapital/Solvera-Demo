import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
    exitYear: number;
    setExitYear: (val: number) => void;
    marketMultiple: number;
    setMarketMultiple: (val: number) => void;
}

export const SensitivityAnalysis: React.FC<Props> = ({
    exitYear, setExitYear, marketMultiple, setMarketMultiple
}) => {
    const { t } = useLanguage();
    return (
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold mb-6 text-solvera-text">{t('Sensitivity Analysis ("What-If")', 'Sensitivity Analysis ("What-If")')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Exit Year Slider */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-gray-400 text-sm">{t('Horizon Exit (Tahun)', 'Exit Horizon (Years)')}</label>
                        <span className="text-solvera-cyan font-mono font-bold">{exitYear} {t('Tahun', 'Years')}</span>
                    </div>
                    <input
                        type="range"
                        min="3"
                        max="7"
                        step="1"
                        value={exitYear}
                        onChange={(e) => setExitYear(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-solvera-cyan"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>3 {t('Thn', 'Yrs')}</span>
                        <span>7 {t('Thn', 'Yrs')}</span>
                    </div>
                </div>

                {/* Market Multiple Slider */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-gray-400 text-sm">Market Multiple (EBITDA)</label>
                        <span className="text-solvera-lime font-mono font-bold">{marketMultiple}x</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="15"
                        step="0.5"
                        value={marketMultiple}
                        onChange={(e) => setMarketMultiple(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-solvera-lime"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>5x</span>
                        <span>15x</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
