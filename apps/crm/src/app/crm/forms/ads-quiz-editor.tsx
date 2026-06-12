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

function cleanOptional(value: string): string | undefined {
  const v = value.trim();
  return v || undefined;
}

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
  const offerIdx = schema.steps.findIndex((s) => s.type === "offer");
  const offerStep = offerIdx >= 0 && schema.steps[offerIdx]?.type === "offer" ? schema.steps[offerIdx] : null;

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
                  landing: { ...s.landing, socialProof: cleanOptional(e.target.value) },
                }))
              }
            />
          </Field>
          <Field>
            <FieldLabel>Banner da capa (URL, opcional — substitui o collage)</FieldLabel>
            <Input
              value={landing.heroImageUrl ?? ""}
              placeholder="/media/quiz-hero-kelvin-paris.png"
              onChange={(e) =>
                setSchema((s) => ({
                  ...s,
                  landing: { ...s.landing, heroImageUrl: cleanOptional(e.target.value) },
                }))
              }
            />
          </Field>
        </FieldGroup>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider">Perguntas e etapas</h2>
        <p className="text-muted-foreground text-sm">
          Edite títulos e textos. A etapa <code>offer</code> alimenta a tela de resultado do funil.
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
              <>
                <Textarea
                  rows={4}
                  className="font-mono text-xs"
                  value={step.options
                    .map((o) => {
                      const tags = o.tags?.length ? o.tags.join(",") : "";
                      return `${o.id}|${o.label}|${o.subtitle ?? ""}|${tags}`;
                    })
                    .join("\n")}
                  onChange={(e) => {
                    const prevOpts = step.type === "choice" ? step.options : [];
                    const options = e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [id, label, subtitle, tagsRaw] = line.split("|");
                        const prev = prevOpts.find((o) => o.id === (id ?? "").trim());
                        const tags = (tagsRaw ?? "")
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean);
                        return {
                          id: (id ?? "").trim(),
                          label: (label ?? "").trim(),
                          subtitle: cleanOptional(subtitle ?? ""),
                          tags: tags.length ? tags : undefined,
                          insight: prev?.insight,
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
                  placeholder="id|label|subtítulo|tags opcionais (vírgula)"
                />
                <Field>
                  <FieldLabel>Insights por opção (opcional)</FieldLabel>
                  <Textarea
                    rows={6}
                    className="font-mono text-xs"
                    value={step.options
                      .filter((o) => o.insight)
                      .map((o) => {
                        const ins = o.insight!;
                        const p = ins.proof;
                        return [
                          o.id,
                          ins.eyebrow ?? "",
                          ins.title,
                          ins.body,
                          ins.variant ?? "default",
                          p?.name ?? "",
                          p?.role ?? "",
                          p?.quote ?? "",
                          p?.imageUrl ?? "",
                          p?.imageCaption ?? "",
                          p?.statLabel ?? "",
                        ].join("|");
                      })
                      .join("\n")}
                    onChange={(e) => {
                      const insightById = new Map(
                        e.target.value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line) => {
                            const [
                              optionId,
                              eyebrow,
                              title,
                              body,
                              variant,
                              name,
                              role,
                              quote,
                              imageUrl,
                              imageCaption,
                              statLabel,
                            ] = line.split("|");
                            if (!optionId?.trim() || !title?.trim() || !body?.trim()) return null;
                            const proof =
                              name?.trim() ||
                              role?.trim() ||
                              quote?.trim() ||
                              imageUrl?.trim() ||
                              imageCaption?.trim() ||
                              statLabel?.trim()
                                ? {
                                    name: cleanOptional(name ?? ""),
                                    role: cleanOptional(role ?? ""),
                                    quote: cleanOptional(quote ?? ""),
                                    imageUrl: cleanOptional(imageUrl ?? ""),
                                    imageCaption: cleanOptional(imageCaption ?? ""),
                                    statLabel: cleanOptional(statLabel ?? ""),
                                  }
                                : undefined;
                            const variantValue = cleanOptional(variant ?? "");
                            const allowedVariants = [
                              "default",
                              "print",
                              "testimonial",
                              "objection",
                              "benefit",
                              "stat",
                              "mentor",
                            ] as const;
                            return [
                              optionId.trim(),
                              {
                                eyebrow: cleanOptional(eyebrow ?? ""),
                                title: title.trim(),
                                body: body.trim(),
                                variant: allowedVariants.includes(variantValue as (typeof allowedVariants)[number])
                                  ? (variantValue as (typeof allowedVariants)[number])
                                  : undefined,
                                proof,
                              },
                            ] as const;
                          })
                          .filter(Boolean) as [string, NonNullable<(typeof step.options)[0]["insight"]>][],
                      );
                      setSchema((s) => ({
                        ...s,
                        steps: s.steps.map((st, i) => {
                          if (i !== idx || st.type !== "choice") return st;
                          return {
                            ...st,
                            options: st.options.map((opt) => ({
                              ...opt,
                              insight: insightById.get(opt.id),
                            })),
                          };
                        }),
                      }));
                    }}
                    placeholder="optionId|eyebrow|título|corpo|print|nome|cargo|quote|/media/proof/proof-01.jpeg|legenda|statLabel"
                  />
                </Field>
              </>
            )}
            {(step.type === "message" || step.type === "dynamic") && (
              <Textarea
                rows={4}
                value={step.body}
                onChange={(e) => {
                  const body = e.target.value;
                  setSchema((s) => ({
                    ...s,
                    steps: s.steps.map((st, i) =>
                      i === idx && (st.type === "message" || st.type === "dynamic") ? { ...st, body } : st,
                    ),
                  }));
                }}
                placeholder={step.type === "dynamic" ? "Use {{objetivo}} ou {{momento}} para personalizar" : undefined}
              />
            )}
            {step.type === "mechanism" && (
              <Textarea
                rows={3}
                value={step.intro ?? ""}
                onChange={(e) => {
                  const intro = cleanOptional(e.target.value);
                  setSchema((s) => ({
                    ...s,
                    steps: s.steps.map((st, i) =>
                      i === idx && st.type === "mechanism" ? { ...st, intro } : st,
                    ),
                  }));
                }}
                placeholder="Introdução (opcional)"
              />
            )}
            {step.type === "multichoice" && (
              <Textarea
                rows={4}
                className="font-mono text-xs"
                value={step.options
                  .map((o) => {
                    const tags = o.tags?.length ? o.tags.join(",") : "";
                    return `${o.id}|${o.label}|${tags}`;
                  })
                  .join("\n")}
                onChange={(e) => {
                  const options = e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const [id, label, tagsRaw] = line.split("|");
                      const tags = (tagsRaw ?? "")
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean);
                      return {
                        id: (id ?? "").trim(),
                        label: (label ?? "").trim(),
                        tags: tags.length ? tags : undefined,
                      };
                    })
                    .filter((o) => o.id && o.label);
                  setSchema((s) => ({
                    ...s,
                    steps: s.steps.map((st, i) =>
                      i === idx && st.type === "multichoice" ? { ...st, options } : st,
                    ),
                  }));
                }}
                placeholder="id|label|tags"
              />
            )}
            {step.type === "offer" && (
              <>
                <Field>
                  <FieldLabel>Preço atual (ex: R$49,99)</FieldLabel>
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
                </Field>
                <Field>
                  <FieldLabel>Preço antigo riscado (opcional, ex: R$197)</FieldLabel>
                  <Input
                    value={step.originalPriceLabel ?? ""}
                    onChange={(e) => {
                      const originalPriceLabel = cleanOptional(e.target.value);
                      setSchema((s) => ({
                        ...s,
                        steps: s.steps.map((st, i) =>
                          i === idx && st.type === "offer"
                            ? { ...st, originalPriceLabel }
                            : st,
                        ),
                      }));
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel>Nota de urgência (opcional)</FieldLabel>
                  <Input
                    value={step.urgencyNote ?? ""}
                    onChange={(e) => {
                      const urgencyNote = cleanOptional(e.target.value);
                      setSchema((s) => ({
                        ...s,
                        steps: s.steps.map((st, i) =>
                          i === idx && st.type === "offer" ? { ...st, urgencyNote } : st,
                        ),
                      }));
                    }}
                    placeholder="Lote promocional: apenas 47 vagas..."
                  />
                </Field>
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
                  placeholder="Um benefício por linha"
                />
              </>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider">Tela de cálculo</h2>
        <Field>
          <FieldLabel>Mensagens padrão (uma por linha)</FieldLabel>
          <Textarea
            rows={4}
            className="font-mono text-xs"
            value={(schema.calculating?.messages ?? []).join("\n")}
            onChange={(e) => {
              const messages = e.target.value
                .split("\n")
                .map((m) => m.trim())
                .filter(Boolean);
              setSchema((s) => ({
                ...s,
                calculating: {
                  messages,
                  messagesByTags: s.calculating?.messagesByTags,
                },
              }));
            }}
            placeholder="Analisando suas respostas…"
          />
        </Field>
        <Field>
          <FieldLabel>Mensagens por perfil (opcional) — tags|msg1;msg2</FieldLabel>
          <Textarea
            rows={4}
            className="font-mono text-xs"
            value={(schema.calculating?.messagesByTags ?? [])
              .map((r) => `${r.whenTags.join(",")}|${r.messages.join(";")}`)
              .join("\n")}
            onChange={(e) => {
              const messagesByTags = e.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                  const [tagsRaw, msgsRaw] = line.split("|");
                  const whenTags = (tagsRaw ?? "")
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  const messages = (msgsRaw ?? "")
                    .split(";")
                    .map((m) => m.trim())
                    .filter(Boolean);
                  return { whenTags, messages };
                })
                .filter((r) => r.whenTags.length && r.messages.length);
              setSchema((s) => ({
                ...s,
                calculating: {
                  messages: s.calculating?.messages ?? ["Analisando…"],
                  messagesByTags: messagesByTags.length ? messagesByTags : undefined,
                },
              }));
            }}
            placeholder="needs_support|Priorizando suporte…;Ajustando plano…"
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider">Tela de resultado</h2>
        <FieldGroup>
          <Field>
            <FieldLabel>Eyebrow</FieldLabel>
            <Input
              value={schema.result?.eyebrow ?? ""}
              onChange={(e) => {
                const eyebrow = e.target.value;
                setSchema((s) => {
                  const prev = s.result ?? { eyebrow: "", headline: "" };
                  const next = { ...prev, eyebrow };
                  if (!next.eyebrow.trim() || !next.headline.trim()) {
                    return { ...s, result: undefined };
                  }
                  return { ...s, result: { ...next, reassurance: cleanOptional(next.reassurance ?? "") } };
                });
              }}
            />
          </Field>
          <Field>
            <FieldLabel>Título</FieldLabel>
            <Textarea
              rows={2}
              value={schema.result?.headline ?? ""}
              onChange={(e) => {
                const headline = e.target.value;
                setSchema((s) => {
                  const prev = s.result ?? { eyebrow: "", headline: "" };
                  const next = { ...prev, headline };
                  if (!next.eyebrow.trim() || !next.headline.trim()) {
                    return { ...s, result: undefined };
                  }
                  return { ...s, result: { ...next, reassurance: cleanOptional(next.reassurance ?? "") } };
                });
              }}
            />
          </Field>
          <Field>
            <FieldLabel>Reassurance (opcional)</FieldLabel>
            <Textarea
              rows={2}
              value={schema.result?.reassurance ?? ""}
              onChange={(e) => {
                const reassurance = cleanOptional(e.target.value);
                setSchema((s) => {
                  const prev = s.result ?? { eyebrow: "", headline: "" };
                  if (!prev.eyebrow.trim() || !prev.headline.trim()) {
                    return s;
                  }
                  return { ...s, result: { ...prev, reassurance } };
                });
              }}
            />
          </Field>
          <Field>
            <FieldLabel>Badge (ex: PERFIL IDEAL)</FieldLabel>
            <Input
              value={schema.result?.badge ?? ""}
              onChange={(e) => {
                const badge = cleanOptional(e.target.value);
                setSchema((s) => {
                  const prev = s.result ?? { eyebrow: "", headline: "" };
                  if (!prev.eyebrow.trim() || !prev.headline.trim()) return s;
                  return { ...s, result: { ...prev, badge } };
                });
              }}
            />
          </Field>
          <Field>
            <FieldLabel>Destaques do diagnóstico (um por linha)</FieldLabel>
            <Textarea
              rows={3}
              value={(schema.result?.highlights ?? []).join("\n")}
              onChange={(e) => {
                const highlights = e.target.value
                  .split("\n")
                  .map((h) => h.trim())
                  .filter(Boolean);
                setSchema((s) => {
                  const prev = s.result ?? { eyebrow: "", headline: "" };
                  if (!prev.eyebrow.trim() || !prev.headline.trim()) return s;
                  return {
                    ...s,
                    result: { ...prev, highlights: highlights.length ? highlights : undefined },
                  };
                });
              }}
            />
          </Field>
        </FieldGroup>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider">Resultado por perfil (opcional)</h2>
        <Field>
          <FieldLabel>tags|headline|reassurance — uma regra por linha</FieldLabel>
          <Textarea
            rows={5}
            className="font-mono text-xs"
            value={(schema.resultRules ?? [])
              .map((r) => `${r.whenTags.join(",")}|${r.headline}|${r.reassurance ?? ""}`)
              .join("\n")}
            onChange={(e) => {
              const resultRules = e.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                  const [tagsRaw, headline, reassurance] = line.split("|");
                  const whenTags = (tagsRaw ?? "")
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  return {
                    whenTags,
                    headline: (headline ?? "").trim(),
                    reassurance: cleanOptional(reassurance ?? ""),
                  };
                })
                .filter((r) => r.whenTags.length && r.headline);
              setSchema((s) => ({
                ...s,
                resultRules: resultRules.length ? resultRules : undefined,
              }));
            }}
            placeholder="stage_zero|Você tem perfil para começar do zero…|Texto de apoio"
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider">Depoimentos na oferta final (opcional)</h2>
        <Field>
          <FieldLabel>nome|cargo|frase — um por linha</FieldLabel>
          <Textarea
            rows={5}
            className="font-mono text-xs"
            value={(schema.testimonials ?? [])
              .map((t) => `${t.name}|${t.role ?? ""}|${t.quote}`)
              .join("\n")}
            onChange={(e) => {
              const testimonials = e.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                  const [name, role, ...quoteParts] = line.split("|");
                  const quote = quoteParts.join("|").trim();
                  return {
                    name: (name ?? "").trim(),
                    role: cleanOptional(role ?? ""),
                    quote,
                  };
                })
                .filter((t) => t.name && t.quote);
              setSchema((s) => ({
                ...s,
                testimonials: testimonials.length ? testimonials : undefined,
              }));
            }}
            placeholder="Maria Silva|Aluna|Consegui minha primeira venda em 3 semanas"
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider">Cadastro (após a landing)</h2>
        <FieldGroup>
          {(
            [
              ["nameTitle", "Título — nome"],
              ["ageTitle", "Título — idade"],
              ["incomeTitle", "Título — renda"],
              ["emailTitle", "Título — e-mail"],
              ["phoneTitle", "Título — WhatsApp"],
              ["submitLabel", "Botão final do cadastro"],
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

      {offerStep && (
        <p className="text-xs text-muted-foreground">
          Oferta ativa: <strong>{offerStep.priceLabel}</strong>
          {offerStep.originalPriceLabel ? ` (de ${offerStep.originalPriceLabel})` : ""}
        </p>
      )}

      <Button type="submit" disabled={saving}>
        {saving ? "Salvando…" : "Salvar quiz"}
      </Button>
    </form>
  );
}
