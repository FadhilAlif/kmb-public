import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Pilih Paket Kursus</h2>
        <p className="text-sm text-muted-foreground">Pilih paket yang sesuai dengan kebutuhan Anda</p>

        <div className="inline-flex items-center gap-3 p-1.5 bg-secondary rounded-full mt-4">
          <span
            className={cn(
              "px-3 py-1.5 rounded-full font-medium text-xs transition-all",
              !useOwnCar ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            Mobil Kursus
          </span>
          <Switch
            checked={useOwnCar}
            onCheckedChange={(v) => onUpdate({ useOwnCar: v })}
          />
          <span
            className={cn(
              "px-3 py-1.5 rounded-full font-medium text-xs transition-all flex items-center gap-1.5",
              useOwnCar ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            Mobil Sendiri
            <span className="text-[10px] bg-primary-foreground/20 px-1.5 py-0.5 rounded-full">Hemat!</span>
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {packages.map((pkg, index) => {
          const price = useOwnCar ? pkg.priceOwn : pkg.priceCourse;
          const features = useOwnCar ? pkg.featuresOwn : pkg.featuresCourse;

          return (
            <motion.button
              key={pkg.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.08 }}
              onClick={() => handleSelect(pkg)}
              className={cn(
                "w-full text-left rounded-xl border p-4 transition-all hover:shadow-md group relative",
                pkg.popular
                  ? "border-primary ring-2 ring-primary/15 bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              {pkg.popular && (
                <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  Populer
                </span>
              )}

              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-foreground text-sm">{pkg.name}</h3>
                    <span className="text-xs text-muted-foreground">• {pkg.sessions}x pertemuan</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{pkg.description}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {features.slice(0, 3).map((f) => (
                      <span key={f} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Check className="w-3 h-3 text-primary flex-shrink-0" />
                        {f}
                      </span>
                    ))}
                    {features.length > 3 && (
                      <span className="text-[11px] text-primary font-medium">
                        +{features.length - 3} lainnya
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <motion.span
                    key={useOwnCar ? "own" : "course"}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-bold text-foreground block"
                  >
                    {formatPrice(price)}
                  </motion.span>
                  <span className="text-[11px] text-primary font-medium group-hover:underline">
                    Pilih →
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default StepPaket;
