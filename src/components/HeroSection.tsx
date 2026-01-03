import { useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-driving-lesson.jpg";
import WhatsAppConfirmDialog from "./WhatsAppConfirmDialog";

const PHONE_NUMBER = "6285100450236";

const HeroSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleScrollToPricing = () => {
    const element = document.querySelector("#paket");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section
        id="beranda"
        className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-background to-background" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
                🚗 Terpercaya sejak 2015
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Kursus Mengemudi{" "}
                <span className="text-primary">Terbaik</span> di Bantul &
                Sekitarnya
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Belajar mobil dengan instruktur sabar sampai mahir. Bisa
                antar-jemput ke rumah Anda.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={handleScrollToPricing}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 text-base px-8"
                >
                  Lihat Paket Harga
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setDialogOpen(true)}
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold gap-2 text-base px-8"
                >
                  <MessageCircle className="w-5 h-5" />
                  Tanya Jadwal
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Siswa Lulus</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">8+</p>
                  <p className="text-sm text-muted-foreground">Tahun Pengalaman</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">⭐ 4.9</p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Main Image Container */}
                <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-elevated border border-border">
                  <img
                    src={heroImage}
                    alt="Instruktur mengajar mengemudi"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-elevated border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Sampai Mahir</p>
                      <p className="text-sm text-muted-foreground">Garansi Bisa</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WhatsAppConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        phoneNumber={PHONE_NUMBER}
        message="Halo, saya ingin tanya jadwal kursus"
      />
    </>
  );
};

export default HeroSection;
