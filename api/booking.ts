import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "../src/integrations/supabase/types";

export const config = {
  runtime: "edge",
};

const ALLOWED_TIME_SLOTS = ["08:00", "10:00", "13:00", "15:00"] as const;
const ACTIVE_SESSION_STATUSES = ["tentative", "scheduled"] as const;
const ALLOWED_FILE_TYPES = new Map([
  ["image/jpeg", ["jpg", "jpeg"]],
  ["image/png", ["png"]],
  ["application/pdf", ["pdf"]],
]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BOOKING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const RATE_LIMIT_MESSAGE =
  "Terlalu banyak percobaan booking. Silakan coba lagi beberapa saat nanti atau hubungi admin melalui WhatsApp.";

type SupabaseAdmin = ReturnType<typeof createClient<Database>>;

interface BookingNotificationPayload {
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  packageName: string;
  date: string;
  timeSlot: string;
  pickupAddress: string;
  notes: string;
}

const bookingSchema = z.object({
  nama: z.string().trim().min(3).max(100),
  whatsapp: z
    .string()
    .trim()
    .regex(/^(08|\+62|62)\d{8,13}$/),
  titikJemput: z.string().trim().min(5).max(200),
  catatan: z.string().trim().max(500).optional().default(""),
  packageId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.enum(ALLOWED_TIME_SLOTS),
  website: z.string().optional().default(""),
});

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const getRequiredServerEnv = (
  canonicalName: string,
  aliases: string[] = [],
): string => {
  const value = [canonicalName, ...aliases]
    .map((key) => process.env[key])
    .find((item) => item && item.trim().length > 0);

  if (!value) {
    throw new Error(
      `Missing required server environment variable: ${canonicalName}`,
    );
  }

  return value;
};

const getSupabaseAdmin = (): SupabaseAdmin => {
  const supabaseUrl = getRequiredServerEnv("SUPABASE_URL", [
    "VITE_SUPABASE_URL",
  ]);
  const serviceRoleKey = getRequiredServerEnv("SUPABASE_SERVICE_ROLE_KEY", [
    "VITE_SUPABASE_SERVICE_ROLE_KEY",
  ]);

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
};

const getJakartaDateKey = (date = new Date()): string => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
};

const getTomorrowJakartaDateKey = (): string => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return getJakartaDateKey(tomorrow);
};

const normalizeWhatsApp = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  return digits;
};

const getFileExtension = (fileName: string): string => {
  const extension = fileName.split(".").pop();
  return extension?.toLowerCase() ?? "";
};

const validatePaymentProof = (file: File): string | null => {
  if (file.size === 0) {
    return "File bukti pembayaran kosong.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File bukti pembayaran maksimal 5MB.";
  }

  const allowedExtensions = ALLOWED_FILE_TYPES.get(file.type);
  if (!allowedExtensions) {
    return "Format bukti pembayaran harus JPG, PNG, atau PDF.";
  }

  if (!allowedExtensions.includes(getFileExtension(file.name))) {
    return "Ekstensi file bukti pembayaran tidak sesuai.";
  }

  return null;
};

const getClientIp = (request: Request): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
};

const getMemoryRateLimitStore = (): Map<string, { attempts: number; resetAt: number }> => {
  const globalState = globalThis as typeof globalThis & {
    __kmbBookingRateLimit?: Map<string, { attempts: number; resetAt: number }>;
  };

  globalState.__kmbBookingRateLimit ??= new Map();
  return globalState.__kmbBookingRateLimit;
};

const checkMemoryRateLimit = (identifier: string): boolean => {
  const store = getMemoryRateLimitStore();
  const key = `ip:${identifier}`;
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { attempts: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }

  if (current.attempts >= 5) {
    return false;
  }

  current.attempts += 1;
  return true;
};

const checkIpRateLimit = async (
  supabase: SupabaseAdmin,
  ipAddress: string,
): Promise<boolean> => {
  const windowStart = new Date();
  windowStart.setUTCMinutes(0, 0, 0);

  const payload = {
    scope: "ip",
    identifier: ipAddress,
    window_start: windowStart.toISOString(),
  };

  const { data, error } = await supabase
    .from("booking_rate_limits")
    .select("id, attempts")
    .match(payload)
    .maybeSingle();

  if (error) {
    console.warn("booking_rate_limits_unavailable", error.message);
    return checkMemoryRateLimit(ipAddress);
  }

  if (!data) {
    const { error: insertError } = await supabase
      .from("booking_rate_limits")
      .insert({ ...payload, attempts: 1 });

    if (insertError) {
      console.warn("booking_rate_limit_insert_failed", insertError.message);
      return checkMemoryRateLimit(ipAddress);
    }

    return true;
  }

  if (data.attempts >= 5) {
    return false;
  }

  const { error: updateError } = await supabase
    .from("booking_rate_limits")
    .update({ attempts: data.attempts + 1 })
    .eq("id", data.id);

  if (updateError) {
    console.warn("booking_rate_limit_update_failed", updateError.message);
    return checkMemoryRateLimit(ipAddress);
  }

  return true;
};

const ensureWhatsAppLimit = async (
  supabase: SupabaseAdmin,
  phoneNumber: string,
): Promise<boolean> => {
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("phone_number", phoneNumber)
    .maybeSingle();

  if (studentError) {
    throw studentError;
  }

  if (!student) {
    return true;
  }

  const createdAfter = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("student_id", student.id)
    .eq("status", "pending_verification")
    .gte("created_at", createdAfter);

  if (error) {
    throw error;
  }

  return (count ?? 0) < 3;
};

const isSlotAvailable = async (
  supabase: SupabaseAdmin,
  date: string,
  timeSlot: string,
): Promise<boolean> => {
  const { count, error } = await supabase
    .from("sessions")
    .select("id", { count: "exact", head: true })
    .eq("session_date", date)
    .eq("start_time", `${timeSlot}:00`)
    .in("status", [...ACTIVE_SESSION_STATUSES]);

  if (error) {
    throw error;
  }

  return (count ?? 0) === 0;
};

const generateSuffix = (): string => {
  const randomBytes = new Uint8Array(3);
  crypto.getRandomValues(randomBytes);

  return Array.from(randomBytes)
    .map((byte) => BOOKING_CODE_ALPHABET[byte % BOOKING_CODE_ALPHABET.length])
    .join("");
};

const generateBookingCode = async (supabase: SupabaseAdmin): Promise<string> => {
  const datePart = getJakartaDateKey().replaceAll("-", "");

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = `KMB-${datePart}-${generateSuffix()}`;
    const { count, error } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("booking_code", code);

    if (error) {
      throw error;
    }

    if ((count ?? 0) === 0) {
      return code;
    }
  }

  throw new Error("Failed to generate unique booking code.");
};

const sanitizeFileName = (fileName: string): string =>
  fileName
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_") || "payment-proof";

const notifyBooking = async (
  payload: BookingNotificationPayload,
): Promise<void> => {
  const webhookUrl = process.env.BOOKING_NOTIFY_WEBHOOK_URL;
  if (!webhookUrl) return;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Notification failed with ${response.status}`);
  }
};

export default async function handler(request: Request): Promise<Response> {
  const requestId = crypto.randomUUID();

  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  try {
    const formData = await request.formData();
    const parsed = bookingSchema.safeParse({
      nama: formData.get("nama"),
      whatsapp: formData.get("whatsapp"),
      titikJemput: formData.get("titikJemput"),
      catatan: formData.get("catatan") ?? "",
      packageId: formData.get("packageId"),
      date: formData.get("date"),
      timeSlot: formData.get("timeSlot"),
      website: formData.get("website") ?? "",
    });

    if (!parsed.success) {
      return json(
        {
          message:
            "Data booking tidak valid. Periksa kembali nama, WhatsApp, titik jemput, jadwal, dan paket.",
        },
        400,
      );
    }

    if (parsed.data.website.trim().length > 0) {
      return json({ message: "Booking tidak dapat diproses." }, 400);
    }

    const proof = formData.get("buktiTransfer");
    if (!(proof instanceof File)) {
      return json({ message: "Bukti pembayaran wajib diupload." }, 400);
    }

    const proofError = validatePaymentProof(proof);
    if (proofError) {
      return json({ message: proofError }, 400);
    }

    if (parsed.data.date < getTomorrowJakartaDateKey()) {
      return json(
        { message: "Tanggal booking paling cepat adalah besok." },
        400,
      );
    }

    const supabase = getSupabaseAdmin();
    const ipAllowed = await checkIpRateLimit(supabase, getClientIp(request));
    if (!ipAllowed) {
      return json({ message: RATE_LIMIT_MESSAGE }, 429);
    }

    const normalizedWhatsApp = normalizeWhatsApp(parsed.data.whatsapp);
    const phoneAllowed = await ensureWhatsAppLimit(supabase, normalizedWhatsApp);
    if (!phoneAllowed) {
      return json({ message: RATE_LIMIT_MESSAGE }, 429);
    }

    const { data: selectedPackage, error: packageError } = await supabase
      .from("packages")
      .select("id, name, price, total_sessions, is_active")
      .eq("id", parsed.data.packageId)
      .eq("is_active", true)
      .maybeSingle();

    if (packageError) {
      throw packageError;
    }

    if (!selectedPackage) {
      return json({ message: "Paket tidak tersedia." }, 400);
    }

    const slotAvailable = await isSlotAvailable(
      supabase,
      parsed.data.date,
      parsed.data.timeSlot,
    );

    if (!slotAvailable) {
      return json(
        {
          message:
            "Slot jadwal tersebut baru saja terisi. Silakan pilih slot lain.",
        },
        409,
      );
    }

    const bookingCode = await generateBookingCode(supabase);
    const now = new Date().toISOString();

    const { data: existingStudent, error: findStudentError } = await supabase
      .from("students")
      .select("id")
      .eq("phone_number", normalizedWhatsApp)
      .maybeSingle();

    if (findStudentError) {
      throw findStudentError;
    }

    let studentId = existingStudent?.id;

    if (studentId) {
      const { error: updateStudentError } = await supabase
        .from("students")
        .update({
          name: parsed.data.nama,
          pickup_address: parsed.data.titikJemput,
          updated_at: now,
        })
        .eq("id", studentId);

      if (updateStudentError) {
        throw updateStudentError;
      }
    } else {
      const { data: newStudent, error: insertStudentError } = await supabase
        .from("students")
        .insert({
          name: parsed.data.nama,
          phone_number: normalizedWhatsApp,
          pickup_address: parsed.data.titikJemput,
        })
        .select("id")
        .single();

      if (insertStudentError) {
        throw insertStudentError;
      }

      studentId = newStudent.id;
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        booking_code: bookingCode,
        student_id: studentId,
        package_id: selectedPackage.id,
        total_price: selectedPackage.price,
        status: "pending_verification",
        notes: parsed.data.catatan || null,
      })
      .select("id")
      .single();

    if (bookingError) {
      throw bookingError;
    }

    const safeFileName = sanitizeFileName(proof.name);
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    const proofPath = `${booking.id}/${timestamp}_${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(proofPath, proof, {
        contentType: proof.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("payment_proof_upload_failed", {
        requestId,
        bookingCode,
        message: uploadError.message,
      });
      return json(
        {
          message:
            "Upload bukti pembayaran gagal. Silakan coba lagi sebelum submit ulang.",
        },
        500,
      );
    }

    const { error: paymentError } = await supabase.from("payments").insert({
      booking_id: booking.id,
      amount: selectedPackage.price,
      method: "manual_transfer",
      status: "pending_verification",
      proof_path: proofPath,
    });

    if (paymentError) {
      throw paymentError;
    }

    const { error: sessionError } = await supabase.from("sessions").insert({
      booking_id: booking.id,
      session_number: 1,
      session_date: parsed.data.date,
      start_time: `${parsed.data.timeSlot}:00`,
      duration_minutes: 90,
      status: "tentative",
    });

    if (sessionError) {
      throw sessionError;
    }

    notifyBooking({
      bookingCode,
      customerName: parsed.data.nama,
      customerPhone: normalizedWhatsApp,
      packageName: selectedPackage.name,
      date: parsed.data.date,
      timeSlot: parsed.data.timeSlot,
      pickupAddress: parsed.data.titikJemput,
      notes: parsed.data.catatan || "-",
    }).catch((error) => {
      console.error("booking_notification_failed", {
        requestId,
        bookingCode,
        error,
      });
    });

    return json({ success: true, bookingCode });
  } catch (error) {
    console.error("booking_submission_failed", { requestId, error });
    return json(
      {
        message:
          "Booking gagal diproses. Silakan coba lagi atau hubungi admin melalui WhatsApp.",
      },
      500,
    );
  }
}
