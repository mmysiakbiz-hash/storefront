// Pobranie oceny i opinii z Google Places (Place Details). Wymaga GOOGLE_PLACES_API_KEY.
// UWAGA ToS Google: opinie wyświetlamy z atrybucją, API zwraca maks. ~5 opinii.
export async function fetchGooglePlace(placeId: string): Promise<{
  rating: number | null; count: number | null; url: string | null;
  reviews: { author: string; rating: number; text: string; time: number }[];
} | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key || !placeId) return null;
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=rating,user_ratings_total,url,reviews&key=${key}`;
    const res = await fetch(url, { cache: "no-store" });
    const j = await res.json();
    const r = j?.result;
    if (!r) return null;
    return {
      rating: r.rating ?? null,
      count: r.user_ratings_total ?? null,
      url: r.url ?? null,
      reviews: (r.reviews || []).slice(0, 5).map((rv: any) => ({ author: rv.author_name, rating: rv.rating, text: rv.text, time: rv.time })),
    };
  } catch { return null; }
}
