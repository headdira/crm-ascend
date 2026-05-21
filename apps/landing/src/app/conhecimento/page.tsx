import type { Metadata } from "next";
import Link from "next/link";
import {
  CHECKOUT_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  faq,
  includes,
  mentors,
  offer,
  summaryParagraph,
  testimonialsText,
} from "@/lib/sales/knowledge";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Informações sobre o programa",
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${siteUrl}/conhecimento` },
  robots: { index: true, follow: true },
};

export default function ConhecimentoPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 font-inter text-white/85 leading-relaxed">
      <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4">
        Base de conhecimento · {SITE_NAME}
      </p>
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-6">
        {SITE_NAME} — mentoria para renda online (Brasil)
      </h1>

      <p className="mb-8 text-white/70">{summaryParagraph}</p>

      <section className="mb-10" id="oferta">
        <h2 className="text-xl font-black text-white mb-3">Oferta e preço</h2>
        <ul className="list-disc pl-5 space-y-2 text-white/75">
          <li>
            Preço atual: <strong>R${offer.priceBrl}</strong> ({offer.billing}), antes R$
            {offer.priceWasBrl}.
          </li>
          <li>Acesso: {offer.accessMonths} meses completos.</li>
          <li>{offer.dailyCostNote}.</li>
          <li>
            Inscrição:{" "}
            <a href={CHECKOUT_URL} className="text-primary underline">
              checkout oficial (Kiwify)
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="mb-10" id="inclui">
        <h2 className="text-xl font-black text-white mb-3">O que está incluído</h2>
        <ul className="list-disc pl-5 space-y-2 text-white/75">
          {includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10" id="publico">
        <h2 className="text-xl font-black text-white mb-3">Para quem é</h2>
        <p className="text-white/75">
          Iniciantes no digital que querem passo a passo, suporte próximo, networking e calls ao
          vivo — sem precisar de experiência prévia.
        </p>
      </section>

      <section className="mb-10" id="mentores">
        <h2 className="text-xl font-black text-white mb-3">Mentores</h2>
        {mentors.map((m) => (
          <article key={m.name} className="mb-4">
            <h3 className="font-bold text-white">{m.name}</h3>
            <p className="text-sm text-primary">{m.role}</p>
            <p className="text-white/70 text-sm mt-1">{m.bio}</p>
          </article>
        ))}
      </section>

      <section className="mb-10" id="resultados">
        <h2 className="text-xl font-black text-white mb-3">Resultados citados por alunos</h2>
        <ul className="list-disc pl-5 space-y-2 text-white/75">
          {testimonialsText.map((t) => (
            <li key={t.name}>
              <strong>{t.name}:</strong> {t.result}
            </li>
          ))}
        </ul>
        <p className="text-xs text-white/40 mt-3">
          Resultados individuais variam conforme dedicação e aplicação do método.
        </p>
      </section>

      <section className="mb-10" id="faq">
        <h2 className="text-xl font-black text-white mb-3">Perguntas frequentes</h2>
        <dl className="space-y-6">
          {faq.map((item) => (
            <div key={item.question}>
              <dt className="font-bold text-white">{item.question}</dt>
              <dd className="text-white/75 mt-1">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="text-xs text-white/40">
        Última atualização: maio de 2026.{" "}
        <Link href="/" className="text-primary underline">
          Voltar à página principal
        </Link>{" "}
        ·{" "}
        <Link href="/privacidade" className="text-primary underline">
          Privacidade
        </Link>
      </p>
    </main>
  );
}
