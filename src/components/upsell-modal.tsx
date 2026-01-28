import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

interface UpsellModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    comboName: string;
    comboImage: string;
    comboContent: string;
    extraCost: number;
}

export default function UpsellModal({ isOpen, onClose, onAccept, comboName, comboImage, comboContent, extraCost }: UpsellModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 md:p-0">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-t-3xl md:rounded-2xl overflow-hidden max-w-md w-full shadow-2xl relative z-[101] m-auto"
            >
                <div className="bg-gradient-to-br from-morrison-green to-emerald-600 p-1">
                    <div className="bg-white rounded-t-[1.3rem] md:rounded-xl overflow-hidden h-full">
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full transition z-20">
                            <X size={20} className="text-gray-600" />
                        </button>

                        <div className="relative h-48 w-full bg-[#f9f9f9]">
                            {comboImage && (
                                <Image
                                    src={comboImage}
                                    alt={comboName}
                                    fill
                                    className="object-contain p-4 drop-shadow-xl"
                                />
                            )}
                            <div className="absolute top-4 left-4 bg-morrison-red text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                                Oferta Especial
                            </div>
                        </div>

                        <div className="p-6 text-center">
                            <h3 className="text-2xl font-display text-morrison-maroon mb-2">¡Mejora tu Pedido!</h3>
                            <p className="text-gray-600 mb-6 text-sm md:text-base">
                                Por solo <span className="font-bold text-morrison-green text-xl mx-1">S/ {extraCost.toFixed(2)}</span> adicionales te llevas:
                            </p>

                            <div className="bg-orange-50 p-4 rounded-xl mb-8 border border-orange-100 flex items-center gap-4 text-left">
                                <div className="flex-1">
                                    <h4 className="font-display text-lg text-morrison-maroon leading-tight mb-1">{comboName}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{comboContent}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3.5 text-gray-500 font-bold text-sm hover:bg-gray-50 rounded-xl transition border border-gray-100"
                                >
                                    Solo el producto
                                </button>
                                <button
                                    onClick={onAccept}
                                    className="flex-1 py-3.5 bg-morrison-green text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition flex items-center justify-center gap-2 transform active:scale-95"
                                >
                                    <Check size={18} />
                                    ¡Mejora el Combo!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
