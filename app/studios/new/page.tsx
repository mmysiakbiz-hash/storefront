import IntakeWizard from "./IntakeWizard";
import { Logo } from "@/ds/components/brand/Logo";

export const metadata = { title: "Add your studio · sey.la | book" };

export default function Page() {
  return (
    <>
      <nav style={{ borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "18px var(--gutter)" }}>
          <a href="/" style={{ textDecoration: "none" }}><Logo product="book" /></a>
        </div>
      </nav>
      <IntakeWizard />
    </>
  );
}
