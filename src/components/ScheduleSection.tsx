import { memo } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ScheduleCalendarPreview from "./ScheduleCalendarPreview";

const ScheduleSection = () => {
  const navigate = useNavigate();

  return (
    <section id="jadwal" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
        >
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Booking Online
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Cek Ketersediaan Jadwal
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Preview jadwal bulanan untuk melihat tanggal available, slot yang
              sudah booking, dan jam yang masih kosong sebelum masuk ke halaman
              booking.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/booking")}
              className="gap-2 bg-primary px-8 text-base font-semibold text-primary-foreground"
            >
              Booking Sekarang
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          <ScheduleCalendarPreview onBookingClick={() => navigate("/booking")} />
        </motion.div>
      </div>
    </section>
  );
};

export default memo(ScheduleSection);
