import { memo } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium text-sm">Booking Online</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cek Ketersediaan Jadwal
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Lihat slot waktu yang kosong dan booking langsung jadwal belajar Anda.
            Pilih paket, jadwal, dan konfirmasi pembayaran — semua dalam satu halaman.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/booking")}
            className="bg-primary text-primary-foreground font-semibold gap-2 text-base px-8"
          >
            Booking Sekarang
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(ScheduleSection);
