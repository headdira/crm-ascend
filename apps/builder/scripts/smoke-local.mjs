#!/usr/bin/env node
/**
 * Smoke local do builder — catálogo + preset para etapa de logo.
 * Uso: node scripts/smoke-local.mjs [baseUrl]
 */
const BASE = (process.argv[2] ?? "http://localhost:3002").replace(/\/$/, "");

async function main() {
  console.log(`Builder smoke → ${BASE}\n`);

  const home = await fetch(`${BASE}/`);
  console.log(`GET /           → ${home.status}`);

  const catRes = await fetch(`${BASE}/api/catalog`);
  console.log(`GET /api/catalog → ${catRes.status}`);
  if (!catRes.ok) {
    console.error(await catRes.text());
    process.exit(1);
  }

  const catalog = await catRes.json();
  const petBanners = catalog.banners
    .filter((b) => b.niche === "Pet")
    .slice(0, 3)
    .map((b) => b.id);
  const petLogo = catalog.logos.find((l) => l.niche === "Pet")?.id ?? catalog.logos[0]?.id;

  console.log(`  logos: ${catalog.logos?.length ?? 0}, banners: ${catalog.banners?.length ?? 0}`);

  const preset = {
    step: 9,
    form: {
      verifyTab: "email",
      courseEmail: "teste@exemplo.com",
      cpf: "",
      storeEmail: "loja@exemplo.com",
      storeAdminHost: "demo.lojavirtualnuvem.com.br",
      planWatchedInfo: true,
      planWillSubscribe: false,
      storeName: "Loja Ascend Teste",
      niche: "Pet",
      bannerIds: petBanners,
      logoSource: "generated",
      logoId: "",
      generatedLogoVariant: "stacked",
      primaryColor: "#0a0a0a",
      secondaryColor: "#d4af37",
      fontId: "dm-sans",
    },
  };

  console.log("\n--- Cole no DevTools (Console) em", `${BASE}/`, "---\n");
  console.log(`localStorage.setItem("ascend-builder-v5", ${JSON.stringify(JSON.stringify(preset))});`);
  console.log("location.reload();");
  console.log("\n--- Referência catálogo Pet ---");
  console.log("bannerIds:", petBanners);
  console.log("logoId (catálogo):", petLogo ?? "(nenhuma)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
