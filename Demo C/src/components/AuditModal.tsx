import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, ArrowRight } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const AuditModal: React.FC<Props> = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-2xl w-full bg-solvera-bg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">

                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <Dialog.Title className="text-xl font-bold text-solvera-text">
                            Operational Engineering Audit Plan
                        </Dialog.Title>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8">
                        <p className="text-gray-400 mb-8">
                            Langkah strategis untuk mengubah efisiensi operasional menjadi valuasi exit yang lebih tinggi melalui intervensi engineering.
                        </p>

                        <div className="space-y-6 relative">
                            {/* Connecting Line */}
                            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-800 -z-10"></div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-solvera-navy flex items-center justify-center shrink-0 font-bold text-solvera-navy">1</div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Portfolio Readiness Check</h3>
                                    <p className="text-sm text-gray-500">Kesiapan Portofolio: Evaluasi infrastruktur saat ini dan identifikasi bottleneck utama.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-solvera-cyan flex items-center justify-center shrink-0 font-bold text-solvera-cyan">2</div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Engineering Maturity Assessment</h3>
                                    <p className="text-sm text-gray-500">Penilaian Maturitas Teknik: Audit kapabilitas tim, CI/CD pipeline, dan kualitas kode.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-solvera-lime flex items-center justify-center shrink-0 font-bold text-solvera-lime">3</div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Data Quality Audit</h3>
                                    <p className="text-sm text-gray-500">Audit Kualitas Data: Memastikan integritas data untuk pengambilan keputusan berbasis AI.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-900 border-t border-gray-800 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { alert('Booking Request Sent (Prototyping)'); onClose(); }}
                            className="px-6 py-2 bg-solvera-lime text-solvera-bg font-bold rounded hover:bg-opacity-90 flex items-center gap-2"
                        >
                            Confirm Booking <ArrowRight size={16} />
                        </button>
                    </div>

                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
