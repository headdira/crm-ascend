"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Flame, ShieldCheck, Star } from "lucide-react";
import CheckoutLink from "./CheckoutLink";
import SalesImage from "./SalesImage";
import Ticker from "./Ticker";
import { HERO_IMAGE, LOGO_URL } from "./constants";
import Image from "next/image";
import { useLightExperience } from "@/hooks/use-light-experience";

const navLinks = [
  { href: "#beneficios", label: "Benefícios" },
  { href: "#mentores", label: "Mentores" },
  { href: "#depoimentos", label: "Resultados" },
  { href: "#preco", label: "Preço" },
];

export default function HeroSection() {
  const light = useLightExperience();
  const M = light ? "div" : motion.div;

  return (
    <section className="relative overflow-hidden bg-transparent">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,184,0,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black" />
      </div>

      <nav className="relative z-40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <SalesImage
            src={LOGO_URL}
            alt="Ascend Club"
            width={160}
            height={48}
            priority
            className="h-12 w-auto opacity-95"
            sizes="160px"
          />
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wide text-white/50">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <CheckoutLink
            trackLabel="hero_nav"
            className="hidden md:inline-flex items-center gap-2 bg-primary hover:brightness-110 transition-all text-black font-black uppercase text-sm px-6 py-3 rounded-full shadow-[0_0_40px_rgba(255,184,0,0.25)]"
          >
            Entrar Agora
          </CheckoutLink>
        </div>
      </nav>

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-10 pb-20 overflow-visible">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start overflow-visible">
          <div>
            <M
              {...(!light && {
                initial: { opacity: 0, y: 18 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4 },
              })}
              data-motion="true"
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 mb-8"
            >
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-primary uppercase tracking-[0.2em] text-[11px] font-bold">
                Método Validado + Comunidade Exclusiva
              </span>
            </M>

            <M
              {...(!light && {
                initial: { opacity: 0, y: 35 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.55 },
              })}
              data-motion="true"
              className="text-white uppercase leading-[0.95] font-black text-5xl sm:text-6xl lg:text-7xl"
            >
              <h1>
                Aprenda A Construir Sua
                <span className="block text-primary drop-shadow-[0_0_30px_rgba(255,184,0,0.35)]">
                  Renda Online
                </span>
                Mesmo Começando
                <span className="block">Do Zero</span>
              </h1>
            </M>

            <M
              {...(!light && {
                initial: { opacity: 0, y: 25 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.55, delay: 0.1 },
              })}
              data-motion="true"
              className="mt-8 text-white/65 text-lg leading-relaxed max-w-xl"
            >
              <p>
                Tenha acesso ao passo a passo, suporte próximo, networking ativo e estratégias
                aplicadas por alunos que já estão faturando no digital.
              </p>
            </M>

            <div className="mt-10 space-y-4">
              {[
                "Método criado para iniciantes",
                "2 calls ao vivo por semana",
                "Grupo de networking exclusivo",
                "Acompanhamento real e suporte próximo",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-white/85 text-sm sm:text-base font-medium">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <p className="text-white/25 line-through text-lg font-medium">De R$497</p>
              <div className="flex items-end gap-3">
                <p className="text-primary font-black text-7xl leading-none drop-shadow-[0_0_25px_rgba(255,184,0,0.35)]">
                  R$197
                </p>
                <span className="text-white/40 text-sm mb-2 uppercase tracking-wider">
                  pagamento único
                </span>
              </div>
              <p className="text-primary text-sm font-semibold mt-2">Menos de R$0,54 por dia</p>
            </div>

            <div className="mt-10">
              <CheckoutLink
                trackLabel="hero_main"
                className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-2xl bg-primary px-10 py-6 text-black font-black uppercase tracking-wide text-lg transition-all hover:brightness-110 shadow-[0_0_50px_rgba(255,184,0,0.3)]"
              >
                <span className="relative z-10">Quero Entrar No Ascend Club</span>
                <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000" />
              </CheckoutLink>
              <div className="mt-5 flex flex-wrap items-center gap-5 text-white/35 text-xs">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pagamento 100% seguro</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock3 className="w-4 h-4" />
                  <span>Acesso imediato</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-primary" />
                  <span>Turma fechando hoje</span>
                </div>
              </div>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-5">
              {[
                { value: "500+", label: "Alunos" },
                { value: "2x", label: "Calls Semanais" },
                { value: "24/7", label: "Suporte" },
                { value: "R$197", label: "1 Ano Completo" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-center"
                >
                  <p className="text-primary text-3xl font-black">{item.value}</p>
                  <p className="text-white/35 uppercase tracking-widest text-[10px] mt-2">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <M
            {...(!light && {
              initial: { opacity: 0, x: 60 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.7 },
            })}
            data-motion="true"
            className="relative hidden lg:flex shrink-0 justify-center overflow-visible lg:mt-[calc(4.75rem+30px)]"
          >
            <div className="pointer-events-none absolute inset-0 -z-10 bg-primary/20 blur-[120px] rounded-full" />
            <div className="relative w-full max-w-[520px] overflow-visible">
              <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[32px] bg-gradient-to-b from-primary/30 to-transparent blur-xl" />
              <Image
                src={HERO_IMAGE}
                alt="Mentor Ascend Club"
                width={520}
                height={650}
                priority
                className="relative z-[1] w-full max-w-[520px] h-auto rounded-[28px] border border-primary/20 shadow-[0_0_60px_rgba(255,184,0,0.12)] object-cover"
              />
              <div className="absolute z-20 bottom-3 -left-8 bg-black/90 border border-primary/20 rounded-2xl px-5 py-4 backdrop-blur-xl shadow-2xl">
                <p className="text-primary text-xs uppercase tracking-widest font-bold mb-1">
                  Resultado Real
                </p>
                <h3 className="text-white font-black text-2xl">+500 alunos</h3>
                <p className="text-white/45 text-xs mt-1">aplicando o método Ascend</p>
              </div>
              <div className="absolute z-20 top-2 -right-24 lg:-right-28 bg-black/90 border border-primary/20 rounded-2xl px-5 py-4 backdrop-blur-xl shadow-2xl">
                <p className="text-primary text-xs uppercase tracking-widest font-bold mb-1">
                  Comunidade
                </p>
                <h3 className="text-white font-black text-2xl">Networking</h3>
                <p className="text-white/45 text-xs mt-1">suporte + direcionamento</p>
              </div>
            </div>
          </M>
        </div>
      </div>

      <Ticker />
    </section>
  );
}
