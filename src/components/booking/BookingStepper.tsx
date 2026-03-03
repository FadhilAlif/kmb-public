import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const steps = [
  { label: "Paket", step: 1 },
  { label: "Jadwal", step: 2 },
  { label: "Data Diri", step: 3 },
  { label: "Checkout", step: 4 },
];

interface BookingStepperProps {
  currentStep: number;
}

const BookingStepper = ({ currentStep }: BookingStepperProps) => {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-10 max-w-md mx-auto">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {steps.map((s) => (
          <div key={s.step} className="flex flex-col items-center gap-1.5">
            <motion.div
              layout
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                currentStep > s.step
                  ? "bg-primary text-primary-foreground"
                  : currentStep === s.step
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {currentStep > s.step ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Check className="w-4 h-4" />
                </motion.span>
              ) : (
                s.step
              )}
            </motion.div>
            <span
              className={cn(
                "text-[11px] font-medium",
                currentStep >= s.step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingStepper;
