'use client';
import { OTHER_PRODUCTS } from '@/data/products';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import UpsellModal from '@/components/upsell-modal';

import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-is-mobile';

export default function MenuGrid() {
    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const toggleCart = useCartStore((state) => state.toggleCart);
    const isMobile = useIsMobile();


    const [upsellConfig, setUpsellConfig] = useState<{
        combo: any,
        extraCost: number,
        itemToAdd: any,
        targetCartItemIds?: string[]
    } | null>(null);

    const handleAdd = (item: any, type: 'combo' | 'other' = 'other') => {
        // Upsell Logic
        if (type === 'other' && item.name) {
            // Helper for flavor check
            const isFlavorValid = (d: string | undefined) => ['americana', 'peperoni', 'hawaiana'].includes(d?.toLowerCase().trim() || '');

            // 1. Check for Combo Full Amigos (Needs 1 Grande + 1 Mediana in Cart + Adding Lasagna)
            // (Note: This assumes we are adding Lasagna. If adding Pizza, that's handled in PizzaBuilder)
            if (item.name === 'Lasagna de Carne') {
                const grande = cartItems.find(i => i.quantity === 1 && i.type === 'pizza' && i.name.includes('Grande') && isFlavorValid(i.details));
                const mediana = cartItems.find(i => i.quantity === 1 && i.type === 'pizza' && i.name.includes('Mediana') && isFlavorValid(i.details));

                // Case A: Perfect Match (Grande + Mediana + Lasagna)
                if (grande && mediana) {
                    const comboFull = OTHER_PRODUCTS.combos.find(c => c.name === 'Combo Full Amigos');
                    if (comboFull) {
                        const basePrice = item.price + grande.price + mediana.price;
                        const extraCost = comboFull.price - basePrice;
                        setUpsellConfig({
                            combo: comboFull,
                            extraCost: Math.max(0, extraCost),
                            itemToAdd: { ...item, type, quantity: 1, details: item.content || item.description },
                            targetCartItemIds: [grande.id, mediana.id]
                        });
                        return;
                    }
                }

                // Case B: Partial Match (Grande + Lasagna) -> Upsell Mediana (Full Amigos)
                // "debe activarse tambien cuando se pide una pizza grande + una lasagna"
                if (grande && !mediana) {
                    const comboFull = OTHER_PRODUCTS.combos.find(c => c.name === 'Combo Full Amigos');
                    if (comboFull) {
                        // We have Grande + Lasagna (Adding). Missing Mediana.
                        // Offer Combo. Target: Grande.
                        // Result: Combo (includes all 3).
                        const basePrice = item.price + grande.price;
                        const extraCost = comboFull.price - basePrice;
                        setUpsellConfig({
                            combo: comboFull,
                            extraCost: Math.max(0, extraCost),
                            itemToAdd: { ...item, type, quantity: 1, details: item.content || item.description },
                            targetCartItemIds: [grande.id]
                        });
                        return;
                    }
                }

                // 2. Check for Dúo Italiano (Needs 1 Mediana in Cart + Adding Lasagna)
                const medianaForDuo = cartItems.find(i => i.quantity === 1 && i.type === 'pizza' && i.name.includes('Mediana') && isFlavorValid(i.details));
                if (medianaForDuo) {
                    const comboDuo = OTHER_PRODUCTS.combos.find(c => c.name === 'Dúo Italiano');
                    if (comboDuo) {
                        const basePrice = item.price + medianaForDuo.price;
                        const extraCost = comboDuo.price - basePrice;
                        setUpsellConfig({
                            combo: comboDuo,
                            extraCost: Math.max(0, extraCost),
                            itemToAdd: { ...item, type, quantity: 1, details: item.content || item.description },
                            targetCartItemIds: [medianaForDuo.id]
                        });
                        return;
                    }
                }
            }

            // 3. Fallback: Trío Italiano logic (3 Pastas)
            // "se activa cuando se agregan 2 de las 4 patas ... tambien con dos platos"
            const eligiblePastas = ['Lasagna de Carne', 'Spaguetti A lo Alfredo', 'Spaguetti A la Bolognesa', 'Spaguetti en Salsa de Champiñones'];
            if (eligiblePastas.includes(item.name)) {
                const trioItaliano = OTHER_PRODUCTS.combos.find(c => c.name === 'Trío Italiano');
                if (trioItaliano) {
                    // Check total quantity in cart + current item
                    const addingQty = item.quantity || 1;
                    const cartMatches = cartItems.filter(i => eligiblePastas.includes(i.name));
                    const qtyInCart = cartMatches.reduce((acc, i) => acc + i.quantity, 0);

                    // Trigger on 2 OR 3
                    if (qtyInCart + addingQty >= 2) {
                        // We always upsell to a combo of 3 items.
                        // So, we need to "consume" 3 items in total (from cart + current add).
                        // The number of items we need to find in the cart is (3 - addingQty).

                        let neededFromCart = 3 - addingQty;
                        const targets: string[] = [];
                        let collected = 0;

                        if (neededFromCart > 0) {
                            // Collect items from cart to reach 'neededFromCart'
                            // Prioritize items that are already in the cart.
                            for (const m of cartMatches) {
                                // Add the item's ID to targets.
                                // If an item has quantity > 1, we consider its full quantity for collection.
                                targets.push(m.id);
                                collected += m.quantity;
                                if (collected >= neededFromCart) break; // Stop once enough are collected
                            }
                        }

                        // Calculate Price
                        // The base price is the sum of the price of the item being added (x its quantity)
                        // plus the value of the items identified as 'targets' from the cart.
                        const valueOfRemoved = cartMatches.filter(i => targets.includes(i.id)).reduce((sum, i) => sum + (i.price * i.quantity), 0);
                        const basePrice = (item.price * addingQty) + valueOfRemoved;
                        const extraCost = trioItaliano.price - basePrice;

                        setUpsellConfig({
                            combo: trioItaliano,
                            extraCost: Math.max(0, extraCost),
                            itemToAdd: { ...item, type, quantity: 1, details: item.content || item.description },
                            targetCartItemIds: targets
                        });
                        return;
                    }
                }
            }
        }

        addItem({ ...item, type, quantity: 1, details: item.content || item.description });
        toggleCart();
    };

    const handleUpsellAccept = () => {
        if (!upsellConfig) return;

        // Remove targets if any
        if (upsellConfig.targetCartItemIds) {
            upsellConfig.targetCartItemIds.forEach(id => removeItem(id));
        }

        addItem({
            name: upsellConfig.combo.name,
            type: 'combo',
            price: upsellConfig.combo.price,
            quantity: 1,
            details: upsellConfig.combo.content
        });
        setUpsellConfig(null);
        toggleCart();
    };

    const handleUpsellDecline = () => {
        if (!upsellConfig) return;
        setUpsellConfig(null);
        toggleCart();
    };

    return (
        <div className="bg-morrison-gray py-20 px-4 space-y-32">
            {/* Combos */}


            {/* Pastas Section */}
            <section id="pastas" className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-display text-morrison-red mb-4">Pastas Artesanales</h2>
                    <span className="inline-block bg-morrison-yellow text-morrison-maroon px-4 py-1 rounded-full font-bold tracking-widest text-sm uppercase">Incluyen Pan al Ajo</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {OTHER_PRODUCTS.pastas.map((pasta) => (
                        <motion.div
                            key={pasta.name}
                            whileInView={isMobile
                                ? { boxShadow: "-8px 8px 0px 0px #D32F2F" }
                                : undefined
                            }
                            viewport={isMobile ? { once: false, margin: "-40% 0px -40% 0px" } : undefined}
                            transition={{ duration: 0.3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAdd(pasta)}
                            className={cn(
                                "bg-white rounded-3xl p-6 shadow-[-8px_8px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-300 group ring-1 ring-gray-100 flex flex-col sm:flex-row gap-6 items-center cursor-pointer",
                                !isMobile && "hover:shadow-[-8px_8px_0px_0px_#D32F2F]"
                            )}
                        >
                            <div className="w-full sm:w-1/2 h-48 relative">
                                <motion.div
                                    whileHover={!isMobile ? { scale: 1.1, rotate: -2 } : undefined}
                                    whileInView={isMobile ? { scale: 1.1, rotate: -2 } : undefined}
                                    whileTap={{ scale: 1.05 }}
                                    className="w-full h-full"
                                >
                                    {pasta.image && (
                                        <Image
                                            src={pasta.image}
                                            alt={pasta.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-contain drop-shadow-lg"
                                        />
                                    )}
                                </motion.div>
                            </div>

                            <div className="w-full sm:w-1/2 flex flex-col items-start text-left">
                                <h3 className="text-2xl font-display text-morrison-maroon leading-tight mb-2">{pasta.name}</h3>
                                <p className="text-sm text-gray-500 mb-4 font-medium leading-relaxed">{pasta.description}</p>

                                <div className="mt-auto w-full flex items-center justify-between">
                                    <span className="text-3xl font-display text-morrison-red">S/ {pasta.price}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleAdd(pasta); }}
                                        className="bg-morrison-red text-white p-3 rounded-full hover:bg-morrison-maroon transition-colors shadow-md active:scale-95"
                                    >
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Salchipapas Section */}
            <section id="salchipapas" className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-display text-morrison-maroon mb-4">Salchipapas & Alitas</h2>
                    <span className="inline-block bg-morrison-green text-white px-4 py-1 rounded-full font-bold tracking-widest text-sm uppercase shadow-sm">★ Con Papas Nativas ★</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {OTHER_PRODUCTS.salchipapas.map((item) => (
                        <motion.div
                            key={item.name}
                            whileInView={isMobile
                                ? { boxShadow: "-8px 8px 0px 0px #118C30" }
                                : undefined
                            }
                            viewport={isMobile ? { once: false, margin: "-40% 0px -40% 0px" } : undefined}
                            transition={{ duration: 0.3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAdd(item)}
                            className={cn(
                                "bg-white rounded-3xl overflow-hidden shadow-[-8px_8px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col group h-full ring-1 ring-gray-100 cursor-pointer",
                                !isMobile && "hover:shadow-[-8px_8px_0px_0px_#118C30]"
                            )}
                        >
                            <div className="h-56 w-full relative bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
                                {item.image && (
                                    <motion.div
                                        whileHover={!isMobile ? { scale: 1.15 } : undefined}
                                        whileInView={isMobile ? { scale: 1.15 } : undefined}
                                        whileTap={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="w-full h-full relative"
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-contain drop-shadow-xl"
                                        />
                                    </motion.div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-grow relative bg-white">
                                <h3 className="text-xl font-display text-morrison-maroon leading-tight mb-2">{item.name}</h3>
                                <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed line-clamp-2">{item.description}</p>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-2xl font-display text-morrison-red">S/ {item.price}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleAdd(item); }}
                                        className="bg-morrison-yellow text-morrison-maroon p-3 rounded-full hover:bg-morrison-orange hover:text-white transition-colors shadow-md active:scale-95"
                                        aria-label="Agregar al carrito"
                                    >
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Visual Gallery Carousel - Platos Suculentos */}
            <section className="w-full py-16 overflow-hidden bg-white">
                <div className="mb-2 text-center max-w-7xl mx-auto px-4">
                    <h3 className="text-4xl lg:text-5xl font-display text-morrison-maroon mb-2">No podrás probar solo uno...</h3>
                    <p className="text-gray-500 font-medium text-lg">Directo de nuestra cocina a tu mesa</p>
                </div>

                <PlatosCarousel />
            </section>

            {/* Drinks & Liquors */}
            <section id="bebidas" className="max-w-7xl mx-auto">
                <div className="text-white p-6 md:p-10 rounded-3xl relative overflow-hidden ring-4 ring-morrison-green/30 isolate h-full">
                    {/* Background Images & Overlay */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        {/* Desktop Image */}
                        <div className="hidden md:block relative w-full h-full">
                            <Image
                                src="/images/aguashorizontal.webp"
                                alt="Bar Background"
                                fill
                                sizes="100vw"
                                className="object-cover"
                                quality={90}
                            />
                        </div>
                        {/* Mobile Images (Stacked) */}
                        <div className="md:hidden flex flex-col w-full h-full">
                            <div className="relative w-full h-1/2 border-b border-white/10">
                                <Image
                                    src="/images/aguasvertical.webp"
                                    alt="Bar Background Top"
                                    fill
                                    sizes="100vw"
                                    className="object-cover"
                                    quality={90}
                                />
                            </div>
                            <div className="relative w-full h-1/2">
                                <Image
                                    src="/images/aguasvertical.webp"
                                    alt="Bar Background Bottom"
                                    fill
                                    sizes="100vw"
                                    className="object-cover scale-x-[-1]" // Mirror for variety? Or just repeat. User said repeat.
                                    quality={90}
                                />
                            </div>
                        </div>
                        {/* Green Overlay - Transparent enough to show image, opaque enough for text */}
                        <div className="absolute inset-0 bg-morrison-green/60"></div>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-5xl font-display mb-10 text-center text-morrison-yellow drop-shadow-md">Bebidas & Bar</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <h3 className="text-3xl font-display mb-6 border-b border-white/20 pb-2">Refrescos & Gaseosas</h3>
                                <div className="space-y-4">
                                    {OTHER_PRODUCTS.drinks.map((item, index) => (
                                        <motion.div
                                            key={`${item.name}-${index}`}
                                            whileHover={!isMobile ? { scale: 1.02, backgroundColor: "rgba(255,255,255,0.2)" } : undefined}
                                            whileInView={isMobile ? { scale: 1.02, backgroundColor: "rgba(255,255,255,0.2)" } : undefined}
                                            viewport={isMobile ? { once: false, margin: "-40% 0px -40% 0px", amount: 0.8 } : undefined}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAdd(item)}
                                            className={cn(
                                                "flex justify-between items-center p-4 rounded-xl backdrop-blur-sm shadow-sm transition-all cursor-pointer group bg-white/10",
                                                !isMobile && "hover:bg-white/20"
                                            )}
                                        >
                                            <span className="font-display text-lg">{item.name}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-morrison-yellow font-display text-xl">S/ {item.price}</span>
                                                <motion.button
                                                    whileHover={!isMobile ? { scale: 1.1, backgroundColor: "#F2C12E" } : undefined}
                                                    whileInView={isMobile ? { scale: 1.1, backgroundColor: "#F2C12E" } : undefined}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="bg-white text-morrison-green px-3 py-1 rounded-full text-xs font-bold transition-colors shadow-sm"
                                                >
                                                    +
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-display mb-6 border-b border-white/20 pb-2">Vinos & Cócteles</h3>
                                <div className="space-y-4">
                                    {OTHER_PRODUCTS.liquors.map((item) => {
                                        const isPromo = item.name.includes('2x1');
                                        return (
                                            <motion.div
                                                key={item.name}
                                                onClick={() => handleAdd(item)}
                                                whileHover={!isMobile ? { scale: 1.02, backgroundColor: "rgba(255,255,255,0.2)" } : undefined}
                                                whileInView={isMobile ? { scale: 1.02, backgroundColor: "rgba(255,255,255,0.2)" } : undefined}
                                                viewport={isMobile ? { once: false, margin: "-40% 0px -40% 0px", amount: 0.8 } : undefined}
                                                whileTap={{ scale: 0.95 }}
                                                className={cn(
                                                    `flex justify-between items-center bg-white/10 p-4 rounded-xl backdrop-blur-sm shadow-sm transition-all cursor-pointer group relative overflow-hidden`,
                                                    isPromo ? 'ring-1 ring-morrison-yellow/30' : '',
                                                    !isMobile && "hover:bg-white/20"
                                                )}
                                            >
                                                <div className="relative z-10">
                                                    {isPromo ? (
                                                        <span className="font-display block text-lg relative">
                                                            <span className="text-3xl text-morrison-yellow font-bold mr-2 italic drop-shadow-sm">2x1</span>
                                                            <span className="text-white">{item.name.replace('2x1', '').trim()}</span>
                                                            <span className="ml-2 inline-block bg-morrison-red text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse align-middle shadow-md border border-white/20">
                                                                ¡PROMO!
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span className="font-display block text-lg">{item.name}</span>
                                                    )}
                                                    {item.details && <span className="text-sm opacity-70 block">{item.details}</span>}
                                                </div>
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <span className={`font-display text-xl ${isPromo ? 'text-morrison-yellow scale-105' : 'text-morrison-yellow'}`}>S/ {item.price}</span>
                                                    <motion.button
                                                        whileHover={!isMobile ? { scale: 1.1, backgroundColor: "#F2C12E" } : undefined}
                                                        whileInView={isMobile ? { scale: 1.1, backgroundColor: "#F2C12E" } : undefined}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="bg-white text-morrison-green px-3 py-1 rounded-full text-xs font-bold transition-colors shadow-sm"
                                                    >
                                                        +
                                                    </motion.button>
                                                </div>
                                                {/* Subtle gloss effect for promo */}
                                                {isPromo && <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-morrison-yellow/10 to-transparent pointer-events-none"></div>}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Upsell Modal */}
            <AnimatePresence>
                {upsellConfig && (
                    <UpsellModal
                        isOpen={!!upsellConfig}
                        onClose={handleUpsellDecline}
                        onAccept={handleUpsellAccept}
                        comboName={upsellConfig.combo.name}
                        comboImage={upsellConfig.combo.image}
                        comboContent={upsellConfig.combo.content}
                        extraCost={upsellConfig.extraCost}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function PlatosCarousel() {
    const images = [
        { src: '/images/carrusel/Salchialitas.webp', alt: 'Salchialitas Morrison' },
        { src: '/images/carrusel/alitas-bbq.webp', alt: 'Alitas BBQ' },
        { src: '/images/carrusel/alitas-acevichadas.jpg', alt: 'Alitas Acevichadas' },
        { src: '/images/carrusel/salchipapa-a-lo-pobre.webp', alt: 'Salchipapa a lo Pobre' },
        { src: '/images/carrusel/salchipapa.webp', alt: 'Salchipapa Clásica' },
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-play
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const getVisibleImages = () => {
        const total = images.length;
        const prev = (activeIndex - 1 + total) % total;
        const next = (activeIndex + 1) % total;
        return [images[prev], images[activeIndex], images[next]];
    };

    const visibleImages = getVisibleImages();

    return (
        <div className="relative w-full h-[550px] md:h-[800px] flex items-center justify-center overflow-hidden">
            {/* Render 3 cards, but active one (index 1 in visible array) is zoomed */}
            <div className="flex items-center justify-center gap-4 md:gap-8 w-full max-w-5xl px-4">
                {visibleImages.map((img, i) => {
                    const isCenter = i === 1;
                    return (
                        <motion.div
                            key={`${activeIndex}-${i}`}
                            layout
                            initial={{ scale: 0.8, opacity: 0.5, x: isCenter ? 0 : (i === 0 ? -50 : 50) }}
                            animate={{
                                scale: isCenter ? 1.05 : 0.85,
                                opacity: isCenter ? 1 : 0.6,
                                x: 0,
                                zIndex: isCenter ? 20 : 10,
                                filter: isCenter ? "blur(0px)" : "blur(2px)"
                            }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            onClick={() => {
                                if (i === 0) setActiveIndex((activeIndex - 1 + images.length) % images.length);
                                if (i === 2) setActiveIndex((activeIndex + 1) % images.length);
                            }}
                            className={cn(
                                "relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer bg-black",
                                isCenter ? "w-[360px] md:w-[520px] aspect-[3/4] ring-4 ring-morrison-gold/50" : "hidden md:block w-[340px] aspect-[3/4] grayscale-[30%] hover:grayscale-0"
                            )}
                        >
                            <motion.div
                                className="w-full h-full relative"
                                animate={{ scale: isCenter ? 1.15 : 1 }}
                                transition={{ duration: 5, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                    onClick={() => isCenter && window.innerWidth < 768 && setActiveIndex((activeIndex + 1) % images.length)}
                                />
                            </motion.div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-6 flex gap-2 z-30">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                            "w-3 h-3 rounded-full transition-all shadow-md",
                            idx === activeIndex ? "bg-morrison-yellow w-8" : "bg-white/50 hover:bg-white"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}

