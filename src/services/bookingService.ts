interface SubmitBookingParams {
  nama: string;
  whatsapp: string;
  titikJemput: string;
  catatan: string;
  packageId: string;
  date: string;
  timeSlot: string;
  buktiTransfer: File | null;
  website?: string;
}

interface SubmitBookingResult {
  bookingCode: string;
  success: boolean;
}

export const submitBooking = async (
  params: SubmitBookingParams,
): Promise<SubmitBookingResult> => {
  const formData = new FormData();
  formData.set("nama", params.nama);
  formData.set("whatsapp", params.whatsapp);
  formData.set("titikJemput", params.titikJemput);
  formData.set("catatan", params.catatan);
  formData.set("packageId", params.packageId);
  formData.set("date", params.date);
  formData.set("timeSlot", params.timeSlot);
  formData.set("website", params.website ?? "");

  if (params.buktiTransfer) {
    formData.set("buktiTransfer", params.buktiTransfer);
  }

  const response = await fetch("/api/booking", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json().catch(() => null)) as
    | { success?: boolean; bookingCode?: string; message?: string }
    | null;

  if (!response.ok || !result?.success || !result.bookingCode) {
    throw new Error(
      result?.message ??
        "Booking gagal diproses. Silakan coba lagi atau hubungi admin via WhatsApp.",
    );
  }

  return {
    bookingCode: result.bookingCode,
    success: true,
  };
};
