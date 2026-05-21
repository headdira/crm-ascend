"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, Shield, Zap } from "lucide-react";
import Ticker from "./Ticker";
import CheckoutLink from "./CheckoutLink";

const included = [
  "1 ano completo de acesso",
  "2 calls ao vivo por semana",
  "Grupo de networking exclusivo",
  "Palestrantes convidados",
  "Suporte próximo e constante",
  "Ferramentas dos grandes players",
  "Direcionamento passo a passo",
  "Brindes e recompensas por progresso",
];

export default function PricingCTA() {
  return (
    <section id="preco" className="bg-[#0d0d0d]">
      <Ticker text="GARANTA SUA VAGA · VAGAS LIMITADAS" bgColor="bg-primary" textColor="text-black" />
      <div className="py-24 px-6 max-w-4xl mx-auto">
        <motion.div
          className="relative rounded-3xl overflow-hidden border border-primary/20 bg-[#111]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary/15 rounded-full blur-3xl" />

          <div className="relative z-10 p-8 sm:p-12 md:p-16">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="font-inter text-sm font-bold text-red-400 uppercase tracking-wide">
                  Vagas Limitadas · Preço por Tempo Limitado
                </span>
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="font-inter font-black text-3xl sm:text-4xl md:text-5xl uppercase text-white mb-4">
                PRONTO PARA
                <br />
                <span className="text-primary">TRANSFORMAR</span> SUA VIDA?
              </h2>
              <p className="font-inter text-white/50 max-w-xl mx-auto">
                Entre agora para o Ascend Club e tenha acesso a tudo que precisa para construir
                sua renda online.
              </p>
            </div>

            <div className="text-center mb-10">
              <p className="font-inter text-white/30 line-through text-lg mb-1">De R$497</p>
              <p className="font-inter font-black text-7xl sm:text-8xl text-primary leading-none">
                R$197
              </p>
              <p className="font-inter text-white/40 text-sm mt-2 uppercase tracking-widest">
                1 ano completo · Pagamento único
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-10">
              {included.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <span className="font-inter text-sm text-white/60">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4">
              <CheckoutLink
                trackLabel="pricing_main"
                className="inline-flex items-center gap-3 bg-primary text-black font-inter font-black text-xl px-14 py-6 rounded-xl uppercase tracking-wide hover:brightness-110 transition-all shadow-2xl shadow-primary/30 w-full sm:w-auto justify-center"
              >
                Garantir minha vaga
                <ArrowRight className="w-5 h-5" />
              </CheckoutLink>
              <div className="flex flex-wrap justify-center gap-5 text-xs text-white/30 font-inter">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Pagamento seguro via Kiwify</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Acesso imediato</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
