import { useState } from "react";
import { sendBooking } from "../api";
import { validateBooking, type BookingErrors } from "../lib/validate";

type Status = "idle" | "sending" | "done" | "failed";

export function BookingForm({ slotId, summary }: { slotId: string | null; summary?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<BookingErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const booking = { slotId: slotId ?? "", name, email, note };
    const found = validateBooking(booking);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    setServerError("");
    try {
      await sendBooking(booking);
      setStatus("done");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Booking failed. Please try again.");
      setStatus("failed");
    }
  }

  if (status === "done") {
    return (
      <div className="form form--done" role="status">
        <h2>You are booked in</h2>
        {summary && <p className="form__summary">{summary}</p>}
        <p>We sent a confirmation to {email.trim()}.</p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <h2>Your details</h2>
      {errors.slotId && <p className="field__error" role="alert">{errors.slotId}</p>}
      <div className="form__row">
        <label className="field">
          <span>Full name</span>
          <input name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
          {errors.name && <span id="name-error" className="field__error" role="alert">{errors.name}</span>}
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
          {errors.email && <span id="email-error" className="field__error" role="alert">{errors.email}</span>}
        </label>
      </div>
      <label className="field">
        <span>Anything we should know? <em>(optional)</em></span>
        <textarea name="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
      </label>
      {serverError && <p className="form__fail" role="alert">{serverError}</p>}
      <button type="submit" className="cta" disabled={status === "sending"}>
        {status === "sending" ? "Booking..." : "Confirm booking"}
      </button>
    </form>
  );
}
