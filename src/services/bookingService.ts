import { supabase } from "@/integrations/supabase/client";

interface SubmitBookingParams {
  // Student info
  nama: string;
  whatsapp: string;
  titikJemput: string;
  catatan: string;
  // Package info
  packageId: string;
  totalPrice: number;
  totalSessions: number;
  // Schedule chosen by student
  date: Date;
  timeSlot: string; // format "HH:mm", e.g. "08:00"
  // Payment proof
  buktiTransfer: File | null;
}

interface SubmitBookingResult {
  bookingId: string;
  success: boolean;
}

/**
 * Build a datetime string (ISO 8601) from a Date and an "HH:mm" time string.
 * Duration is fixed at 1.5 hours per session.
 */
function buildSessionTimes(
  date: Date,
  timeSlot: string,
): { start_time: string; end_time: string } {
  const [hours, minutes] = timeSlot.split(":").map(Number);
  const start = new Date(date);
  start.setHours(hours, minutes, 0, 0);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 90); // 1.5-hour session
  return {
    start_time: start.toISOString(),
    end_time: end.toISOString(),
  };
}

export async function submitBooking(
  params: SubmitBookingParams,
): Promise<SubmitBookingResult> {
  const {
    nama,
    whatsapp,
    titikJemput,
    catatan,
    packageId,
    totalPrice,
    totalSessions,
    date,
    timeSlot,
    buktiTransfer,
  } = params;

  // 1. Upsert student (match by phone_number)
  const { data: existingStudents, error: findError } = await supabase
    .from("students")
    .select("id")
    .eq("phone_number", whatsapp)
    .limit(1);

  if (findError)
    throw new Error(`Gagal mencari data siswa: ${findError.message}`);

  let studentId: string;

  if (existingStudents && existingStudents.length > 0) {
    studentId = existingStudents[0].id;
    // Update name and address if changed
    const { error: updateError } = await supabase
      .from("students")
      .update({ name: nama, pickup_address: titikJemput })
      .eq("id", studentId);
    if (updateError)
      throw new Error(`Gagal update data siswa: ${updateError.message}`);
  } else {
    const { data: newStudent, error: insertError } = await supabase
      .from("students")
      .insert({
        name: nama,
        phone_number: whatsapp,
        pickup_address: titikJemput,
      })
      .select("id")
      .single();

    if (insertError)
      throw new Error(`Gagal membuat data siswa: ${insertError.message}`);
    studentId = newStudent.id;
  }

  // 2. Create booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      student_id: studentId,
      package_id: packageId,
      total_price: totalPrice,
      status: "awaiting_payment",
      student_notes: catatan || null,
    })
    .select("id")
    .single();

  if (bookingError)
    throw new Error(`Gagal membuat booking: ${bookingError.message}`);

  // 3. Upload payment proof
  let proofUrl: string | null = null;

  if (buktiTransfer) {
    const fileExt = buktiTransfer.name.split(".").pop();
    const filePath = `payment-proofs/${booking.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, buktiTransfer, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      // Storage upload failed — still create payment without proof
      console.warn("Upload bukti transfer gagal:", uploadError.message);
    } else {
      const { data: urlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(filePath);
      proofUrl = urlData.publicUrl;
    }
  }

  // 4. Create payment record
  const { error: paymentError } = await supabase.from("payments").insert({
    booking_id: booking.id,
    amount: totalPrice,
    payment_method: "manual_transfer",
    proof_url: proofUrl,
    status: "pending",
  });

  if (paymentError)
    throw new Error(`Gagal membuat data pembayaran: ${paymentError.message}`);

  // 5. Create sessions
  // Session 1 uses the date/time chosen by the student.
  // Each subsequent session is scheduled exactly 7 days later
  // at the same time, as a placeholder that the admin can adjust.
  const sessionsToInsert = Array.from({ length: totalSessions }, (_, i) => {
    // Offset the base date by i * 7 days for each session
    const sessionDate = new Date(date);
    sessionDate.setDate(sessionDate.getDate() + i * 7);
    const { start_time, end_time } = buildSessionTimes(sessionDate, timeSlot);
    return {
      booking_id: booking.id,
      session_number: i + 1,
      start_time,
      end_time,
      status: "scheduled" as const,
    };
  });

  const { error: sessionsError } = await supabase
    .from("sessions")
    .insert(sessionsToInsert);

  if (sessionsError)
    throw new Error(`Gagal membuat jadwal sesi: ${sessionsError.message}`);

  return {
    bookingId: booking.id,
    success: true,
  };
}
