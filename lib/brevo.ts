// Cienki wrapper na Brevo Transactional Email API.
type Recipient = { email: string; name?: string };

export async function sendEmail(opts: {
  to: Recipient[];
  subject: string;
  html: string;
  replyTo?: Recipient;
}) {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error("BREVO_API_KEY nie ustawiony");

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL || "hello@sey.la",
        name: process.env.BREVO_SENDER_NAME || "sey.la | book",
      },
      to: opts.to,
      subject: opts.subject,
      htmlContent: opts.html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
  return res.json();
}

// Szkielety maili (treść dopniemy w Fazie 2).
export const emails = {
  otp: (code: string) => `<p>Twój kod logowania: <b>${code}</b></p>`,
  bookingConfirmed: (service: string, when: string) =>
    `<p>Rezerwacja potwierdzona: <b>${service}</b> — ${when}.</p>`,
};
