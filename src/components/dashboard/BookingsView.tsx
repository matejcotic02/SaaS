import { useState, useMemo } from "react";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockBookings, type BookingRow } from "@/data/dashboardMockData";

export function BookingsView() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = useMemo(() => {
    if (!searchTerm.trim()) return mockBookings;
    const term = searchTerm.toLowerCase();
    return mockBookings.filter(
      (booking) =>
        booking.customerName.toLowerCase().includes(term) ||
        booking.customerPhone.toLowerCase().includes(term) ||
        booking.service.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          All Bookings
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          View and search all your appointment bookings.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-3 border-b border-white/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="relative flex-1 sm:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
              aria-hidden
            />
            <Input
              type="text"
              placeholder="Search by name, phone, service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-9"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            Filter by date
          </Button>
        </div>

        <div className="px-5 py-3 sm:px-6">
          <p className="text-sm font-medium text-foreground">
            {filteredBookings.length} Booking{filteredBookings.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="hidden min-h-0 overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-t border-white/5 text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Service</th>
                <th className="px-6 py-3 font-medium">Date &amp; Time</th>
                <th className="px-6 py-3 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.map((booking) => (
                <BookingTableRow key={booking.id} booking={booking} />
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-sm text-neutral-500"
                  >
                    No bookings found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ul className="divide-y divide-white/5 md:hidden">
          {filteredBookings.map((booking) => (
            <BookingMobileCard key={booking.id} booking={booking} />
          ))}
          {filteredBookings.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-neutral-500">
              No bookings found matching your search.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function BookingTableRow({ booking }: { booking: BookingRow }) {
  return (
    <tr className="transition-colors hover:bg-white/[0.02]">
      <td className="whitespace-nowrap px-6 py-4">
        <p className="font-medium text-foreground">{booking.customerName}</p>
        <p className="mt-0.5 text-xs text-neutral-500">{booking.customerPhone}</p>
      </td>
      <td className="px-6 py-4 text-neutral-300">{booking.service}</td>
      <td className="whitespace-nowrap px-6 py-4">
        <p className="text-neutral-300">{booking.date}</p>
        <p className="mt-0.5 text-xs text-primary">{booking.time}</p>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-primary">
        {booking.duration}
      </td>
    </tr>
  );
}

function BookingMobileCard({ booking }: { booking: BookingRow }) {
  return (
    <li className="space-y-2 px-5 py-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-foreground">{booking.customerName}</p>
          <p className="text-xs text-neutral-500">{booking.customerPhone}</p>
        </div>
        <span className="shrink-0 text-xs text-primary">{booking.duration}</span>
      </div>
      <p className="text-sm text-neutral-300">{booking.service}</p>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-400">{booking.date}</span>
        <span className="text-primary">{booking.time}</span>
      </div>
    </li>
  );
}
