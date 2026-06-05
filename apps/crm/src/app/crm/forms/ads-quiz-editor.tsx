"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Copy, ExternalLink } from "lucide-react";
import type { AdsQuizConfig } from "@crm-ascend/validation";
import type { AdsQuizFormRecord } from "@/lib/actions/ads-quiz-form";
import { saveAdsQuizForm } from "@/lib/actions/ads-quiz-form";
import { actionErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AdsQuizEditor({ form, publicUrl }: { form: AdsQuizFormRecord; publicUrl: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [schema, setSchema] = useState<AdsQuizConfig>(form.schema);
  const [name, setName] = useState(form.name);
  const [active, setActive] = useState(form.is_active);
  const [saving, setSaving] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Link copiado");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar");
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveAdsQuizForm({ name, is_active: active, schema });
      toast.success("Quiz salvo");
      router.refresh();
    } catch (err) {
      toast.error(actionErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const landing = schema.landing;
  const contact = schema.contact;

  return (
    <form onSubmit={(e) => void handleSave(e)} className="space-y-10 max-w-3xl">
      <section className="rounded-xl border border-border bg-card/40 p-5 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Link público</h2>
        <p className="text-muted-foreground text-sm">
          Use este link nos anúncios (Meta, WhatsApp, etc.). A página fica na landing em{" "}
          <code className="text-xs">/form</code>.
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <Input readOnly value={publicUrl} className="font-mono text-sm flex-1 min-w-[240px]" />
          <Button type="button" variant="secondary" onClick={() => void copyLink()}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            Copiar
          </Button>
          <Button type="button" variant="outline" asChild>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Abrir
            </a>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          URL base: variável <code>NEXT_PUBLIC_LANDING_URL</code> no CRM (padrão ascendclub.com.br).
        </p>
      </section>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form_name">Nome interno</FieldLabel>
          <Input id="form_name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="rounded border-border"
          />
          Quiz ativo (público em /form)
        </label>
      </FieldGroup>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider">Capa</h2>
        <FieldGroup>
          <Field>
            <FieldLabel>Eyebrow</FieldLabel>
            <Input
              value={landing.eyebrow}
              onChange={(e) =>
                setSchema((s) => ({ ...s, landing: { ...s.landing, eyebrow: e.target.value } }))
              }
            />
          </Field>
          <Field>
            <FieldLabel>Título</FieldLabel>
            <Textarea
              rows={2}
              value={landing.headline}
              onChange={(e) =>
                setSchema((s) => ({ ...s, landing: { ...s.landing, headline: e.target.value } }))
              }
            />
          </Field>
          <Field>
            <FieldLabel>Subtítulo</FieldLabel>
            <Textarea
              rows={3}
              value={landing.subheadline}
              onChange={(e) =>
                setSchema((s) => ({ ...s, landing: { ...s.landing, subheadline: e.target.value } }))
              }
            />
          </Field>
          <Field>
            <FieldLabel>Botão inicial</FieldLabel>
            <Input
              value={landing.ctaLabel}
              onChange={(e) =>
                setSchema((s) => ({ ...s, landing: { ...s.landing, ctaLabel: e.target.value } }))
              }
            />
          </Field>
          <Field>
            <FieldLabel>Prova social (opcional)</FieldLabel>
            <Input
              value={landing.socialProof ?? ""}
              onChange={(e) =>
                setSchema((s) => ({
                  ...s,
                  landing: { ...s.landing, socialProof: e.target.value || undefined },
                }))
              }
            />
          </Field>
        </FieldGroup>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider">Perguntas e etapas</h2>
        <p className="text-muted-foreground text-sm">
          Edite títulos e textos. A ordem e tipos das etapas vêm do JSON salvo no banco (padrão já
          inclui objetivo, experiência, mensagem e oferta).
        </p>
        {schema.steps.map((step, idx) => (
          <div key={step.id} className="rounded-lg border border-border p-4 space-y-3">
            <p className="text-xs font-mono text-muted-foreground">
              {idx + 1}. {step.id} · {step.type}
            </p>
            <Input
              value={step.title}
              onChange={(e) => {
                const title = e.target.value;
                setSchema((s) => ({
                  ...s,
                  steps: s.steps.map((st, i) => (i === idx ? { ...st, title } : st)),
                }));
              }}
            />
            {step.type === "choice" && (
              <Textarea
                rows={4}
                className="font-mono text-xs"
                value={step.options.map((o) => `${o.id}|${o.label}|${o.subtitle ?? ""}`).join("\n")}
                onChange={(e) => {
                  const options = e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const [id, label, subtitle] = line.split("|");
                      return {
                        id: (id ?? "").trim(),
                        label: (label ?? "").trim(),
                        subtitle: (subtitle ?? "").trim() || undefined,
                      };
                    })
                    .filter((o) => o.id && o.label);
                  setSchema((s) => ({
                    ...s,
                    steps: s.steps.map((st, i) =>
                      i === idx && st.type === "choice" ? { ...st, options } : st,
                    ),
                  }));
                }}
                placeholder="id|label|subtítulo opcional"
              />
            )}
            {step.type === "message" && (
              <Textarea
                rows={4}
                value={step.body}
                onChange={(e) => {
                  const body = e.target.value;
                  setSchema((s) => ({
                    ...s,
                    steps: s.steps.map((st, i) =>
                      i === idx && st.type === "message" ? { ...st, body } : st,
                    ),
                  }));
                }}
              />
            )}
            {step.type === "offer" && (
              <>
                <Input
                  value={step.priceLabel}
                  onChange={(e) => {
                    const priceLabel = e.target.value;
                    setSchema((s) => ({
                      ...s,
                      steps: s.steps.map((st, i) =>
                        i === idx && st.type === "offer" ? { ...st, priceLabel } : st,
                      ),
                    }));
                  }}
                />
                <Textarea
                  rows={3}
                  value={step.bullets.join("\n")}
                  onChange={(e) => {
                    const bullets = e.target.value.split("\n").map((b) => b.trim()).filter(Boolean);
                    setSchema((s) => ({
                      ...s,
                      steps: s.steps.map((st, i) =>
                        i === idx && st.type === "offer" ? { ...st, bullets } : st,
                      ),
                    }));
                  }}
                />
              </>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider">Contato (antes do pagamento)</h2>
        <FieldGroup>
          {(
            [
              ["nameTitle", "Título — nome"],
              ["emailTitle", "Título — e-mail"],
              ["phoneTitle", "Título — WhatsApp"],
              ["submitLabel", "Botão final"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key}>
              <FieldLabel>{label}</FieldLabel>
              <Input
                value={contact[key]}
                onChange={(e) =>
                  setSchema((s) => ({
                    ...s,
                    contact: { ...s.contact, [key]: e.target.value },
                  }))
                }
              />
            </Field>
          ))}
        </FieldGroup>
      </section>

      <Button type="submit" disabled={saving}>
        {saving ? "Salvando…" : "Salvar quiz"}
      </Button>
    </form>
  );
}
