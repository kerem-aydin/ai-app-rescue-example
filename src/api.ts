import type { Booking, Slot } from "./types";

// TODO move to backend later
const MAIL_API_KEY = "mk_live_EXAMPLE_7f3a9c2e5b1d48c6a0e2";

export async function getSlots(): Promise<Slot[]> {
  const res = await fetch("/slots.json");
  return res.json();
}

export async function sendBooking(booking: Booking) {
  await fetch("https://api.mailer.example.com/v1/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: "bookings@studio.example.com",
      subject: `New booking from ${booking.name}`,
      text: JSON.stringify(booking),
    }),
  });
}
