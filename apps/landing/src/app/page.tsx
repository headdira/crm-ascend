import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HeroSection from "@/components/sales/brand-preview/HeroSection";

const BenefitsSection = dynamic(() => import("@/components/sales/brand-preview/BenefitsSection"));
const GamificationSection = dynamic(
  () => import("@/components/sales/brand-preview/GamificationSection"),
);
const MentorsSection = dynamic(() => import("@/components/sales/brand-preview/MentorsSection"));
const TestimonialsSection = dynamic(
  () => import("@/components/sales/brand-preview/TestimonialsSection"),
);
const ObjectionsSection = dynamic(
  () => import("@/components/sales/brand-preview/ObjectionsSection"),
);
const PricingCTA = dynamic(() => import("@/components/sales/brand-preview/PricingCTA"));
const FinalSection = dynamic(() => import("@/components/sales/brand-preview/FinalSection"));
const FloatingCTA = dynamic(() => import("@/components/sales/brand-preview/FloatingCTA"));

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Ascend Club — Aprenda a construir sua renda online",
  description:
    "Mentoria com suporte próximo, networking ativo e método validado. Entre no Ascend Club por R$197.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Ascend Club — Renda online do zero",
    description: "Mentoria + comunidade + 2 calls ao vivo por semana. R$197 pagamento único.",
    url: siteUrl,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ascend Club",
    description: "Mentoria para iniciantes no digital — R$197, 12 meses de acesso.",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <GamificationSection />
      <MentorsSection />
      <TestimonialsSection />
      <ObjectionsSection />
      <PricingCTA />
      <FinalSection />
      <FloatingCTA />
    </>
  );
}
