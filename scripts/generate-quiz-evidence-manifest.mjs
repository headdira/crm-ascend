#!/usr/bin/env node
/**
 * Regenera arrays de paths em quiz-evidence.ts a partir de public/media/quiz-evidence.
 * Pastas espelham Downloads/Imagens: faturamento, notificacoes, mencoes-erick, videos.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MEDIA = path.join(ROOT, "apps/landing/public/media/quiz-evidence");
const TARGET = path.join(ROOT, "apps/landing/src/lib/sales/quiz-evidence.ts");
const BASE = "/media/quiz-evidence";

const CATEGORIES = [
  { sub: "proof/faturamento", export: "QUIZ_PROOF_FATURAMENTO" },
  { sub: "proof/notificacoes", export: "QUIZ_PROOF_NOTIFICACOES" },
  { sub: "proof/mencoes-erick", export: "QUIZ_PROOF_MENCOES_ERICK" },
];

function listMediaUrls(sub) {
  const dir = path.join(MEDIA, sub);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => `${BASE}/${sub}/${f}`);
}

function renderArray(name, urls) {
  const lines = urls.map((u) => `  "${u}",`).join("\n");
  return `export const ${name} = [\n${lines}\n] as const;`;
}

const fat = listMediaUrls("proof/faturamento");
const notif = listMediaUrls("proof/notificacoes");
const erick = listMediaUrls("proof/mencoes-erick");
const all = [...fat, ...notif, ...erick];

const manifest = [
  "/** Manifest gerado por scripts/import-quiz-evidence.sh — não editar paths manualmente. */",
  `export const QUIZ_EVIDENCE_BASE = "${BASE}" as const;`,
  "",
  renderArray("QUIZ_PROOF_FATURAMENTO", fat),
  renderArray("QUIZ_PROOF_NOTIFICACOES", notif),
  renderArray("QUIZ_PROOF_MENCOES_ERICK", erick),
  renderArray("QUIZ_ALL_PROOFS", all),
  "",
].join("\n");

const source = fs.readFileSync(TARGET, "utf8");
const begin = "/** MANIFEST:BEGIN */";
const end = "/** MANIFEST:END */";

let next;
if (source.includes(begin) && source.includes(end)) {
  next = source.replace(
    new RegExp(`${begin}[\\s\\S]*?${end}`),
    `${begin}\n${manifest}\n${end}`,
  );
} else {
  const logicStart = source.indexOf("/** Celular inteiro");
  if (logicStart === -1) {
    console.error("Marcadores MANIFEST ou bloco de lógica não encontrados em quiz-evidence.ts");
    process.exit(1);
  }
  const logic = source.slice(logicStart);
  next = `${begin}\n${manifest}\n${end}\n\n${logic}`;
}

fs.writeFileSync(TARGET, next);
console.log(`Manifest atualizado: ${fat.length} fat, ${notif.length} notif, ${erick.length} erick`);
