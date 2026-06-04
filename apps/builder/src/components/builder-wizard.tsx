"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  BUILDER_FONT_OPTIONS,
  BUILDER_NICHES,
} from "@crm-ascend/validation";
import { AscendLogoMark } from "@/components/colored-svg";
import { ColoredAsset } from "@/components/colored-asset";
import { exportRecoloredAsset } from "@/lib/recolor-raster";
import {
  generateLogoVariants,
  generatedLogoVariantLabel,
} from "@/lib/generate-logo-variants";
import { exportGeneratedLogoRaster } from "@/lib/rasterize-generated-logo";
import { BUILDER_RASTER_PREVIEW_MAX_WIDTH } from "@/lib/raster-template";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import {
  fetchCatalog,
  fetchOAuthSession,
  submitBuilder,
} from "@/lib/api";
import {
  emptyForm,
  STEP_LABELS,
  STORAGE_KEY,
  formForLocalStorage,
  mergeSavedForm,
  normalizeStoreAdminHost,
  type BuilderCatalog,
  type BuilderFormState,
} from "@/lib/types";
import { recolorSvg } from "@crm-ascend/validation";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function StepVerify({
  form,
  update,
}: {
  form: BuilderFormState;
  update: (key: keyof BuilderFormState, value: BuilderFormState[keyof BuilderFormState]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Verificação de aluno</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Preencha o e-mail cadastrado no curso ou seu CPF para liberar o builder.
        </p>
      </div>
      <div className="flex rounded-lg border border-zinc-800 p-1">
        {(["email", "cpf"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => update("verifyTab", tab)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              form.verifyTab === tab
                ? "bg-zinc-800 text-ascend-gold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab === "email" ? "E-mail do curso" : "CPF"}
          </button>
        ))}
      </div>
      {form.verifyTab === "email" ? (
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">E-mail do curso</span>
          <input
            type="email"
            autoComplete="email"
            value={form.courseEmail}
            onChange={(e) => update("courseEmail", e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-black/40 px-4 py-3 text-zinc-100 outline-none ring-ascend-gold/40 placeholder:text-zinc-600 focus:border-ascend-gold focus:ring-2"
            placeholder="voce@email.com"
          />
        </label>
      ) : (
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">CPF</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.cpf}
            onChange={(e) => update("cpf", e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-black/40 px-4 py-3 text-zinc-100 outline-none ring-ascend-gold/40 placeholder:text-zinc-600 focus:border-ascend-gold focus:ring-2"
            placeholder="000.000.000-00"
          />
          <span className="text-xs text-zinc-500">
            Apenas para layout: {digitsOnly(form.cpf).length}/11 dígitos
          </span>
        </label>
      )}
    </div>
  );
}

function StepNuvemshopConnect({
  form,
  update,
  oauthConnecting,
  onClearOAuth,
}: {
  form: BuilderFormState;
  update: (key: keyof BuilderFormState, value: BuilderFormState[keyof BuilderFormState]) => void;
  oauthConnecting?: boolean;
  onClearOAuth: () => void;
}) {
  const connected = Boolean(form.oauthSessionId && form.nuvemshopStoreId);
  const storeHost = normalizeStoreAdminHost(form.storeAdminHost);

  const startOAuth = () => {
    const host = normalizeStoreAdminHost(form.storeAdminHost);
    if (!host) return;

    onClearOAuth();
    try {
      sessionStorage.setItem("ascend_oauth_pending", "1");
    } catch {
      /* ignore */
    }

    const returnUrl = `${window.location.origin}${window.location.pathname}?oauth_return=1`;
    const params = new URLSearchParams({
      return_url: returnUrl,
      force: "1",
      store_host: host,
    });
    window.location.replace(`/api/oauth/start?${params.toString()}`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Conectar sua loja Nuvemshop</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Uma conexão OAuth basta. Logo, banners e cores vão para a vitrine via{" "}
          <strong className="text-zinc-300">API de Scripts</strong> (sem CLI de tema) — funciona com Toluca
          ou qualquer tema instalado.
        </p>
      </div>
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">E-mail da loja (contato)</span>
        <input
          type="email"
          value={form.storeEmail}
          onChange={(e) => update("storeEmail", e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-black/40 px-4 py-3 text-zinc-100 outline-none focus:border-ascend-gold focus:ring-2 focus:ring-ascend-gold/40"
          placeholder="loja@email.com"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Endereço da sua loja no admin Nuvemshop</span>
        <input
          type="text"
          value={form.storeAdminHost}
          onChange={(e) => update("storeAdminHost", e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-black/40 px-4 py-3 text-zinc-100 outline-none focus:border-ascend-gold focus:ring-2 focus:ring-ascend-gold/40"
          placeholder="sualoja.lojavirtualnuvem.com.br"
          autoComplete="off"
        />
        <span className="text-xs text-zinc-500">
          O mesmo domínio em que você entra no painel (ex.{" "}
          <span className="text-zinc-400">aestheticwrld.lojavirtualnuvem.com.br</span>). O OAuth abre
          lá, não em nuvemshop.com.br genérico.
        </span>
        {form.storeAdminHost.trim() && !storeHost && (
          <span className="text-xs text-red-400">Domínio inválido — use o host do admin da loja.</span>
        )}
      </label>
      {oauthConnecting ? (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-300">
          Validando conexão com a Nuvemshop…
        </div>
      ) : null}
      {connected && !oauthConnecting && (
        <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">
          Autorização desta sessão: loja {form.nuvemshopStoreId || "conectada"}. Ao finalizar o wizard,
          associamos o script da vitrine com suas cores e banners.
        </div>
      )}
      <button
        type="button"
        onClick={startOAuth}
        disabled={oauthConnecting || !storeHost}
        className="w-full rounded-lg bg-ascend-gold px-4 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {connected ? "Autorizar novamente no admin da loja" : "Abrir autorização no admin da loja"}
      </button>
      <p className="text-xs text-zinc-500">
        Se o app Ascend já estiver instalado, a Nuvemshop pode voltar em 1–2 segundos sem pedir de novo —
        isso é normal. Para ver a tela de permissões, desinstale o app no admin da loja antes de clicar.
      </p>
    </div>
  );
}

function StepNuvemshopCredentials({
  form,
  update,
}: {
  form: BuilderFormState;
  update: (key: keyof BuilderFormState, value: BuilderFormState[keyof BuilderFormState]) => void;
}) {
  const oauthOk = Boolean(form.oauthSessionId);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Acesso ao admin da loja</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Informe o e-mail e a senha que você usa para entrar no painel Nuvemshop da sua loja.
          Nossa equipe usa esses dados para aplicar manualmente as cores e banners que você
          escolher — com segurança e apenas para a customização.
        </p>
      </div>

      {!oauthOk && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Conecte sua loja na etapa anterior antes de informar o acesso.
        </div>
      )}

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">E-mail de login Nuvemshop</span>
        <input
          type="email"
          autoComplete="username"
          value={form.nuvemshopLoginEmail}
          onChange={(e) => update("nuvemshopLoginEmail", e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-black/40 px-4 py-3 text-zinc-100 outline-none focus:border-ascend-gold focus:ring-2 focus:ring-ascend-gold/40"
          placeholder="seu@email.com"
        />
        <span className="text-xs text-zinc-500">
          O mesmo e-mail que você digita na tela de login do admin da loja.
        </span>
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Senha de login Nuvemshop</span>
        <input
          type="password"
          autoComplete="current-password"
          value={form.nuvemshopLoginPassword}
          onChange={(e) => update("nuvemshopLoginPassword", e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-black/40 px-4 py-3 text-zinc-100 outline-none focus:border-ascend-gold focus:ring-2 focus:ring-ascend-gold/40"
          placeholder="••••••••"
        />
        <span className="text-xs text-zinc-500">
          Não salvamos a senha no seu navegador — você precisará informá-la novamente se
          recarregar a página antes de enviar.
        </span>
      </label>
    </div>
  );
}

function StepPlan({
  affiliate,
  youtubeEmbedUrl,
  form,
  update,
}: {
  affiliate: string;
  youtubeEmbedUrl: string | null;
  form: BuilderFormState;
  update: (key: keyof BuilderFormState, value: BuilderFormState[keyof BuilderFormState]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Plano</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Assista ao vídeo para entender como assinar o plano. Se ainda não criou a loja, use o link
          de cadastro na Nuvemshop.
        </p>
      </div>
      <div className="aspect-video overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        {youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            title="Vídeo explicativo do plano"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="text-4xl" aria-hidden>
              ▶
            </span>
            <p className="text-sm font-medium text-zinc-300">Vídeo não configurado</p>
            <p className="max-w-sm text-xs text-zinc-500">
              Configure a URL do YouTube na aba Builder do CRM.
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-black/30 p-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={form.planWatchedInfo}
            onChange={(e) => update("planWatchedInfo", e.target.checked)}
            className="mt-1 size-4 rounded border-zinc-600 text-ascend-gold focus:ring-ascend-gold"
          />
          <span>Revisei o vídeo / já sei como assinar e quero seguir em frente.</span>
        </label>
        <Link
          href={affiliate}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-ascend-gold/50 bg-ascend-gold/10 px-4 py-3 text-sm font-semibold text-ascend-gold transition hover:bg-ascend-gold/20"
        >
          Link de cadastro Nuvemshop
        </Link>
      </div>
    </div>
  );
}

function StepStoreName({
  form,
  update,
}: {
  form: BuilderFormState;
  update: (key: keyof BuilderFormState, value: BuilderFormState[keyof BuilderFormState]) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Nome da loja</h2>
        <p className="mt-1 text-sm text-zinc-400">Como sua marca deve aparecer para clientes.</p>
      </div>
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Nome da loja</span>
        <input
          type="text"
          value={form.storeName}
          onChange={(e) => update("storeName", e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-black/40 px-4 py-3 text-zinc-100 outline-none focus:border-ascend-gold focus:ring-2 focus:ring-ascend-gold/40"
          placeholder="Ex.: Ascend Imports"
        />
      </label>
    </div>
  );
}

function StepNiche({
  form,
  onSelectNiche,
}: {
  form: BuilderFormState;
  onSelectNiche: (niche: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Nicho</h2>
        <p className="mt-1 text-sm text-zinc-400">Escolha o segmento principal da loja.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {BUILDER_NICHES.map((niche) => (
          <button
            key={niche}
            type="button"
            onClick={() => onSelectNiche(niche)}
            className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
              form.niche === niche
                ? "border-ascend-gold bg-ascend-gold/10 text-ascend-gold"
                : "border-zinc-800 text-zinc-300 hover:border-zinc-600"
            }`}
          >
            {niche}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepBanners({
  form,
  catalog,
  toggleBanner,
  update,
}: {
  form: BuilderFormState;
  catalog: BuilderCatalog;
  toggleBanner: (id: string) => void;
  update: (key: keyof BuilderFormState, value: BuilderFormState[keyof BuilderFormState]) => void;
}) {
  const previewPrimary = useDebouncedValue(form.primaryColor, 80);
  const previewSecondary = useDebouncedValue(form.secondaryColor, 80);

  const banners = useMemo(() => {
    return catalog.banners.filter(
      (b) => b.niche === form.niche || b.niche === "Genérico",
    );
  }, [catalog.banners, form.niche]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Personalização — banners e cores</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Escolha <strong className="text-zinc-200">3 banners</strong> do seu nicho. As cores
          abaixo são aplicadas automaticamente nas artes.
        </p>
      </div>
      <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-300">
        <p className="font-medium text-zinc-100">Como funcionam as cores nos banners</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-zinc-400">
          <li>
            <strong className="text-zinc-300">Cor dos objetos</strong> — textos, ícones e formas
            escuras do banner. Recomendamos <strong className="text-zinc-200">preto (#0a0a0a)</strong>{" "}
            para melhor contraste com qualquer fundo.
          </li>
          <li>
            <strong className="text-zinc-300">Cor de fundo/destaque</strong> — áreas claras e
            fundo. Use a cor da sua marca (ex.: dourado, azul, verde).
          </li>
          <li>
            Cores muito claras nos objetos ou muito escuras no fundo podem deixar a arte difícil
            de ler — confira sempre a prévia abaixo antes de avançar.
          </li>
        </ul>
      </div>
      <p className="text-xs text-zinc-500">
        Selecionados: {form.bannerIds.length}/3 · Disponíveis: {banners.length}
      </p>
      {banners.length > 0 && banners.length < 3 ? (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Faltam banners neste nicho (mínimo 3). Cadastre no CRM (Builder → Banners) ou aplique a
          migration <code className="text-amber-100/90">011_builder_extra_banners.sql</code> no
          Supabase.
        </p>
      ) : null}
      {banners.length === 0 ? (
        <p className="text-sm text-zinc-400">
          Nenhum banner disponível para este nicho. Adicione banners no CRM.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {banners.map((banner) => {
            const selected = form.bannerIds.includes(banner.id);
            return (
              <button
                key={banner.id}
                type="button"
                onClick={() => toggleBanner(banner.id)}
                className={`group relative overflow-hidden rounded-xl border-2 transition ${
                  selected
                    ? "border-ascend-gold ring-2 ring-ascend-gold/30"
                    : "border-zinc-800 hover:border-zinc-600"
                }`}
              >
                <ColoredAsset
                  content={banner.svg_content}
                  primary={previewPrimary}
                  secondary={previewSecondary}
                  previewMaxWidth={BUILDER_RASTER_PREVIEW_MAX_WIDTH}
                  alt={banner.name}
                  className="aspect-[16/10] w-full object-cover [&_img]:h-full [&_img]:w-full [&_svg]:h-full [&_svg]:w-full"
                />
                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-300">
                  {banner.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-zinc-300">Cor dos objetos e textos</span>
          <input
            type="color"
            value={form.primaryColor}
            onChange={(e) => update("primaryColor", e.target.value)}
            className="h-12 w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-900"
          />
          <span className="text-xs text-zinc-500">
            Padrão preto — melhor legibilidade. Valor: {form.primaryColor}
          </span>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-zinc-300">Cor de fundo e destaque</span>
          <input
            type="color"
            value={form.secondaryColor}
            onChange={(e) => update("secondaryColor", e.target.value)}
            className="h-12 w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-900"
          />
          <span className="text-xs text-zinc-500">Cor da marca — fundo e áreas claras. Valor: {form.secondaryColor}</span>
        </label>
      </div>
    </div>
  );
}

function StepFonts({
  form,
  update,
}: {
  form: BuilderFormState;
  update: (key: keyof BuilderFormState, value: BuilderFormState[keyof BuilderFormState]) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Escolha das fontes</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Escolha a fonte do texto da sua loja.
        </p>
      </div>
      <div className="space-y-3">
        {BUILDER_FONT_OPTIONS.map((font) => (
          <button
            key={font.id}
            type="button"
            onClick={() => update("fontId", font.id)}
            className={`w-full rounded-xl border px-4 py-4 text-left transition ${
              form.fontId === font.id
                ? "border-ascend-gold bg-ascend-gold/10"
                : "border-zinc-800 hover:border-zinc-600"
            }`}
          >
            <p
              className="text-lg text-zinc-100"
              style={{ fontFamily: `var(${font.cssVar}), sans-serif` }}
            >
              {font.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepLogo({
  form,
  catalog,
  setForm,
}: {
  form: BuilderFormState;
  catalog: BuilderCatalog;
  setForm: Dispatch<SetStateAction<BuilderFormState>>;
}) {
  const previewPrimary = useDebouncedValue(form.primaryColor, 80);
  const previewSecondary = useDebouncedValue(form.secondaryColor, 80);

  const generatedVariants = useMemo(
    () =>
      generateLogoVariants({
        storeName: form.storeName,
        niche: form.niche,
        fontId: form.fontId || "dm-sans",
      }),
    [form.storeName, form.niche, form.fontId],
  );

  const logos = useMemo(() => {
    return catalog.logos.filter(
      (l) => l.niche === form.niche || l.niche === "Genérico",
    );
  }, [catalog.logos, form.niche]);

  const selectCatalogLogo = (id: string) => {
    setForm((prev) => ({
      ...prev,
      logoSource: "catalog",
      logoId: id,
      generatedLogoVariant: "",
    }));
  };

  const selectGeneratedLogo = (variantId: string) => {
    setForm((prev) => ({
      ...prev,
      logoSource: "generated",
      logoId: "",
      generatedLogoVariant: variantId,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Escolha sua logo</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Logos tipográficas com o <strong className="text-zinc-200">nome da sua loja</strong> na
          fonte escolhida, ou um modelo pronto do catálogo.
        </p>
      </div>

      {form.storeName.trim().length >= 2 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-200">
            Logos com &ldquo;{form.storeName.trim()}&rdquo;
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {generatedVariants.map((variant) => {
              const selected =
                form.logoSource === "generated" && form.generatedLogoVariant === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => selectGeneratedLogo(variant.id)}
                  className={`rounded-xl border-2 p-4 transition ${
                    selected
                      ? "border-ascend-gold bg-ascend-gold/10 ring-2 ring-ascend-gold/30"
                      : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <ColoredAsset
                    content={variant.svg}
                    primary={previewPrimary}
                    secondary={previewSecondary}
                    alt={variant.label}
                    className="mx-auto h-20 w-full max-w-[140px] [&_img]:h-full [&_img]:w-full [&_svg]:h-full [&_svg]:w-full"
                  />
                  <p className="mt-2 text-center text-xs text-zinc-400">{variant.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-400">
          Informe o nome da loja (etapa anterior) para ver logos personalizadas com o nome da marca.
        </p>
      )}

      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-200">Modelos do catálogo</p>
        {logos.length === 0 ? (
          <p className="text-sm text-zinc-400">
            Nenhuma logo neste nicho. Use as opções com o nome da loja acima.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {logos.map((logo) => {
              const selected = form.logoSource === "catalog" && form.logoId === logo.id;
              return (
                <button
                  key={logo.id}
                  type="button"
                  onClick={() => selectCatalogLogo(logo.id)}
                  className={`rounded-xl border-2 p-4 transition ${
                    selected
                      ? "border-ascend-gold bg-ascend-gold/10 ring-2 ring-ascend-gold/30"
                      : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <ColoredAsset
                    content={logo.svg_content}
                    primary={previewPrimary}
                    secondary={previewSecondary}
                    previewMaxWidth={480}
                    alt={logo.name}
                    className="mx-auto h-20 w-20 [&_img]:h-full [&_img]:w-full [&_svg]:h-full [&_svg]:w-full"
                  />
                  <p className="mt-2 text-center text-xs text-zinc-400">{logo.name}</p>
                  {logo.niche !== form.niche && (
                    <p className="mt-0.5 text-center text-[10px] text-zinc-500">{logo.niche}</p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-right font-medium text-zinc-200 sm:max-w-[60%]">{value}</dd>
    </div>
  );
}

function StepReview({ form, catalog }: { form: BuilderFormState; catalog: BuilderCatalog }) {
  const verify =
    form.verifyTab === "email" ? form.courseEmail : `${digitsOnly(form.cpf)} (CPF)`;
  const fontTitle =
    BUILDER_FONT_OPTIONS.find((f) => f.id === form.fontId)?.title ?? "—";
  const logoName =
    form.logoSource === "generated"
      ? `${form.storeName.trim()} (${generatedLogoVariantLabel(form.generatedLogoVariant)})`
      : (catalog.logos.find((l) => l.id === form.logoId)?.name ?? "—");
  const bannerNames = form.bannerIds
    .map((id) => catalog.banners.find((b) => b.id === id)?.name ?? id)
    .join(", ");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Revisão final</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Confira todas as informações antes de enviar.
        </p>
      </div>
      <dl className="divide-y divide-zinc-800 text-sm">
        <ReviewRow label="Verificação" value={verify || "—"} />
        <ReviewRow label="E-mail da loja" value={form.storeEmail || "—"} />
        <ReviewRow
          label="Login Nuvemshop"
          value={form.nuvemshopLoginEmail ? `${form.nuvemshopLoginEmail} · senha informada` : "—"}
        />
        <ReviewRow
          label="Nuvemshop OAuth"
          value={form.oauthSessionId ? `Conectada (${form.nuvemshopStoreId || "ok"})` : "Não conectada"}
        />
        <ReviewRow
          label="Plano"
          value={form.planWatchedInfo ? "Vídeo revisado" : "—"}
        />
        <ReviewRow label="Nome da loja" value={form.storeName || "—"} />
        <ReviewRow label="Nicho" value={form.niche || "—"} />
        <ReviewRow label="Banners" value={bannerNames || "—"} />
        <ReviewRow
          label="Cores"
          value={`Objetos ${form.primaryColor} · Fundo ${form.secondaryColor}`}
        />
        <ReviewRow label="Fonte" value={fontTitle} />
        <ReviewRow label="Logo" value={logoName} />
      </dl>
    </div>
  );
}

function StepDone({ form }: { form: BuilderFormState }) {
  return (
    <div className="space-y-6 py-4 text-center">
      <div className="text-5xl" aria-hidden>
        🎉
      </div>
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">
          Tudo certo, {form.storeName.trim() || "Aluno"}!
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-200">
          Recebemos suas escolhas. Sua loja ficará pronta em até{" "}
          <strong className="text-ascend-gold">72 horas</strong>.
        </p>
      </div>
    </div>
  );
}

export function BuilderWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BuilderFormState>(emptyForm);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<BuilderCatalog | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [oauthConnecting, setOauthConnecting] = useState(false);

  const clearOAuth = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      oauthSessionId: "",
      nuvemshopStoreId: "",
    }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setCatalogLoading(true);
    fetchCatalog()
      .then(setCatalog)
      .catch((err) => setCatalogError(err instanceof Error ? err.message : "Erro ao carregar"))
      .finally(() => setCatalogLoading(false));

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { step: number; form: Partial<BuilderFormState> };
        setForm(mergeSavedForm(parsed.form));
        if (parsed.step) {
          setStep(Math.min(Math.max(parsed.step, 1), STEP_LABELS.length));
        }
      } catch {
        /* ignore */
      }
    }

    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");
    if (code && params.get("state")) {
      const qs = params.toString();
      window.location.replace(`/api/oauth/callback?${qs}`);
      return;
    }

    const oauthId = params.get("oauth_session_id");
    const oauthReturn =
      params.get("oauth_return") === "1" ||
      (typeof sessionStorage !== "undefined" &&
        sessionStorage.getItem("ascend_oauth_pending") === "1");

    if (oauthId && !oauthReturn) {
      params.delete("oauth_session_id");
      params.delete("oauth_mock");
      const qs = params.toString();
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${qs ? `?${qs}` : ""}`,
      );
    }

    if (oauthId && oauthReturn) {
      try {
        sessionStorage.removeItem("ascend_oauth_pending");
      } catch {
        /* ignore */
      }
      setOauthConnecting(true);
      setError(null);
      setForm((prev) => ({ ...prev, oauthSessionId: oauthId }));

      fetchOAuthSession(oauthId)
        .then((session) => {
          setForm((prev) => ({
            ...prev,
            oauthSessionId: oauthId,
            nuvemshopStoreId: session.store_id,
          }));
          params.delete("oauth_session_id");
          params.delete("oauth_mock");
          params.delete("oauth_return");
          const qs = params.toString();
          const next = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
          window.history.replaceState({}, "", next);
        })
        .catch((err) => {
          clearOAuth();
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível validar a conexão. Tente de novo ou verifique o provisioner na Vercel.",
          );
        })
        .finally(() => setOauthConnecting(false));
    }

    setReady(true);
  }, [clearOAuth]);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step, form: formForLocalStorage(form) }),
      );
    }
  }, [step, form, ready]);

  const update = useCallback(
    (key: keyof BuilderFormState, value: BuilderFormState[keyof BuilderFormState]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setError(null);
    },
    [],
  );

  const selectNiche = useCallback((niche: string) => {
    setForm((prev) => ({
      ...prev,
      niche,
      bannerIds: [],
      logoId: "",
      logoSource: "catalog",
      generatedLogoVariant: "",
    }));
    setError(null);
  }, []);

  const toggleBanner = useCallback((id: string) => {
    setForm((prev) => {
      const exists = prev.bannerIds.includes(id);
      let next = [...prev.bannerIds];
      if (exists) next = next.filter((b) => b !== id);
      else if (next.length < 3) next.push(id);
      return { ...prev, bannerIds: next };
    });
    setError(null);
  }, []);

  const validate = useCallback((): string | null => {
    switch (step) {
      case 1:
        if (form.verifyTab === "email") {
          if (!isEmail(form.courseEmail)) return "Informe um e-mail válido do curso.";
        } else if (digitsOnly(form.cpf).length !== 11) {
          return "Informe um CPF válido (11 dígitos).";
        }
        return null;
      case 2:
        if (!isEmail(form.storeEmail)) return "Informe um e-mail válido para a loja.";
        if (!normalizeStoreAdminHost(form.storeAdminHost)) {
          return "Informe o domínio do admin da loja (ex. sualoja.lojavirtualnuvem.com.br).";
        }
        if (!form.oauthSessionId) return "Autorize o app no admin da sua loja antes de continuar.";
        return null;
      case 3:
        if (!isEmail(form.nuvemshopLoginEmail)) {
          return "Informe o e-mail de login que você usa no admin Nuvemshop.";
        }
        if (form.nuvemshopLoginPassword.trim().length < 4) {
          return "Informe a senha de login do admin Nuvemshop.";
        }
        return null;
      case 4:
        if (!form.planWatchedInfo) return "Confirme que assistiu ou revisou o vídeo explicativo.";
        return null;
      case 5:
        if (form.storeName.trim().length < 2) return "Nome da loja muito curto.";
        return null;
      case 6:
        if (!form.niche) return "Selecione um nicho.";
        return null;
      case 7:
        if (form.bannerIds.length !== 3) {
          const available = (catalog?.banners ?? []).filter(
            (b) => b.niche === form.niche || b.niche === "Genérico",
          ).length;
          if (available < 3) {
            return `Só há ${available} banner(s) para este nicho. Cadastre mais no CRM (mínimo 3).`;
          }
          return "Escolha exatamente 3 banners.";
        }
        return null;
      case 8:
        if (!form.fontId) return "Escolha uma fonte.";
        return null;
      case 9:
        if (form.logoSource === "generated") {
          if (!form.generatedLogoVariant) return "Escolha uma logo com o nome da sua loja.";
        } else if (!form.logoId) {
          return "Escolha uma logo.";
        }
        return null;
      default:
        return null;
    }
  }, [step, form, catalog]);

  const goNext = useCallback(() => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    if (step === 10 && catalog) {
      startTransition(async () => {
        try {
          const banners = form.bannerIds
            .map((id) => catalog.banners.find((b) => b.id === id))
            .filter(Boolean);
          if (banners.length !== 3) {
            setStep(11);
            setError(null);
            return;
          }

          let logoSvgPayload: string;
          let logoId: string | undefined;
          let generatedLogoVariant: string | undefined;

          if (form.logoSource === "generated") {
            if (!form.generatedLogoVariant) {
              setError("Escolha uma logo com o nome da sua loja.");
              return;
            }
            generatedLogoVariant = form.generatedLogoVariant;
            const rasterParams = {
              storeName: form.storeName,
              fontId: form.fontId,
              primary: form.primaryColor,
              secondary: form.secondaryColor,
            };
            try {
              logoSvgPayload = await exportGeneratedLogoRaster({
                variantId: form.generatedLogoVariant,
                ...rasterParams,
              });
            } catch {
              try {
                logoSvgPayload = await exportGeneratedLogoRaster({
                  variantId: "wordmark",
                  ...rasterParams,
                });
              } catch {
                logoSvgPayload = "";
              }
            }
          } else {
            const logo = catalog.logos.find((l) => l.id === form.logoId);
            if (!logo) {
              setStep(11);
              setError(null);
              return;
            }
            logoId = form.logoId;
            logoSvgPayload = await exportRecoloredAsset(
              logo.svg_content,
              form.primaryColor,
              form.secondaryColor,
            );
          }

          try {
            const result = await submitBuilder({
              verifyTab: form.verifyTab,
              courseEmail: form.verifyTab === "email" ? form.courseEmail : undefined,
              cpf: form.verifyTab === "cpf" ? form.cpf : undefined,
              storeEmail: form.storeEmail,
              storeName: form.storeName,
              niche: form.niche,
              bannerIds: form.bannerIds,
              logoSource: form.logoSource,
              logoId,
              generatedLogoVariant,
              primaryColor: form.primaryColor,
              secondaryColor: form.secondaryColor,
              fontId: form.fontId,
              planWatchedInfo: form.planWatchedInfo,
              planWillSubscribe: true,
              oauthSessionId: form.oauthSessionId,
              nuvemshopLoginEmail: form.nuvemshopLoginEmail,
              nuvemshopLoginPassword: form.nuvemshopLoginPassword,
              logoSvg: logoSvgPayload,
              bannerSvgs: await Promise.all(
                banners.map((b) =>
                  exportRecoloredAsset(b!.svg_content, form.primaryColor, form.secondaryColor),
                ),
              ),
            });
            setSubmissionId(result.submission_id ?? null);
          } catch {
            /* cliente sempre vê tela de sucesso */
          }
          setStep(11);
          setError(null);
        } catch {
          setStep(11);
          setError(null);
        }
      });
      return;
    }

    setStep((s) => Math.min(s + 1, STEP_LABELS.length));
    setError(null);
  }, [validate, step, catalog, form]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
    setError(null);
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setForm(emptyForm());
    setStep(1);
    setSubmissionId(null);
    setError(null);
  }, []);

  const progress = Math.round((step / STEP_LABELS.length) * 100);

  if (!ready || catalogLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-zinc-400">Carregando…</div>
    );
  }

  if (catalogError || !catalog) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-300">{catalogError ?? "Catálogo indisponível"}</p>
        <p className="text-sm text-zinc-500">
          Verifique se o CRM está rodando e se a migration do builder foi aplicada.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-col items-center gap-4 text-center">
        <AscendLogoMark className="h-10 w-auto sm:h-12" />
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-ascend-gold">Ascend Club</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            Criação da sua loja
          </h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-400">
            Formulário passo a passo para configurar sua loja.
          </p>
        </div>
      </header>

      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs text-zinc-500">
          <span>
            Etapa {step} de {STEP_LABELS.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-ascend-gold to-yellow-200 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm font-medium text-zinc-300">
          {STEP_LABELS[step - 1]}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl shadow-black/40 backdrop-blur-sm">
        {error && step !== 11 && (
          <div
            className="mb-4 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}
        {step === 1 && <StepVerify form={form} update={update} />}
        {step === 2 && (
          <StepNuvemshopConnect
            form={form}
            update={update}
            oauthConnecting={oauthConnecting}
            onClearOAuth={clearOAuth}
          />
        )}
        {step === 3 && <StepNuvemshopCredentials form={form} update={update} />}
        {step === 4 && (
          <StepPlan
            affiliate={catalog.affiliate_url}
            youtubeEmbedUrl={catalog.youtube_embed_url}
            form={form}
            update={update}
          />
        )}
        {step === 5 && <StepStoreName form={form} update={update} />}
        {step === 6 && <StepNiche form={form} onSelectNiche={selectNiche} />}
        {step === 7 && (
          <StepBanners form={form} catalog={catalog} toggleBanner={toggleBanner} update={update} />
        )}
        {step === 8 && <StepFonts form={form} update={update} />}
        {step === 9 && <StepLogo form={form} catalog={catalog} setForm={setForm} />}
        {step === 10 && <StepReview form={form} catalog={catalog} />}
        {step === 11 && <StepDone form={form} />}
      </div>

      {step < 11 && (
        <nav className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1 || isPending}
            className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Voltar
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg px-3 py-2.5 text-sm text-zinc-500 underline-offset-4 hover:text-zinc-300 hover:underline"
            >
              Limpar rascunho
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={isPending}
              className="rounded-lg bg-ascend-gold px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-60"
            >
              {step === 10 ? (isPending ? "Enviando…" : "Enviar") : "Continuar"}
            </button>
          </div>
        </nav>
      )}

      {step === 11 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            Reiniciar
          </button>
        </div>
      )}
    </div>
  );
}
