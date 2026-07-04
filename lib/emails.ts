// Brandowane szablony maili transakcyjnych (Brevo). Kolory jak w produkcie;
// nagłówki na Georgia (Fraunces nie ładuje się pewnie w klientach poczty).
const SHELL = "#F5EAE0", COCOA = "#3B2A25", CLAY = "#A8503F", CREAM = "#FCF8F2", MUTED = "#6b5a52", LINE = "#e7d9cc";

function layout(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:${SHELL};padding:28px 0;font-family:Helvetica,Arial,sans-serif;color:${COCOA}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px;max-width:92%;background:${CREAM};border:1px solid ${LINE};border-radius:16px;overflow:hidden">
      <tr><td style="padding:26px 30px 6px">
        <span style="font-family:Georgia,serif;font-size:20px;color:${MUTED}">sey.la</span>
        <span style="color:#c9b7a8">&nbsp;|&nbsp;</span>
        <span style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:${COCOA}">book</span>
      </td></tr>
      <tr><td style="padding:10px 30px 8px">
        <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:26px;line-height:1.15;margin:0;color:${COCOA}">${title}</h1>
      </td></tr>
      <tr><td style="padding:6px 30px 28px;font-size:15px;line-height:1.6;color:${COCOA}">${body}</td></tr>
      <tr><td style="padding:16px 30px;border-top:1px solid ${LINE};font-size:12px;color:${MUTED}">
        Sent by sey.la&nbsp;|&nbsp;book · Beauty &amp; wellness across the Seychelles
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

function button(href: string, text: string): string {
  return `<a href="${href}" style="display:inline-block;background:${CLAY};color:#fff;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 26px;border-radius:10px">${text}</a>`;
}

export const templates = {
  bookingConfirmed(p: { guest: string; studio: string; service: string; staff?: string; when: string; manageUrl?: string }): { subject: string; html: string } {
    return {
      subject: `Booking confirmed · ${p.studio}`,
      html: layout("You're booked. 🌺", `
        <p>Hi ${p.guest}, your appointment is confirmed:</p>
        <table role="presentation" style="margin:16px 0;font-size:15px">
          <tr><td style="color:${MUTED};padding:3px 14px 3px 0">Studio</td><td style="font-weight:bold">${p.studio}</td></tr>
          <tr><td style="color:${MUTED};padding:3px 14px 3px 0">Treatment</td><td style="font-weight:bold">${p.service}</td></tr>
          ${p.staff ? `<tr><td style="color:${MUTED};padding:3px 14px 3px 0">With</td><td style="font-weight:bold">${p.staff}</td></tr>` : ""}
          <tr><td style="color:${MUTED};padding:3px 14px 3px 0">When</td><td style="font-weight:bold">${p.when}</td></tr>
        </table>
        <p style="color:${MUTED}">See you soon. If you need to change anything, just reply to the studio.</p>`),
    };
  },
  studioWelcome(p: { studio: string; url: string }): { subject: string; html: string } {
    return {
      subject: `${p.studio} is live on book.sey.la`,
      html: layout("Your page is live.", `
        <p>Your studio page is ready to share. Send it to your clients so they can book online:</p>
        <p style="margin:20px 0">${button(p.url, "View your page")}</p>
        <p style="color:${MUTED}">Tip: drop the link in your Instagram bio and send it on WhatsApp to your regulars.</p>`),
    };
  },
  reminder(p: { guest: string; studio: string; service: string; when: string; kind: "24h" | "2h" }): { subject: string; html: string } {
    const soon = p.kind === "2h" ? "in about 2 hours" : "tomorrow";
    return {
      subject: `Reminder: ${p.service} ${soon}`,
      html: layout("See you soon. \ud83c\udf3a", `
        <p>Hi ${p.guest}, a quick reminder of your appointment ${soon}:</p>
        <table role="presentation" style="margin:16px 0;font-size:15px">
          <tr><td style="color:${MUTED};padding:3px 14px 3px 0">Studio</td><td style="font-weight:bold">${p.studio}</td></tr>
          <tr><td style="color:${MUTED};padding:3px 14px 3px 0">Treatment</td><td style="font-weight:bold">${p.service}</td></tr>
          <tr><td style="color:${MUTED};padding:3px 14px 3px 0">When</td><td style="font-weight:bold">${p.when}</td></tr>
        </table>
        <p style="color:${MUTED}">Need to change it? Manage your booking in your book.sey.la account.</p>`),
    };
  },
  otp(code: string): { subject: string; html: string } {
    return {
      subject: "Your sign-in code",
      html: layout("Your code", `<p>Use this code to sign in:</p>
        <p style="font-size:30px;font-weight:bold;letter-spacing:6px;color:${CLAY};margin:14px 0">${code}</p>
        <p style="color:${MUTED}">It expires shortly. If you didn't request it, ignore this email.</p>`),
    };
  },
};
