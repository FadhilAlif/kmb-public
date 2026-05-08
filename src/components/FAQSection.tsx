import { memo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Jadwal kursus tersedia kapan saja?",
    answer:
      "Kami buka setiap hari Senin - Minggu, dari pukul 07.00 - 17.00 WIB. Anda bisa memilih jadwal yang sesuai dengan kesibukan Anda. Untuk jadwal weekend biasanya lebih cepat penuh, jadi disarankan booking lebih awal.",
  },
  {
    question: "Apakah bisa antar-jemput ke rumah?",
    answer:
      "Ya, bisa! Untuk paket menggunakan mobil kursus, kami menyediakan layanan antar-jemput gratis di area Bantul dan sekitarnya (radius 10 km dari kantor kami). Untuk area lebih jauh, ada biaya tambahan yang terjangkau.",
  },
  {
    question: "Bagaimana sistem pembayarannya?",
    answer:
      "Pembayaran bisa dilakukan secara tunai atau transfer bank. Anda bisa bayar di awal secara lunas atau dengan sistem DP 50% di awal dan pelunasan sebelum sesi ke-3. Kami juga menerima pembayaran via QRIS.",
  },
  {
    question: "Apa saja syarat untuk ikut kursus?",
    answer:
      "Syaratnya sangat mudah: minimal usia 17 tahun, membawa fotokopi KTP, dan siap belajar dengan semangat! Tidak perlu pengalaman sama sekali karena kami akan mengajarkan dari dasar.",
  },
  {
    question: "Apakah ada garansi sampai bisa?",
    answer:
      "Ya! Khusus untuk Paket Mahir, kami memberikan garansi sampai bisa. Jika setelah 12 sesi Anda masih merasa belum mahir, kami akan memberikan tambahan sesi GRATIS sampai Anda benar-benar percaya diri.",
  },
  {
    question: "Bisa pakai mobil matic atau manual?",
    answer:
      "Saat ini armada kursus kami menggunakan mobil transmisi manual. Namun, jika Anda ingin belajar dengan mobil matic, bisa menggunakan opsi 'Mobil Sendiri' dengan harga lebih hemat.",
  },
];

const FAQSection = () => {
  return (
    <section id="kontak" className="py-20 bg-secondary/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan jawaban atas pertanyaan umum seputar kursus mengemudi kami.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-card"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(FAQSection);
