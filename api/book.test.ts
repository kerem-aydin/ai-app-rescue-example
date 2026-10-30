// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { POST } from "./book";

const booking = { slotId: "s1", name: " Maya Lee ", email: "maya@example.com", note: "" };
const req = (body: unknown) =>
  new Request("http://localhost/api/book", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) });

describe("POST /api/book", () => {
  it("refuses to run without the server-side key", async () => {
    vi.stubEnv("MAIL_API_KEY", "");
    const res = await POST(req(booking), vi.fn());
    expect(res.status).toBe(500);
  });

  it("validates on the server too", async () => {
    vi.stubEnv("MAIL_API_KEY", "test-key");
    const mail = vi.fn();
    const res = await POST(req({ slotId: "", name: "", email: "nope" }), mail);
    expect(res.status).toBe(400);
    expect(mail).not.toHaveBeenCalled();
    expect((await POST(req("not json"), mail)).status).toBe(400);
  });

  it("sends the key only to the mail service and never back to the browser", async () => {
    vi.stubEnv("MAIL_API_KEY", "test-key");
    const mail = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    const res = await POST(req(booking), mail);
    expect(res.status).toBe(201);
    expect(mail.mock.calls[0][1].headers.Authorization).toBe("Bearer test-key");
    expect(await res.text()).not.toContain("test-key");
  });

  it("returns 502 when the mail service fails", async () => {
    vi.stubEnv("MAIL_API_KEY", "test-key");
    const res = await POST(req(booking), vi.fn().mockResolvedValue(new Response("", { status: 503 })));
    expect(res.status).toBe(502);
  });
});
