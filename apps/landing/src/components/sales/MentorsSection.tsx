"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { useLightExperience } from "@/hooks/use-light-experience";
import { mentorProfiles } from "@/lib/sales/mentors";
import SalesImage from "./SalesImage";
import Ticker from "./Ticker";

const mentorPhotoFrameClass =
  "relative w-full overflow-hidden bg-[#111] min-h-[320px] aspect-[3/4] sm:min-h-[360px] md:aspect-[4/5] md:min-h-0 md:max-h-[480px] lg:max-h-[520px]";

export default function MentorsSection() {
  const light = useLightExperience();
  const M = light ? "div" : motion.div;

  return (
    <section id="mentores" className="bg-[#0a0a0a]">
      <Ticker
        text="SEUS MENTORES · KELVIN MARTINS · ERICK VINICIUS"
        bgColor="bg-primary"
        textColor="text-black"
      />
      <div className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <M
          className="text-center mb-12 sm:mb-16"
          {...(!light && {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-40px" },
          })}
          data-motion="true"
        >
          <p className="font-inter text-primary font-bold text-sm tracking-[0.3em] uppercase mb-4">
            Quem vai te guiar
          </p>
          <h2 className="font-inter font-black text-4xl sm:text-5xl md:text-6xl uppercase text-white">
            CONHEÇA SEUS <span className="text-primary">MENTORES</span>
          </h2>
        </M>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {mentorProfiles.map((m, i) => (
            <M
              key={m.name}
              className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-colors"
              {...(!light && {
                initial: { opacity: 0, y: 40 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-40px" },
                transition: { delay: i * 0.15 },
              })}
              data-motion="true"
            >
              <div className={mentorPhotoFrameClass}>
                <SalesImage
                  src={m.img}
                  webpSrc={m.webpSrc}
                  alt={`${m.name} — ${m.role} do Ascend Club`}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover"
                  style={{ objectPosition: m.objectPosition }}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
              </div>
              <div className="p-6 sm:p-8 -mt-4 relative">
                <div className="inline-flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-inter text-primary text-xs font-bold uppercase tracking-widest">
                    {m.role}
                  </span>
                </div>
                <h3 className="font-inter font-black text-xl sm:text-2xl uppercase text-white mb-3">
                  {m.name}
                </h3>
                <p className="font-inter text-white/50 text-sm sm:text-[15px] leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </M>
          ))}
        </div>
      </div>
    </section>
  );
}
