import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const FloatingWhatsApp = () => {
  return (
    <motion.a
      href="https://web.whatsapp.com/send?phone=6285100450236&text=Halo, saya tertarik dengan kursus mobil"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-whatsapp hover:bg-whatsapp-hover text-accent-foreground px-5 py-3 rounded-full shadow-elevated transition-colors group"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="font-semibold hidden sm:inline">Chat WhatsApp</span>
      
      {/* Pulse Animation */}
      <span className="absolute inset-0 rounded-full bg-whatsapp animate-ping opacity-25" />
    </motion.a>
  );
};

export default FloatingWhatsApp;
