import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const ScheduleSection = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "kursus-mengemudi" });
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: true,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <section id="jadwal" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium text-sm">
              Booking Online
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cek Ketersediaan Jadwal
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Lihat slot waktu yang kosong dan booking langsung jadwal belajar Anda di sini. 
            Jadwal terhubung otomatis dengan instruktur.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-[800px] mx-auto"
        >
          <div className="bg-card rounded-2xl shadow-card overflow-hidden border border-border">
            <div className="min-h-[500px] md:min-h-[600px]">
              <Cal
                namespace="kursus-mengemudi"
                calLink="fadhil-alif-kq7h8t/kursus-mengemudi"
                style={{ width: "100%", height: "100%", overflow: "scroll" }}
                config={{ layout: "month_view", theme: "light" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScheduleSection;
