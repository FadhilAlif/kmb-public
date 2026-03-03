import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import BookingStepper from "@/components/booking/BookingStepper";
import StepPaket from "@/components/booking/StepPaket";
import StepJadwal from "@/components/booking/StepJadwal";
import StepDataDiri from "@/components/booking/StepDataDiri";
import StepCheckout from "@/components/booking/StepCheckout";
import {
  initialBookingData,
  type BookingData,
} from "@/components/booking/bookingData";
import { usePackages } from "@/hooks/usePackages";

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<BookingData>(initialBookingData);
  const { data: packages } = usePackages();

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  // Pre-fill from query params (now using packageId)
  useEffect(() => {
    const packageId = searchParams.get("packageId");
    if (packageId && packages) {
      const pkg = packages.find((p) => p.id === packageId);
      if (pkg) {
        setData((d) => ({
          ...d,
          packageId: pkg.id,
          packageName: pkg.name,
          useOwnCar: pkg.car_type === "mobil_sendiri",
          price: pkg.price,
          sessions: pkg.total_sessions,
        }));
        setDirection(1);
        setStep(2);
      }
    }
  }, [searchParams, packages]);

  const updateData = (partial: Partial<BookingData>) => {
    setData((d) => ({ ...d, ...partial }));
  };

  return (
    <>
      <Helmet>
        <title>Booking Kursus | Kursus Mobil Bantul</title>
        <meta
          name="description"
          content="Booking jadwal kursus mengemudi di Bantul. Pilih paket, jadwal, dan konfirmasi pembayaran."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto flex items-center gap-4 h-16">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-bold text-foreground text-lg">
              Booking Kursus
            </span>
          </div>
        </div>

        <div className="container mx-auto py-8 px-4">
          <BookingStepper currentStep={step} />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {step === 1 && (
                <StepPaket
                  data={data}
                  onUpdate={updateData}
                  onNext={() => goTo(2)}
                />
              )}
              {step === 2 && (
                <StepJadwal
                  data={data}
                  onUpdate={updateData}
                  onNext={() => goTo(3)}
                  onBack={() => goTo(1)}
                />
              )}
              {step === 3 && (
                <StepDataDiri
                  data={data}
                  onUpdate={updateData}
                  onNext={() => goTo(4)}
                  onBack={() => goTo(2)}
                />
              )}
              {step === 4 && (
                <StepCheckout
                  data={data}
                  onUpdate={updateData}
                  onBack={() => goTo(3)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default BookingPage;
