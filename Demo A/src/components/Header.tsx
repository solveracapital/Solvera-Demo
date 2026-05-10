import React from 'react';
import Solvera from '../assets/Solvera.svg';
import { useLanguage } from '../contexts/LanguageContext';

export const Header: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-solvera-bg/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <a href="https://solvera.biz.id/#portfolio" className="flex items-center gap-2 text-xs font-bold text-solvera-text/60 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                        {t('Kembali', 'Back')}
                    </a>
                    <div className="flex items-center justify-center w-12 h-12">
                        <img src={Solvera} alt="Solvera Logo" className="w-full h-full object-contain" />
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm text-solvera-text/70">
                    <span>{t('Solusi Modal. Mengakselerasi Pertumbuhan.', 'Capital Solutions. Accelerating Growth.')}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
                    <button 
                        onClick={() => setLanguage('id')}
                        className={`px-2 py-1 text-xs font-bold rounded ${language === 'id' ? 'bg-solvera-highlight text-solvera-bg' : 'text-solvera-text/60 hover:text-white'}`}
                    >
                        ID
                    </button>
                    <button 
                        onClick={() => setLanguage('en')}
                        className={`px-2 py-1 text-xs font-bold rounded ${language === 'en' ? 'bg-solvera-highlight text-solvera-bg' : 'text-solvera-text/60 hover:text-white'}`}
                    >
                        EN
                    </button>
                </div>
            </div>
        </header>
    );
};
