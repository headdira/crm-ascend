"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type PreviewData = {
  store_name: string;
  primary_color: string;
  secondary_color: string;
  font_id: string;
  logo_url: string | null;
  banner_urls: string[];
  provision_status: string | null;
  provision_error: string | null;
  note: string;
};

const FONT_STACK: Record<string, string> = {
  montserrat: "'Montserrat', system-ui, sans-serif",
  "dm-sans": "'DM Sans', system-ui, sans-serif",
  playfair: "'Playfair Display', Georgia, serif",
};

function PreviewContent() {
  const params = useSearchParams();
  const submissionId = params.get("submission_id");
  const [data, setData] = useState<PreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    if (!submissionId) {
      setError("Informe ?submission_id= na URL");
      return;
    }
    fetch(`/api/preview-data?submission_id=${encodeURIComponent(submissionId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json() as Promise<PreviewData>;
      })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Erro ao carregar"));
  }, [submissionId]);

  if (error) {
    return (
      <p className="p-8 text-center text-red-300">{error}</p>
    );
  }

  if (!data) {
    return <p className="p-8 text-center text-zinc-400">Carregando prévia…</p>;
  }

  const font = FONT_STACK[data.font_id] ?? FONT_STACK.montserrat;
  const banners = data.banner_urls.length ? data.banner_urls : [];
  const activeBanner = banners[bannerIndex] ?? null;

  return (
    <div className="min-h-screen" style={{ fontFamily: font, backgroundColor: data.secondary_color }}>
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: data.primary_color, color: data.secondary_color }}
      >
        {data.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.logo_url} alt="" className="h-12 w-auto max-w-[160px] object-contain" />
        ) : (
          <span className="text-lg font-bold">{data.store_name}</span>
        )}
        <nav className="hidden gap-6 text-sm font-medium sm:flex">
          <span>Início</span>
          <span>Produtos</span>
          <span>Contato</span>
        </nav>
      </header>

      <section className="relative aspect-[16/7] w-full overflow-hidden bg-black/20">
        {activeBanner ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeBanner} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full items-center justify-center text-lg"
            style={{ color: data.primary_color }}
          >
            Sem banners
          </div>
        )}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Banner ${i + 1}`}
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: i === bannerIndex ? data.primary_color : "rgba(255,255,255,0.4)",
                }}
                onClick={() => setBannerIndex(i)}
              />
            ))}
          </div>
        )}
      </section>

      <main className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-3xl font-bold" style={{ color: data.primary_color }}>
          {data.store_name}
        </h1>
        <p className="mt-4 text-base opacity-80" style={{ color: data.primary_color }}>
          Prévia visual local — logo, banners e paleta do Builder. Ipanema na Nuvemshop ainda não
          foi aplicado nesta loja.
        </p>
        <button
          type="button"
          className="mt-8 rounded-lg px-8 py-3 text-sm font-semibold"
          style={{ backgroundColor: data.primary_color, color: data.secondary_color }}
        >
          Ver produtos
        </button>
      </main>

      <footer
        className="mt-16 px-6 py-8 text-center text-sm"
        style={{ backgroundColor: data.primary_color, color: data.secondary_color }}
      >
        © {data.store_name}
      </footer>

      <aside className="fixed bottom-4 right-4 max-w-sm rounded-lg border border-amber-700/50 bg-zinc-950/95 px-4 py-3 text-left text-xs text-zinc-300 shadow-lg">
        <p className="font-medium text-amber-400">Prévia local</p>
        <p className="mt-1">{data.note}</p>
        {data.provision_error && (
          <p className="mt-2 text-red-300">Provisionamento: {data.provision_error}</p>
        )}
      </aside>
    </div>
  );
}

export default function LocalPreviewPage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <Suspense fallback={<p className="p-8 text-center text-zinc-400">Carregando…</p>}>
        <PreviewContent />
      </Suspense>
    </>
  );
}
