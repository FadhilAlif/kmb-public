import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type BookingData } from "./bookingData";

const formSchema = z.object({
  nama: z.string().trim().min(3, "Nama minimal 3 karakter").max(100),
  whatsapp: z
    .string()
    .trim()
    .regex(/^(08|\+62|62)\d{8,13}$/, "Format nomor WA tidak valid (contoh: 08123456789)"),
  titikJemput: z.string().trim().min(5, "Titik jemput minimal 5 karakter").max(200),
  catatan: z.string().max(500).optional(),
});

interface StepDataDiriProps {
  data: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepDataDiri = ({ data, onUpdate, onNext, onBack }: StepDataDiriProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: data.nama,
      whatsapp: data.whatsapp,
      titikJemput: data.titikJemput,
      catatan: data.catatan,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onUpdate({
      nama: values.nama,
      whatsapp: values.whatsapp,
      titikJemput: values.titikJemput,
      catatan: values.catatan || "",
    });
    onNext();
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Data Diri</h2>
        <p className="text-muted-foreground">Lengkapi data untuk konfirmasi booking</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap *</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No WhatsApp *</FormLabel>
                <FormControl>
                  <Input placeholder="08123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="titikJemput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titik Jemput *</FormLabel>
                <FormControl>
                  <Input placeholder="Alamat lengkap titik jemput" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="catatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catatan Tambahan</FormLabel>
                <FormControl>
                  <Textarea placeholder="Catatan khusus (opsional)" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              Lanjutkan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StepDataDiri;
