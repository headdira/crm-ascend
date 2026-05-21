"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CheckoutLink from "./CheckoutLink";
import SalesImage from "./SalesImage";
import Ticker from "./Ticker";
import { LOGO_URL } from "./constants";

const pillars = [
  "Suporte Presente",
  "Acompanhamento de Perto",
  "Comunidade Ativa",
  "Transformação Real",
];

export default function FinalSection() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="py-24 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SalesImage
            src={LOGO_URL}
            alt="Ascend Club"
            width={200}
            height={80}
            className="h-20 w-auto mx-auto mb-12 opacity-90"
            sizes="200px"
          />
          <h2 className="font-inter font-black text-3xl sm:text-4xl md:text-5xl uppercase text-white mb-4 leading-tight">
            O ASCEND CLUB NÃO É SÓ
            <br />
            UMA MENTORIA.
          </h2>
          <h3 className="font-inter font-black text-3xl sm:text-4xl md:text-5xl uppercase text-primary mb-10">
            É UM MOVIMENTO.
          </h3>
          <p className="font-inter text-white/50 text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
            Aqui, ninguém caminha sozinho. Você terá ao seu lado mentores comprometidos, uma
            comunidade que vibra junto e um método que realmente funciona.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {pillars.map((p) => (
              <div key={p} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <p className="font-inter font-bold text-sm text-white uppercase tracking-wide">{p}</p>
              </div>
            ))}
          </div>

          <CheckoutLink
            trackLabel="final_section"
            className="inline-flex items-center gap-3 bg-primary text-black font-inter font-black text-lg px-12 py-6 rounded-xl uppercase tracking-wide hover:brightness-110 transition-all shadow-2xl shadow-primary/30"
          >
            Entrar para o Ascend Club
            <ArrowRight className="w-5 h-5" />
          </CheckoutLink>
          <p className="font-inter text-xs text-white/20 mt-4">
            Você está a um clique de mudar sua história.
          </p>
        </motion.div>
      </div>

      <Ticker
        text="ASCEND CLUB · SEU NOVO COMEÇO NO DIGITAL"
        bgColor="bg-primary"
        textColor="text-black"
      />

      <div className="py-8 text-center space-y-2">
        <p className="font-inter text-xs text-white/30 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link href="/conhecimento" className="hover:text-primary underline underline-offset-2">
            Informações do programa
          </Link>
          <Link href="/privacidade" className="hover:text-primary underline underline-offset-2">
            Privacidade
          </Link>
        </p>
        <p className="font-inter text-xs text-white/20">
          © {new Date().getFullYear()} Ascend Club. Todos os direitos reservados.
        </p>
      </div>
    </section>
  );
}
