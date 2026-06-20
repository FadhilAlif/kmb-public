import { useEffect, useState } from "react";
import { format } from "date-fns";

const fetchAvailabilityFromApi = async (
  dateKey: string,
  signal: AbortSignal,
): Promise<string[]> => {
  const response = await fetch(`/api/availability?date=${dateKey}`, {
    signal,
  });
  const result = (await response.json()) as {
    unavailableSlots?: string[];
    message?: string;
  };

  if (!response.ok) {
    throw new Error(result.message ?? "Gagal memeriksa ketersediaan.");
  }

  return result.unavailableSlots ?? [];
};

export const useBookedSlots = (date: Date | undefined) => {
  const [data, setData] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!date) {
      setData(new Set());
      return;
    }

    const controller = new AbortController();

    const fetchBookedSlots = async (): Promise<void> => {
      setIsLoading(true);
      setIsError(false);

      try {
        const dateKey = format(date, "yyyy-MM-dd");
        const unavailableSlots = await fetchAvailabilityFromApi(
          dateKey,
          controller.signal,
        );

        setData(new Set(unavailableSlots));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setIsError(true);
        setData(new Set());
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchBookedSlots();

    return () => controller.abort();
  }, [date]);

  return { data, isLoading, isError };
};
