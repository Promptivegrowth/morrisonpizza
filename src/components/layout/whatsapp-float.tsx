'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function WhatsAppFloat() {
    const phoneNumber = "51966650474";
    const message = "Hola Morrison Pizza, quisiera hacer un pedido / consulta sobre delivery 🛵";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 1
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[99999] bg-[#25D366] text-white p-2 rounded-full shadow-lg flex items-center justify-center group decoration-none" // Reduced padding
            style={{ textDecoration: 'none' }}
            aria-label="Contactar por WhatsApp"
        >
            {/* Pulsing Effect */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping group-hover:animate-none"></span>

            {/* Icon & Text Container */}
            <div className="relative z-10 flex items-center gap-2">
                <Image
                    src="/images/whatsapp.png"
                    alt="WhatsApp"
                    width={45}  // Optimized size
                    height={45} // Optimized size
                    priority
                    className="object-contain"
                />
                <span className="font-bold hidden group-hover:block whitespace-nowrap overflow-hidden transition-all duration-300 max-w-0 group-hover:max-w-xs pl-0 text-white">
                    ¡Pide aquí!
                </span>
            </div>
        </motion.a>
    );
}
