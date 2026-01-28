'use client';
import { useState, useMemo } from 'react';
import { PIZZAS, Pizza, PizzaSize } from '@/data/products';
import { useCartStore } from '@/store/cart';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, ShoppingCart, X, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { OTHER_PRODUCTS } from '@/data/products';
import UpsellModal from '@/components/upsell-modal';

const SIZES: { id: PizzaSize; label: string; slices: number }[] = [
    { id: 'personal', label: 'Personal (4p)', slices: 4 },
    { id: 'mediana', label: 'Mediana (8p)', slices: 8 },
    { id: 'grande', label: 'Grande (12p)', slices: 12 },
    { id: 'familiar', label: 'Familiar (14p)', slices: 14 },
    { id: 'gigante', label: 'Gigante (16p)', slices: 16 },
];

export default function PizzaBuilder() {
    // ... (state vars same as before)
    const [size, setSize] = useState<PizzaSize>('grande');
    const [mode, setMode] = useState<'whole' | 'half' | 'quarter'>('whole');
    const [selections, setSelections] = useState<{ [key: number]: string }>({ 0: 'americana' });
    const [quantity, setQuantity] = useState(1);
    const [activeSlot, setActiveSlot] = useState(0);
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

    // Upsell State
    const [upsellConfig, setUpsellConfig] = useState<{
        combo: any,
        extraCost: number,
        actionType: 'replace_current' | 'replace_cart_item',
        targetCartItemIds?: string[] // Array for multiple removals
    } | null>(null);

    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const toggleCart = useCartStore((state) => state.toggleCart);

    // ... (logic same as before)
    const slots = mode === 'whole' ? [0] : mode === 'half' ? [0, 1] : [0, 1, 2, 3];

    const handleFlavorSelect = (flavorId: string, slotIndex: number) => {
        setSelections(prev => ({ ...prev, [slotIndex]: flavorId }));
    };

    const currentPrice = useMemo(() => {
        if (mode === 'whole') {
            const flavorId = selections[0] || 'americana';
            const pizza = PIZZAS.find(p => p.id === flavorId);
            return pizza?.prices[size] || 0;
        }
        const baseId = mode === 'half' ? '2-estaciones' : '4-estaciones';
        const basePizza = PIZZAS.find(p => p.id === baseId);
        return basePizza?.prices[size] || 0;
    }, [size, mode, selections]);

    const handleUpsellAccept = () => {
        if (!upsellConfig) return;

        const { combo, actionType, targetCartItemIds } = upsellConfig;

        // Add the combo
        addItem({
            name: combo.name,
            type: 'combo',
            price: combo.price,
            quantity: 1,
            details: combo.content
        });

        // Handle removals
        if (actionType === 'replace_cart_item' && targetCartItemIds) {
            targetCartItemIds.forEach(id => removeItem(id));
        }

        // Finalize
        setUpsellConfig(null);
        toggleCart();
        setQuantity(1);
    };

    const addToCart = () => {
        const selectedFlavorsStr = slots.map(s => PIZZAS.find(p => p.id === (selections[s] || 'americana'))?.name).join(', ');
        const details = `${mode === 'whole' ? '' : mode === 'half' ? 'Mitad y Mitad: ' : '4 Sabores: '} ${selectedFlavorsStr}`;
        const flavorId = selections[0]; // Primary flavor for checks

        const candidateItem = {
            name: `Pizza ${size.charAt(0).toUpperCase() + size.slice(1)}`,
            type: 'pizza' as const,
            price: currentPrice,
            quantity: quantity,
            details: details
        };

        // --- UPSELL LOGIC ---

        // Helper to check flavor match strictly
        const checkFlavor = (item: any, allowed: string[]) => {
            const d = item.details?.toLowerCase().trim();
            return allowed.includes(d);
        };

        // 1. Combo Full Amigos (1 Grande + 1 Mediana + 1 Lasagna)
        // Check if adding Grande...
        if (size === 'grande' && mode === 'whole' && quantity === 1 && ['americana', 'peperoni', 'hawaiana'].includes(flavorId)) {
            const comboFull = OTHER_PRODUCTS.combos.find(c => c.name === 'Combo Full Amigos');
            if (comboFull) {
                const mediana = cartItems.find(item => item.quantity === 1 && item.type === 'pizza' && item.name.includes('Mediana') && checkFlavor(item, ['americana', 'peperoni', 'hawaiana']));
                const lasagna = cartItems.find(item => item.quantity === 1 && item.name === 'Lasagna de Carne');

                // Perfect Match: Grande + Mediana + Lasagna
                if (mediana && lasagna) {
                    const basePrice = currentPrice + mediana.price + lasagna.price;
                    const extraCost = comboFull.price - basePrice;
                    setUpsellConfig({ combo: comboFull, extraCost: Math.max(0, extraCost), actionType: 'replace_cart_item', targetCartItemIds: [mediana.id, lasagna.id] });
                    return;
                }
                // Partial: Grande + Mediana (Missing Lasagna)
                if (mediana) {
                    const basePrice = currentPrice + mediana.price;
                    const extraCost = comboFull.price - basePrice;
                    setUpsellConfig({ combo: comboFull, extraCost: Math.max(0, extraCost), actionType: 'replace_cart_item', targetCartItemIds: [mediana.id] });
                    return;
                }
                // Partial: Grande + Lasagna (Missing Mediana)
                if (lasagna) {
                    const basePrice = currentPrice + lasagna.price;
                    const extraCost = comboFull.price - basePrice;
                    setUpsellConfig({ combo: comboFull, extraCost: Math.max(0, extraCost), actionType: 'replace_cart_item', targetCartItemIds: [lasagna.id] });
                    return;
                }
            }
        }
        // Check if adding Mediana...
        if (size === 'mediana' && mode === 'whole' && quantity === 1 && ['americana', 'peperoni', 'hawaiana'].includes(flavorId)) {
            const comboFull = OTHER_PRODUCTS.combos.find(c => c.name === 'Combo Full Amigos');
            if (comboFull) {
                const grande = cartItems.find(item => item.quantity === 1 && item.type === 'pizza' && item.name.includes('Grande') && checkFlavor(item, ['americana', 'peperoni', 'hawaiana']));
                const lasagna = cartItems.find(item => item.quantity === 1 && item.name === 'Lasagna de Carne');

                // Perfect Match: Grande + Mediana + Lasagna
                if (grande && lasagna) {
                    const basePrice = currentPrice + grande.price + lasagna.price;
                    const extraCost = comboFull.price - basePrice;
                    setUpsellConfig({ combo: comboFull, extraCost: Math.max(0, extraCost), actionType: 'replace_cart_item', targetCartItemIds: [grande.id, lasagna.id] });
                    return;
                }
                // Partial: Grande + Mediana (Missing Lasagna)
                if (grande) {
                    const basePrice = currentPrice + grande.price;
                    const extraCost = comboFull.price - basePrice;
                    setUpsellConfig({ combo: comboFull, extraCost: Math.max(0, extraCost), actionType: 'replace_cart_item', targetCartItemIds: [grande.id] });
                    return;
                }
                // Note: Mediana + Lasagna case falls through to Duo Italiano logic (Block 4)
            }
        }

        // 2. Súper Combo Mediana (3 Medianas Am/Pep/Haw)
        if (size === 'mediana' && mode === 'whole' && ['americana', 'peperoni', 'hawaiana'].includes(flavorId)) {
            const comboSuperMed = OTHER_PRODUCTS.combos.find(c => c.name === 'Súper Combo Mediana');
            if (comboSuperMed) {
                // A: Qty=3
                if (quantity === 3) {
                    const extraCost = comboSuperMed.price - (currentPrice * 3);
                    setUpsellConfig({ combo: comboSuperMed, extraCost: Math.max(0, extraCost), actionType: 'replace_current' });
                    return;
                }
                // B: Qty=2 + Cart(1)
                if (quantity === 2) {
                    const matching = cartItems.find(item => item.quantity === 1 && item.type === 'pizza' && item.name.includes('Mediana') && checkFlavor(item, ['americana', 'peperoni', 'hawaiana']));
                    if (matching) {
                        const extraCost = comboSuperMed.price - ((currentPrice * 2) + matching.price);
                        setUpsellConfig({ combo: comboSuperMed, extraCost: Math.max(0, extraCost), actionType: 'replace_cart_item', targetCartItemIds: [matching.id] });
                        return;
                    }
                }
                // C: Qty=1 + Cart(2 or 1x2)
                if (quantity === 1) {
                    const matchings = cartItems.filter(item => item.type === 'pizza' && item.name.includes('Mediana') && checkFlavor(item, ['americana', 'peperoni', 'hawaiana']));

                    // Option 1: Find one item with Qty=2
                    const doubleItem = matchings.find(i => i.quantity === 2);
                    if (doubleItem) {
                        const extraCost = comboSuperMed.price - (currentPrice + (doubleItem.price * 2));
                        setUpsellConfig({ combo: comboSuperMed, extraCost: Math.max(0, extraCost), actionType: 'replace_cart_item', targetCartItemIds: [doubleItem.id] });
                        return;
                    }

                    // Option 2: Find two items with Qty=1
                    const singles = matchings.filter(i => i.quantity === 1);
                    if (singles.length >= 2) {
                        const toRemove = singles.slice(0, 2);
                        const extraCost = comboSuperMed.price - (currentPrice + toRemove.reduce((sum, i) => sum + i.price, 0));
                        setUpsellConfig({ combo: comboSuperMed, extraCost: Math.max(0, extraCost), actionType: 'replace_cart_item', targetCartItemIds: toRemove.map(i => i.id) });
                        return;
                    }
                }
            }
        }

        // 3. Súper Combo Los Glotones (2 Medianas Am/Pep/Haw)
        if (size === 'mediana' && mode === 'whole' && ['americana', 'peperoni', 'hawaiana'].includes(flavorId)) {
            const comboGlotones = OTHER_PRODUCTS.combos.find(c => c.name.includes('Glotones'));
            if (comboGlotones) {
                // A: Qty=2
                if (quantity === 2) {
                    const basePrice = currentPrice * 2;
                    const extraCost = comboGlotones.price - basePrice;
                    setUpsellConfig({ combo: comboGlotones, extraCost: Math.max(0, extraCost), actionType: 'replace_current' });
                    return;
                }
                // B: Qty=1 + Cart(1)
                if (quantity === 1) {
                    const matchingCartItem = cartItems.find(item => item.quantity === 1 && item.type === 'pizza' && item.name.includes('Mediana') && checkFlavor(item, ['americana', 'peperoni', 'hawaiana']));
                    if (matchingCartItem) {
                        const basePrice = currentPrice + matchingCartItem.price;
                        const extraCost = comboGlotones.price - basePrice;
                        setUpsellConfig({ combo: comboGlotones, extraCost: Math.max(0, extraCost), actionType: 'replace_cart_item', targetCartItemIds: [matchingCartItem.id] });
                        return;
                    }
                }
            }
        }

        // 4. Dúo Italiano (1 Mediana Pep/Am/Haw + Lasagna)
        if (size === 'mediana' && mode === 'whole' && quantity === 1 && ['americana', 'peperoni', 'hawaiana'].includes(flavorId)) {
            const comboDuoIt = OTHER_PRODUCTS.combos.find(c => c.name === 'Dúo Italiano');
            if (comboDuoIt) {
                const lasagna = cartItems.find(item => item.quantity === 1 && item.name === 'Lasagna de Carne');
                if (lasagna) {
                    const extraCost = comboDuoIt.price - (currentPrice + lasagna.price);
                    setUpsellConfig({ combo: comboDuoIt, extraCost: Math.max(0, extraCost), actionType: 'replace_cart_item', targetCartItemIds: [lasagna.id] });
                    return;
                }
            }
        }

        // 5. Combo Para Dos (1 Mediana Am/Pep)
        if (size === 'mediana' && mode === 'whole' && quantity === 1 && ['americana', 'peperoni'].includes(flavorId)) {
            const comboParaDos = OTHER_PRODUCTS.combos.find(c => c.name === 'Combo Para Dos');
            if (comboParaDos) {
                const extraCost = comboParaDos.price - currentPrice;
                if (extraCost > 0) {
                    setUpsellConfig({ combo: comboParaDos, extraCost, actionType: 'replace_current' });
                    return;
                }
            }
        }

        // 6. Combo Extra Familiar (2 Familiares Am/Pep)
        const isExtraFamEligible = size === 'familiar' && mode === 'whole' && ['americana', 'peperoni'].includes(flavorId);
        if (isExtraFamEligible) {
            const comboExtraFam = OTHER_PRODUCTS.combos.find(c => c.name === 'Combo Extra Familiar');
            if (comboExtraFam) {
                if (quantity === 2) {
                    const extraCost = comboExtraFam.price - (currentPrice * 2);
                    setUpsellConfig({ combo: comboExtraFam, extraCost: Math.max(0, extraCost), actionType: 'replace_current' });
                    return;
                }
                if (quantity === 1) {
                    const matchingFam = cartItems.find(item => item.quantity === 1 && item.type === 'pizza' && item.name.includes('Familiar') && checkFlavor(item, ['americana', 'peperoni']));
                    if (matchingFam) {
                        const extraCost = comboExtraFam.price - (currentPrice + matchingFam.price);
                        setUpsellConfig({ combo: comboExtraFam, extraCost: Math.max(0, extraCost), actionType: 'replace_cart_item', targetCartItemIds: [matchingFam.id] });
                        return;
                    }
                }
            }
        }

        // 7. Combo Familiar (1 Familiar Am/Pep/Haw)
        if (size === 'familiar' && mode === 'whole' && quantity === 1 && ['americana', 'peperoni', 'hawaiana'].includes(flavorId)) {
            const comboFamiliar = OTHER_PRODUCTS.combos.find(c => c.name === 'Combo Familiar');
            if (comboFamiliar) {
                const extraCost = comboFamiliar.price - currentPrice;
                if (extraCost > 0) {
                    setUpsellConfig({ combo: comboFamiliar, extraCost, actionType: 'replace_current' });
                    return;
                }
            }
        }

        // 8. Combo Dúo Grande (2 Grandes Am/Pep/Haw)
        const isGrandeEligible = size === 'grande' && mode === 'whole' && ['americana', 'peperoni', 'hawaiana'].includes(flavorId);
        if (isGrandeEligible) {
            const comboDuoGrande = OTHER_PRODUCTS.combos.find(c => c.name === 'Combo Dúo Grande');
            if (comboDuoGrande) {
                if (quantity === 2) {
                    const extraCost = comboDuoGrande.price - (currentPrice * 2);
                    setUpsellConfig({ combo: comboDuoGrande, extraCost: Math.max(0, extraCost), actionType: 'replace_current' });
                    return;
                }
                if (quantity === 1) {
                    const matchingGrande = cartItems.find(item => item.quantity === 1 && item.type === 'pizza' && item.name.includes('Grande') && checkFlavor(item, ['americana', 'peperoni', 'hawaiana']));
                    if (matchingGrande) {
                        const extraCost = comboDuoGrande.price - (currentPrice + matchingGrande.price);
                        setUpsellConfig({ combo: comboDuoGrande, extraCost: Math.max(0, extraCost), actionType: 'replace_cart_item', targetCartItemIds: [matchingGrande.id] });
                        return;
                    }
                }
            }
        }

        // 9. Combo Pizza Gigante (1 Gigante Americana)
        if (size === 'gigante' && mode === 'whole' && quantity === 1 && flavorId === 'americana') {
            const comboGigante = OTHER_PRODUCTS.combos.find(c => c.name === 'Combo Pizza Gigante');
            if (comboGigante) {
                const extraCost = comboGigante.price - currentPrice;
                if (extraCost > 0) {
                    setUpsellConfig({ combo: comboGigante, extraCost, actionType: 'replace_current' });
                    return;
                }
            }
        }

        // --- END UPSELL LOGIC ---

        addItem(candidateItem);
        toggleCart();
        setQuantity(1);
    };

    const handleContinueWithoutUpsell = () => {
        // Just add the current item (ignoring the combo)
        // Need to reconstruct item or store it? 
        // Reconstruct implies reading state again. State hasn't changed.
        const selectedFlavorsStr = slots.map(s => PIZZAS.find(p => p.id === (selections[s] || 'americana'))?.name).join(', ');
        const details = `${mode === 'whole' ? '' : mode === 'half' ? 'Mitad y Mitad: ' : '4 Sabores: '} ${selectedFlavorsStr}`;

        addItem({
            name: `Pizza ${size.charAt(0).toUpperCase() + size.slice(1)}`,
            type: 'pizza',
            price: currentPrice,
            quantity: quantity,
            details: details
        });

        setUpsellConfig(null);
        toggleCart();
        setQuantity(1);
    };

    return (
        <section id="pizzas" className="py-20 bg-white px-4 min-h-screen relative">

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left: Controls & Visuals */}
                {/* Left: Controls & Visuals */}
                <div className="lg:col-span-7 space-y-10">
                    <div className="text-center lg:text-left relative">
                        <div className="relative inline-block">
                            <h2 className="text-5xl font-display text-morrison-maroon mb-2">Arma tu Pizza</h2>
                        </div>
                        <p className="text-xl text-gray-500">Elige tamaño, masa y tus ingredientes favoritos.</p>
                    </div>

                    {/* Size Selector */}
                    {/* Size Selector */}
                    <div className="bg-gray-100 p-1.5 rounded-full flex justify-between w-full relative isolate shadow-inner items-stretch h-14 md:h-16">
                        {SIZES.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setSize(s.id)}
                                className={cn(
                                    "flex-1 relative z-10 transition-colors duration-300 flex flex-col items-center justify-center rounded-full leading-none",
                                    size === s.id ? "text-morrison-maroon" : "text-gray-400 hover:text-morrison-maroon/70"
                                )}
                            >
                                {size === s.id && (
                                    <motion.div
                                        layoutId="activeSize"
                                        className="absolute inset-0 bg-morrison-yellow rounded-full -z-10 shadow-lg"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className={cn("text-base md:text-lg text-morrison-maroon", size === s.id ? "font-display" : "font-heading opacity-80")}>
                                    {s.label.split('(')[0].trim()}
                                </span>
                                <span className={cn("text-xs md:text-sm font-sans font-medium", size === s.id ? "text-morrison-maroon opacity-100" : "text-morrison-maroon/70")}>{s.label.match(/\((.*?)\)/)?.[0]}</span>
                            </button>
                        ))}
                    </div>

                    {/* Mode Selector */}
                    <div className="flex gap-4 justify-center w-full px-4 overflow-x-auto pb-4">
                        {[
                            { id: 'whole', label: 'Un Sabor' },
                            { id: 'half', label: 'Mitad y Mitad' },
                            { id: 'quarter', label: '4 Sabores' }
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => {
                                    const newMode = m.id as 'whole' | 'half' | 'quarter';
                                    setMode(newMode);
                                    // Reset selections completely when changing mode
                                    setSelections({});
                                    setActiveSlot(0);
                                }}
                                className={cn(
                                    "px-6 py-3 rounded-full font-bold transition-all relative isolate text-sm md:text-base whitespace-nowrap",
                                    mode === m.id ? "text-morrison-maroon shadow-lg" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                                )}
                            >
                                {mode === m.id && (
                                    <motion.div
                                        layoutId="activeMode"
                                        className="absolute inset-0 bg-morrison-yellow rounded-full -z-10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Pizza Visual */}
                    <div className="aspect-square max-w-md mx-auto relative bg-[#F9F5E8] rounded-full border-8 border-[#E6D5B8] shadow-inner p-4 overflow-hidden">
                        <div className="w-full h-full relative rounded-full overflow-hidden isolate">
                            {/* Base Background mainly for empty slots */}
                            <div className="absolute inset-0 bg-[#E6D5B8]/30 z-0"></div>

                            {slots.map((slot, idx) => {
                                // Determine Clip Path based on Mode and Slot Index
                                let clipPath = 'none';
                                if (mode === 'half') {
                                    clipPath = idx === 0 ? 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' : 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)';
                                } else if (mode === 'quarter') {
                                    // 0: TL, 1: TR, 2: BL, 3: BR
                                    if (idx === 0) clipPath = 'polygon(0 0, 50% 0, 50% 50%, 0 50%)';
                                    if (idx === 1) clipPath = 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)';
                                    if (idx === 2) clipPath = 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)';
                                    if (idx === 3) clipPath = 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)';
                                }

                                const flavorId = selections[slot];
                                const pizzaData = PIZZAS.find(p => p.id === flavorId);

                                return (
                                    <motion.div
                                        key={slot}
                                        className="absolute inset-0 z-10 cursor-pointer lg:cursor-default" // Clickable on mobile
                                        style={{ clipPath }}
                                        animate={{ opacity: 1 }}
                                        initial={{ opacity: 0 }}
                                        onClick={() => {
                                            setActiveSlot(slot);
                                            setIsMobileModalOpen(true);
                                        }}
                                    >
                                        {/* Render Image if selected */}
                                        {pizzaData?.image ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={pizzaData.image}
                                                    alt={pizzaData.name}
                                                    fill
                                                    className="object-cover scale-105" // slightly scale up to ensure edges meet
                                                />
                                                {/* Text Label Overlay */}
                                                <div className={cn(
                                                    "absolute flex items-center justify-center p-2 z-20",
                                                    // Position text based on slot
                                                    mode === 'whole' ? "inset-0" :
                                                        mode === 'half' ? (idx === 0 ? "inset-y-0 left-0 w-1/2" : "inset-y-0 right-0 w-1/2") :
                                                            // Quarter
                                                            (idx === 0 ? "top-0 left-0 w-1/2 h-1/2" : idx === 1 ? "top-0 right-0 w-1/2 h-1/2" : idx === 2 ? "bottom-0 left-0 w-1/2 h-1/2" : "bottom-0 right-0 w-1/2 h-1/2")
                                                )}>
                                                    <span className="font-display text-morrison-maroon text-xs md:text-sm lg:text-base font-bold bg-white/60 backdrop-blur-md px-3 py-1 rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(255,255,255,0.5)] border border-white/20">
                                                        {pizzaData.name}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            // Empty Slot Placeholder
                                            <div className={cn(
                                                "w-full h-full flex items-center justify-center bg-white/40",
                                                activeSlot === slot ? "bg-morrison-yellow/20" : ""
                                            )}>
                                                <div className={cn(
                                                    "absolute flex items-center justify-center",
                                                    mode === 'whole' ? "inset-0" :
                                                        mode === 'half' ? (idx === 0 ? "inset-y-0 left-0 w-1/2" : "inset-y-0 right-0 w-1/2") :
                                                            (idx === 0 ? "top-0 left-0 w-1/2 h-1/2" : idx === 1 ? "top-0 right-0 w-1/2 h-1/2" : idx === 2 ? "bottom-0 left-0 w-1/2 h-1/2" : "bottom-0 right-0 w-1/2 h-1/2")
                                                )}>
                                                    <span className="font-heading text-morrison-maroon/40 text-xl md:text-2xl uppercase tracking-widest border-2 border-dashed border-morrison-maroon/20 px-4 py-2 rounded-lg">
                                                        Elegir
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>


                    <div className="bg-morrison-green text-white p-4 lg:p-6 rounded-2xl flex items-center justify-between lg:justify-center gap-4 lg:gap-14 shadow-xl ring-4 ring-morrison-green/20">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                            <div className="flex flex-col">
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="p-1 hover:bg-white/10 rounded-md transition-colors text-white"
                                >
                                    <ChevronUp size={16} />
                                </button>
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="p-1 hover:bg-white/10 rounded-md transition-colors text-white"
                                >
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                            <span className="text-2xl font-display font-bold px-2 min-w-[3rem] text-center">x{quantity}</span>
                        </div>

                        <div className="pb-1 text-center md:text-left">
                            <span className="block text-[10px] md:text-sm opacity-90 uppercase tracking-widest font-bold mb-1">Total Estimado</span>
                            <span className="text-4xl lg:text-5xl font-display text-white whitespace-nowrap leading-none">S/ {(currentPrice * quantity).toFixed(2)}</span>
                        </div>
                        <button
                            onClick={addToCart}
                            className="bg-morrison-red hover:bg-red-700 text-white w-14 h-14 lg:w-auto lg:h-auto lg:px-8 lg:py-3 rounded-xl font-bold flex items-center justify-center transition-transform hover:scale-105 shadow-md mb-1"
                            aria-label="Agregar al carrito"
                        >
                            <ShoppingCart className="w-6 h-6 lg:w-5 lg:h-5 lg:mr-2" />
                            <span className="hidden lg:inline">Agregar</span>
                        </button>
                    </div>

                </div>

                {/* Right: Flavor Grid (Desktop) */}
                <div className="hidden lg:col-span-5 relative lg:block">
                    <div className="sticky top-10 flex flex-col h-[80vh]">
                        <h3 className="text-2xl font-heading mb-4">Elige tus Sabores {mode !== 'whole' && <span className="text-sm font-sans text-morrison-red bg-red-100 px-2 py-1 rounded ml-2">Seleccionando parte {activeSlot + 1}/{slots.length}</span>}</h3>

                        <div className="bg-white rounded-3xl shadow-xl overflow-y-auto px-4 py-4 flex-1 space-y-6 border border-gray-100 custom-scrollbar">

                            {/* Clásicas */}
                            <div>
                                <h4 className="font-heading text-lg text-morrison-maroon uppercase tracking-wider mb-2 border-b border-morrison-red/10 pb-1">Clásicas</h4>
                                <div className="space-y-3">
                                    {PIZZAS.filter(p => ['americana', 'peperoni', 'hawaiana'].includes(p.id)).map((pizza) => (
                                        <PizzaItem
                                            key={pizza.id}
                                            pizza={pizza}
                                            slots={slots}
                                            selections={selections}
                                            activeSlot={activeSlot}
                                            setActiveSlot={setActiveSlot}
                                            setSelections={setSelections}
                                            handleFlavorSelect={handleFlavorSelect}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Especiales */}
                            <div>
                                <h4 className="font-heading text-lg text-morrison-maroon uppercase tracking-wider mb-2 border-b border-morrison-red/10 pb-1">Especiales</h4>
                                <div className="space-y-3">
                                    {PIZZAS.filter(p => ['hawaiana-chicken', 'hawaiana-tropical', 'vegetariana', 'espanola', 'alemana', 'che-argentina'].includes(p.id)).map((pizza) => (
                                        <PizzaItem
                                            key={pizza.id}
                                            pizza={pizza}
                                            slots={slots}
                                            selections={selections}
                                            activeSlot={activeSlot}
                                            setActiveSlot={setActiveSlot}
                                            setSelections={setSelections}
                                            handleFlavorSelect={handleFlavorSelect}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Premium */}
                            <div>
                                <h4 className="font-heading text-lg text-morrison-maroon uppercase tracking-wider mb-2 border-b border-morrison-red/10 pb-1">De la Casa</h4>
                                <div className="space-y-3">
                                    {PIZZAS.filter(p => ['la-parrillera', 'carnivora', 'suprema', 'grito-de-lobo', 'brava'].includes(p.id)).map((pizza) => (
                                        <PizzaItem
                                            key={pizza.id}
                                            pizza={pizza}
                                            slots={slots}
                                            selections={selections}
                                            activeSlot={activeSlot}
                                            setActiveSlot={setActiveSlot}
                                            setSelections={setSelections}
                                            handleFlavorSelect={handleFlavorSelect}
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Slot Indicator */}
                        {mode !== 'whole' && (
                            <div className="mt-4 flex gap-2 justify-center">
                                {slots.map(i => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveSlot(i)}
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all",
                                            activeSlot === i
                                                ? "border-morrison-green bg-morrison-green text-white"
                                                : selections[i]
                                                    ? "border-morrison-maroon bg-morrison-maroon/10 text-morrison-maroon"
                                                    : "border-gray-300 text-gray-400 bg-white"
                                        )}
                                    >
                                        {selections[i] ? '✓' : i + 1}
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Mobile Flavor Selection Modal */}
            <AnimatePresence>
                {isMobileModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
                            onClick={() => setIsMobileModalOpen(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
                            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-[60] lg:hidden rounded-t-[2rem] flex flex-col overflow-hidden shadow-2xl ring-1 ring-black/5"
                        >
                            <div className="p-6 pb-2 relative">
                                {/* Clear All Button */}
                                <button
                                    onClick={() => {
                                        setSelections({});
                                        setActiveSlot(0);
                                    }}
                                    className="absolute top-6 left-6 p-2.5 bg-red-50 text-morrison-red rounded-full hover:bg-red-100 transition-colors border border-red-100 shadow-sm"
                                    aria-label="Limpiar todo"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                {/* Close Button */}
                                <button
                                    onClick={() => setIsMobileModalOpen(false)}
                                    className="absolute top-6 right-6 p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm"
                                    aria-label="Cerrar"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Handle */}
                                <div className="w-16 h-1.5 bg-morrison-green rounded-full mx-auto mb-6 opacity-80" />

                                <h3 className="text-3xl font-display text-morrison-maroon text-center px-8">
                                    Sabor para {mode === 'whole' ? 'toda la pizza' : `Parte ${activeSlot + 1}`}
                                </h3>
                                <p className="text-center text-gray-400 text-sm mt-1">
                                    Selecciona un sabor para esta sección
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 pb-20 pt-2 space-y-6 custom-scrollbar">
                                {/* Helper to render flavor sections - duplicated for clarity in this view */}
                                {['Clásicas', 'Especiales', 'De la Casa'].map((category) => (
                                    <div key={category}>
                                        <h4 className="font-heading text-lg text-morrison-maroon uppercase tracking-wider mb-3 border-b border-morrison-red/10 pb-1 sticky top-0 bg-white z-10 py-2">
                                            {category}
                                        </h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            {PIZZAS.filter(p => {
                                                if (category === 'Clásicas') return ['americana', 'peperoni', 'hawaiana'].includes(p.id);
                                                if (category === 'Especiales') return ['hawaiana-chicken', 'hawaiana-tropical', 'vegetariana', 'espanola', 'alemana', 'che-argentina'].includes(p.id);
                                                return ['la-parrillera', 'carnivora', 'suprema', 'grito-de-lobo', 'brava'].includes(p.id);
                                            }).map((pizza) => (
                                                <PizzaItem
                                                    key={pizza.id}
                                                    pizza={pizza}
                                                    slots={slots}
                                                    selections={selections}
                                                    activeSlot={activeSlot}
                                                    setActiveSlot={setActiveSlot}
                                                    setSelections={(newSel: any) => {
                                                        setSelections(newSel);
                                                        // Only close on mobile if adding (stay if removing?) - user simple wants interactive. Close after select is usually expected.
                                                        // If slot filled -> close? Let's check logic:
                                                        // PizzaItem logic: toggles (removes) OR adds.
                                                        // If we add (selecting for empty slot), we should close.
                                                        // We can wrap handleFlavorSelect to close.
                                                    }}
                                                    handleFlavorSelect={(id: string, slot: number) => {
                                                        handleFlavorSelect(id, slot);
                                                        // Close modal after selection
                                                        if (activeSlot < slots.length - 1) {
                                                            // If auto-advance, keep open? User said "select flavor for missing part".
                                                            // Maybe better UX: Auto advance active slot, keep modal open? 
                                                            // BUT, visually shifting slots in modal is weird.
                                                            // Let's close it to let them see the result, then they tap next.
                                                            // Or just close.
                                                            setIsMobileModalOpen(false);
                                                        } else {
                                                            setIsMobileModalOpen(false);
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Upsell Modal */}
            <AnimatePresence>
                {upsellConfig && (
                    <UpsellModal
                        isOpen={!!upsellConfig}
                        onClose={handleContinueWithoutUpsell}
                        onAccept={handleUpsellAccept}
                        comboName={upsellConfig.combo.name}
                        comboImage={upsellConfig.combo.image}
                        comboContent={upsellConfig.combo.content}
                        extraCost={upsellConfig.extraCost}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

function PizzaItem({ pizza, slots, selections, activeSlot, setActiveSlot, setSelections, handleFlavorSelect }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
                const existingSlot = slots.find((s: number) => selections[s] === pizza.id);
                if (existingSlot !== undefined) {
                    const newSelections = { ...selections };
                    delete newSelections[existingSlot];
                    setSelections(newSelections);
                    setActiveSlot(existingSlot);
                    return;
                }
                handleFlavorSelect(pizza.id, activeSlot);
                const nextEmpty = slots.find((s: number) => s > activeSlot && !selections[s]);
                if (nextEmpty !== undefined) {
                    setActiveSlot(nextEmpty);
                } else if (activeSlot < slots.length - 1) {
                    setActiveSlot(activeSlot + 1);
                }
            }}
            className={cn(
                "cursor-pointer p-3 rounded-xl border-2 transition-all flex justify-between items-start group relative isolate overflow-hidden",
                slots.some((s: number) => selections[s] === pizza.id)
                    ? "border-morrison-green bg-green-50 ring-2 ring-morrison-green"
                    : "border-gray-100 hover:border-gray-300"
            )}
        >
            <div>
                <h4 className="font-display text-lg leading-tight text-morrison-maroon">{pizza.name}</h4>
                <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2 mt-1 leading-snug max-w-[180px]">{pizza.ingredients}</p>
            </div>
            {slots.some((s: number) => selections[s] === pizza.id) && <Check className="text-morrison-green w-5 h-5 flex-shrink-0" />}

            <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 text-morrison-maroon text-[10px] font-bold uppercase transition-opacity">
                {slots.some((s: number) => selections[s] === pizza.id) ? 'Quitar' : 'Elegir'}
            </div>
        </motion.div>
    );
}
