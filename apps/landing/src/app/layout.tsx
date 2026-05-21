import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SalesJsonLd from "@/components/sales/SalesJsonLd";
import AttributionCapture from "@/components/sales/AttributionCapture";
import LightExperienceInit from "@/components/sales/LightExperienceInit";
import CookieConsent from "@/components/sales/CookieConsent";
import ConsentScripts from "@/components/sales/ConsentScripts";
import StarfieldBackground from "@/components/sales/StarfieldBackground";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-family",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ascend Club",
    template: "%s | Ascend Club",
  },
  description: "Ascend Club — mentoria e comunidade para renda online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter antialiased`}>
        <div className="sales-landing sales-landing-brand relative min-h-screen bg-[#0a0a0a] text-[#fafafa] overflow-x-hidden">
          <StarfieldBackground />
          <SalesJsonLd />
          <AttributionCapture />
          <LightExperienceInit />
          <div className="relative z-[1]">{children}</div>
          <CookieConsent />
          <ConsentScripts />
        </div>
      </body>
    </html>
  );
}
