import CartSidebar from "@/components/cart-sidebar";
import Hero from "@/components/hero";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MenuGrid from "@/components/menu-grid";
import PizzaBuilder from "@/components/pizza-builder";
import PizzaCarousel from "@/components/pizza-carousel";
import PromoSection from "@/components/promo-section";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-morrison-gray flex flex-col">
      <Header />
      <Hero />
      <PromoSection />
      <PizzaCarousel />
      <PizzaBuilder />
      <MenuGrid />
      <Footer />
      <CartSidebar />
    </main>
  );
}
