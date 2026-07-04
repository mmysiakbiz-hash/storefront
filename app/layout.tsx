import type { Metadata } from "next";
import "@/ds/styles.css";

export const metadata: Metadata = {
  title: "sey.la | book · Beauty & wellness in the Seychelles",
  description:
    "Book hair, nails, spa, massage, barber and brows with the best local studios across Mahé, Praslin and La Digue.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="sey-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
