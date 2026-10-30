// Serverless function (Vercel-style, runs on the server). Reads the secret from an environment variable.
import { validateBooking } from "../src/lib/validate";
import type { Booking } from "../src/types";

const MAIL_URL = "https://api.mailer.example.com/v1/send";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

export async function POST(request: Request, fetchImpl: typeof fetch = fetch): Promise<Response> {
  const key = process.env.MAIL_API_KEY;
  if (!key) return json(500, { error: "Booking is not configured on the server." });

  let input: Partial<Booking>;
  try {
    input = await request.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }

  const errors = validateBooking(input);
  if (Object.keys(errors).length > 0) return json(400, { error: "Please check the form.", fields: errors });

  const name = input.name!.trim();
  const res = await fetchImpl(MAIL_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      to: "bookings@studio.example.com",
      subject: `New booking from ${name}`,
      text: JSON.stringify({ ...input, name, email: input.email!.trim() }),
    }),
  });
  if (!res.ok) return json(502, { error: "Mail service unavailable. Please try again." });
  return json(201, { ok: true });
}
