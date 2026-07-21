import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { AppPreloader } from "@/components/layout/app-preloader";
import "./globals.css";
import { Providers } from "./providers";

const manrope = Manrope({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "Subtera — Subscription Analytics Dashboard",
    template: "%s — Subtera",
  },
  description:
    "A fictional subscription analytics dashboard built as a responsive frontend portfolio demonstration.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#08090E",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={manrope.variable} lang="en">
      <body>
        <AppPreloader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
