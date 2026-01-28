'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';

const slides = [
    {
        desktop: '/images/sliders/slider1horizontal.webp',
        mobile: '/images/sliders/slider1vertical.webp',
        subtitle: 'Tu Verano • Sabor Brutal',
        button: 'PIDE TU COMBO',
        link: '#combos'
    },
    {
        desktop: '/images/sliders/slider2horizontal.webp',
        mobile: '/images/sliders/slider2vertical.webp',
        subtitle: 'No podrás probar solo una',
        button: 'ARMA TU PIZZA',
        link: '#pizzas'
    },
    {
        desktop: '/images/sliders/slider3horizontal.webp',
        mobile: '/images/sliders/slider3vertical.webp',
        subtitle: 'Disfruta la mejor lasagna y salchialitas',
        button: 'PIDE AHORA',
        link: '#pastas'
    },
];

export default function Hero() {
    const ref = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000); // 8 seconds interval
        return () => clearInterval(timer);
    }, []);

    const slideContent = slides[currentSlide];

    return (
        <section ref={ref} className="relative h-screen w-full overflow-hidden bg-morrison-maroon flex items-center justify-center">
            {/* Background Image Slider with Parallax */}
            <div className="absolute inset-0 z-0">
                <motion.div style={{ y: yImage }} className="relative w-full h-full">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentSlide}
                            className="absolute inset-0 w-full h-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2.5 }} // Slower crossfade
                        >
                            {/* Cinematic Zoom Effect */}
                            <motion.div
                                className="w-full h-full relative"
                                initial={{ scale: 1 }}
                                animate={{ scale: 1.15 }}
                                transition={{ duration: 10, ease: "linear" }}
                            >
                                {/* Desktop Linear */}
                                <div className="hidden md:block w-full h-full relative">
                                    <Image
                                        src={slideContent.desktop}
                                        alt="Morrison Pizza Hero"
                                        fill
                                        sizes="100vw"
                                        className="object-cover opacity-60"
                                        priority
                                    />
                                </div>
                                {/* Mobile Vertical */}
                                <div className="block md:hidden w-full h-full relative">
                                    <Image
                                        src={slideContent.mobile}
                                        alt="Morrison Pizza Hero"
                                        fill
                                        sizes="100vw"
                                        className="object-cover opacity-60"
                                        priority
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-morrison-gray via-transparent to-black/60 z-10"></div>
                </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                {/* Static Title */}
                <motion.h1
                    className="text-7xl md:text-[10rem] leading-none font-display text-white mb-6 tracking-tighter drop-shadow-2xl"
                    style={{ y: yText }}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    MORRISON <br /> <span className="text-morrison-red inline-block transform -rotate-2 origin-bottom-left">PIZZA</span>
                </motion.h1>

                {/* Dynamic Subtitle & Button */}
                <div className="min-h-[160px] flex flex-col items-center justify-between gap-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`content-${currentSlide}`}
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center gap-8"
                        >
                            <p className="text-2xl md:text-4xl text-morrison-yellow font-display tracking-widest uppercase drop-shadow-md text-balance">
                                {slideContent.subtitle}
                            </p>

                            <Link href={slideContent.link}>
                                <motion.div
                                    className="bg-morrison-green text-white font-display text-2xl md:text-3xl px-10 py-4 rounded-full shadow-[0_0_30px_rgba(17,140,48,0.6)] border-2 border-transparent hover:border-white transition-all transform cursor-pointer inline-block"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{ boxShadow: ["0 0 0px rgba(17,140,48,0)", "0 0 20px rgba(17,140,48,0.6)", "0 0 0px rgba(17,140,48,0)"] }}
                                    transition={{
                                        boxShadow: {
                                            repeat: Infinity,
                                            duration: 2
                                        }
                                    }}
                                >
                                    {slideContent.button}
                                </motion.div>
                            </Link>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
