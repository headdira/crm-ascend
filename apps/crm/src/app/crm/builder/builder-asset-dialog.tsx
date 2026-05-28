"use client";

import { useState } from "react";
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
import { upsertBuilderAsset, type BuilderAsset } from "@/lib/actions/builder";
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
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
      toast.success(asset ? "Asset atualizado" : "Asset criado");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(actionErrorMessage(err));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={asset ? "ghost" : "default"} size={asset ? "sm" : "default"}>
          {asset ? "Editar" : assetType === "logo" ? "Nova logo" : "Novo banner"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {asset ? `Editar ${assetType}` : assetType === "logo" ? "Nova logo" : "Novo banner"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
                placeholder={
                  assetType === "banner"
                    ? 'SVG com #PRIMARY/#SECONDARY ou raster:/banners/arquivo.jpg'
                    : "SVG com #PRIMARY e #SECONDARY"
                }
                required
              />
              <p className="text-muted-foreground text-xs">
                Banners em escala de cinza: use{" "}
                <code className="text-foreground">raster:/banners/nome.jpg</code> e coloque o arquivo
                em <code className="text-foreground">public/banners/</code> do builder e do CRM.
              </p>
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
              <Select name="is_active" defaultValue={asset?.is_active !== false ? "true" : "false"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Button type="submit">Salvar</Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
