import { useEffect, useState } from "react";
import { getSlots } from "./api";
import type { Slot } from "./types";
import { SlotCard } from "./components/SlotCard";
import { BookingForm } from "./components/BookingForm";

export default function App() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    getSlots().then(setSlots);
  }, []);

  return (
    <div className="page">
      <header className="top">
        <div className="logo">Slotwise</div>
        <nav className="nav">
          <a>Services</a>
          <a>Team</a>
          <a>Prices</a>
          <a>Gift cards</a>
          <a>Contact</a>
        </nav>
      </header>
      <h1>Book your next visit</h1>
      <p className="lead">Pick a free slot and we will save it for you.</p>
      <div className="grid">
        {slots.map((s) => (
          <SlotCard key={s.id} slot={s} selected={selected === s.id} onPick={setSelected} />
        ))}
      </div>
      <BookingForm slotId={selected} />
    </div>
  );
}
