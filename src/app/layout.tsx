import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "SaaS Dashboard Foundation",
    template: "%s | SaaS Dashboard Foundation",
  },
  description:
    "Phase 1 foundation for a professional Figma-to-Next.js SaaS dashboard portfolio project.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f7f8fa",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
