import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "../src/integrations/supabase/types.js";

export const config = {
  runtime: "edge",
};

const ACTIVE_SESSION_STATUSES = ["tentative", "scheduled"] as const;
const LEGACY_ACTIVE_SESSION_STATUSES = ["scheduled"] as const;

const availabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const isMissingSessionDateError = (error: { code?: string } | null): boolean =>
  error?.code === "42703";

const getJakartaDayRange = (
  dateKey: string,
): { dayStart: string; dayEnd: string } => ({
  dayStart: new Date(`${dateKey}T00:00:00.000+07:00`).toISOString(),
  dayEnd: new Date(`${dateKey}T23:59:59.999+07:00`).toISOString(),
});

const toSlotTime = (value: string): string => {
  if (/^\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 5);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(date);
};

const mapUnavailableSlots = (
  sessions: Array<{ start_time: string | null }>,
): string[] =>
  sessions
    .map((session) =>
      typeof session.start_time === "string"
        ? toSlotTime(session.start_time)
        : "",
    )
    .filter(Boolean);

const getSupabaseServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const apiKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !apiKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return createClient<Database>(supabaseUrl, apiKey, {
    auth: { persistSession: false },
  });
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return json({ message: "Method not allowed" }, 405);
  }

  const requestUrl = new URL(request.url);
  const parsed = availabilitySchema.safeParse({
    date: requestUrl.searchParams.get("date"),
  });

  if (!parsed.success) {
    return json({ message: "Tanggal tidak valid." }, 400);
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("sessions")
      .select("start_time")
      .eq("session_date", parsed.data.date)
      .in("status", [...ACTIVE_SESSION_STATUSES]);

    if (error) {
      if (isMissingSessionDateError(error)) {
        const { dayStart, dayEnd } = getJakartaDayRange(parsed.data.date);
        const { data: legacyData, error: legacyError } = await supabase
          .from("sessions")
          .select("start_time")
          .gte("start_time", dayStart)
          .lte("start_time", dayEnd)
          .in("status", [...LEGACY_ACTIVE_SESSION_STATUSES]);

        if (legacyError) {
          throw legacyError;
        }

        return json({
          unavailableSlots: mapUnavailableSlots(legacyData ?? []),
        });
      }

      throw error;
    }

    const unavailableSlots = mapUnavailableSlots(data ?? []);

    return json({ unavailableSlots });
  } catch (error) {
    console.error("availability_error", error);
    return json({ message: "Gagal memeriksa ketersediaan jadwal." }, 500);
  }
}
