'use client';

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PIZZAS, OTHER_PRODUCTS } from "@/data/products";
import { ChevronRight } from "lucide-react";

interface MegaMenuProps {
    activeCategory: string | null;
    onClose: () => void;
}

export default function MegaMenu({ activeCategory, onClose }: MegaMenuProps) {
    if (!activeCategory) return null;

    // Unified configuration for each category
    const categoryConfig: Record<string, {
        title: string;
        description: string;
        link: string;
        items: any[];
        type: 'pizzas' | 'products' | 'combos';
        colorDecoration: string; // for subtle gradients/accents
    }> = {
        'Pizzas': {
            title: 'Nuestras Pizzas',
            description: 'Masa artesanal fresca, ingredientes premium y el sabor inconfundible de Morrison.',
            link: '/#pizzas',
            items: PIZZAS.slice(0, 4), // First 4 pizzas
            type: 'pizzas',
            colorDecoration: 'bg-morrison-green/5'
        },
        'Combos': {
            title: 'Combos Grupales',
            description: 'Las mejores combinaciones para compartir con amigos y familia.',
            link: '/#combos',
            items: OTHER_PRODUCTS.combos.slice(0, 4),
            type: 'combos',
            colorDecoration: 'bg-morrison-red/5' // Keep subtle color variation if desired, or make all uniform? User said "styles different", usually means layout. I will keep subtle thematic color but unify layout.
        },
        'Pastas': {
            title: 'Pastas Artesanales',
            description: 'Recetas italianas clásicas con nuestro toque especial.',
            link: '/#pastas',
            items: OTHER_PRODUCTS.pastas.slice(0, 4),
            type: 'products',
            colorDecoration: 'bg-morrison-yellow/10'
        },
        'Salchipapas': {
            title: 'Salchipapas & Alitas',
            description: 'Papas nativas crocantes y alitas con salsas irresistibles.',
            link: '/#salchipapas',
            items: OTHER_PRODUCTS.salchipapas.slice(0, 4),
            type: 'products',
            colorDecoration: 'bg-morrison-maroon/5'
        }
    };

    const config = categoryConfig[activeCategory];
    if (!config) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-8 z-40"
                onMouseLeave={onClose}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Sidebar Info - Unified Style */}
                        <div className={`col-span-12 md:col-span-3 p-6 rounded-2xl ${config.colorDecoration} flex flex-col justify-between h-full min-h-[250px]`}>
                            <div>
                                <h3 className="font-display text-3xl text-morrison-maroon mb-4">{config.title}</h3>
                                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{config.description}</p>
                            </div>
                            <Link
                                href={config.link}
                                onClick={onClose}
                                className="text-morrison-maroon font-bold text-sm flex items-center gap-2 group w-fit px-4 py-2 border border-morrison-maroon/20 rounded-full hover:bg-morrison-maroon hover:text-white transition-all"
                            >
                                Ver Carta Completa
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Items Grid - Unified Style */}
                        <div className="col-span-12 md:col-span-9">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {config.items.map((item, idx) => (
                                    <Link
                                        key={item.id || item.name}
                                        href={config.link}
                                        onClick={onClose}
                                        className="group flex flex-col items-center text-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="relative w-full aspect-square mb-4 rounded-full overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 group-hover:ring-morrison-yellow transition-all">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">Sin Foto</div>
                                            )}
                                        </div>
                                        <h4 className="font-display text-lg text-gray-800 group-hover:text-morrison-maroon transition-colors line-clamp-1">{item.name}</h4>

                                        {config.type === 'pizzas' && (
                                            <span className="text-xs text-gray-500 line-clamp-2 mt-1 px-2 h-8">
                                                {item.ingredients ? item.ingredients.split('+').slice(0, 3).join(', ') : ''}
                                            </span>
                                        )}

                                        {config.type === 'combos' && (
                                            <span className="text-xs text-gray-500 line-clamp-2 mt-1 px-2 h-8">
                                                {item.content || item.description || ''}
                                            </span>
                                        )}

                                        {(config.type === 'products') && (
                                            <span className="text-xs text-gray-500 line-clamp-2 mt-1 px-2 h-8">
                                                {item.description || ''}
                                            </span>
                                        )}

                                        {item.prices?.mediana && (
                                            <span className="text-morrison-red font-bold text-sm mt-2">Desde S/ {item.prices.mediana}</span>
                                        )}

                                        {item.price && (
                                            <span className="text-morrison-red font-bold text-sm mt-2">S/ {item.price}</span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
