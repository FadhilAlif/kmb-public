import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { type BookingData, ALL_TIME_SLOTS } from "./bookingData";
import { useBookedSlots } from "@/hooks/useBookedSlots";

interface StepJadwalProps {
  data: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepJadwal = ({ data, onUpdate, onNext, onBack }: StepJadwalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(data.date);
  const [selectedTime, setSelectedTime] = useState(data.timeSlot);

  // Fetch real booked slots from Supabase for the selected date
  const { data: bookedSlots, isLoading: loadingSlots, isError: slotsError } =
    useBookedSlots(selectedDate);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(""); // reset time whenever date changes
  };

  const handleContinue = () => {
    onUpdate({ date: selectedDate, timeSlot: selectedTime });
    onNext();
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // reset ke midnight agar perbandingan murni per-hari

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Pilih Jadwal
        </h2>
        <p className="text-muted-foreground">
          Pilih preferensi jadwal sesi pertama Anda
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto mt-3">
          Jadwal yang Anda pilih merupakan preferensi awal. Admin KMB akan
          menghubungi Anda melalui WhatsApp untuk verifikasi pembayaran dan
          konfirmasi jadwal final.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < tomorrow}
            className="rounded-xl border bg-card p-4 pointer-events-auto"
            locale={id}
          />
        </div>

        {/* Time Slots */}
        <div>
          {selectedDate ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={selectedDate.toDateString()}
            >
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Slot Waktu —{" "}
                {format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })}
              </h3>

              {/* Loading state */}
              {loadingSlots ? (
                <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Memeriksa ketersediaan...</span>
                </div>
              ) : slotsError ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                  Gagal memeriksa ketersediaan slot. Silakan pilih tanggal lagi
                  atau refresh halaman.
                </div>
              ) : (
                <div className="space-y-3">
                  {ALL_TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots?.has(slot.time) ?? false;

                    return (
                      <button
                        key={slot.time}
                        disabled={isBooked}
                        onClick={() => setSelectedTime(slot.time)}
                        className={cn(
                          "w-full p-4 rounded-xl border text-left transition-all",
                          isBooked
                            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            : selectedTime === slot.time
                              ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/20"
                              : "border-border bg-card text-foreground hover:border-primary/40",
                        )}
                      >
                        <span className="font-medium">{slot.label}</span>
                        {isBooked && (
                          <span className="block text-xs text-destructive mt-1">
                            Slot penuh
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>← Pilih tanggal terlebih dahulu</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8 max-w-3xl mx-auto">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime || loadingSlots || slotsError}
          className="bg-primary text-primary-foreground"
        >
          Lanjutkan
        </Button>
      </div>
    </div>
  );
};

export default StepJadwal;
