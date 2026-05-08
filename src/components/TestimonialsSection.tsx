import { memo } from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import testimonial1 from "@/assets/testimonial-1.webp";
import testimonial2 from "@/assets/testimonial-2.webp";
import testimonial3 from "@/assets/testimonial-3.webp";

const testimonials = [
  {
    name: "Dian Pratiwi",
    role: "Ibu Rumah Tangga",
    content:
      "Awalnya saya sangat takut belajar mobil. Tapi berkat kesabaran Pak Bambang, sekarang saya sudah bisa antar-jemput anak sendiri. Terima kasih Kursus Mobil Bantul!",
    rating: 5,
    image: testimonial1,
  },
  {
    name: "Andi Saputra",
    role: "Mahasiswa",
    content:
      "Jadwalnya fleksibel banget, bisa disesuaikan sama jadwal kuliah. 8x pertemuan langsung bisa ambil SIM. Harganya juga terjangkau untuk mahasiswa.",
    rating: 5,
    image: testimonial2,
  },
  {
    name: "Bu Siti Rahayu",
    role: "Guru SD",
    content:
      "Saya pakai mobil sendiri buat kursus, jadi lebih hemat. Instrukturnya sabar dan selalu kasih tips praktis. Sekarang parkir paralel sudah tidak masalah!",
    rating: 5,
    image: testimonial3,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            Testimoni
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ratusan siswa telah berhasil lulus dan mendapatkan SIM berkat
            bimbingan kami.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-shadow"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-highlight fill-highlight"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="48"
                  height="48"
                />
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(TestimonialsSection);
