import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "./BookingForm";

async function fillAndSend() {
  await userEvent.type(screen.getByLabelText("Full name"), "Maya Lee");
  await userEvent.type(screen.getByLabelText("Email"), "maya@example.com");
  await userEvent.click(screen.getByRole("button", { name: "Confirm booking" }));
}

describe("BookingForm", () => {
  it("does not send an empty form and explains what is missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<BookingForm slotId={null} />);
    await userEvent.click(screen.getByRole("button", { name: "Confirm booking" }));
    expect(screen.getByText("Pick a time slot first.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your email.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts to our own /api/book endpoint with no secret in the request", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<BookingForm slotId="s1" />);
    await fillAndSend();
    expect(await screen.findByText("You are booked in")).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/book");
    expect(JSON.stringify(init)).not.toMatch(/authorization|mk_live/i);
  });

  it("shows the server error and lets the user try again", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "Mail service unavailable. Please try again." }), { status: 502 }),
    ));
    render(<BookingForm slotId="s1" />);
    await fillAndSend();
    expect(await screen.findByText("Mail service unavailable. Please try again.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm booking" })).toBeEnabled();
  });

  it("blocks double submit while sending", async () => {
    let resolve!: (r: Response) => void;
    const fetchMock = vi.fn(() => new Promise<Response>((r) => (resolve = r)));
    vi.stubGlobal("fetch", fetchMock);
    render(<BookingForm slotId="s1" />);
    await fillAndSend();
    const button = screen.getByRole("button", { name: "Booking..." });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolve(new Response(JSON.stringify({ ok: true }), { status: 201 }));
    expect(await screen.findByText("You are booked in")).toBeInTheDocument();
  });
});
