import type { Booking, Slot } from "./types";

export async function getSlots(signal?: AbortSignal): Promise<Slot[]> {
  const res = await fetch("/slots.json", { signal });
  if (!res.ok) throw new Error(`Could not load times (HTTP ${res.status}).`);
  const data: unknown = await res.json();
  if (!Array.isArray(data)) throw new Error("Unexpected response from the server.");
  return data as Slot[];
}

/** The mail API key lives only on the server (api/book.ts). The browser never sees it. */
export async function sendBooking(booking: Booking): Promise<void> {
  const res = await fetch("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Booking failed. Please try again.");
  }
}
