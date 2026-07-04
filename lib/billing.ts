// Model biznesowy book.sey.la:
// 3 mies. free → 25 EUR za KAŻDEGO pracownika / miesiąc + 20% od PIERWSZEJ rezerwacji
// klienta spoza grupy zaciągniętej na start (nowy klient z marketplace).
export const BILLING = {
  trialMonths: 3,
  pricePerStaffEur: 25,
  currency: "EUR",
  newClientCommission: 0.2,
} as const;

export function trialEndsAt(from: Date = new Date()): Date {
  const d = new Date(from);
  d.setMonth(d.getMonth() + BILLING.trialMonths);
  return d;
}

/** Miesięczny koszt = 25 EUR × liczba pracowników. */
export function monthlyPriceEur(staffCount: number): number {
  return Math.max(1, staffCount) * BILLING.pricePerStaffEur;
}

/** Prowizja tylko od pierwszej rezerwacji nowego klienta (nie z listy zaciągniętej na start). */
export function commissionDue(priceEur: number, isNewClient: boolean): number {
  return isNewClient ? +(priceEur * BILLING.newClientCommission).toFixed(2) : 0;
}
