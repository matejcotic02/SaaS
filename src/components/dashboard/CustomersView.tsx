import { useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  History,
  Search,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockCustomers, type CustomerRow } from "@/data/dashboardMockData";

export function CustomersView() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return mockCustomers;
    const term = searchTerm.toLowerCase();

    return mockCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) ||
        customer.phone.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Customer Directory
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          View and manage your customers and their booking history.
        </p>
      </header>

      <section
        className="rounded-2xl border border-white/10 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        aria-label="Customer filters"
      >
        <div className="grid gap-3 border-b border-white/5 px-5 py-4 sm:px-6 lg:grid-cols-[1fr_auto]">
          <div className="relative min-w-0">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
              aria-hidden
            />
            <Input
              type="text"
              placeholder="Search by name, phone, email..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-10 pl-9"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            Filter by date
          </Button>
        </div>

        <div className="px-5 py-3 sm:px-6">
          <button
            type="button"
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Users className="h-3.5 w-3.5" aria-hidden />
            All Customers
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </section>

      <section
        className="rounded-2xl border border-white/10 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        aria-labelledby="customers-title"
      >
        <div className="border-b border-white/5 px-5 py-3 sm:px-6">
          <h2 id="customers-title" className="text-sm font-medium text-foreground">
            {filteredCustomers.length} Customer
            {filteredCustomers.length !== 1 ? "s" : ""}
          </h2>
        </div>

        <ul className="divide-y divide-white/5">
          {filteredCustomers.map((customer) => (
            <CustomerRowItem key={customer.id} customer={customer} />
          ))}
          {filteredCustomers.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-neutral-500">
              No customers found matching your search.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

function CustomerRowItem({ customer }: { customer: CustomerRow }) {
  return (
    <li className="grid gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
          <User className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {customer.name}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">{customer.phone}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
        <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5">
          <History className="h-3.5 w-3.5" aria-hidden />
          History
        </Button>
        <div className="text-xs text-neutral-400 lg:text-right">
          <p>Last booking</p>
          <p className="mt-0.5 text-neutral-300">{customer.lastBookingDate}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
          {customer.bookingCount} booking
          {customer.bookingCount !== 1 ? "s" : ""}
        </span>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-white/5 hover:text-foreground"
          aria-label={`Open ${customer.name}`}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}
