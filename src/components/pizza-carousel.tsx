'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function PizzaCarousel() {
    const images = [
        { src: '/images/pizzas carrusel/alemana.webp', alt: 'La Alemana' },
        { src: '/images/pizzas carrusel/carnivora.webp', alt: 'La Carnívora' },
        { src: '/images/pizzas carrusel/che argentina.webp', alt: 'Che Argentina' },
        { src: '/images/pizzas carrusel/hawaina.webp', alt: 'Hawaiana' },
        { src: '/images/pizzas carrusel/tropical.webp', alt: 'Tropical' },
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-play
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Consistent with PlatosCarousel
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
        <section className="w-full py-16 overflow-hidden bg-white">
            <div className="mb-2 text-center max-w-7xl mx-auto px-4">
                <h3 className="text-4xl lg:text-5xl font-display text-morrison-maroon mb-2">No podrás probar solo una...</h3>
                <p className="text-gray-500 font-medium text-lg">La perfección hecha pizza</p>
            </div>

            <div className="relative w-full h-[450px] md:h-[600px] flex items-center justify-center overflow-hidden">
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
                                    // Modified aspect ratio to square for pizzas
                                    isCenter ? "w-[360px] md:w-[500px] aspect-square ring-4 ring-morrison-gold/50" : "hidden md:block w-[320px] aspect-square grayscale-[30%] hover:grayscale-0"
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
        </section>
    );
}
