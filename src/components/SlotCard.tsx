import type { Slot } from "../types";
import { formatPrice } from "../format";

type Props = { slot: Slot; selected: boolean; onPick: (id: string) => void };

export function SlotCard({ slot, selected, onPick }: Props) {
  return (
    <button className={selected ? "slot slot--on" : "slot"} onClick={() => onPick(slot.id)}>
      <span className="slot__day">{slot.day}</span>
      <span className="slot__time">{slot.time}</span>
      <span className="slot__service">{slot.service} · {slot.minutes} min</span>
      <span className="slot__price">{formatPrice(slot.price)}</span>
      <span className="slot__left">{slot.spotsLeft} spots left</span>
    </button>
  );
}
