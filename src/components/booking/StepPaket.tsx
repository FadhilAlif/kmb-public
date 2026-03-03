import { useState } from "react";
import { Check, ChevronDown, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { packages, formatPrice, type BookingData } from "./bookingData";

interface StepPaketProps {
  data: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  onNext: () => void;
}

const StepPaket = ({ data, onUpdate, onNext }: StepPaketProps) => {
  const useOwnCar = data.useOwnCar;
  const [expandedPkg, setExpandedPkg] = useState<string | null>(null);

  const handleSelect = (pkg: (typeof packages)[0]) => {
    onUpdate({
      packageName: pkg.name,
      useOwnCar,
      price: useOwnCar ? pkg.priceOwn : pkg.priceCourse,
      sessions: pkg.sessions,
    });
    onNext();
  };

  const toggleExpand = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setExpandedPkg((prev) => (prev === name ? null : name));
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
          const isExpanded = expandedPkg === pkg.name;
          const savingsPercent = Math.round((1 - pkg.priceOwn / pkg.priceCourse) * 100);

          return (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.08 }}
              className={cn(
                "rounded-xl border transition-all relative overflow-hidden",
                pkg.popular
                  ? "border-primary ring-2 ring-primary/15 bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              {pkg.popular && (
                <span className="absolute -top-0 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-b-lg">
                  <Star className="w-3 h-3 fill-current" />
                  Populer
                </span>
              )}

              {/* Main clickable row */}
              <button
                onClick={() => handleSelect(pkg)}
                className="w-full text-left p-4 group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-foreground text-sm">{pkg.name}</h3>
                      <span className="text-xs text-muted-foreground">• {pkg.sessions}x pertemuan</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pkg.description}</p>
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
                    {useOwnCar && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block text-[10px] font-semibold bg-green-500/15 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-full mb-0.5"
                      >
                        Hemat {savingsPercent}%
                      </motion.span>
                    )}
                    <span className="text-[11px] text-primary font-medium group-hover:underline block">
                      Pilih →
                    </span>
                  </div>
                </div>
              </button>

              {/* Expand toggle */}
              <button
                onClick={(e) => toggleExpand(e, pkg.name)}
                className="w-full flex items-center justify-center gap-1 py-2 text-[11px] font-medium text-muted-foreground hover:text-primary border-t border-border/50 transition-colors"
              >
                {isExpanded ? "Sembunyikan fitur" : `Lihat ${features.length} fitur`}
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              </button>

              {/* Expandable features */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 space-y-1.5">
                      {features.map((f) => (
                        <span key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StepPaket;
