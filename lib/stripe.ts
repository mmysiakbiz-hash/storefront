import Stripe from "stripe";

// Lazy singleton — nie inicjalizujemy przy braku klucza (np. w buildzie bez env).
let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY nie ustawiony");
    _stripe = new Stripe(key); // używa domyślnej wersji API z SDK
  }
  return _stripe;
}
