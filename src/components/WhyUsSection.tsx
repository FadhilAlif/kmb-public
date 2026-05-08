import { Award, Clock, Car, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Award,
    title: "Instruktur Sabar & Bersertifikat",
    description:
      "Semua instruktur kami telah tersertifikasi resmi dan berpengalaman mengajar dengan sabar.",
  },
  {
    icon: Clock,
    title: "Jadwal Fleksibel",
    description:
      "Pilih jadwal sesuai kebutuhan Anda. Tersedia sesi pagi hingga sore hari.",
  },
  {
    icon: Car,
    title: "Armada Terawat & Bersih",
    description:
      "Mobil latihan selalu dalam kondisi prima, bersih, dan nyaman untuk belajar.",
  },
  {
    icon: Wallet,
    title: "Bisa Pakai Mobil Sendiri",
    description:
      "Lebih hemat! Gunakan mobil pribadi Anda untuk latihan dengan harga spesial.",
    isHighlight: true,
  },
];

const WhyUsSection = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            Mengapa Kami?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Keunggulan Kursus Mobil Bantul
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kami berkomitmen memberikan pelayanan terbaik agar Anda cepat mahir
            mengemudi dengan aman dan percaya diri.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative group p-6 rounded-2xl bg-card border transition-all duration-300 hover:shadow-card-hover ${
                feature.isHighlight
                  ? "border-highlight ring-2 ring-highlight/20"
                  : "border-border hover:border-primary/30"
              }`}
            >
              {feature.isHighlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-highlight text-highlight-foreground text-xs font-semibold rounded-full">
                  Hemat Biaya!
                </span>
              )}

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  feature.isHighlight
                    ? "bg-highlight/10 text-highlight"
                    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                }`}
              >
                <feature.icon className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(WhyUsSection);
