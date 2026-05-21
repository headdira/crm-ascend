import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HeroSection from "@/components/sales/brand-preview/HeroSection";
import LazyWhenVisible from "@/components/sales/LazyWhenVisible";

const BenefitsSection = dynamic(
  () => import("@/components/sales/brand-preview/BenefitsSection"),
  { loading: () => null },
);
const GamificationSection = dynamic(
  () => import("@/components/sales/brand-preview/GamificationSection"),
  { loading: () => null },
);
const MentorsSection = dynamic(
  () => import("@/components/sales/brand-preview/MentorsSection"),
  { loading: () => null },
);
const TestimonialsSection = dynamic(
  () => import("@/components/sales/brand-preview/TestimonialsSection"),
  { loading: () => null },
);
const ObjectionsSection = dynamic(
  () => import("@/components/sales/brand-preview/ObjectionsSection"),
  { loading: () => null },
);
const PricingCTA = dynamic(() => import("@/components/sales/brand-preview/PricingCTA"), {
  loading: () => null,
});
const FinalSection = dynamic(() => import("@/components/sales/brand-preview/FinalSection"), {
  loading: () => null,
});
const FloatingCTA = dynamic(() => import("@/components/sales/brand-preview/FloatingCTA"), {
  loading: () => null,
});

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
      <LazyWhenVisible minHeight={360}>
        <BenefitsSection />
      </LazyWhenVisible>
      <LazyWhenVisible minHeight={320}>
        <GamificationSection />
      </LazyWhenVisible>
      <LazyWhenVisible minHeight={480}>
        <MentorsSection />
      </LazyWhenVisible>
      <LazyWhenVisible minHeight={520}>
        <TestimonialsSection />
      </LazyWhenVisible>
      <LazyWhenVisible minHeight={280}>
        <ObjectionsSection />
      </LazyWhenVisible>
      <LazyWhenVisible minHeight={400}>
        <PricingCTA />
      </LazyWhenVisible>
      <LazyWhenVisible minHeight={360}>
        <FinalSection />
      </LazyWhenVisible>
      <LazyWhenVisible minHeight={0}>
        <FloatingCTA />
      </LazyWhenVisible>
    </>
  );
}
