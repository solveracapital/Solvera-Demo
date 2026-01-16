import * as Dialog from '@radix-ui/react-dialog';
import { Check, X, ArrowRight, ShieldCheck, FileText, Lock } from 'lucide-react';

export const CTAModal = () => {
    return (
        <Dialog.Root>
            <div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-gradient-to-t from-solvera-bg to-transparent pointer-events-none flex justify-center">
                <Dialog.Trigger asChild>
                    <button className="pointer-events-auto shadow-2xl shadow-solvera-primary/50 bg-solvera-primary hover:bg-solvera-primary/90 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-3 border border-white/10">
                        Jadwalkan Audit Kepatuhan & Strukturisasi
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </Dialog.Trigger>
            </div>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-solvera-bg border border-white/10 p-6 shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
                    <Dialog.Title className="text-xl font-bold text-white mb-2">
                        Audit Strukturisasi & Kepatuhan
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-solvera-text/70 mb-6">
                        Tim teknisi hukum kami akan meninjau aset Anda untuk kelayakan tokenisasi.
                    </Dialog.Description>

                    <div className="space-y-3 mb-6">
                        <CheckItem
                            icon={<ShieldCheck className="w-5 h-5 text-solvera-highlight" />}
                            title="Infrastruktur KYC/AML"
                            desc="Pemeriksaan orientasi investor otomatis"
                        />
                        <CheckItem
                            icon={<FileText className="w-5 h-5 text-solvera-highlight" />}
                            title="Keamanan Smart Contract"
                            desc="Audit kode & penilaian kerentanan"
                        />
                        <CheckItem
                            icon={<Lock className="w-5 h-5 text-solvera-highlight" />}
                            title="Integrasi Cap Table"
                            desc="Sinkronisasi On-chain vs Off-chain"
                        />
                    </div>

                    <div className="bg-solvera-positive/10 border border-solvera-positive/20 rounded-xl p-4 mb-6">
                        <h4 className="text-solvera-positive font-bold text-sm mb-1">Temuan ROI yang Diharapkan</h4>
                        <div className="flex items-center gap-2 text-xs text-solvera-text/80">
                            <Check className="w-3 h-3 text-solvera-positive" />
                            <span>Membuka Diskon Ilikuiditas 15-30%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-solvera-text/80">
                            <Check className="w-3 h-3 text-solvera-positive" />
                            <span>Kurangi Biaya Administrasi sebesar 40%</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Dialog.Close asChild>
                            <button className="bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors">
                                Batal
                            </button>
                        </Dialog.Close>
                        <button
                            onClick={() => alert("Permintaan Audit Terkirim (Demo)")}
                            className="bg-solvera-primary hover:bg-solvera-primary/90 text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-solvera-primary/20"
                        >
                            Minta Audit
                        </button>
                    </div>

                    <Dialog.Close asChild>
                        <button className="absolute top-4 right-4 text-solvera-text/40 hover:text-white" aria-label="Close">
                            <X className="w-4 h-4" />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

const CheckItem = ({ icon, title, desc }: any) => (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
        <div className="mt-0.5">{icon}</div>
        <div>
            <div className="text-sm font-bold text-white">{title}</div>
            <div className="text-xs text-solvera-text/50">{desc}</div>
        </div>
    </div>
);
