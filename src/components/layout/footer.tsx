import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-morrison-maroon text-white py-12 px-4 relative z-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <div className="relative w-24 h-24 mb-2">
                        <Image
                            src="/images/logo-morri.png"
                            alt="Morrison Pizza Logo"
                            fill
                            sizes="96px"
                            className="object-contain"
                        />
                    </div>
                    <h3 className="font-display text-4xl mb-4 text-morrison-yellow">Morrison Pizza</h3>
                    <p className="text-white/60 max-w-xs">El auténtico sabor artesanal que compartes con los que más quieres. Pasión en cada masa.</p>
                </div>

                {/* Navigation Menu */}
                <div className="flex flex-col gap-3 font-display tracking-widest uppercase text-lg">
                    <h4 className="text-morrison-yellow text-xl mb-2 opacity-50 md:opacity-100">Menú</h4>
                    {['Pizzas', 'Combos', 'Pastas', 'Salchipapas'].map((item) => (
                        <Link
                            key={item}
                            href={`/#${item.toLowerCase()}`}
                            className="hover:text-morrison-yellow transition-colors hover:translate-x-1 duration-300 transform"
                        >
                            {item}
                        </Link>
                    ))}
                    <Link
                        href="/sobre-nosotros"
                        className="hover:text-morrison-yellow transition-colors hover:translate-x-1 duration-300 transform"
                    >
                        Nosotros
                    </Link>
                </div>

                <div className="space-y-6">
                    <div>
                        <h4 className="font-heading text-2xl text-morrison-yellow mb-2 flex items-center justify-center md:justify-start gap-2">
                            <MapPin size={24} /> Ubícanos
                        </h4>
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Av.+San+Diego+de+Alcalá+1089+-+SMP,+San+Martín+de+Porres,+Peru"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl hover:text-morrison-yellow transition-colors group block"
                        >
                            <p className="group-hover:underline decoration-morrison-yellow underline-offset-4">Av. San Diego de Alcalá 1089 - SMP</p>
                            <p className="text-sm opacity-60 mt-1">San Martín de Porres, Perú</p>
                        </a>
                    </div>
                    <div>
                        <h4 className="font-heading text-2xl text-morrison-yellow mb-2 flex items-center justify-center md:justify-start gap-2">
                            <MessageCircle size={24} /> Delivery
                        </h4>
                        <a
                            href="https://wa.me/51966650474?text=Hola%20Morrison%20Pizza,%20quisiera%20hacer%20un%20pedido%20🍕"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl font-bold hover:text-green-400 transition-colors flex items-center justify-center md:justify-start gap-2"
                        >
                            <span>+51 966 650 474</span>
                            <span className="bg-green-500 text-morrison-maroon text-xs px-2 py-0.5 rounded-full font-bold uppercase">WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="text-center mt-16 pt-8 border-t border-white/10 text-xs text-white/30 uppercase tracking-widest flex flex-col md:flex-row justify-center gap-1 items-center">
                <span>© {new Date().getFullYear()} Morrison Pizza.</span>
                <span>
                    Diseñado por <a href="https://promptiveagency.com/" target="_blank" rel="noopener noreferrer" className="text-morrison-yellow hover:text-white transition-colors font-bold ml-1">Promptive Agency</a>
                </span>
            </div>
        </footer>
    )
}
