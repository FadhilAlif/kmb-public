import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingStepper from "@/components/booking/BookingStepper";
import StepPaket from "@/components/booking/StepPaket";
import StepJadwal from "@/components/booking/StepJadwal";
import StepDataDiri from "@/components/booking/StepDataDiri";
import StepCheckout from "@/components/booking/StepCheckout";
import { initialBookingData, packages, type BookingData } from "@/components/booking/bookingData";

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>(initialBookingData);

  // Pre-fill from query params
  useEffect(() => {
    const paket = searchParams.get("paket");
    const tipe = searchParams.get("tipe");
    if (paket) {
      const useOwn = tipe === "sendiri";
      const pkg = packages.find((p) => p.name === paket);
      if (pkg) {
        setData((d) => ({
          ...d,
          packageName: pkg.name,
          useOwnCar: useOwn,
          price: useOwn ? pkg.priceOwn : pkg.priceCourse,
          sessions: pkg.sessions,
        }));
        setStep(2);
      }
    }
  }, [searchParams]);

  const updateData = (partial: Partial<BookingData>) => {
    setData((d) => ({ ...d, ...partial }));
  };

  return (
    <>
      <Helmet>
        <title>Booking Kursus | Kursus Mobil Bantul</title>
        <meta name="description" content="Booking jadwal kursus mengemudi di Bantul. Pilih paket, jadwal, dan konfirmasi pembayaran." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto flex items-center gap-4 h-16">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-bold text-foreground text-lg">Booking Kursus</span>
          </div>
        </div>

        <div className="container mx-auto py-8 px-4">
          <BookingStepper currentStep={step} />

          {step === 1 && (
            <StepPaket data={data} onUpdate={updateData} onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <StepJadwal data={data} onUpdate={updateData} onNext={() => setStep(3)} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <StepDataDiri data={data} onUpdate={updateData} onNext={() => setStep(4)} onBack={() => setStep(2)} />
          )}
          {step === 4 && (
            <StepCheckout data={data} onUpdate={updateData} onBack={() => setStep(3)} />
          )}
        </div>
      </div>
    </>
  );
};

export default BookingPage;
