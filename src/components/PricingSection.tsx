import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { packages, formatPrice } from "./booking/bookingData";

const PricingSection = () => {
  const [useOwnCar, setUseOwnCar] = useState(false);
  const navigate = useNavigate();

  const handlePackageClick = (pkgName: string) => {
    const tipe = useOwnCar ? "sendiri" : "kursus";
    navigate(`/booking?paket=${encodeURIComponent(pkgName)}&tipe=${tipe}`);
  };

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

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl bg-card border p-6 lg:p-8 transition-all duration-300 ${
                  pkg.popular
                    ? "border-primary ring-2 ring-primary/20 shadow-elevated scale-[1.02]"
                    : "border-border hover:border-primary/30 hover:shadow-card-hover"
                }`}
              >
                {pkg.popular && (
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
                    {pkg.description}
                  </p>
                  <div className="flex items-end justify-center gap-1">
                    <motion.span
                      key={useOwnCar ? "own" : "course"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl lg:text-4xl font-bold text-foreground"
                    >
                      {formatPrice(useOwnCar ? pkg.priceOwn : pkg.priceCourse)}
                    </motion.span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pkg.sessions}x pertemuan
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {(useOwnCar ? pkg.featuresOwn : pkg.featuresCourse).map(
                    (feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    )
                  )}
                </ul>

                <Button
                  onClick={() => handlePackageClick(pkg.name)}
                  className={`w-full gap-2 font-semibold ${
                    pkg.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  }`}
                >
                  
                  Pilih Paket Ini
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
};

export default PricingSection;
