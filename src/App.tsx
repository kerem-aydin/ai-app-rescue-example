import { useCallback, useEffect, useState } from "react";
import { getSlots } from "./api";
import type { Slot } from "./types";
import { SlotCard } from "./components/SlotCard";
import { BookingForm } from "./components/BookingForm";

type Load = { state: "loading" } | { state: "error"; message: string } | { state: "ready"; slots: Slot[] };

export default function App() {
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [selected, setSelected] = useState<string | null>(null);

  const fetchSlots = useCallback((signal?: AbortSignal) => {
    setLoad({ state: "loading" });
    getSlots(signal)
      .then((slots) => setLoad({ state: "ready", slots }))
      .catch((err: unknown) => {
        if (signal?.aborted) return;
        setLoad({ state: "error", message: err instanceof Error ? err.message : "Could not load times." });
      });
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchSlots(ctrl.signal);
    return () => ctrl.abort();
  }, [fetchSlots]);

  return (
    <div className="page">
      <header className="top">
        <div className="logo">Slotwise</div>
        <nav className="nav" aria-label="Main">
          <a href="#services">Services</a>
          <a href="#team">Team</a>
          <a href="#prices">Prices</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <main>
        <h1>Book your next visit</h1>
        <p className="lead">Pick a free slot and we will save it for you.</p>

        {load.state === "loading" && (
          <div className="grid" aria-busy="true" aria-label="Loading times">
            {Array.from({ length: 6 }, (_, i) => <div key={i} className="slot skeleton" />)}
          </div>
        )}
        {load.state === "error" && (
          <div className="notice" role="alert">
            <p>{load.message}</p>
            <button type="button" className="ghost" onClick={() => fetchSlots()}>Try again</button>
          </div>
        )}
        {load.state === "ready" && load.slots.length === 0 && (
          <p className="notice">No free times this week. Check back tomorrow.</p>
        )}
        {load.state === "ready" && load.slots.length > 0 && (
          <div className="grid">
            {load.slots.map((s) => (
              <SlotCard key={s.id} slot={s} selected={selected === s.id} onPick={setSelected} />
            ))}
          </div>
        )}

        <BookingForm slotId={selected} />
      </main>
    </div>
  );
}
