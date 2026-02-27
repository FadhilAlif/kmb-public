import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { packages, formatPrice, type BookingData } from "./bookingData";

interface StepPaketProps {
  data: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  onNext: () => void;
}

const StepPaket = ({ data, onUpdate, onNext }: StepPaketProps) => {
  const useOwnCar = data.useOwnCar;

  const handleSelect = (pkg: (typeof packages)[0]) => {
    onUpdate({
      packageName: pkg.name,
      useOwnCar,
      price: useOwnCar ? pkg.priceOwn : pkg.priceCourse,
      sessions: pkg.sessions,
    });
    onNext();
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Pilih Paket Kursus</h2>
        <p className="text-muted-foreground">Pilih paket yang sesuai dengan kebutuhan Anda</p>

        <div className="inline-flex items-center gap-4 p-2 bg-secondary rounded-full mt-6">
          <span
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
              !useOwnCar ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Mobil Kursus
          </span>
          <Switch
            checked={useOwnCar}
            onCheckedChange={(v) => onUpdate({ useOwnCar: v })}
          />
          <span
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
              useOwnCar ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Mobil Sendiri
            <span className="text-xs bg-primary-foreground/20 px-2 py-0.5 rounded-full">Hemat!</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`relative rounded-2xl bg-card border p-6 transition-all duration-300 ${
              pkg.popular
                ? "border-primary ring-2 ring-primary/20 shadow-lg scale-[1.02]"
                : "border-border hover:border-primary/30 hover:shadow-md"
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
              <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
              <motion.span
                key={useOwnCar ? "own" : "course"}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-foreground"
              >
                {formatPrice(useOwnCar ? pkg.priceOwn : pkg.priceCourse)}
              </motion.span>
              <p className="text-sm text-muted-foreground mt-1">{pkg.sessions}x pertemuan</p>
            </div>

            <ul className="space-y-3 mb-8">
              {(useOwnCar ? pkg.featuresOwn : pkg.featuresCourse).map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleSelect(pkg)}
              className={`w-full font-semibold ${
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
  );
};

export default StepPaket;
