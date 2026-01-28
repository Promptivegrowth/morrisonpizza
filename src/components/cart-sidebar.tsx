'use client';
import { useCartStore } from '@/store/cart';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function CartSidebar() {
    const { items, isOpen, toggleCart, removeItem, total, updateQuantity } = useCartStore();
    const [address, setAddress] = useState('');
    const [ref, setRef] = useState('');

    const generateWhatsApp = () => {
        let msg = `🍕 *Nuevo Pedido Morrison Pizza* 🍕\n\n`;
        items.forEach(item => {
            msg += `• ${item.quantity}x ${item.name} ${item.details ? `(${item.details})` : ''} - S/ ${(item.price * item.quantity).toFixed(2)}\n`;
        });
        msg += `\n________________________________________\n`;
        msg += `💰 *Total a pagar: S/ ${total().toFixed(2)}*`;
        msg += `\n📍 Dirección: ${address || 'Pendiente'}`;
        msg += `\n🛵 Referencia: ${ref || 'Pendiente'}`;

        // Using a placeholder number. Ideally this should be configured.
        return `https://wa.me/51966650474?text=${encodeURIComponent(msg)}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        <div className="p-6 bg-morrison-green text-white flex justify-between items-center shadow-md">
                            <div className="flex items-center gap-3">
                                <ShoppingBag />
                                <h2 className="text-2xl font-display">Tu Pedido</h2>
                                <span className="bg-morrison-yellow text-morrison-maroon px-2 py-0.5 rounded-full text-sm font-bold">{items.length}</span>
                            </div>
                            <button onClick={toggleCart}><X /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="text-center text-gray-400 mt-20">
                                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Tu carrito está vacío.</p>
                                    <p className="text-sm">¡Agrega una pizza brutal!</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-display text-lg leading-none">{item.name}</h4>
                                            {item.details && <p className="text-xs text-gray-500 mt-1">{item.details}</p>}
                                            <p className="text-morrison-green font-bold mt-2">S/ {item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex flex-col items-end justify-between">
                                            <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                                            {/* Quantity controls could go here */}
                                            <div className="flex items-center gap-2 bg-white rounded-lg border px-2 py-1">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-black">-</button>
                                                <span className="text-sm font-bold min-w-[1rem] text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-black">+</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}

                            {/* Upselling Placeholder */}
                            {items.length > 0 && (
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                    <p className="font-bold text-orange-800 text-sm mb-2">¿Deseas agregar Pan al Ajo Especial?</p>
                                    <button className="w-full bg-white text-orange-600 border border-orange-200 py-2 rounded-lg text-sm hover:bg-orange-100 transition-colors">
                                        Agregar por S/ 10.00
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-white border-t space-y-4">
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Dirección de entrega"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-morrison-green outline-none transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="Referencia (Ej: Grifo Repsol)"
                                    value={ref}
                                    onChange={(e) => setRef(e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-morrison-green outline-none transition-all"
                                />
                            </div>

                            <div className="flex justify-between items-center text-xl font-heading">
                                <span>Total</span>
                                <span>S/ {total().toFixed(2)}</span>
                            </div>

                            <a
                                href={generateWhatsApp()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-morrison-green text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                            >
                                Finalizar Pedido por WhatsApp <ChevronRight />
                            </a>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
