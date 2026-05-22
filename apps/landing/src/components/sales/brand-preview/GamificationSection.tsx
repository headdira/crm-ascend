"use client";

import { motion } from "framer-motion";
import { Trophy, Gift, Shirt } from "lucide-react";
import { brandSurfaces, brandTypography } from "./tokens";

const rewards = [
  {
    icon: Shirt,
    label: "Camisas",
    desc: "Camisas exclusivas do Ascend Club conforme você avança.",
  },
  {
    icon: Gift,
    label: "Pulseiras",
    desc: "Pulseiras de membro que simbolizam pertencimento e conquista.",
  },
  {
    icon: Trophy,
    label: "Placas",
    desc: "Placas físicas de conquista celebrando seus marcos no digital.",
  },
];

export default function GamificationSection() {
  return (
    <section id="gamificacao" className={`${brandSurfaces.deep} py-24 px-6`}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className={`${brandTypography.eyebrow} mb-4`}>
            Gamificação
          </p>
          <h2 className={`${brandTypography.h2} leading-tight`}>
            SEU PROGRESSO É
            <br />
            <span className="text-primary">RECOMPENSADO</span>
          </h2>
          <p className={`mt-6 max-w-xl mx-auto ${brandTypography.body}`}>
            Cada passo que você dá no Ascend Club é reconhecido com brindes físicos exclusivos.
            Porque você merece ser celebrado pela sua evolução.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {rewards.map((r, i) => (
            <motion.div
              key={r.label}
              className="group text-center p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                <r.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-inter font-black text-xl uppercase text-white mb-2">{r.label}</h3>
              <p className="text-white/65 text-sm">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
