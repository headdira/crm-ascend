"use client";

import Link from "next/link";
import { useState } from "react";
import { BUILDER_FONT_OPTIONS } from "@crm-ascend/validation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ThemeAssets = {
  logo?: string;
  bannersDesktop?: string[];
  bannersMobile?: string[];
};

type Payload = {
  verifyTab?: string;
  courseEmail?: string;
  cpf?: string;
  storeEmail?: string;
  storeName?: string;
  niche?: string;
  bannerIds?: string[];
  logoId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontId?: string;
  nuvemshopLoginEmail?: string;
  nuvemshopLoginPassword?: string;
  logoSvg?: string;
  bannerSvgs?: string[];
  oauthSessionId?: string;
};

function ColorSwatch({ label, hex }: { label: string; hex: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="size-10 shrink-0 rounded-md border shadow-sm"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <div>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-mono text-sm font-medium">{hex}</p>
      </div>
    </div>
  );
}

function SvgPreview({ svg, alt, className }: { svg: string; alt: string; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-lg border bg-muted/30 ${className ?? ""}`}
      role="img"
      aria-label={alt}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function DownloadAssetsButton({
  storeName,
  logoSvg,
  bannerSvgs,
  themeAssets,
}: {
  storeName: string;
  logoSvg?: string;
  bannerSvgs?: string[];
  themeAssets?: ThemeAssets | null;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    const slug = storeName.replace(/\s+/g, "-").toLowerCase().slice(0, 40) || "loja";

    try {
      if (logoSvg) {
        downloadBlob(`${slug}-logo.svg`, logoSvg, "image/svg+xml");
        await new Promise((r) => setTimeout(r, 200));
      }

      if (bannerSvgs?.length) {
        bannerSvgs.forEach((svg, i) => {
          setTimeout(() => {
            downloadBlob(`${slug}-banner-${i + 1}.svg`, svg, "image/svg+xml");
          }, 300 * (i + 1));
        });
      }

      const remoteUrls = [
        ...(themeAssets?.bannersDesktop ?? []),
        ...(themeAssets?.bannersMobile ?? []),
      ];
      if (themeAssets?.logo) remoteUrls.unshift(themeAssets.logo);

      for (let i = 0; i < remoteUrls.length; i++) {
        const url = remoteUrls[i];
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          const ext = url.includes(".png") ? "png" : url.includes(".jpg") ? "jpg" : "bin";
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = `${slug}-asset-${i + 1}.${ext}`;
          a.click();
          URL.revokeObjectURL(blobUrl);
          await new Promise((r) => setTimeout(r, 300));
        } catch {
          /* skip failed remote asset */
        }
      }
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  return (
    <Button type="button" variant="secondary" disabled={downloading} onClick={() => void handleDownload()}>
      {downloading ? "Baixando…" : "Baixar todos os banners e logo"}
    </Button>
  );
}

function CredentialField({ label, value }: { label: string; value: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs">{label}</p>
      <div className="flex items-center gap-2">
        <p className="font-mono text-sm">{visible ? value : "••••••••••••"}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => setVisible((v) => !v)}>
          {visible ? "Ocultar" : "Revelar"}
        </Button>
      </div>
    </div>
  );
}

export function BuilderSubmissionDetail({
  submission,
}: {
  submission: {
    id: string;
    store_name: string | null;
    niche: string | null;
    course_email: string | null;
    store_email: string | null;
    created_at: string;
    provision_status?: string | null;
    store_preview_url?: string | null;
    nuvemshop_store_id?: string | null;
    case_id?: string | null;
    theme_assets?: ThemeAssets | null;
    payload: Payload;
  };
}) {
  const payload = submission.payload ?? {};
  const fontTitle =
    BUILDER_FONT_OPTIONS.find((f) => f.id === payload.fontId)?.title ?? payload.fontId ?? "—";
  const verifyLabel =
    payload.verifyTab === "cpf"
      ? `CPF: ${payload.cpf ?? "—"}`
      : payload.courseEmail ?? submission.course_email ?? "—";

  return (
    <div className="flex flex-col gap-6">
      {submission.case_id ? (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm dark:border-emerald-900 dark:bg-emerald-950/30">
          <Badge variant="outline">Caso aberto</Badge>
          <Link href={`/crm/cases/${submission.case_id}`} className="text-primary font-medium underline">
            Ver caso de customização de loja
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          Caso de customização não foi criado automaticamente — verifique o serviço LOJA-CUSTOMIZACAO
          no banco.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
            Identificação
          </p>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Nome da loja</dt>
              <dd className="font-medium">{submission.store_name ?? payload.storeName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Nicho</dt>
              <dd className="font-medium">{submission.niche ?? payload.niche ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Verificação aluno</dt>
              <dd className="font-medium">{verifyLabel}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Fonte</dt>
              <dd className="font-medium">{fontTitle}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
            Acesso Nuvemshop
          </p>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">E-mail contato loja</dt>
              <dd className="font-medium">{submission.store_email ?? payload.storeEmail ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">E-mail login admin</dt>
              <dd className="font-medium">{payload.nuvemshopLoginEmail ?? "—"}</dd>
            </div>
            {payload.nuvemshopLoginPassword ? (
              <CredentialField label="Senha login admin" value={payload.nuvemshopLoginPassword} />
            ) : null}
            <div>
              <dt className="text-muted-foreground">Store ID OAuth</dt>
              <dd className="font-mono text-xs">{submission.nuvemshop_store_id ?? "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
            Cores escolhidas
          </p>
          <div className="space-y-3">
            {payload.primaryColor ? (
              <ColorSwatch label="Objetos e textos (escuro)" hex={payload.primaryColor} />
            ) : null}
            {payload.secondaryColor ? (
              <ColorSwatch label="Fundo e destaque (claro)" hex={payload.secondaryColor} />
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-medium">Banners e logo customizados</p>
          <DownloadAssetsButton
            storeName={submission.store_name ?? "loja"}
            logoSvg={payload.logoSvg}
            bannerSvgs={payload.bannerSvgs}
            themeAssets={submission.theme_assets}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {payload.logoSvg ? (
            <div>
              <p className="text-muted-foreground mb-2 text-xs">Logo</p>
              <SvgPreview svg={payload.logoSvg} alt="Logo customizada" className="aspect-square max-h-40" />
            </div>
          ) : null}
          {payload.bannerSvgs?.map((svg, i) => (
            <div key={`banner-${i}`}>
              <p className="text-muted-foreground mb-2 text-xs">Banner {i + 1}</p>
              <SvgPreview svg={svg} alt={`Banner ${i + 1}`} className="aspect-[16/10]" />
            </div>
          ))}
        </div>

        {submission.theme_assets ? (
          <div className="mt-4 border-t pt-4">
            <p className="text-muted-foreground mb-2 text-xs font-medium">Assets provisionados (Supabase)</p>
            <ul className="flex flex-wrap gap-2 text-sm">
              {submission.theme_assets.logo ? (
                <li>
                  <a
                    href={submission.theme_assets.logo}
                    className="text-primary underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Logo
                  </a>
                </li>
              ) : null}
              {submission.theme_assets.bannersDesktop?.map((url, i) => (
                <li key={`d-${i}`}>
                  <a href={url} className="text-primary underline" target="_blank" rel="noopener noreferrer">
                    Desktop {i + 1}
                  </a>
                </li>
              ))}
              {submission.theme_assets.bannersMobile?.map((url, i) => (
                <li key={`m-${i}`}>
                  <a href={url} className="text-primary underline" target="_blank" rel="noopener noreferrer">
                    Mobile {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-2">
        <div>
          <span className="text-muted-foreground">Provisionamento</span>
          <p className="font-medium capitalize">{submission.provision_status ?? "—"}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Preview loja</span>
          <p className="font-medium">
            {submission.store_preview_url ? (
              <a
                href={submission.store_preview_url}
                className="text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir loja
              </a>
            ) : (
              "—"
            )}
          </p>
        </div>
      </div>

      <details className="rounded-lg border">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium">Payload JSON completo</summary>
        <pre className="bg-muted/40 overflow-x-auto border-t p-4 text-xs">
          {JSON.stringify(submission.payload, null, 2)}
        </pre>
      </details>
    </div>
  );
}
