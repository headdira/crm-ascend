"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { brandSurfaces, brandTypography } from "./tokens";

const objections = [
  {
    q: '"Não tenho experiência…"',
    a: "Perfeito. A mentoria foi criada exatamente para iniciantes. Você será guiado do absoluto zero com passo a passo claro.",
  },
  {
    q: '"R$197 é muito pra mim agora…"',
    a: "São menos de R$0,54 por dia para 1 ano completo de mentoria, comunidade e suporte. O menor investimento com o maior retorno.",
  },
  {
    q: '"Já comprei cursos e não funcionou…"',
    a: "Aqui não é curso gravado que você assiste sozinho. É mentoria com acompanhamento real, calls ao vivo e suporte constante.",
  },
  {
    q: '"Será que funciona pra mim?"',
    a: "O método foi validado por centenas de alunos de diferentes perfis e idades. Se você seguir o direcionamento, funciona.",
  },
];

export default function ObjectionsSection() {
  return (
    <section id="objecoes" className={`${brandSurfaces.base} py-24 px-6`}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className={`${brandTypography.eyebrow} mb-4`}>
            Ainda com dúvidas?
          </p>
          <h2 className={`${brandTypography.h2} sm:text-5xl`}>
            DEIXA EU SER <span className="text-primary">DIRETO</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {objections.map((o, i) => (
            <motion.div
              key={o.q}
              className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-primary/25 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="font-inter font-bold text-white/60 text-sm mb-3">{o.q}</p>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-white/65 text-sm leading-relaxed">{o.a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
