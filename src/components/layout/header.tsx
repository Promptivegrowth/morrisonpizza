'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import MegaMenu from './mega-menu';

export default function Header() {
    const { toggleCart, items } = useCartStore();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    return (
        <header
            onMouseLeave={() => setActiveCategory(null)}
            className={cn(
                "fixed top-0 w-full z-50 transition-[padding,background-color,border-color,box-shadow] duration-500 ease-in-out border-b border-transparent",
                isScrolled
                    ? "bg-morrison-green/95 backdrop-blur-md shadow-lg border-white/10 py-2 sm:py-3"
                    : "bg-transparent py-4 sm:py-6"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center bg-transparent relative z-50">
                <Link href="/" className="flex items-center gap-2 group">
                    <div
                        className={cn(
                            "relative transition-all duration-500 ease-in-out cursor-pointer drop-shadow-md",
                            isScrolled ? "w-20 h-20 md:w-24 md:h-24 scale-105" : "w-16 h-16 md:w-20 md:h-20"
                        )}
                    >
                        <Image
                            src="/images/logo-morri.png"
                            alt="Morrison Pizza Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <Menu className="w-8 h-8" />
                </button>

                <nav className="hidden md:flex gap-8 text-xl font-display tracking-widest uppercase text-white items-center">
                    {['Pizzas', 'Combos', 'Pastas', 'Salchipapas'].map((link) => (
                        <div
                            key={link}
                            onMouseEnter={() => setActiveCategory(link)}
                            className="relative py-4"
                        >
                            <Link
                                href={`/#${link.toLowerCase()}`}
                                className={cn(
                                    "transition-colors drop-shadow-sm hover:scale-105 transform duration-200 block",
                                    activeCategory === link ? "text-morrison-yellow" : "hover:text-morrison-yellow"
                                )}
                            >
                                {link}
                            </Link>
                            {activeCategory === link && (
                                <motion.div
                                    layoutId="navIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-morrison-yellow shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </div>
                    ))}
                    <Link
                        href="/sobre-nosotros"
                        onMouseEnter={() => setActiveCategory(null)}
                        className="hover:text-morrison-yellow transition-colors drop-shadow-sm hover:scale-105 transform duration-200"
                    >
                        Nosotros
                    </Link>
                </nav>

                <button
                    onClick={toggleCart}
                    className="relative p-2 hover:bg-white/10 rounded-full transition-colors group"
                >
                    <ShoppingCart className={cn("transition-all duration-300", isScrolled ? "w-7 h-7" : "w-6 h-6")} />
                    {items.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-morrison-red text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                            {items.length}
                        </span>
                    )}
                </button>
            </div>

            <MegaMenu activeCategory={activeCategory} onClose={() => setActiveCategory(null)} />

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 w-screen h-screen z-[100] bg-morrison-green md:hidden flex flex-col items-center justify-center space-y-8 overflow-hidden"
                    >
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <Menu className="w-10 h-10 rotate-90" />
                        </button>

                        <div className="relative w-32 h-32 mb-8">
                            <Image src="/images/logo-morri.png" alt="Morrison Logo" fill className="object-contain" />
                        </div>

                        {['Pizzas', 'Combos', 'Pastas', 'Salchipapas'].map((link) => (
                            <Link
                                key={link}
                                href={`/#${link.toLowerCase()}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-display text-white hover:text-morrison-yellow tracking-widest uppercase transition-all duration-200 hover:scale-110 active:scale-95 active:text-morrison-yellow"
                            >
                                {link}
                            </Link>
                        ))}
                        <Link
                            href="/sobre-nosotros"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-2xl font-display text-white hover:text-morrison-yellow tracking-widest uppercase transition-all duration-200 hover:scale-110 active:scale-95 active:text-morrison-yellow"
                        >
                            Nosotros
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
