import React from 'react';
import { Switch } from '@headlessui/react';
import { clsx } from 'clsx';
import type { Initiative } from '../types';
import { Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
    initiatives: Initiative[];
    activeInitiatives: string[];
    onToggle: (id: string) => void;
}

export const ValueCreationRoadmap: React.FC<Props> = ({ initiatives, activeInitiatives, onToggle }) => {
    const { language, t } = useLanguage();
    return (
        <div className="space-y-4">
            {initiatives.map((item) => {
                const isActive = activeInitiatives.includes(item.id);
                return (
                    <div
                        key={item.id}
                        className={clsx(
                            "p-4 rounded-lg border transition-all duration-300 flex items-center justify-between",
                            isActive
                                ? "bg-solvera-navy/20 border-solvera-cyan/50 shadow-[0_0_15px_rgba(122,229,255,0.1)]"
                                : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <div className={clsx(
                                "p-2 rounded-full mt-1",
                                isActive ? "bg-solvera-cyan/10 text-solvera-cyan" : "bg-gray-700 text-gray-500"
                            )}>
                                <Zap size={18} />
                            </div>
                            <div>
                                <h4 className={clsx("font-medium", isActive ? "text-white" : "text-gray-400")}>
                                    {t(item.name, item.name)}
                                </h4>
                                <div className="text-sm text-gray-500 mt-1 font-mono">
                                    {language === 'en' 
                                        ? `Cost: $${(item.cost / 16000 / 1000).toFixed(1)}k` 
                                        : `Biaya: Rp ${(item.cost / 1000000).toFixed(0)} Jt`}
                                    <span className="mx-2">•</span>
                                    {t('Dampak', 'Impact')}: +{item.impact_multiple}x
                                </div>
                            </div>
                        </div>

                        <Switch
                            checked={isActive}
                            onChange={() => onToggle(item.id)}
                            className={clsx(
                                isActive ? 'bg-solvera-cyan' : 'bg-gray-700',
                                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-solvera-cyan focus:ring-offset-2 focus:ring-offset-gray-900'
                            )}
                        >
                            <span className="sr-only">Toggle initiative</span>
                            <span
                                aria-hidden="true"
                                className={clsx(
                                    isActive ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                )}
                            />
                        </Switch>
                    </div>
                )
            })}
        </div >
    );
};
