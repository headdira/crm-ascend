"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Ticker from "../Ticker";
import { brandSurfaces, brandTypography } from "./tokens";

const benefits = [
  "Grupo de networking ativo com pessoas no mesmo objetivo",
  "2 calls ao vivo por semana em grupo",
  "Acesso aos aplicativos e ferramentas dos grandes players",
  "Palestras com convidados de resultados de múltiplos dígitos",
  "Suporte próximo e acompanhamento constante",
  "Direcionamento passo a passo do zero ao resultado",
  "Método validado por centenas de alunos",
  "Comunidade exclusiva com networking real",
];

export default function BenefitsSection() {
  return (
    <section id="beneficios" className={brandSurfaces.base}>
      <div className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className={`${brandTypography.eyebrow} mb-4`}>
            O que você recebe
          </p>
          <h2 className={`${brandTypography.h2} leading-tight`}>
            TUDO QUE VOCÊ PRECISA
            <br />
            PARA <span className="text-primary">DECOLAR</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {benefits.map((b, i) => (
            <motion.div
              key={b}
              className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-white/65 text-sm leading-relaxed">{b}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <Ticker text="ASCEND CLUB · RESULTADOS REAIS" bgColor="bg-white/5" textColor="text-white/40" />
    </section>
  );
}
