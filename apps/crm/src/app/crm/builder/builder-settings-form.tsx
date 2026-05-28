"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateBuilderSettings, type BuilderSettings } from "@/lib/actions/builder";
import { actionErrorMessage } from "@/lib/errors";

export function BuilderSettingsForm({ settings }: { settings: BuilderSettings }) {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await updateBuilderSettings({
        youtube_url: String(fd.get("youtube_url") ?? ""),
        affiliate_url: String(fd.get("affiliate_url") ?? ""),
      });
      toast.success("Configurações salvas");
      router.refresh();
    } catch (err) {
      toast.error(actionErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="youtube_url">URL do vídeo (YouTube)</FieldLabel>
          <Input
            id="youtube_url"
            name="youtube_url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            defaultValue={settings.youtube_url ?? ""}
          />
          <p className="text-muted-foreground text-xs">
            Exibido na etapa &quot;Plano&quot; do builder.
          </p>
        </Field>
        <Field>
          <FieldLabel htmlFor="affiliate_url">Link de afiliado do plano</FieldLabel>
          <Input
            id="affiliate_url"
            name="affiliate_url"
            type="url"
            defaultValue={settings.affiliate_url ?? ""}
          />
        </Field>
        <Button type="submit">Salvar configurações</Button>
      </FieldGroup>
    </form>
  );
}
