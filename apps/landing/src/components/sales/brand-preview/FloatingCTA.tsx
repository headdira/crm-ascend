"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BrandCheckoutLink from "./BrandCheckoutLink";
import { useLightExperience } from "@/hooks/use-light-experience";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const light = useLightExperience();
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 600);
        ticking.current = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (light) {
    return visible ? (
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <BrandCheckoutLink trackLabel="floating_mobile" variant="floating">
          Garantir vaga
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </BrandCheckoutLink>
      </div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 md:hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
        >
          <BrandCheckoutLink trackLabel="floating_mobile" variant="floating">
            Garantir vaga
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </BrandCheckoutLink>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
