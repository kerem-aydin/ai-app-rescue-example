import type { Booking } from "../types";

export type BookingErrors = Partial<Record<keyof Booking, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the form and the server function, so both apply the same rules. */
export function validateBooking(input: Partial<Booking>): BookingErrors {
  const errors: BookingErrors = {};
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const note = input.note ?? "";

  if (!input.slotId) errors.slotId = "Pick a time slot first.";
  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > 80) errors.name = "Name is too long.";
  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL.test(email)) errors.email = "This email address looks wrong.";
  if (note.length > 500) errors.note = "Keep the note under 500 characters.";
  return errors;
}
