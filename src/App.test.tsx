import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import type { Slot } from "./types";

const slots: Slot[] = [
  { id: "s1", day: "Mon 3 Nov", time: "09:00", service: "Haircut", minutes: 45, price: 38, left: 2 },
  { id: "s5", day: "Wed 5 Nov", time: "16:00", service: "Colour", minutes: 90, price: 95, left: 0 },
];

const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

describe("App", () => {
  it("shows a loading state, then the slots with prices", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok(slots)));
    render(<App />);
    expect(screen.getByLabelText("Loading times")).toHaveAttribute("aria-busy", "true");
    expect(await screen.findByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("$38")).toBeInTheDocument();
    expect(screen.getByText("2 spots left")).toBeInTheDocument();
  });

  it("disables fully booked slots", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok(slots)));
    render(<App />);
    const full = await screen.findByRole("button", { name: /16:00/ });
    expect(full).toBeDisabled();
  });

  it("shows an error with a retry button when slots fail to load", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response("Internal Server Error", { status: 500 }))
      .mockResolvedValueOnce(ok(slots));
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    expect(await screen.findByText("Could not load times (HTTP 500).")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("09:00")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
