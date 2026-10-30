import { describe, expect, it } from "vitest";
import { validateBooking } from "./validate";

const good = { slotId: "s1", name: "Maya Lee", email: "maya@example.com", note: "" };

describe("validateBooking", () => {
  it("accepts a complete booking", () => {
    expect(validateBooking(good)).toEqual({});
  });

  it("rejects an empty form with one message per field", () => {
    expect(validateBooking({})).toEqual({
      slotId: "Pick a time slot first.",
      name: "Please enter your name.",
      email: "Please enter your email.",
    });
  });

  it("rejects a malformed email and whitespace-only name", () => {
    const errors = validateBooking({ ...good, name: "   ", email: "maya@example" });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBe("This email address looks wrong.");
  });

  it("limits the note length", () => {
    expect(validateBooking({ ...good, note: "x".repeat(501) }).note).toBeDefined();
  });
});
