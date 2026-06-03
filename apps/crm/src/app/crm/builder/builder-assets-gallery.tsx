"use client";

import { useMemo, useState } from "react";
import { BUILDER_NICHES } from "@crm-ascend/validation";
import type { BuilderAsset } from "@/lib/actions/builder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BuilderAssetDialog } from "./builder-asset-dialog";
import { BuilderAssetThumbnail } from "./builder-asset-thumbnail";
import { DeleteBuilderAssetButton } from "./delete-builder-asset-button";
import { BuilderAssetBulkUpload } from "./builder-asset-bulk-upload";

const ALL_NICHES = "Todos";

function isBuilderNicheFilter(value: string): boolean {
  return (BUILDER_NICHES as readonly string[]).includes(value);
}

export function BuilderAssetsGallery({
  assets,
  assetType,
}: {
  assets: BuilderAsset[];
  assetType: "logo" | "banner";
}) {
  const [niche, setNiche] = useState<string>(ALL_NICHES);
  const [query, setQuery] = useState("");

  const countsByNiche = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of assets) {
      map.set(a.niche, (map.get(a.niche) ?? 0) + 1);
    }
    return map;
  }, [assets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter((a) => {
      if (niche !== ALL_NICHES && a.niche !== niche) return false;
      if (q && !a.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [assets, niche, query]);

  const nichesWithAssets = useMemo(
    () => BUILDER_NICHES.filter((n) => (countsByNiche.get(n) ?? 0) > 0),
    [countsByNiche],
  );

  const isBanner = assetType === "banner";

  return (
    <div className="space-y-4">
      {isBanner && (
        <BuilderAssetBulkUpload
          defaultNiche={
            niche !== ALL_NICHES && isBuilderNicheFilter(niche)
              ? (niche as (typeof BUILDER_NICHES)[number])
              : "Genérico"
          }
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={niche === ALL_NICHES}
            label={`Todos (${assets.length})`}
            onClick={() => setNiche(ALL_NICHES)}
          />
          {nichesWithAssets.map((n) => (
            <FilterChip
              key={n}
              active={niche === n}
              label={`${n} (${countsByNiche.get(n)})`}
              onClick={() => setNiche(n)}
            />
          ))}
        </div>
        <div className="flex shrink-0 gap-2">
          <Input
            placeholder="Buscar por nome…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full sm:w-52"
          />
          <BuilderAssetDialog assetType={assetType} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/40 px-6 py-12 text-center">
          <p className="text-muted-foreground text-sm">
            {assets.length === 0
              ? `Nenhum ${isBanner ? "banner" : "logo"} cadastrado.`
              : "Nenhum item neste filtro."}
          </p>
          {assets.length === 0 && (
            <div className="mt-4">
              <BuilderAssetDialog assetType={assetType} />
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4",
            isBanner
              ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
          )}
        >
          {filtered.map((asset) => (
            <article
              key={asset.id}
              className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={cn(
                  "flex items-center justify-center bg-muted/50 p-2",
                  isBanner ? "aspect-[16/9]" : "aspect-square",
                )}
              >
                <BuilderAssetThumbnail
                  content={asset.svg_content}
                  className={cn(
                    "max-h-full max-w-full object-contain",
                    isBanner ? "h-full w-full" : "h-20 w-20",
                  )}
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <p className="line-clamp-2 text-sm leading-snug font-medium">{asset.name}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {asset.niche}
                  </Badge>
                  {!asset.is_active && (
                    <Badge variant="outline" className="text-xs">
                      Inativo
                    </Badge>
                  )}
                  <span className="text-muted-foreground ml-auto text-xs">#{asset.sort_order}</span>
                </div>
                <div className="mt-auto flex gap-1 border-t pt-2">
                  <BuilderAssetDialog assetType={assetType} asset={asset} />
                  <DeleteBuilderAssetButton id={asset.id} name={asset.name} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      className={cn("h-8 rounded-full text-xs font-normal", !active && "bg-background")}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
