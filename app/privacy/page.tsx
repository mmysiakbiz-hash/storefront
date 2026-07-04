import { Legal, H, P } from "../_legal";
export const metadata = { title: "Privacy Policy · sey.la | book" };
export default function Page() {
  return (
    <Legal title="Privacy Policy" updated="July 2026">
      <P>This policy explains how <b>Nexora Consulting LLC</b> ("we", "book.sey.la") handles personal data when you use book.sey.la. We are the data controller for the platform. Each studio is an independent controller for its own relationship with its clients.</P>
      <H>What we collect</H>
      <P>Account data (your email); booking data (name, email, phone, appointment details); data studios add about their own clients and team; reviews you leave; and technical data needed to run the service. If a studio imports a client list, it does so on its own responsibility and confirms it has a lawful basis to share those contacts.</P>
      <H>Why we use it (legal bases)</H>
      <P>To provide bookings and accounts (performance of a contract); to send transactional emails such as confirmations and reminders (legitimate interest / your request); to keep the service secure and improve it (legitimate interest); and where you give consent, for that specific purpose.</P>
      <H>Who processes it</H>
      <P>We use trusted processors under data-processing agreements: Supabase (database & hosting), Vercel (application hosting), Brevo (transactional email), and — where enabled — Stripe (payments) and Google (ratings you choose to import). Studios you book with receive the booking details needed to serve you.</P>
      <H>International transfers</H>
      <P>Some processors are outside your country. Where required, transfers rely on appropriate safeguards (e.g. EU Standard Contractual Clauses) or, for occasional transfers necessary to perform your booking, Article 49 GDPR derogations.</P>
      <H>Retention</H>
      <P>We keep data for as long as your account or bookings are active and as required by law, then delete or anonymise it.</P>
      <H>Your rights</H>
      <P>Subject to applicable law you may request access, correction, deletion, portability, restriction, or object to processing. Email hello@sey.la. You may also contact your local data-protection authority.</P>
      <H>Contact</H>
      <P>Nexora Consulting LLC, Sharjah Media City, UAE — hello@sey.la.</P>
    </Legal>
  );
}
