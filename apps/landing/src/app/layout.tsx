import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import SalesJsonLd from "@/components/sales/SalesJsonLd";
import SalesLayoutShell from "@/components/sales/SalesLayoutShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-family",
  subsets: ["latin"],
  display: "swap",
  preload: true,
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
        <Script id="early-light" strategy="beforeInteractive">
          {`(function(){try{var c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;var slow=c&&(c.saveData||/^(slow-2g|2g|3g)$/.test(c.effectiveType||''));var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var narrow=window.matchMedia('(max-width: 1023px)').matches;if(slow||reduced||narrow)document.documentElement.setAttribute('data-light','true');}catch(e){}})();`}
        </Script>
        <SalesJsonLd />
        <SalesLayoutShell>{children}</SalesLayoutShell>
      </body>
    </html>
  );
}
