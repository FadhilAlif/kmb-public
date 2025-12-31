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
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#1a8a8a", // Primary teal hsl(185, 65%, 35%)
            "cal-brand-emphasis": "#147070", // Darker teal for hover
            "cal-brand-text": "#ffffff",
            "cal-brand-subtle": "#e6f5f5", // Light teal background
            "cal-bg": "#fafbfc", // Background color
            "cal-bg-emphasis": "#ffffff",
            "cal-bg-subtle": "#f0f4f5",
            "cal-bg-muted": "#e8ecee",
            "cal-bg-inverted": "#1c2a33",
            "cal-border": "#d4dde2", // Border color
            "cal-border-emphasis": "#c0ccd3",
            "cal-border-subtle": "#e8ecee",
            "cal-border-booker": "#d4dde2",
            "cal-text": "#1c2a33", // Foreground text
            "cal-text-emphasis": "#0f171c",
            "cal-text-subtle": "#5c6f7a", // Muted foreground
            "cal-text-muted": "#7a8f9a",
            "cal-text-inverted": "#fafbfc",
          },
          dark: {
            "cal-brand": "#2aa3a3", // Primary teal dark mode hsl(185, 60%, 45%)
            "cal-brand-emphasis": "#3cb8b8",
            "cal-brand-text": "#ffffff",
            "cal-brand-subtle": "#1a3333",
            "cal-bg": "#141c22", // Dark background
            "cal-bg-emphasis": "#1c2830",
            "cal-bg-subtle": "#1c2830",
            "cal-bg-muted": "#243038",
            "cal-bg-inverted": "#fafbfc",
            "cal-border": "#2a3840",
            "cal-border-emphasis": "#3a4850",
            "cal-border-subtle": "#1c2830",
            "cal-border-booker": "#2a3840",
            "cal-text": "#f5f8fa",
            "cal-text-emphasis": "#ffffff",
            "cal-text-subtle": "#8aa0ac",
            "cal-text-muted": "#6a8090",
            "cal-text-inverted": "#141c22",
          },
        },
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
