import { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { formatPrice } from "./booking/bookingData";
import { useGroupedPackages } from "@/hooks/usePackages";

const PricingSection = () => {
  const [useOwnCar, setUseOwnCar] = useState(false);
  const navigate = useNavigate();
  const { mobilKursus, mobilSendiri, isLoading, isError } =
    useGroupedPackages();

  const displayPackages = useOwnCar ? mobilSendiri : mobilKursus;

  const handlePackageClick = useCallback((pkgId: string) => {
    navigate(`/booking?packageId=${pkgId}`);
  }, [navigate]);

  return (
    <section id="paket" className="py-20 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            Pilihan Paket
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Paket Harga Terjangkau
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Pilih paket yang sesuai dengan kebutuhan Anda. Tersedia opsi pakai
            mobil sendiri untuk harga lebih hemat.
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex items-center gap-4 p-2 bg-secondary rounded-full">
            <span
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                !useOwnCar
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Mobil Kursus
            </span>
            <Switch
              checked={useOwnCar}
              onCheckedChange={setUseOwnCar}
              className="data-[state=checked]:bg-highlight"
            />
            <span
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                useOwnCar
                  ? "bg-highlight text-highlight-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Mobil Sendiri
              <span className="text-xs bg-highlight-foreground/20 px-2 py-0.5 rounded-full">
                Hemat!
              </span>
            </span>
          </div>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Memuat paket...</span>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-destructive font-medium">
              Gagal memuat data paket.
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Silakan refresh halaman atau coba lagi nanti.
            </p>
          </div>
        )}

        {/* Packages grid */}
        {!isLoading && !isError && (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {displayPackages.map((pkg, index) => {
              // Mark the middle package as popular if there are 3+
              const isPopular =
                displayPackages.length >= 3 &&
                index === Math.floor(displayPackages.length / 2);

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative rounded-2xl bg-card border p-6 lg:p-8 transition-all duration-300 ${
                    isPopular
                      ? "border-primary ring-2 ring-primary/20 shadow-elevated scale-[1.02]"
                      : "border-border hover:border-primary/30 hover:shadow-card-hover"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                        <Star className="w-4 h-4 fill-current" />
                        Paling Populer
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {pkg.car_type === "mobil_kursus"
                        ? "Menggunakan Mobil Kursus"
                        : "Menggunakan Mobil Sendiri"}
                    </p>
                    <div className="flex items-end justify-center gap-1">
                      <motion.span
                        key={pkg.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl lg:text-4xl font-bold text-foreground"
                      >
                        {formatPrice(pkg.price)}
                      </motion.span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pkg.total_sessions}x pertemuan
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {pkg.total_sessions}x Pertemuan @ 90 menit
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {pkg.car_type === "mobil_kursus"
                          ? "Mobil kursus disediakan"
                          : "Pakai mobil pribadi Anda"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {pkg.car_type === "mobil_kursus"
                          ? "BBM sudah termasuk"
                          : "BBM ditanggung siswa"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Instruktur berpengalaman
                      </span>
                    </li>
                    {pkg.total_sessions >= 10 && (
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Simulasi ujian SIM
                        </span>
                      </li>
                    )}
                  </ul>

                  <Button
                    onClick={() => handlePackageClick(pkg.id)}
                    className={`w-full gap-2 font-semibold ${
                      isPopular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                    }`}
                  >
                    Pilih Paket Ini
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(PricingSection);
