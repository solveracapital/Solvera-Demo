import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-solvera-bg/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-solvera-primary text-white font-bold font-mono">
                        S
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Solvera</span>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm text-solvera-text/70">
                    <span>Solusi Modal. Mengakselerasi Pertumbuhan.</span>
                </div>
                <div>
                    {/* Placeholder for potential nav or profile */}
                </div>
            </div>
        </header>
    );
};
