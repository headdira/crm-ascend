"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { BUILDER_NICHES } from "@crm-ascend/validation";
import { postBuilderAssetUpload } from "@/lib/builder-upload-client";
import { MAX_BUILDER_BULK_FILES, MAX_BUILDER_BULK_BATCH } from "@/lib/builder-upload";
import { actionErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const BATCH_SIZE = MAX_BUILDER_BULK_BATCH;

function filterImages(files: FileList | readonly File[]): File[] {
  return Array.from(files).filter(
    (f) => f.type === "image/png" || f.type === "image/jpeg" || f.type === "image/webp",
  );
}

export function BuilderAssetBulkUpload({
  defaultNiche = "Genérico",
}: {
  defaultNiche?: (typeof BUILDER_NICHES)[number];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [niche, setNiche] = useState(defaultNiche);
  const [queue, setQueue] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const images = filterImages(incoming);
    if (images.length === 0) {
      toast.error("Só PNG, JPG ou WebP");
      return;
    }
    setQueue((prev) => {
      const merged = [...prev, ...images];
      if (merged.length > MAX_BUILDER_BULK_FILES) {
        toast.warning(`Máximo ${MAX_BUILDER_BULK_FILES} arquivos por vez`);
        return merged.slice(0, MAX_BUILDER_BULK_FILES);
      }
      return merged;
    });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  async function handleUpload() {
    if (queue.length === 0) {
      toast.error("Arraste imagens ou clique para selecionar");
      return;
    }

    setPending(true);
    let totalOk = 0;
    const allFailed: Array<{ name: string; error: string }> = [];

    try {
      for (let i = 0; i < queue.length; i += BATCH_SIZE) {
        const batch = queue.slice(i, i + BATCH_SIZE);
        setProgress(`${Math.min(i + batch.length, queue.length)} / ${queue.length}`);

        const fd = new FormData();
        fd.set("asset_type", "banner");
        fd.set("niche", niche);
        for (const file of batch) fd.append("files", file);

        const result = await postBuilderAssetUpload(fd);
        totalOk += result.created.length;
        allFailed.push(...result.failed);
      }

      if (totalOk > 0) {
        toast.success(`${totalOk} banner${totalOk > 1 ? "s" : ""} publicado${totalOk > 1 ? "s" : ""}`);
        setQueue([]);
        router.refresh();
      }
      if (allFailed.length > 0) {
        toast.error(
          `${allFailed.length} falha${allFailed.length > 1 ? "s" : ""}: ${allFailed[0]?.name} — ${allFailed[0]?.error}`,
        );
      }
    } catch (err) {
      toast.error(actionErrorMessage(err));
    } finally {
      setPending(false);
      setProgress(null);
    }
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Upload em massa</h2>
          <p className="text-muted-foreground text-xs">
            Arraste vários banners, escolha o nicho e envie de uma vez (até {MAX_BUILDER_BULK_FILES}{" "}
            arquivos).
          </p>
        </div>
        <Field className="w-full sm:w-56">
          <FieldLabel>Nicho dos banners</FieldLabel>
          <Select value={niche} onValueChange={(v) => setNiche(v as typeof niche)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUILDER_NICHES.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-10 transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/50",
        )}
      >
        <Upload className="text-muted-foreground size-8" />
        <p className="text-sm font-medium">Solte as imagens aqui ou clique para escolher</p>
        <p className="text-muted-foreground text-xs">PNG, JPG ou WebP · até 5 MB cada</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {queue.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {queue.map((file, idx) => (
              <span
                key={`${file.name}-${idx}`}
                className="inline-flex max-w-full items-center gap-1 rounded-full border bg-muted/50 px-2 py-1 text-xs"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQueue((q) => q.filter((_, i) => i !== idx));
                  }}
                  aria-label={`Remover ${file.name}`}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" onClick={handleUpload} disabled={pending}>
              {pending ? `Enviando… ${progress ?? ""}` : `Publicar ${queue.length} banner${queue.length > 1 ? "s" : ""}`}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => setQueue([])}
            >
              Limpar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
