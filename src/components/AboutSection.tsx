import { memo } from "react";
import { motion } from "framer-motion";
import instructorProfile from "@/assets/instructor-profile.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const galleryImages = [
  {
    src: gallery1,
    alt: "Mobil latihan di jalan",
  },
  {
    src: gallery2,
    alt: "Latihan mengemudi",
  },
  {
    src: gallery3,
    alt: "Latihan parkir",
  },
  {
    src: gallery4,
    alt: "Sertifikat kelulusan",
  },
];

const AboutSection = () => {
  return (
    <section id="tentang" className="py-20 bg-secondary/50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              Tentang Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Instruktur Berpengalaman & Bersertifikat
            </h2>

            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Kursus Mobil Bantul</strong>{" "}
                didirikan pada tahun 2015 dengan satu tujuan: membantu
                masyarakat Bantul dan sekitarnya belajar mengemudi dengan aman,
                percaya diri, dan menyenangkan.
              </p>
              <p>
                Tim instruktur kami terdiri dari pengemudi profesional yang
                telah tersertifikasi dan memiliki pengalaman mengajar lebih dari
                8 tahun. Kami memahami bahwa setiap orang memiliki kecepatan
                belajar berbeda, maka dari itu kami selalu sabar membimbing
                hingga Anda benar-benar mahir.
              </p>
              <p>
                Dengan lebih dari <strong>500 siswa</strong> yang telah lulus
                dan mendapatkan SIM, kami bangga menjadi pilihan utama warga
                Bantul untuk belajar mengemudi.
              </p>
            </div>

            {/* Instructor Profile */}
            <div className="mt-8 flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
              <img
                src={instructorProfile}
                alt="Instruktur Utama"
                className="w-16 h-16 rounded-full object-cover"
                loading="lazy"
                decoding="async"
                width="64"
                height="64"
              />
              <div>
                <p className="font-semibold text-foreground">Pak Bambang S.</p>
                <p className="text-sm text-muted-foreground">
                  Instruktur Utama • 12 tahun pengalaman
                </p>
                <p className="text-sm text-primary font-medium">
                  "Kesabaran adalah kunci sukses belajar mengemudi"
                </p>
              </div>
            </div>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.alt}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`rounded-2xl overflow-hidden shadow-card ${
                  index === 1 ? "mt-8" : index === 2 ? "-mt-8" : ""
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="200"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(AboutSection);
