import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "../src/integrations/supabase/types.js";

export const config = {
  runtime: "edge",
};

const ACTIVE_SESSION_STATUSES = ["tentative", "scheduled"] as const;
const LEGACY_ACTIVE_SESSION_STATUSES = ["scheduled"] as const;
const ALL_TIME_SLOTS = ["08:00", "10:00", "13:00", "15:00"] as const;

const dailyAvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const monthlyAvailabilitySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
});

type SessionSlot = {
  session_date?: string | null;
  start_time: string | null;
};

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

const getJakartaMonthRange = (
  monthKey: string,
): { monthStart: string; monthEnd: string; dateKeys: string[] } => {
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lastDateKey = `${monthKey}-${String(daysInMonth).padStart(2, "0")}`;
  const dateKeys = Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return `${monthKey}-${day}`;
  });

  return {
    monthStart: new Date(`${monthKey}-01T00:00:00.000+07:00`).toISOString(),
    monthEnd: new Date(`${lastDateKey}T23:59:59.999+07:00`).toISOString(),
    dateKeys,
  };
};

const toJakartaDateKey = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
};

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
  ALL_TIME_SLOTS.filter((slot) =>
    sessions.some((session) =>
      typeof session.start_time === "string"
        ? toSlotTime(session.start_time) === slot
        : false,
    ),
  );

const mapMonthlyAvailability = (dateKeys: string[], sessions: SessionSlot[]) => {
  const slotsByDate = new Map<string, Set<string>>();

  for (const dateKey of dateKeys) {
    slotsByDate.set(dateKey, new Set<string>());
  }

  for (const session of sessions) {
    const dateKey =
      typeof session.session_date === "string" && session.session_date.length > 0
        ? session.session_date
        : typeof session.start_time === "string"
          ? toJakartaDateKey(session.start_time)
          : "";

    const slot =
      typeof session.start_time === "string"
        ? toSlotTime(session.start_time)
        : "";

    if (
      slotsByDate.has(dateKey) &&
      ALL_TIME_SLOTS.includes(slot as (typeof ALL_TIME_SLOTS)[number])
    ) {
      slotsByDate.get(dateKey)?.add(slot);
    }
  }

  return dateKeys.map((dateKey) => {
    const unavailableSlots = ALL_TIME_SLOTS.filter((slot) =>
      slotsByDate.get(dateKey)?.has(slot),
    );
    const availableSlots = ALL_TIME_SLOTS.filter(
      (slot) => !slotsByDate.get(dateKey)?.has(slot),
    );

    return {
      date: dateKey,
      unavailableSlots,
      availableSlots,
      isAvailable: availableSlots.length > 0,
      isFullyBooked: availableSlots.length === 0,
    };
  });
};

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
  const dailyParsed = dailyAvailabilitySchema.safeParse({
    date: requestUrl.searchParams.get("date"),
  });
  const monthlyParsed = monthlyAvailabilitySchema.safeParse({
    month: requestUrl.searchParams.get("month"),
  });

  if (!dailyParsed.success && !monthlyParsed.success) {
    return json({ message: "Tanggal tidak valid." }, 400);
  }

  try {
    const supabase = getSupabaseServerClient();

    if (monthlyParsed.success) {
      const { monthStart, monthEnd, dateKeys } = getJakartaMonthRange(
        monthlyParsed.data.month,
      );
      const firstDateKey = dateKeys[0];
      const lastDateKey = dateKeys[dateKeys.length - 1];
      const { data, error } = await supabase
        .from("sessions")
        .select("session_date,start_time")
        .gte("session_date", firstDateKey)
        .lte("session_date", lastDateKey)
        .in("status", [...ACTIVE_SESSION_STATUSES]);

      if (error) {
        if (isMissingSessionDateError(error)) {
          const { data: legacyData, error: legacyError } = await supabase
            .from("sessions")
            .select("start_time")
            .gte("start_time", monthStart)
            .lte("start_time", monthEnd)
            .in("status", [...LEGACY_ACTIVE_SESSION_STATUSES]);

          if (legacyError) {
            throw legacyError;
          }

          return json({
            month: monthlyParsed.data.month,
            dates: mapMonthlyAvailability(dateKeys, legacyData ?? []),
          });
        }

        throw error;
      }

      return json({
        month: monthlyParsed.data.month,
        dates: mapMonthlyAvailability(dateKeys, data ?? []),
      });
    }

    if (!dailyParsed.success) {
      return json({ message: "Tanggal tidak valid." }, 400);
    }

    const { data, error } = await supabase
      .from("sessions")
      .select("start_time")
      .eq("session_date", dailyParsed.data.date)
      .in("status", [...ACTIVE_SESSION_STATUSES]);

    if (error) {
      if (isMissingSessionDateError(error)) {
        const { dayStart, dayEnd } = getJakartaDayRange(dailyParsed.data.date);
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
