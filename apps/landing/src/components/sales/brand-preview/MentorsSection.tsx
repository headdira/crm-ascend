"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import SalesImage from "../SalesImage";
import Ticker from "../Ticker";
import { brandSurfaces, brandTypography } from "./tokens";

const KELVIN_IMG =
  "https://media.base44.com/images/public/69f23854d0500399d6881fb0/bfbd13f93_WhatsAppImage2026-04-29at091311.jpeg";
const ERICK_IMG =
  "https://media.base44.com/images/public/69f23854d0500399d6881fb0/8abe8cf1e_ChatGPTImage5demaide202610_21_16.png";

const mentors = [
  {
    name: "Kelvin Martins",
    role: "Co-fundador do Ascend Club",
    img: KELVIN_IMG,
    /** Foco no rosto — foto com pessoa mais alta no quadro */
    objectPosition: "50% 12%",
    desc: "Empreendedor digital com anos de experiência, ajudou centenas de alunos a construírem suas primeiras fontes de renda online com estratégias simples e replicáveis.",
  },
  {
    name: "Erick Vinicius",
    role: "Co-fundador do Ascend Club",
    img: ERICK_IMG,
    objectPosition: "50% 8%",
    desc: "Especialista em vendas digitais e construção de audiência. Referência no mercado pelo método direto ao ponto e pelos resultados consistentes dos seus mentorados.",
  },
];

export default function MentorsSection() {
  return (
    <section id="mentores" className={brandSurfaces.base}>
      <Ticker
        text="SEUS MENTORES · KELVIN MARTINS · ERICK VINICIUS"
        bgColor="bg-primary"
        textColor="text-black"
      />
      <div className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className={`${brandTypography.eyebrow} mb-4`}>
            Quem vai te guiar
          </p>
          <h2 className={brandTypography.h2}>
            CONHEÇA SEUS <span className="text-primary">MENTORES</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {mentors.map((m, i) => (
            <motion.div
              key={m.name}
              className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-all"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <div
                className={`relative w-full overflow-hidden ${brandSurfaces.elevated} aspect-[3/4] max-h-[min(92vw,520px)] sm:max-h-[560px] md:aspect-[4/5] md:max-h-[480px] lg:max-h-[520px]`}
              >
                <SalesImage
                  src={m.img}
                  alt={`${m.name} — ${m.role} do Ascend Club`}
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  quality={50}
                  className="object-cover"
                  style={{ objectPosition: m.objectPosition }}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
              </div>
              <div className="p-8 -mt-4 relative">
                <div className="inline-flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="font-inter text-primary text-xs font-bold uppercase tracking-widest">
                    {m.role}
                  </span>
                </div>
                <h3 className="font-inter font-black text-2xl uppercase text-white mb-3">{m.name}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
