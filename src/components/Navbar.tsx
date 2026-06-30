import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppConfirmDialog from "./WhatsAppConfirmDialog";

const PHONE_NUMBER = "6285100450236";
const DEFAULT_MESSAGE = "Halo, saya tertarik dengan kursus mobil";

const NAV_LINKS = [
  { href: "#paket", label: "Paket Harga" },
  { href: "#jadwal", label: "Cek Jadwal" },
  { href: "#tentang", label: "Tentang Kami" },
  { href: "#faq", label: "FAQ" },
] as const;

interface NavLink {
  href: string;
  label: string;
  isBooking?: boolean;
}

function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => callbackRef.current(...args),
        delay,
      );
    }) as T,
    [delay],
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = useMemo(() => NAV_LINKS, []);

  const handleScroll = useDebouncedCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, 10);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNavClick = useCallback(
    (link: NavLink) => {
      setIsOpen(false);
      if ("isBooking" in link && link.isBooking) {
        navigate("/booking");
        return;
      }
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    [navigate],
  );

  const handleWhatsAppClick = useCallback(() => {
    setIsOpen(false);
    setDialogOpen(true);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-card/95 backdrop-blur-md shadow-card"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="#beranda"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick({ href: "#beranda", label: "Beranda" });
              }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  K
                </span>
              </div>
              <span className="font-bold text-lg md:text-xl text-foreground">
                Kursus Mobil <span className="text-primary">Bantul</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link);
                  }}
                  className="text-muted-foreground hover:text-primary font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                onClick={handleWhatsAppClick}
                className="bg-whatsapp hover:bg-whatsapp-hover text-accent-foreground font-semibold gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi via WA
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card border-t border-border"
            >
              <div className="container py-4 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link);
                    }}
                    className="block py-2 text-muted-foreground hover:text-primary font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-whatsapp hover:bg-whatsapp-hover text-accent-foreground font-semibold gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi via WA
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <WhatsAppConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        phoneNumber={PHONE_NUMBER}
        message={DEFAULT_MESSAGE}
      />
    </>
  );
};

export default memo(Navbar);
