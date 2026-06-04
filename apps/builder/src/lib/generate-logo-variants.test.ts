import { describe, expect, it } from "vitest";
import {
  fallbackCatalogLogoId,
  generateLogoVariants,
  generatedLogoVariantLabel,
} from "./generate-logo-variants";

describe("generateLogoVariants", () => {
  it("returns empty for short store name", () => {
    expect(generateLogoVariants({ storeName: "A", niche: "Pet", fontId: "dm-sans" })).toEqual(
      [],
    );
  });

  it("returns 4 SVG variants with placeholders", () => {
    const variants = generateLogoVariants({
      storeName: "Ascend Imports",
      niche: "Pet",
      fontId: "montserrat",
    });
    expect(variants).toHaveLength(4);
    const stacked = variants.find((v) => v.id === "stacked");
    expect(stacked?.svg).toContain("Ascend Imports");
    const monogram = variants.find((v) => v.id === "monogram");
    expect(monogram?.svg).toContain("AI");
    for (const v of variants) {
      expect(v.svg).toContain("#PRIMARY");
      expect(v.svg).toContain("#SECONDARY");
      expect(v.label).toBe(generatedLogoVariantLabel(v.id));
    }
  });

  it("truncates very long names in SVG", () => {
    const long = "Super Mega Loja Internacional Premium";
    const variants = generateLogoVariants({
      storeName: long,
      niche: "Genérico",
      fontId: "dm-sans",
    });
    expect(variants[0]?.svg).toContain("…");
    expect(variants[0]?.svg).not.toContain(long);
  });

  it("fallbackCatalogLogoId prefers Genérico", () => {
    const id = fallbackCatalogLogoId([
      { id: "a", niche: "Pet" },
      { id: "b", niche: "Genérico" },
    ]);
    expect(id).toBe("b");
  });
});
