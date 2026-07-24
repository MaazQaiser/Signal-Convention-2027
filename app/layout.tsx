import type { Metadata } from "next";
import { Michroma, Orbitron } from "next/font/google";
import localFont from "next/font/local";
import Aftermovie from "@/components/Aftermovie";
import "./globals.css";

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap",
});

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

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
  icons: {
    icon: [{ url: "/brand/brandmark-27-light.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/brandmark-27-light.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${michroma.variable}`}
      data-display-font="orbitron"
    >
      <head>
        <link
          rel="preload"
          href="/videos/destination.mp4"
          as="video"
          type="video/mp4"
        />
      </head>
      <body className={fkDisplay.variable}>
        {children}
        <Aftermovie />
      </body>
    </html>
  );
}
