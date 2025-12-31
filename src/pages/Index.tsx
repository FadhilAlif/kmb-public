import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyUsSection from "@/components/WhyUsSection";
import PricingSection from "@/components/PricingSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Kursus Mobil Bantul | Belajar Mengemudi Terbaik di Yogyakarta</title>
        <meta
          name="description"
          content="Kursus mengemudi terbaik di Bantul & Yogyakarta. Instruktur sabar, jadwal fleksibel, bisa pakai mobil sendiri. Garansi sampai mahir. Hubungi kami sekarang!"
        />
        <meta
          name="keywords"
          content="kursus mobil bantul, belajar mengemudi yogyakarta, les nyetir bantul, kursus SIM bantul"
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <WhyUsSection />
          <PricingSection />
          <AboutSection />
          <TestimonialsSection />
          <FAQSection />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </>
  );
};

export default Index;
