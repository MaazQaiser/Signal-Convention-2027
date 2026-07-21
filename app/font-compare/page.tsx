import type { Metadata } from "next";
import FontCompare from "@/components/FontCompare";

export const metadata: Metadata = {
  title: "Font Comparison — Signal 2027",
  description:
    "Side-by-side comparison of Michroma and Simple Square for Here We Grow 2027.",
  robots: { index: false, follow: false },
};

export default function FontComparePage() {
  return (
    <main>
      <FontCompare variant="page" />
    </main>
  );
}
