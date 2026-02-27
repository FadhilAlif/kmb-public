import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Pilih Paket", step: 1 },
  { label: "Pilih Jadwal", step: 2 },
  { label: "Data Diri", step: 3 },
  { label: "Checkout", step: 4 },
];

interface BookingStepperProps {
  currentStep: number;
}

const BookingStepper = ({ currentStep }: BookingStepperProps) => {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
      {steps.map((s, i) => (
        <div key={s.step} className="flex items-center gap-2 md:gap-4">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                currentStep > s.step
                  ? "bg-primary text-primary-foreground"
                  : currentStep === s.step
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {currentStep > s.step ? <Check className="w-4 h-4" /> : s.step}
            </div>
            <span
              className={cn(
                "text-xs font-medium hidden md:block",
                currentStep >= s.step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-8 md:w-16 h-0.5 mb-5 md:mb-5",
                currentStep > s.step ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default BookingStepper;
