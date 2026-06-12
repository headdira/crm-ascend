import { describe, expect, it } from "vitest";
import { adsQuizConfigSchema, parseAdsQuizConfig } from "./ads-quiz";

/** Schema salvo no Supabase antes da migration 038 (sem idade/renda). */
const legacyDbContact = {
  version: 20,
  landing: {
    eyebrow: "",
    headline: "Test headline",
    subheadline: "Sub",
    ctaLabel: "COMEÇAR",
  },
  steps: [
    {
      id: "oferta",
      type: "offer" as const,
      title: "Oferta",
      body: "Corpo",
      priceLabel: "R$49,99",
      bullets: ["Item"],
      ctaLabel: "CTA",
    },
  ],
  contact: {
    nameTitle: "Como posso te chamar?",
    emailTitle: "Qual seu melhor e-mail?",
    phoneTitle: "Seu WhatsApp",
    submitLabel: "LIBERAR MEU ACESSO",
  },
};

describe("parseAdsQuizConfig", () => {
  it("legacy contact sem age/income falha no parse direto", () => {
    const direct = adsQuizConfigSchema.safeParse(legacyDbContact);
    expect(direct.success).toBe(false);
    if (!direct.success) {
      expect(direct.error.flatten().fieldErrors.contact).toEqual(["Required", "Required"]);
    }
  });

  it("legacy contact parseia após merge de defaults", () => {
    const parsed = parseAdsQuizConfig(legacyDbContact);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.contact.ageTitle).toBeTruthy();
      expect(parsed.data.contact.incomeTitle).toBeTruthy();
    }
  });
});
