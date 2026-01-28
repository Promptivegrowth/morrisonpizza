'use client';

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white selection:bg-morrison-gold selection:text-white">
            <Header />

            {/* Hero Section - Redesigned for Elegance */}
            <section className="relative h-[60vh] flex items-center justify-center bg-[#400101] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="block text-morrison-yellow tracking-[0.3em] text-sm md:text-base font-bold uppercase mb-4 shadow-black drop-shadow-sm">Desde siempre</span>
                        <h1 className="text-6xl md:text-8xl font-display text-white mb-6 drop-shadow-xl">
                            Nuestra Historia
                        </h1>
                        <div className="w-24 h-1 bg-morrison-yellow mx-auto mb-8 shadow-sm"></div>
                        <p className="text-xl md:text-2xl text-gray-100 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                            Más que una pizzería, somos una familia que creció con el sueño de servir lo mejor.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Narrative Section - Modern Editorial Layout */}
            <section className="py-24 px-4 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-morrison-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-12 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-4 md:text-right relative z-10"
                        >
                            <h2 className="text-5xl md:text-6xl font-display text-morrison-maroon leading-tight">
                                Nuestros <br />
                                <span className="text-morrison-gold">Inicios</span>
                            </h2>
                            <div className="hidden md:block w-full h-px bg-morrison-maroon/20 mt-6"></div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="md:col-span-8 space-y-6 text-lg text-gray-600 font-light leading-relaxed relative pl-8"
                        >
                            <div className="text-7xl text-morrison-gold opacity-50 font-serif font-bold leading-none mb-2">“</div>
                            <p>
                                Morrison Pizza nació del amor por la buena comida y el deseo de crear un lugar donde los amigos y las familias pudieran reunirse.
                                Comenzamos con un pequeño horno y una gran pasión: <strong className="text-morrison-maroon font-medium">perfeccionar la masa, encontrar los ingredientes más frescos</strong> y
                                escuchar a nuestros clientes.
                            </p>
                            <p>
                                Con el tiempo, gracias a su preferencia, hemos crecido, pero nuestra esencia sigue intacta.
                                Mantenemos ese compromiso inquebrantable con la calidad y esa atención cálida y amigable que nos caracteriza.
                                Cada pizza que sale de nuestro horno lleva consigo la dedicación de un equipo que se esfuerza día a día por superar expectativas.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Wall of Memories - Refined Gallery */}
            <section className="py-24 bg-stone-50 overflow-hidden relative border-y border-stone-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-display text-gray-900 mt-2">Momentos Inolvidables</h2>
                        </div>
                        <p className="text-gray-500 font-medium pb-2 border-b-2 border-morrison-gold">El camino recorrido</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative px-4 md:px-0">
                        {/* Photo Frames with cleaner style */}
                        <PhotoFrame src="/images/sobrenosotros/1.webp" rotate="-2deg" delay={0.1} caption="El equipo fundador" />
                        <PhotoFrame src="/images/sobrenosotros/2.webp" rotate="3deg" delay={0.2} caption="Crecimiento constante" />
                        <PhotoFrame src="/images/sobrenosotros/3.webp" rotate="-1deg" delay={0.3} caption="Celebrando juntos" />
                        <PhotoFrame src="/images/sobrenosotros/4.webp" rotate="2deg" delay={0.4} caption="Nuestra Pasión" isFeatured />
                    </div>
                </div>
            </section>

            {/* Mission & Vision - Premium Cards */}
            <section className="py-28 px-4 bg-white relative">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative bg-white border border-gray-100 p-10 md:p-14 rounded-[2rem] shadow-2xl overflow-hidden hover:border-morrison-maroon/30 transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-morrison-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-morrison-red/10 transition-colors"></div>

                            <div className="w-16 h-16 bg-morrison-red/10 rounded-2xl flex items-center justify-center mb-8 text-morrison-red group-hover:scale-110 transition-transform duration-500">
                                <span className="text-3xl">🚀</span>
                            </div>

                            <h3 className="text-3xl font-display text-gray-900 mb-6 group-hover:text-morrison-maroon transition-colors">Nuestra Misión</h3>
                            <p className="text-gray-600 text-lg leading-relaxed relative z-10">
                                Brindar una experiencia gastronómica auténtica y cálida, ofreciendo pizzas y platos de alta calidad que conecten corazones y creen momentos inolvidables en cada mesa peruana.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="group relative bg-white border border-gray-100 p-10 md:p-14 rounded-[2rem] shadow-2xl overflow-hidden hover:border-morrison-yellow/50 transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-morrison-yellow/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-morrison-yellow/20 transition-colors"></div>

                            <div className="w-16 h-16 bg-morrison-yellow/20 rounded-2xl flex items-center justify-center mb-8 text-morrison-yellow group-hover:scale-110 transition-transform duration-500">
                                <span className="text-3xl">👁️</span>
                            </div>

                            <h3 className="text-3xl font-display text-gray-900 mb-6 group-hover:text-morrison-maroon transition-colors">Nuestra Visión</h3>
                            <p className="text-gray-600 text-lg leading-relaxed relative z-10">
                                Consolidarnos como la pizzería referente en el Perú, reconocida no solo por el sabor de nuestra cocina, sino por nuestra formalidad, confianza y el trato familiar que nos distingue.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Client Trust Section */}
            <section className="py-24 bg-morrison-maroon text-white text-center">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-display mb-6"
                    >
                        ¡Ya muchos nos prefieren!
                    </motion.h2>
                    <p className="text-xl text-white/80 mb-12 font-light">Gracias por hacernos parte de sus mejores momentos</p>

                    {/* Bento Grid Gallery */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                        {[1, 2, 3, 4, 5].map((num, i) => (
                            <motion.div
                                key={num}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                // Create an interesting layout: First item large
                                className={`relative rounded-2xl overflow-hidden shadow-lg group ${num === 1 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
                            >
                                <Image
                                    src={`/images/nos prefieren/${num}.webp`}
                                    alt={`Cliente feliz ${num}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </motion.div>
                        ))}
                        {/* Filler div to balance grid if needed? 7 items. 
                 If 1 is 2x2 (4 cells), + 6 items = 10 cells.
                 Grid cols 4.
                 Row 1: [Large 1 (2cols)] [2] [3]
                 Row 2: [Large 1 (2cols)] [4] [5]
                 Row 3: [6] [7] ... empty space?
                 Let's make 5 also large or adjust.
                 Actually, just a responsive masonry or standard grid is fine. 
                 Let's keep it simple style:
                 1 (large), 2, 3
                 4, 5, 6, 7 (row of 4)
                 Total 7 images.
                 Let's try:
                 Row 1: [1 (2x2)] [2] [3]
                 Row 2: (1 continues) [4] [5]
                 Row 3: [6] [7]
                 Wait, if 1 is col-span-2 row-span-2.
                 Grid is 4 columns.
                 Cells:
                 [1][1][2][3]
                 [1][1][4][5]
                 [6][7][ ][ ] -> Gap.
                 Let's make 6 and 7 col-span-2?
                 [6 (2col)] [7 (2col)] -> Perfect.
             */}
                    </div>

                    {/* Corporate CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/10 backdrop-blur-md rounded-3xl p-10 md:p-14 max-w-4xl mx-auto border border-white/20"
                    >
                        <h3 className="text-3xl md:text-4xl font-display mb-4 text-morrison-yellow">¿Empresas y Eventos?</h3>
                        <p className="text-xl font-light mb-8 leading-relaxed">
                            Realizamos ventas corporativas y atendemos todo tipo de eventos. <br className="hidden md:block" />
                            Lleva la calidad y el sabor que ya conoces a tus reuniones importantes.
                        </p>
                        <a
                            href="https://wa.me/51966650474?text=Hola%20Morrison%20Pizza,%20me%20interesa%20cotizar%20un%20evento%20corporativo%20/%20servicio%20especial%20🍕"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-morrison-yellow text-morrison-maroon px-10 py-4 rounded-full font-bold text-xl hover:bg-white hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-2 mx-auto"
                        >
                            <span>Contáctanos aquí</span>
                            <span className="text-2xl">📲</span>
                        </a>
                    </motion.div>
                </div>
            </section>

            <div id="contacto">
                <Footer />
            </div>
        </main>
    );
}

function PhotoFrame({ src, rotate, delay, caption, isFeatured = false }: { src: string, rotate: string, delay: number, caption: string, isFeatured?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            whileInView={{ opacity: 1, scale: 1, rotate: rotate }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6, type: "spring" }}
            className={`bg-white p-4 shadow-[0_10px_20px_rgba(0,0,0,0.15)] flex flex-col transform hover:z-10 hover:scale-105 transition-all duration-300 ${isFeatured ? 'md:col-span-1 md:row-span-1 border-4 border-morrison-gold/20' : ''}`}
            style={{ rotate: rotate }} // Initial static rotation
        >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 mb-4 filter sepia-[0.15]">
                <Image src={src} alt={caption} fill className="object-cover" />
                <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
            </div>
            <div className={`text-center font-display text-morrison-maroon ${isFeatured ? 'text-xl' : 'text-lg'}`}>
                {caption}
            </div>
            {/* Tape effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 shadow-sm rotate-1 transform backdrop-blur-sm border border-white/60"></div>
        </motion.div>
    )
}
