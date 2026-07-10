export type JourneyPayload = Record<string, unknown>;

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function browserFromPayload(payload: JourneyPayload) {
  const b = payload.browser;
  if (!b || typeof b !== "object") return null;
  return b as Record<string, unknown>;
}

/** Frase principal da ação (português) */
export function describeJourneyEvent(
  eventName: string,
  payload: JourneyPayload,
): string {
  const ctaLabel = str(payload.cta_label) ?? str(payload.cta);
  const sectionLabel = str(payload.section_label) ?? str(payload.section);
  const step = str(payload.step);
  const next = str(payload.next);

  switch (eventName) {
    case "PageView":
      return "Entrou na landing page";
    case "section_view":
      return sectionLabel
        ? `Visualizou a seção «${sectionLabel}»`
        : "Visualizou uma seção da página";
    case "checkout_click":
      return ctaLabel
        ? `Clicou no CTA «${ctaLabel}»`
        : "Clicou em um botão de compra";
    case "checkout_modal_open":
      return ctaLabel
        ? `Abriu o formulário (botão: «${ctaLabel}»)`
        : "Abriu o formulário de checkout";
    case "checkout_modal_step":
      if (step && next) {
        return `No formulário: concluiu «${stepLabel(step)}» e foi para «${stepLabel(next)}»`;
      }
      return "Avançou uma etapa no formulário";
    case "checkout_modal_abandon":
      return step
        ? `Fechou o formulário sem ir à Kiwify (parou em: ${stepLabel(step)})`
        : "Fechou o formulário sem concluir o pagamento";
    case "checkout_completed":
      return ctaLabel
        ? `Preencheu tudo e seguiu para a Kiwify («${ctaLabel}»)`
        : "Concluiu o formulário e foi para a Kiwify";
    case "proof_image_click": {
      const idx = payload.index;
      const label = str(payload.label);
      if (typeof idx === "number") {
        return label
          ? `Clicou no print «${label}» (#${idx})`
          : `Clicou em um print de resultado (#${idx})`;
      }
      return "Clicou em um print na seção de depoimentos";
    }
    case "session_start":
      return "Iniciou visita no site (sessão criada)";
    case "session_ping":
      return "Continuou navegando no site";
    case "InitiateCheckout":
      return ctaLabel ? `Iniciou checkout («${ctaLabel}»)` : "Iniciou checkout";
    case "quiz_start":
      return "Iniciou o quiz (/form)";
    case "quiz_lead_capture":
      return "Preencheu cadastro no quiz (nome, e-mail e WhatsApp)";
    case "quiz_abandon": {
      const stepId = str(payload.step_id);
      return stepId ? `Abandonou o quiz em: ${stepId}` : "Abandonou o quiz";
    }
    case "quiz_step": {
      const stepId = str(payload.step_id);
      return stepId ? `Respondeu etapa do quiz: ${stepId}` : "Avançou no quiz";
    }
    case "quiz_calculating":
      return "Quiz gerando diagnóstico personalizado";
    default:
      return eventName.replace(/_/g, " ");
  }
}

function stepLabel(step: string): string {
  const map: Record<string, string> = {
    name: "Nome",
    email: "E-mail",
    phone: "WhatsApp",
  };
  return map[step] ?? step;
}

export type JourneyDetailChip = { label: string; value: string };

/** Detalhes extras em chips (fora do bloco navegador) */
export function journeyDetailChips(
  eventName: string,
  payload: JourneyPayload,
): JourneyDetailChip[] {
  const chips: JourneyDetailChip[] = [];
  const cta = str(payload.cta_label) ?? str(payload.cta);
  const section = str(payload.section_label) ?? str(payload.section);

  if (eventName !== "checkout_click" && eventName !== "checkout_modal_open" && cta) {
    chips.push({ label: "Botão", value: cta });
  }
  if (eventName !== "section_view" && section) {
    chips.push({ label: "Seção", value: section });
  }

  if (payload.has_name === true) chips.push({ label: "Formulário", value: "Preencheu nome" });
  if (payload.has_email === true) chips.push({ label: "Formulário", value: "Preencheu e-mail" });
  if (payload.has_phone === true) chips.push({ label: "Formulário", value: "Preencheu telefone" });

  const metaEventId = str(payload.meta_event_id);
  if (metaEventId) chips.push({ label: "Meta", value: `event_id ${metaEventId.slice(0, 8)}…` });

  const filled = payload.filled_fields;
  if (Array.isArray(filled) && filled.length > 0) {
    chips.push({
      label: "Campos",
      value: filled.map((f) => stepLabel(String(f))).join(", "),
    });
  }

  const title = str(payload.title);
  if (title && eventName === "PageView") {
    chips.push({ label: "Página", value: title.length > 60 ? `${title.slice(0, 60)}…` : title });
  }

  return chips;
}

/** Card de navegador / dispositivo */
export function journeyBrowserChips(payload: JourneyPayload): JourneyDetailChip[] {
  const b = browserFromPayload(payload);
  if (!b) return [];

  const chips: JourneyDetailChip[] = [];
  const device = str(b.device);
  const os = str(b.os);
  const lang = str(b.language);
  const viewport = str(b.viewport);

  if (device) chips.push({ label: "Dispositivo", value: device });
  if (os) chips.push({ label: "Sistema", value: os });
  if (lang) chips.push({ label: "Idioma", value: lang });
  if (viewport) chips.push({ label: "Tela", value: viewport });

  return chips;
}

export function journeyEventIcon(eventName: string): string {
  switch (eventName) {
    case "PageView":
      return "👁";
    case "section_view":
      return "📜";
    case "checkout_click":
    case "InitiateCheckout":
      return "🖱";
    case "checkout_modal_open":
    case "checkout_modal_step":
      return "📝";
    case "checkout_modal_abandon":
      return "🚪";
    case "checkout_completed":
      return "✅";
    case "proof_image_click":
      return "🖼";
    default:
      return "•";
  }
}
