import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

/**
 * Returns the set of already-booked start times (format "HH:mm") for a given
 * date, by querying the `sessions` table.
 *
 * Only sessions with status "scheduled" or "completed" and belonging to
 * bookings that are NOT "canceled" are considered as blocking a slot.
 *
 * The query uses a date range in UTC that covers the full local day to handle
 * the UTC+7 offset stored in the DB timestamps.
 */
export const useBookedSlots = (date: Date | undefined) => {
  return useQuery({
    queryKey: ["booked-slots", date ? format(date, "yyyy-MM-dd") : null],
    enabled: !!date,
    staleTime: 30_000, // re-fetch at most every 30s
    queryFn: async (): Promise<Set<string>> => {
      if (!date) return new Set();

      // Build a UTC range that covers the entire local day (WIB = UTC+7).
      // We query start_time between midnight and midnight of the next day (local),
      // expressed as UTC timestamps.
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("sessions")
        .select(
          `
          start_time,
          status,
          booking:bookings!sessions_booking_id_fkey (
            status
          )
        `,
        )
        .in("status", ["scheduled", "completed"])
        .gte("start_time", dayStart.toISOString())
        .lte("start_time", dayEnd.toISOString());

      if (error) throw error;

      const blocked = new Set<string>();

      for (const session of data ?? []) {
        // Ignore sessions from canceled bookings
        const bookingStatus = (session.booking as { status: string } | null)
          ?.status;
        if (bookingStatus === "canceled") continue;

        // Extract local "HH:mm" from the ISO timestamp
        const localTime = new Date(session.start_time);
        const hh = String(localTime.getHours()).padStart(2, "0");
        const mm = String(localTime.getMinutes()).padStart(2, "0");
        blocked.add(`${hh}:${mm}`);
      }

      return blocked;
    },
  });
};
