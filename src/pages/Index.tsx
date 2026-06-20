import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyUsSection from "@/components/WhyUsSection";
import PricingSection from "@/components/PricingSection";
import ScheduleSection from "@/components/ScheduleSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Helmet } from "react-helmet-async";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://kursusmobilbantul.com/#business",
      name: "Kursus Mobil Bantul",
      alternateName: "KMB",
      description:
        "Kursus mengemudi terbaik di Bantul & Yogyakarta. Instruktur sabar, jadwal fleksibel, bisa pakai mobil sendiri. Garansi sampai mahir.",
      url: "https://kursusmobilbantul.com",
      telephone: "+6281234567890",
      email: "info@kursusmobilbantul.com",
      image: "https://kursusmobilbantul.com/og-image.jpg",
      priceRange: "Rp500.000 - Rp1.500.000",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Bantul No. 123",
        addressLocality: "Bantul",
        addressRegion: "DI Yogyakarta",
        postalCode: "55711",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -7.8846,
        longitude: 110.3342,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "07:00",
          closes: "17:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday", "Sunday"],
          opens: "08:00",
          closes: "16:00",
        },
      ],
      sameAs: [
        "https://instagram.com/kursusmobilbantul",
        "https://facebook.com/kursusmobilbantul",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://kursusmobilbantul.com/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Jadwal kursus tersedia kapan saja?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kami buka setiap hari Senin - Minggu, dari pukul 07.00 - 17.00 WIB. Anda bisa memilih jadwal yang sesuai dengan kesibukan Anda. Untuk jadwal weekend biasanya lebih cepat penuh, jadi disarankan booking lebih awal.",
          },
        },
        {
          "@type": "Question",
          name: "Apakah bisa antar-jemput ke rumah?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ya, bisa! Untuk paket menggunakan mobil kursus, kami menyediakan layanan antar-jemput gratis di area Bantul dan sekitarnya (radius 10 km dari kantor kami).",
          },
        },
        {
          "@type": "Question",
          name: "Bagaimana sistem pembayarannya?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pembayaran bisa dilakukan secara tunai atau transfer bank. Anda bisa bayar di awal secara lunas atau dengan sistem DP 50% di awal dan pelunasan sebelum sesi ke-3.",
          },
        },
        {
          "@type": "Question",
          name: "Apa saja syarat untuk ikut kursus?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Syaratnya sangat mudah: minimal usia 17 tahun, membawa fotokopi KTP, dan siap belajar dengan semangat! Tidak perlu pengalaman sama sekali karena kami akan mengajarkan dari dasar.",
          },
        },
        {
          "@type": "Question",
          name: "Apakah ada garansi sampai bisa?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ya! Khusus untuk Paket Mahir, kami memberikan garansi sampai bisa. Jika setelah 12 sesi Anda masih merasa belum mahir, kami akan memberikan tambahan sesi GRATIS.",
          },
        },
        {
          "@type": "Question",
          name: "Bisa pakai mobil matic atau manual?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Saat ini armada kursus kami menggunakan mobil transmisi manual. Namun, jika Anda ingin belajar dengan mobil matic, bisa menggunakan opsi 'Mobil Sendiri' dengan harga lebih hemat.",
          },
        },
      ],
    },
  ],
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Kursus Mobil Bantul | Belajar Mengemudi Terbaik di Bantul Yogyakarta</title>
        <meta
          name="description"
          content="Kursus mengemudi terbaik di Bantul & Yogyakarta. Instruktur sabar, jadwal fleksibel, bisa pakai mobil sendiri. Garansi sampai mahir. Hubungi kami sekarang!"
        />
        <meta
          name="keywords"
          content="kursus mobil bantul, belajar mengemudi bantul yogyakarta, les nyetir bantul, kursus SIM bantul"
        />
        <link rel="canonical" href="https://kursusmobilbantul.com/" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <WhyUsSection />
          <PricingSection />
          <ScheduleSection />
          <AboutSection />
          <TestimonialsSection />
          <FAQSection />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </>
  );
};

export default Index;
