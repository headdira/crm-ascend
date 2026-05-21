"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import ProofCarousel from "../ProofCarousel";
import { brandSurfaces, brandTypography } from "./tokens";

const testimonials = [
  {
    name: "Lucas F.",
    role: "Aluno desde 2024",
    photo: "/testimonials/lucas-f.jpg",
    text: "Em 3 meses já estava faturando R$2.500/mês. O suporte próximo faz toda a diferença. Nunca me senti sozinho.",
    stars: 5,
  },
  {
    name: "Ana C.",
    role: "Aluna desde 2024",
    photo: "/testimonials/ana-c.jpg",
    text: "As calls ao vivo são transformadoras. Cada dúvida resolvida na hora. O networking com outros alunos abriu portas inesperadas.",
    stars: 5,
  },
  {
    name: "Pedro H.",
    role: "Aluno desde 2023",
    photo: "/testimonials/pedro-h.jpg",
    text: "Já tentei vários cursos. O Ascend Club é diferente: acompanhamento DE VERDADE. Bati R$8k no mês passado.",
    stars: 5,
  },
  {
    name: "Mariana C.",
    role: "Aluna desde 2024",
    photo: "/testimonials/mariana-c.jpg",
    text: "Saí do CLT e hoje tenho meu próprio negócio digital. Melhor investimento que já fiz.",
    stars: 5,
  },
  {
    name: "Rafael O.",
    role: "Aluno desde 2023",
    photo: "/testimonials/rafael-o.jpg",
    text: "O grupo de networking é incrível. Fechei parcerias e meu faturamento triplicou em 6 meses.",
    stars: 5,
  },
  {
    name: "Juliana S.",
    role: "Aluna desde 2024",
    photo: "/testimonials/juliana-s.jpg",
    text: "Recebi minha camisa e placa do Ascend Club. Me sinto parte de algo real. Comunidade incrível!",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className={`${brandSurfaces.deep} py-24 px-6`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className={`${brandTypography.eyebrow} mb-4`}>
            Resultados reais
          </p>
          <h2 className={brandTypography.h2}>
            VEJA O QUE ESTÃO
            <br />
            <span className="text-primary">FALANDO</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              className="group relative flex flex-col min-h-[280px] p-8 sm:p-9 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] hover:border-primary/35 transition-all duration-300 shadow-lg shadow-black/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Quote
                className="absolute top-6 right-6 w-10 h-10 text-primary/15 group-hover:text-primary/25 transition-colors"
                aria-hidden
              />

              <div className="flex gap-1 mb-5">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-primary" />
                ))}
              </div>

              <blockquote className="flex-1 border-l-[3px] border-primary pl-5 pr-2">
                <p className="text-white/65 text-base sm:text-lg leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
              </blockquote>

              <footer className="flex items-center gap-5 mt-8 pt-6 border-t border-white/[0.06]">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/15 shrink-0 bg-[#1a1a1a] ring-2 ring-primary/25">
                  <Image
                    src={t.photo}
                    alt={`Foto de ${t.name}`}
                    fill
                    unoptimized
                    sizes="224px"
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <p className="font-inter text-base font-bold text-white">{t.name}</p>
                  <p className="font-inter text-sm text-white/40">{t.role}</p>
                </div>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>

      <ProofCarousel />
    </section>
  );
}
