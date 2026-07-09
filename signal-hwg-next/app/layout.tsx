import type { Metadata } from "next";
import { Familjen_Grotesk } from "next/font/google";
import "./globals.css";

const familjen = Familjen_Grotesk({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Signal 2027 — Here We Grow · Franchise Convention",
  description:
    "Signal Franchise Convention 2027 — Arizona. Year three: Consistency. All rays merge to shine in unity.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={familjen.variable}>{children}</body>
    </html>
  );
}
