import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const fkDisplay = localFont({
  src: [
    {
      path: "./fonts/FKDisplay-Regular.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/FKDisplay-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/FKDisplay-Regular.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/FKDisplay-Regular.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/FKDisplay-Regular.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
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
      <head>
        <link
          rel="preload"
          href="/videos/destination.mp4"
          as="video"
          type="video/mp4"
        />
      </head>
      <body className={fkDisplay.variable}>{children}</body>
    </html>
  );
}
