import { memo, useMemo, useState } from "react";
import {
  format,
  isBefore,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { id } from "date-fns/locale";
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMonthlyAvailability } from "@/hooks/useMonthlyAvailability";
import { ALL_TIME_SLOTS } from "@/components/booking/bookingData";

interface ScheduleCalendarPreviewProps {
  onBookingClick: () => void;
}

const getBookableStartDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const toDateKey = (date: Date): string => format(date, "yyyy-MM-dd");

const ScheduleCalendarPreview = ({
  onBookingClick,
}: ScheduleCalendarPreviewProps) => {
  const bookableStartDate = useMemo(() => getBookableStartDate(), []);
  const [visibleMonth, setVisibleMonth] = useState(
    startOfMonth(bookableStartDate),
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    bookableStartDate,
  );

  const { data, availabilityByDate, isLoading, isError } =
    useMonthlyAvailability(visibleMonth);

  const selectedDateKey = selectedDate ? toDateKey(selectedDate) : "";
  const selectedAvailability = selectedDateKey
    ? availabilityByDate.get(selectedDateKey)
    : undefined;

  const monthStats = useMemo(() => {
    const bookableDateKey = toDateKey(bookableStartDate);
    const bookableDates = data.filter((item) => item.date >= bookableDateKey);
    const availableDays = bookableDates.filter(
      (item) => item.availableSlots.length > 0,
    ).length;
    const fullyBookedDays = bookableDates.filter(
      (item) => item.isFullyBooked,
    ).length;
    const availableSlots = bookableDates.reduce(
      (total, item) => total + item.availableSlots.length,
      0,
    );

    return { availableDays, fullyBookedDays, availableSlots };
  }, [bookableStartDate, data]);

  const getDateAvailability = (date: Date) => {
    if (
      isBefore(startOfDay(date), bookableStartDate) ||
      !isSameMonth(date, visibleMonth)
    ) {
      return undefined;
    }

    return availabilityByDate.get(toDateKey(date));
  };

  const handleMonthChange = (month: Date): void => {
    setVisibleMonth(month);

    if (selectedDate && isSameMonth(selectedDate, month)) {
      return;
    }

    const monthStart = startOfMonth(month);
    setSelectedDate(
      isBefore(monthStart, bookableStartDate) ? bookableStartDate : monthStart,
    );
  };

  const selectedIsBookable =
    selectedDate && !isBefore(startOfDay(selectedDate), bookableStartDate);

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card md:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">
            Kalender Ketersediaan
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs sm:min-w-72">
          <div className="rounded-lg bg-primary/10 px-2 py-2">
            <span className="block font-bold text-primary">
              {isLoading ? "-" : monthStats.availableDays}
            </span>
            <span className="text-muted-foreground">Tanggal</span>
          </div>
          <div className="rounded-lg bg-accent/10 px-2 py-2">
            <span className="block font-bold text-accent">
              {isLoading ? "-" : monthStats.availableSlots}
            </span>
            <span className="text-muted-foreground">Slot</span>
          </div>
          <div className="rounded-lg bg-destructive/10 px-2 py-2">
            <span className="block font-bold text-destructive">
              {isLoading ? "-" : monthStats.fullyBookedDays}
            </span>
            <span className="text-muted-foreground">Penuh</span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.85fr)]">
        <div className="min-w-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            month={visibleMonth}
            onMonthChange={handleMonthChange}
            onSelect={setSelectedDate}
            showOutsideDays={false}
            disabled={(date) => isBefore(startOfDay(date), bookableStartDate)}
            locale={id}
            className="mx-auto w-fit rounded-xl border bg-background p-3"
            modifiers={{
              available: (date) => {
                const availability = getDateAvailability(date);
                return (
                  !!availability &&
                  availability.availableSlots.length === ALL_TIME_SLOTS.length
                );
              },
              limited: (date) => {
                const availability = getDateAvailability(date);
                return (
                  !!availability &&
                  availability.availableSlots.length > 0 &&
                  availability.availableSlots.length < ALL_TIME_SLOTS.length
                );
              },
              booked: (date) => {
                const availability = getDateAvailability(date);
                return !!availability?.isFullyBooked;
              },
            }}
            modifiersClassNames={{
              available:
                "after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-accent",
              limited:
                "after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-highlight",
              booked:
                "text-muted-foreground line-through after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-destructive",
            }}
          />

          <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              Tersedia penuh
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-highlight" />
              Sebagian terisi
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
              Penuh
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-4">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Detail tanggal</p>
              <h4 className="font-semibold text-foreground">
                {selectedDate
                  ? format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })
                  : "Pilih tanggal"}
              </h4>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Memuat jadwal bulan ini...
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mb-2 h-4 w-4" />
              Gagal memuat data jadwal. Silakan refresh halaman atau lanjut
              booking untuk memilih tanggal.
            </div>
          ) : !selectedDate || !selectedIsBookable ? (
            <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
              Pilih tanggal mulai besok untuk melihat jam yang sudah booking dan
              jam yang masih available.
            </div>
          ) : (
            <div className="space-y-3">
              {ALL_TIME_SLOTS.map((slot) => {
                const isBooked =
                  selectedAvailability?.unavailableSlots.includes(slot.time) ??
                  false;

                return (
                  <div
                    key={slot.time}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm",
                      isBooked
                        ? "border-destructive/25 bg-destructive/10 text-muted-foreground"
                        : "border-accent/25 bg-accent/10 text-foreground",
                    )}
                  >
                    <span className="font-medium">{slot.label}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
                        isBooked
                          ? "bg-destructive/15 text-destructive"
                          : "bg-accent/15 text-accent",
                      )}
                    >
                      {!isBooked && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {isBooked ? "Terbooking" : "Available"}
                    </span>
                  </div>
                );
              })}

              <Button
                className="mt-2 w-full bg-primary text-primary-foreground"
                onClick={onBookingClick}
                disabled={!selectedAvailability?.isAvailable}
              >
                Booking Jadwal Ini
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ScheduleCalendarPreview);
