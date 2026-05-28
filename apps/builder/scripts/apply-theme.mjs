#!/usr/bin/env node
/**
 * apply-theme.mjs — aplica logo + banners + cores em uma loja Nuvemshop já autorizada,
 * usando o Fork workflow do @tiendanube/cli (Opção 1 da pesquisa).
 *
 * Fluxo: theme list → reusa rascunho / clona produtivo / cria novo → pull → patch
 *        config/settings_data.json + templates/*.json → push → preview → (publish).
 *
 * Pré-requisitos:
 *   - Node 20+
 *   - @tiendanube/cli disponível via npx (instalado automaticamente na 1ª execução)
 *   - Token Base64 da página "theme authorize" do app de Partners (decodifica para
 *     { store_id, access_token }). Se vc tem store_id + access_token avulsos,
 *     passe via --store-id + --access-token e o script monta o Base64.
 *
 * Exemplo:
 *   node scripts/apply-theme.mjs \
 *     --token "<BASE64>" \
 *     --store-name "Aesthetic Wrld" \
 *     --logo https://cdn.exemplo.com/logo.png \
 *     --banner https://cdn.exemplo.com/banner1.jpg \
 *     --banner https://cdn.exemplo.com/banner2.jpg \
 *     --primary-color "#d4af37" \
 *     --secondary-color "#0a0a0a" \
 *     --publish
 */

import { spawn } from "node:child_process";
import { mkdtemp, readFile, writeFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";

const USAGE = `
Uso:
  node scripts/apply-theme.mjs [opções]

Token (uma das formas):
  --token <BASE64>              Base64 pronto (página "theme authorize")
  --store-id N --access-token T Avulsos; o script monta o Base64

Visual:
  --store-name "Nome da Loja"   (obrigatório)
  --logo <URL>                  (obrigatório) URL público do logo
  --banner <URL>                (1+; repita p/ mais; desktop)
  --banner-mobile <URL>         (opcional; default = mesmos do desktop)
  --primary-color "#hex"        (default #d4af37)
  --secondary-color "#hex"      (default #0a0a0a)
  --font dm-sans|montserrat|playfair  (default dm-sans)

Tema:
  --base-theme toluca|ipanema   (default toluca; deve ser o tema instalado)
  --publish                     (flag; ativa o tema; sem isso, fica como rascunho)
  --keep                        (flag; mantém workspace tmp p/ debug)
  --help
`;

const FONT_MAP = {
  "dm-sans": "DM Sans",
  montserrat: "Montserrat",
  playfair: "Playfair Display",
};
const COLOR_KEYS = new Set([
  "primary_color", "brand_color", "accent_color",
  "highlight_color", "button_color", "link_color",
]);
const SECONDARY_KEYS = new Set([
  "secondary_color", "background_color", "text_color", "footer_background",
]);
const SLIDER_KEYS = new Set(["slider", "slider_mobile", "banners", "banner", "gallery"]);
const LOGO_KEYS = new Set(["logo", "logo_image", "logo_alternate", "header_logo"]);

function die(msg, code = 1) {
  console.error(`✗ ${msg}`);
  if (code === 1) console.error(USAGE);
  process.exit(code);
}
function log(msg) {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

function parseCli() {
  const { values } = parseArgs({
    options: {
      token: { type: "string" },
      "store-id": { type: "string" },
      "access-token": { type: "string" },
      "store-name": { type: "string" },
      logo: { type: "string" },
      banner: { type: "string", multiple: true },
      "banner-mobile": { type: "string", multiple: true },
      "primary-color": { type: "string", default: "#d4af37" },
      "secondary-color": { type: "string", default: "#0a0a0a" },
      font: { type: "string", default: "dm-sans" },
      "base-theme": { type: "string", default: "toluca" },
      publish: { type: "boolean", default: false },
      keep: { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
    strict: false,
    allowPositionals: false,
  });
  return values;
}

function buildBase64Token(values) {
  if (values.token?.trim()) return values.token.trim();
  const storeId = values["store-id"]?.trim();
  const accessToken = values["access-token"]?.trim();
  if (!storeId || !/^\d+$/.test(storeId)) {
    die("--token ou (--store-id numérico + --access-token) obrigatórios");
  }
  if (!accessToken) die("--access-token vazio");
  const payload = { store_id: Number(storeId), access_token: accessToken };
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
}

function decodeToken(b64) {
  try {
    const obj = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    if (!obj || typeof obj !== "object") return null;
    const storeId = String(obj.store_id ?? "");
    if (!/^\d+$/.test(storeId)) return null;
    if (!obj.access_token) return null;
    return { storeId, accessToken: String(obj.access_token) };
  } catch {
    return null;
  }
}

function runCli(args, { cwd, token }) {
  const fullArgs = ["@tiendanube/cli", "theme", ...args, "--token", token];
  return new Promise((resolve) => {
    const child = spawn("npx", ["-y", ...fullArgs], {
      cwd,
      env: { ...process.env, FORCE_COLOR: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (c) => (stdout += c.toString()));
    child.stderr.on("data", (c) => (stderr += c.toString()));
    child.on("close", (exitCode) => {
      const ok = exitCode === 0 && !/error:/i.test(stderr);
      resolve({ ok, stdout: stdout.trim(), stderr: stderr.trim(), exitCode });
    });
    child.on("error", (err) => {
      resolve({ ok: false, stdout, stderr: `${stderr}\n${err.message}`, exitCode: null });
    });
  });
}

function fmt(args) { return `nuvemshop theme ${args.join(" ")}`; }

function requireOk(args, res) {
  if (res.ok) return;
  const head = `${fmt(args)} falhou (exit ${res.exitCode ?? "?"})`;
  const tail = res.stderr || res.stdout || "";
  throw new Error(`${head}\n${tail.slice(0, 800)}`);
}

function findIdInJson(node) {
  if (node === null || node === undefined) return undefined;
  if (Array.isArray(node)) {
    for (const it of node) { const id = findIdInJson(it); if (id) return id; }
    return undefined;
  }
  if (typeof node !== "object") return undefined;
  for (const k of ["id", "installation_id", "theme_id", "new_installation_id"]) {
    const v = node[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  }
  for (const v of Object.values(node)) { const id = findIdInJson(v); if (id) return id; }
  return undefined;
}

function parseInstallations(stdout) {
  try {
    const data = JSON.parse(stdout);
    let rows = [];
    if (Array.isArray(data)) rows = data;
    else if (data?.themes) rows = data.themes;
    else if (data?.data) rows = data.data;
    else if (data?.installations) rows = data.installations;
    return rows
      .map((r) => {
        const id = r.id ?? r.installation_id ?? r.theme_id;
        if (id === undefined || id === null) return null;
        const baseTheme = (r.base_theme ?? r.theme_name ?? "").toLowerCase();
        return {
          id: String(id),
          isProductive: r.is_productive === true,
          baseTheme,
          baseThemeType: (r.base_theme_type ?? r.theme_type ?? "").toLowerCase(),
          title: r.title ?? "",
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function isHex(v) {
  return typeof v === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());
}
function gallerySlide(url, i) {
  return {
    image: url, src: url, link: "", url: "",
    title: { pt: `Banner ${i + 1}` }, description: { pt: "" }, button: { pt: "" },
  };
}
function patchGallery(value, urls) {
  if (!urls.length) return value;
  if (Array.isArray(value)) {
    return urls.map((u, i) => {
      const prev = value[i];
      if (prev && typeof prev === "object" && !Array.isArray(prev)) {
        return { ...prev, image: u, src: u };
      }
      return gallerySlide(u, i);
    });
  }
  return urls.map((u, i) => gallerySlide(u, i));
}
function patchLogo(value, logoUrl) {
  if (typeof value === "string") return logoUrl;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...value, src: logoUrl, image: logoUrl };
  }
  return logoUrl;
}

function walkPatch(node, input, keyHint = "") {
  if (Array.isArray(node)) {
    if (SLIDER_KEYS.has(keyHint)) {
      const urls = keyHint === "slider_mobile" ? input.bannersMobile : input.bannersDesktop;
      return patchGallery(node, urls);
    }
    return node.map((it) => walkPatch(it, input));
  }
  if (!node || typeof node !== "object") return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    const lower = k.toLowerCase();
    if (COLOR_KEYS.has(lower) && isHex(v)) { out[k] = input.primaryColor; continue; }
    if (SECONDARY_KEYS.has(lower) && isHex(v)) { out[k] = input.secondaryColor; continue; }
    if (LOGO_KEYS.has(lower)) { out[k] = patchLogo(v, input.logo); continue; }
    if (SLIDER_KEYS.has(lower)) {
      const urls = lower === "slider_mobile" ? input.bannersMobile : input.bannersDesktop;
      out[k] = patchGallery(v, urls);
      continue;
    }
    if (lower.includes("font") && typeof v === "string" && FONT_MAP[input.fontId]) {
      out[k] = FONT_MAP[input.fontId];
      continue;
    }
    out[k] = walkPatch(v, input, lower);
  }
  return out;
}

function patchSettingsRoot(raw, input) {
  const patched = walkPatch(raw, input);
  if (patched && typeof patched === "object" && !Array.isArray(patched)) {
    if (patched.current && typeof patched.current === "object") {
      const cur = patched.current;
      if (!cur.logo || typeof cur.logo === "string") cur.logo = input.logo;
      if (Array.isArray(cur.slider)) cur.slider = patchGallery(cur.slider, input.bannersDesktop);
      if (Array.isArray(cur.slider_mobile)) {
        cur.slider_mobile = patchGallery(cur.slider_mobile, input.bannersMobile);
      }
      for (const k of Object.keys(cur)) {
        if (!k.startsWith("palette_")) continue;
        const p = cur[k];
        if (!p || typeof p !== "object") continue;
        if (isHex(p.primary_color)) p.primary_color = input.primaryColor;
        if (isHex(p.background_color)) p.background_color = input.secondaryColor;
        if (isHex(p.text_color)) p.text_color = input.secondaryColor;
      }
    }
    if (typeof patched.name === "object" && patched.name) patched.name.pt = input.storeName;
  }
  return patched;
}

async function patchWorkspace(workspaceDir, input) {
  const patched = [];
  const settingsPath = path.join(workspaceDir, "config/settings_data.json");
  const raw = JSON.parse(await readFile(settingsPath, "utf8"));
  const out = patchSettingsRoot(raw, input);
  await writeFile(settingsPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
  patched.push("config/settings_data.json");

  const tplDir = path.join(workspaceDir, "templates");
  try {
    const files = await readdir(tplDir);
    for (const f of files.filter((x) => x.endsWith(".json"))) {
      const fp = path.join(tplDir, f);
      const r = JSON.parse(await readFile(fp, "utf8"));
      const p = walkPatch(r, input);
      await writeFile(fp, `${JSON.stringify(p, null, 2)}\n`, "utf8");
      patched.push(`templates/${f}`);
    }
  } catch {
    /* templates é opcional */
  }
  return patched;
}

async function main() {
  const values = parseCli();
  if (values.help) { console.log(USAGE); process.exit(0); }

  const storeName = values["store-name"]?.trim();
  if (!storeName) die("--store-name obrigatório");
  if (!values.logo?.trim()) die("--logo obrigatório (URL público)");
  const banners = (values.banner ?? []).map((u) => u.trim()).filter(Boolean);
  if (!banners.length) die("--banner obrigatório (1+; URL público)");
  const bannersMobile = (values["banner-mobile"] ?? []).map((u) => u.trim()).filter(Boolean);

  const token = buildBase64Token(values);
  const decoded = decodeToken(token);
  if (!decoded) die("Token inválido (não é Base64 de {store_id, access_token})");
  log(`Loja ${decoded.storeId} — tema base "${values["base-theme"]}"`);

  const input = {
    storeName,
    primaryColor: values["primary-color"],
    secondaryColor: values["secondary-color"],
    fontId: values.font,
    logo: values.logo.trim(),
    bannersDesktop: banners,
    bannersMobile: bannersMobile.length ? bannersMobile : banners,
  };
  const baseTheme = values["base-theme"].trim().toLowerCase();

  const workspaceDir = await mkdtemp(path.join(os.tmpdir(), "ascend-theme-cli-"));
  let publishedOk = false;
  let previewUrl = "";

  try {
    log("theme list --json…");
    const list = await runCli(["list", "--json"], { cwd: workspaceDir, token });
    requireOk(["list", "--json"], list);
    let installs = parseInstallations(list.stdout);
    log(`${installs.length} instalação(ões) na loja`);

    const isTarget = (i) => i.baseTheme.includes(baseTheme);
    let target = installs.find((i) => isTarget(i) && !i.isProductive)
              ?? installs.find((i) => isTarget(i) && i.isProductive);
    let targetId;

    if (!target) {
      if (installs.length >= 2) {
        die(
          `Loja ${decoded.storeId} já tem 2 instalações e nenhuma de "${baseTheme}". ` +
          `Exclua uma manualmente no admin (a API não remove tema produtivo).`,
          2,
        );
      }
      const title = `Ascend - ${storeName}`.replace(/[^\x20-\x7E]/g, "").slice(0, 80);
      log(`theme create --base-theme ${baseTheme} --title "${title}"…`);
      const created = await runCli(
        ["create", "--base-theme", baseTheme, "--title", title, "--json"],
        { cwd: workspaceDir, token },
      );
      requireOk(["create"], created);
      targetId = findIdInJson(JSON.parse(created.stdout || "{}"));
      if (!targetId) {
        // fallback: relistar e pegar o draft
        installs = parseInstallations(
          (await runCli(["list", "--json"], { cwd: workspaceDir, token })).stdout,
        );
        targetId = installs.find((i) => isTarget(i) && !i.isProductive)?.id;
      }
      if (!targetId) throw new Error("theme create não retornou ID");
      log(`Criado: installation ${targetId}`);
    } else if (target.isProductive) {
      log(`theme clone --theme-id ${target.id} (produtivo) → vai virar rascunho`);
      const cloned = await runCli(
        ["clone", "--theme-id", target.id, "-y", "--json"],
        { cwd: workspaceDir, token },
      );
      requireOk(["clone"], cloned);
      targetId = findIdInJson(JSON.parse(cloned.stdout || "{}"));
      if (!targetId) throw new Error("theme clone não retornou ID");
      log(`Clonado: installation ${targetId}`);
    } else {
      targetId = target.id;
      log(`Reusando rascunho ${baseTheme} (${targetId})`);
    }

    log(`theme pull --theme-id ${targetId}…`);
    const pulled = await runCli(
      ["pull", "--theme-id", targetId, "-v"],
      { cwd: workspaceDir, token },
    );
    requireOk(["pull"], pulled);

    log("Patch config/settings_data.json + templates/*.json…");
    const patchedFiles = await patchWorkspace(workspaceDir, input);
    log(`Arquivos patchados: ${patchedFiles.join(", ")}`);

    log(`theme push --theme-id ${targetId} --force…`);
    const pushed = await runCli(
      ["push", "--theme-id", targetId, "--force", "-v"],
      { cwd: workspaceDir, token },
    );
    requireOk(["push"], pushed);

    const preview = await runCli(
      ["preview", "--theme-id", targetId, "--json"],
      { cwd: workspaceDir, token },
    );
    if (preview.ok) {
      try {
        const j = JSON.parse(preview.stdout);
        previewUrl = j.url ?? j.preview_url ?? j.previewUrl ?? "";
      } catch { /* */ }
      if (!previewUrl) {
        const m = preview.stdout.match(/https?:\/\/[^\s"'`]+/);
        previewUrl = m?.[0] ?? "";
      }
    }
    if (!previewUrl) {
      previewUrl = `https://loja-${decoded.storeId}.nuvemshop.com.br?theme_installation_id=${targetId}`;
      log(`Preview fallback: ${previewUrl}`);
    } else {
      log(`Preview: ${previewUrl}`);
    }

    if (values.publish) {
      log(`theme publish --theme-id ${targetId}…`);
      const pub = await runCli(
        ["publish", "--theme-id", targetId],
        { cwd: workspaceDir, token },
      );
      requireOk(["publish"], pub);
      publishedOk = true;
      log("Publicado na vitrine (produtivo)");
    } else {
      log("Rascunho pronto — passe --publish pra colocar no ar");
    }

    console.log("\n✓ Concluído");
    console.log(JSON.stringify({
      storeId: decoded.storeId,
      installationId: targetId,
      baseTheme,
      previewUrl,
      published: publishedOk,
    }, null, 2));
  } catch (e) {
    console.error(`\n✗ Falhou: ${e instanceof Error ? e.message : e}`);
    if (values.keep) console.error(`workspace mantido: ${workspaceDir}`);
    process.exit(3);
  } finally {
    if (!values.keep) await rm(workspaceDir, { recursive: true, force: true }).catch(() => {});
    else log(`Workspace mantido: ${workspaceDir}`);
  }
}

main().catch((e) => {
  console.error(`✗ Erro inesperado: ${e?.stack ?? e}`);
  process.exit(99);
});
