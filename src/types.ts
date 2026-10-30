export type Slot = {
  id: string;
  day: string;
  time: string;
  service: string;
  minutes: number;
  price: number;
  left: number;
};

export type Booking = {
  slotId: string;
  name: string;
  email: string;
  note: string;
};
