"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  uploadBuilderAsset,
  upsertBuilderAsset,
  type BuilderAsset,
} from "@/lib/actions/builder";
import { actionErrorMessage } from "@/lib/errors";
import { BUILDER_NICHES } from "@crm-ascend/validation";

export function BuilderAssetDialog({
  assetType,
  asset,
}: {
  assetType: "logo" | "banner";
  asset?: BuilderAsset;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [niche, setNiche] = useState<(typeof BUILDER_NICHES)[number]>(
    asset?.niche ?? "Genérico",
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !asset;

  async function handleCreateUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      toast.error("Escolha uma imagem");
      return;
    }
    const fd = new FormData();
    fd.set("asset_type", assetType);
    fd.set("niche", niche);
    fd.set("file", file);

    setPending(true);
    try {
      const row = await uploadBuilderAsset(fd);
      toast.success(`${row.name} adicionado`);
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(actionErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    try {
      await upsertBuilderAsset({
        id: asset?.id,
        asset_type: assetType,
        name: fd.get("name"),
        niche: fd.get("niche"),
        svg_content: fd.get("svg_content"),
        sort_order: fd.get("sort_order"),
        is_active: fd.get("is_active") === "true",
      });
      toast.success("Asset atualizado");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(actionErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  const title = asset
    ? `Editar ${assetType === "logo" ? "logo" : "banner"}`
    : assetType === "logo"
      ? "Nova logo"
      : "Novo banner";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={asset ? "ghost" : "default"} size={asset ? "sm" : "default"}>
          {asset ? "Editar" : assetType === "logo" ? "Nova logo" : "Novo banner"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {isNew ? (
          <form onSubmit={handleCreateUpload}>
            <FieldGroup>
              <Field>
                <FieldLabel>Nicho</FieldLabel>
                <Select value={niche} onValueChange={(v) => setNiche(v as typeof niche)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria do nicho" />
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
              <Field>
                <FieldLabel htmlFor="builder-asset-file">Imagem</FieldLabel>
                <Input
                  ref={fileRef}
                  id="builder-asset-file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  required
                />
                <p className="text-muted-foreground text-xs">
                  PNG, JPG ou WebP (máx. 5 MB). Banners em escala de cinza recolorizam melhor no
                  wizard.
                </p>
              </Field>
              <Button type="submit" disabled={pending}>
                {pending ? "Enviando…" : "Salvar"}
              </Button>
            </FieldGroup>
          </form>
        ) : (
          <form onSubmit={handleEditSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input id="name" name="name" defaultValue={asset?.name} required />
              </Field>
              <Field>
                <FieldLabel>Nicho</FieldLabel>
                <Select name="niche" defaultValue={asset?.niche ?? "Genérico"}>
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
              <Field>
                <FieldLabel htmlFor="svg_content">Conteúdo do asset</FieldLabel>
                <Textarea
                  id="svg_content"
                  name="svg_content"
                  defaultValue={asset?.svg_content}
                  rows={8}
                  className="font-mono text-xs"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="sort_order">Ordem</FieldLabel>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  defaultValue={asset?.sort_order ?? 0}
                  min={0}
                />
              </Field>
              <Field>
                <FieldLabel>Ativo</FieldLabel>
                <Select
                  name="is_active"
                  defaultValue={asset?.is_active !== false ? "true" : "false"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sim</SelectItem>
                    <SelectItem value="false">Não</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Button type="submit" disabled={pending}>
                {pending ? "Salvando…" : "Salvar"}
              </Button>
            </FieldGroup>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
