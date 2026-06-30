import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

export interface DateAvailability {
  date: string;
  unavailableSlots: string[];
  availableSlots: string[];
  isAvailable: boolean;
  isFullyBooked: boolean;
}

interface MonthlyAvailabilityResponse {
  month?: string;
  dates?: DateAvailability[];
  message?: string;
}

const fetchMonthlyAvailability = async (
  monthKey: string,
  signal: AbortSignal,
): Promise<DateAvailability[]> => {
  const response = await fetch(`/api/availability?month=${monthKey}`, {
    signal,
  });
  const result = (await response.json()) as MonthlyAvailabilityResponse;

  if (!response.ok) {
    throw new Error(result.message ?? "Gagal memeriksa jadwal bulanan.");
  }

  return result.dates ?? [];
};

export const useMonthlyAvailability = (month: Date) => {
  const [data, setData] = useState<DateAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const monthKey = useMemo(() => format(month, "yyyy-MM"), [month]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSchedule = async (): Promise<void> => {
      setIsLoading(true);
      setIsError(false);

      try {
        const dates = await fetchMonthlyAvailability(monthKey, controller.signal);
        setData(dates);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setIsError(true);
        setData([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchSchedule();

    return () => controller.abort();
  }, [monthKey]);

  const availabilityByDate = useMemo(
    () => new Map(data.map((item) => [item.date, item])),
    [data],
  );

  return { data, availabilityByDate, isLoading, isError, monthKey };
};

