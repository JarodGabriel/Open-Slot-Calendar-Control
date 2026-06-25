import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import { config } from "@/lib/config";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `Book time with ${config.hostName}`,
  description: `Schedule a meeting with ${config.hostName}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={publicSans.className}>
      <body>{children}</body>
    </html>
  );
}
