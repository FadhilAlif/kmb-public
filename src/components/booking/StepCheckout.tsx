import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, CheckCircle2, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { type BookingData, formatPrice } from "./bookingData";

interface StepCheckoutProps {
  data: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  onBack: () => void;
}

const StepCheckout = ({ data, onUpdate, onBack }: StepCheckoutProps) => {
  const [file, setFile] = useState<File | null>(data.buktiTransfer);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      alert("File maksimal 5MB");
      return;
    }
    setFile(f);
    onUpdate({ buktiTransfer: f });
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = () => {
    const id = "BK-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setBookingId(id);
    toast({
      title: "Booking berhasil dikonfirmasi",
      description: `Nomor booking Anda: ${id}`,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 max-w-md mx-auto"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Booking Berhasil!</h2>
        <p className="text-muted-foreground mb-4">
          Nomor booking Anda:
        </p>
        <div className="bg-muted rounded-xl p-4 mb-6">
          <span className="text-2xl font-mono font-bold text-primary">{bookingId}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Kami akan menghubungi Anda via WhatsApp di <strong>{data.whatsapp}</strong> untuk konfirmasi.
        </p>
        <Button
          onClick={() => window.location.href = "/"}
          className="bg-primary text-primary-foreground"
        >
          Kembali ke Beranda
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Checkout & Pembayaran</h2>
        <p className="text-muted-foreground">Periksa ringkasan dan upload bukti transfer</p>
      </div>

      {/* Summary */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6 space-y-4">
        <h3 className="font-semibold text-foreground text-lg">Ringkasan Booking</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <span className="text-muted-foreground">Paket</span>
          <span className="text-foreground font-medium">{data.packageName}</span>
          <span className="text-muted-foreground">Tipe</span>
          <span className="text-foreground font-medium">{data.useOwnCar ? "Mobil Sendiri" : "Mobil Kursus"}</span>
          <span className="text-muted-foreground">Jadwal</span>
          <span className="text-foreground font-medium">
            {data.date ? format(data.date, "EEEE, d MMMM yyyy", { locale: id }) : "-"}, {data.timeSlot}
          </span>
          <span className="text-muted-foreground">Nama</span>
          <span className="text-foreground font-medium">{data.nama}</span>
          <span className="text-muted-foreground">WhatsApp</span>
          <span className="text-foreground font-medium">{data.whatsapp}</span>
          <span className="text-muted-foreground">Titik Jemput</span>
          <span className="text-foreground font-medium">{data.titikJemput}</span>
        </div>
        <div className="border-t border-border pt-4 flex justify-between items-center">
          <span className="font-semibold text-foreground">Total Biaya</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(data.price)}</span>
        </div>
      </div>

      {/* Bank Info */}
      <div className="bg-muted rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-3">Transfer ke Rekening</h3>
        <div className="space-y-3">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Bank BCA</p>
            <p className="text-lg font-mono font-bold text-foreground">1234567890</p>
            <p className="text-sm text-muted-foreground">a.n. Kursus Mobil Bantul</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Bank BRI</p>
            <p className="text-lg font-mono font-bold text-foreground">0987654321</p>
            <p className="text-sm text-muted-foreground">a.n. Kursus Mobil Bantul</p>
          </div>
        </div>
      </div>

      {/* Upload */}
      <div className="mb-8">
        <h3 className="font-semibold text-foreground mb-3">Upload Bukti Transfer</h3>
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        {!file ? (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Upload className="w-8 h-8" />
            <span className="font-medium">Klik untuk upload bukti transfer</span>
            <span className="text-xs">.jpg, .png, .pdf — maks 5MB</span>
          </button>
        ) : (
          <div className="border border-border rounded-2xl p-4 flex items-center gap-4">
            {preview ? (
              <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
            ) : (
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              onClick={() => { setFile(null); setPreview(null); onUpdate({ buktiTransfer: null }); }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!file}
          className="bg-primary text-primary-foreground font-semibold"
        >
          Konfirmasi Booking
        </Button>
      </div>
    </div>
  );
};

export default StepCheckout;
