'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-is-mobile';

const COMBOS = [
    {
        id: 'para-dos',
        title: "Combo Para Dos",
        description: "1 Pizza Mediana (Peperoni o Americana) + Limonada o Naranjada + Pan al ajo",
        price: "S/ 26.00",
        image: "/images/combos/combo para dos.png",
        theme: "green"
    },
    {
        id: 'super-glotones',
        title: "Súper Combo Los Glotones",
        description: "2 Pizzas Medianas (Peperoni, Americana o Hawaiana) + Gaseosa 1L + Pan al ajo",
        price: "S/ 38.00",
        image: "/images/combos/Super Combo los Glotones.png",
        theme: "red"
    },
    {
        id: 'super-mediana',
        title: "Súper Combo Mediana",
        description: "3 Pizzas Medianas (Peperoni, Americana o Hawaiana) + Gaseosa 1L + Pan al ajo",
        price: "S/ 47.99",
        image: "/images/combos/Super Combo Mediana.png",
        theme: "yellow"
    },
    {
        id: 'combo-familiar',
        title: "Combo Familiar",
        description: "1 Pizza Familiar (Peperoni, Americana o Hawaiana) + Gaseosa 1L + Pan al ajo",
        price: "S/ 38.00",
        image: "/images/combos/combo familiar.png",
        theme: "white"
    },
    {
        id: 'duo-grande',
        title: "Combo Dúo Grande",
        description: "2 Pizzas Grandes (Peperoni, Americana o Hawaiana) + Gaseosa 1L + Pan al ajo",
        price: "S/ 49.99",
        image: "/images/combos/Combo Duo Grande.png",
        theme: "green"
    },
    {
        id: 'extra-familiar',
        title: "Combo Extra Familiar",
        description: "2 Pizzas Familiares (Peperoni o Americana) + Gaseosa 1L + Pan al ajo",
        price: "S/ 62.00",
        image: "/images/combos/combo extra familiar.png",
        theme: "red"
    },
    {
        id: 'pizza-gigante',
        title: "Combo Pizza Gigante",
        description: "1 Pizza Gigante (Americana) + Gaseosa 1L + Pan al ajo",
        price: "S/ 46.00",
        image: "/images/combos/combo pizza gigante.png",
        theme: "yellow"
    },
    {
        id: 'duo-italiano',
        title: "Dúo Italiano",
        description: "1 Pizza Mediana (Peperoni, Americana o Hawaiana) + Lasagna de Carne + Bebida + Pan al ajo",
        price: "S/ 40.00",
        image: "/images/combos/duo italiano.png",
        theme: "white"
    },
    {
        id: 'trio-italiano',
        title: "Trío Italiano",
        description: "1 Lasagna de Carne + 1 Spaghetti Alfredo + 1 Spaghetti a la Boloñesa + Bebida + Pan al ajo",
        price: "S/ 45.00",
        image: "/images/combos/trio italiano.png",
        theme: "green"
    },
    {
        id: 'full-amigos',
        title: "Combo Full Amigos",
        description: "1 Pizza Grande + 1 Mediana (Peperoni, Americana o Hawaiana) + 1 Lasagna + Bebida + Pan al ajo",
        price: "S/ 65.00",
        image: "/images/combos/combo full amigos.png",
        theme: "red"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 50, damping: 20 }
    }
} as const;

export default function PromoSection() {
    const isMobile = useIsMobile();
    return (
        <section id="combos" className="py-24 px-4 bg-[#F9F5E8] relative z-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl lg:text-6xl font-display text-morrison-maroon mb-4">Combos Grupales</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-sans">
                        Las mejores promociones para compartir momentos inolvidables en familia y con amigos.
                    </p>
                </div>

                <motion.div
                    variants={!isMobile ? container : undefined}
                    initial={!isMobile ? "hidden" : undefined}
                    whileInView={!isMobile ? "show" : undefined}
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
                >
                    {COMBOS.map((combo) => (
                        <ComboCard key={combo.id} combo={combo} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

import { useCartStore } from '@/store/cart';

// ... (existing imports ok) ...

// ... (COMBOS, container, cardVariants ok) ...

// ... (PromoSection export ok) ...

function ComboCard({ combo }: { combo: any }) {
    const addItem = useCartStore((state) => state.addItem);
    const toggleCart = useCartStore((state) => state.toggleCart);
    const isMobile = useIsMobile();

    const handleAddToCart = () => {
        const priceNumber = parseFloat(combo.price.replace('S/ ', ''));
        addItem({
            name: combo.title,
            description: combo.description,
            price: priceNumber || 0,
            quantity: 1,
            type: 'combo',
            details: combo.description
        });
        toggleCart();
    };

    // Theme configuration for cards
    const themes: any = {
        red: {
            card: "bg-morrison-red",
            title: "text-white",
            desc: "text-white/90",
            price: "text-morrison-yellow",
            badge: "bg-morrison-yellow text-morrison-maroon"
        },
        yellow: {
            card: "bg-morrison-yellow",
            title: "text-morrison-maroon",
            desc: "text-morrison-maroon/80",
            price: "text-morrison-red",
            badge: "bg-morrison-red text-white"
        },
        green: {
            card: "bg-morrison-green",
            title: "text-white",
            desc: "text-white/90",
            price: "text-morrison-yellow",
            badge: "bg-white text-morrison-green"
        },
        white: {
            card: "bg-white border-2 border-morrison-maroon/10",
            title: "text-morrison-maroon",
            desc: "text-gray-600",
            price: "text-morrison-red",
            badge: "bg-morrison-maroon text-white"
        }
    };

    const theme = themes[combo.theme] || themes.red;

    return (
        <motion.div
            variants={!isMobile ? cardVariants : undefined}
            initial={isMobile ? { opacity: 1, y: 0 } : undefined}
            whileTap={{ scale: 0.98 }}
            whileHover={!isMobile ? { y: -4, x: 4 } : undefined}
            whileInView={isMobile ? { y: -4, x: 4 } : undefined}
            viewport={isMobile ? { once: false, margin: "-40% 0px -40% 0px" } : undefined}
            transition={{ duration: 0.4 }}
            onClick={handleAddToCart}
            className={cn(
                "relative rounded-3xl overflow-hidden shadow-[-8px_8px_0px_0px_#400101] group cursor-pointer flex flex-col sm:flex-row h-auto sm:h-64",
                theme.card
            )}
        >
            {/* Promo Badge - Centered Top */}
            <span className={cn(
                "absolute top-3 left-1/2 -translate-x-1/2 z-30 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-opacity-90 shadow-sm",
                theme.badge
            )}>
                Promo
            </span>

            {/* Content Side - Name & Description */}
            <div className="p-8 pb-0 sm:pb-8 sm:w-[60%] flex flex-col justify-center relative z-10 order-1 w-full pt-12 sm:pt-8">
                <div>
                    <h3 className={cn("text-3xl font-heading leading-none mb-3 uppercase tracking-wide", theme.title)}>
                        {combo.title}
                    </h3>
                    <p className={cn("text-sm sm:text-base font-medium leading-snug mb-2 sm:mb-6 opacity-95", theme.desc)}>
                        {combo.description}
                    </p>
                </div>

                {/* Desktop Price & CTA */}
                <div className="hidden sm:flex items-center gap-4 mt-auto">
                    <span className={cn("text-4xl font-display whitespace-nowrap", theme.price)}>
                        {combo.price}
                    </span>
                    <span className={cn(
                        "p-3 rounded-full shadow-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 hover:!scale-125 hover:shadow-xl hover:brightness-110 active:scale-90 z-20 relative",
                        theme.badge
                    )}>
                        <ShoppingCart size={20} strokeWidth={2.5} />
                    </span>
                </div>
            </div>

            {/* Image Side */}
            <div className="sm:w-[40%] relative min-h-[200px] sm:min-h-full order-2 w-full h-[200px] sm:h-auto">
                <div className="absolute inset-0 flex items-center justify-center sm:justify-start p-4 sm:p-0 sm:-ml-24">
                    <motion.div
                        whileHover={!isMobile ? { scale: 1.15, rotate: -2 } : undefined}
                        whileInView={isMobile ? { scale: 1.15, rotate: -2 } : undefined}
                        viewport={isMobile ? { once: false, margin: "-40% 0px -40% 0px" } : undefined}
                        whileTap={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="relative w-full h-full sm:w-[140%] sm:h-[140%]"
                    >
                        <Image
                            src={combo.image}
                            alt={combo.title}
                            fill
                            className="object-contain drop-shadow-xl"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Mobile Price Side */}
            <div className="p-8 pt-0 flex sm:hidden items-center justify-between w-full order-3 relative z-10">
                <span className={cn("text-4xl font-display whitespace-nowrap", theme.price)}>
                    {combo.price}
                </span>
                <span className={cn(
                    "p-2.5 rounded-full shadow-sm flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-110 hover:shadow-lg",
                    theme.badge
                )}>
                    <ShoppingCart size={18} strokeWidth={2.5} />
                </span>
            </div>

            {/* Decorative Shine Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
        </motion.div>
    );
}
