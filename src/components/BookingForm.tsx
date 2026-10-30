import { useState } from "react";
import { sendBooking } from "../api";

export function BookingForm({ slotId }: { slotId: string | null }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await sendBooking({ slotId: slotId ?? "", name, email, note });
    alert("Booked! See you soon.");
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>Your details</h2>
      <div className="form__row">
        <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <textarea placeholder="Anything we should know?" value={note} onChange={(e) => setNote(e.target.value)} />
      <button className="cta">Confirm booking</button>
    </form>
  );
}
