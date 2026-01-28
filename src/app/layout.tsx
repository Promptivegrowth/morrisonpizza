import type { Metadata } from "next";
import { Inter, Bebas_Neue, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const playfair = Playfair_Display({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "Morrison Pizza | Las Mejores Pizzas de Lima",
  description: "Pizzas artesanales, pastas y combos irresistibles. ¡Pide online!",
};

import WhatsAppFloat from "@/components/layout/whatsapp-float";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={cn(
        inter.variable,
        bebas.variable,
        playfair.variable,
        "min-h-screen bg-morrison-gray font-sans antialiased text-morrison-maroon overflow-x-hidden"
      )}>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
