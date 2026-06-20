import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  MessageCircle,
  Upload,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { type BookingData, formatPrice } from "./bookingData";
import { submitBooking } from "@/services/bookingService";

interface StepCheckoutProps {
  data: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  onBack: () => void;
}

const ALLOWED_FILE_TYPES = new Map([
  ["image/jpeg", ["jpg", "jpeg"]],
  ["image/png", ["png"]],
  ["application/pdf", ["pdf"]],
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const PHONE_NUMBER = "6285100450236";

const getFileExtension = (fileName: string): string => {
  const extension = fileName.split(".").pop();
  return extension?.toLowerCase() ?? "";
};

const validatePaymentProof = (file: File): string | null => {
  if (file.size === 0) {
    return "File bukti transfer kosong.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File maksimal 5MB.";
  }

  const allowedExtensions = ALLOWED_FILE_TYPES.get(file.type);
  if (!allowedExtensions) {
    return "Format file harus JPG, PNG, atau PDF.";
  }

  if (!allowedExtensions.includes(getFileExtension(file.name))) {
    return "Ekstensi file tidak sesuai dengan tipe file.";
  }

  return null;
};

const StepCheckout = ({ data, onUpdate, onBack }: StepCheckoutProps) => {
  const [file, setFile] = useState<File | null>(data.buktiTransfer);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [website, setWebsite] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const validationError = validatePaymentProof(selectedFile);
    if (validationError) {
      toast({
        title: "File tidak valid",
        description: validationError,
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    onUpdate({ buktiTransfer: selectedFile });

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      if (!data.date || !data.timeSlot) {
        throw new Error(
          "Jadwal belum dipilih. Silakan kembali dan pilih jadwal.",
        );
      }

      if (!file) {
        throw new Error("Bukti pembayaran wajib diupload.");
      }

      const validationError = validatePaymentProof(file);
      if (validationError) {
        throw new Error(validationError);
      }

      const result = await submitBooking({
        nama: data.nama,
        whatsapp: data.whatsapp,
        titikJemput: data.titikJemput,
        catatan: data.catatan,
        packageId: data.packageId,
        date: format(data.date, "yyyy-MM-dd"),
        timeSlot: data.timeSlot,
        buktiTransfer: file,
        website,
      });

      setBookingCode(result.bookingCode);
      toast({
        title: "Booking berhasil dikirim",
        description: `Kode booking: ${result.bookingCode}`,
      });
      setSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuat booking.";
      toast({
        title: "Booking Gagal",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const whatsappMessage = encodeURIComponent(
      `Halo Admin KMB, saya sudah melakukan booking kursus mobil dengan kode booking ${bookingCode}. Mohon dibantu konfirmasi jadwal saya.`,
    );
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${whatsappMessage}`;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 max-w-md mx-auto"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Booking Berhasil Dikirim
        </h2>
        <p className="text-muted-foreground mb-4">Kode booking Anda:</p>
        <div className="bg-muted rounded-xl p-4 mb-6">
          <span className="text-2xl font-mono font-bold text-primary">
            {bookingCode}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Admin KMB akan memverifikasi bukti pembayaran dan menghubungi Anda via
          WhatsApp di <strong>{data.whatsapp}</strong> untuk konfirmasi jadwal
          final.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-whatsapp hover:bg-whatsapp-hover text-accent-foreground gap-2">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="w-4 h-4" />
              Konfirmasi via WhatsApp
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Kembali ke Beranda
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Checkout & Pembayaran
        </h2>
        <p className="text-muted-foreground">
          Periksa ringkasan dan upload bukti transfer
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-6 space-y-4">
        <h3 className="font-semibold text-foreground text-lg">
          Ringkasan Booking
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <span className="text-muted-foreground">Paket</span>
          <span className="text-foreground font-medium">{data.packageName}</span>
          <span className="text-muted-foreground">Tipe</span>
          <span className="text-foreground font-medium">
            {data.useOwnCar ? "Mobil Sendiri" : "Mobil Kursus"}
          </span>
          <span className="text-muted-foreground">Preferensi Jadwal</span>
          <span className="text-foreground font-medium">
            {data.date
              ? format(data.date, "EEEE, d MMMM yyyy", { locale: id })
              : "-"}
            , {data.timeSlot}
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
          <span className="text-2xl font-bold text-primary">
            {formatPrice(data.price)}
          </span>
        </div>
      </div>

      <div className="bg-muted rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-3">
          Transfer ke Rekening
        </h3>
        <div className="space-y-3">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Bank BCA</p>
            <p className="text-lg font-mono font-bold text-foreground">
              1234567890
            </p>
            <p className="text-sm text-muted-foreground">
              a.n. Kursus Mobil Bantul
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Bank BRI</p>
            <p className="text-lg font-mono font-bold text-foreground">
              0987654321
            </p>
            <p className="text-sm text-muted-foreground">
              a.n. Kursus Mobil Bantul
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-foreground mb-3">
          Upload Bukti Transfer
        </h3>
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={handleFileChange}
          aria-label="file"
        />
        <input
          type="text"
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="sr-only"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        {!file ? (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Upload className="w-8 h-8" />
            <span className="font-medium">
              Klik untuk upload bukti transfer
            </span>
            <span className="text-xs">.jpg, .jpeg, .png, .pdf - maks 5MB</span>
          </button>
        ) : (
          <div className="border border-border rounded-2xl p-4 flex items-center gap-4">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
                onUpdate({ buktiTransfer: null });
              }}
              aria-label="remove file"
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2"
          disabled={submitting}
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!file || submitting}
          className="bg-primary text-primary-foreground font-semibold min-w-[180px]"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Memproses...
            </>
          ) : (
            "Kirim Booking"
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepCheckout;
