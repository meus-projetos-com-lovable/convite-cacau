import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import leavesCorner from "@/assets/leaves-corner.png";

const Hero = () => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("2026-05-30T15:00:00").getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="relative min-h-[100svh] flex items-center justify-center px-5 py-12 overflow-hidden">
      {/* Folhas decorativas */}
      <motion.img
        src={leavesCorner}
        alt=""
        aria-hidden
        width={1024}
        height={1024}
        className="absolute -top-10 -left-16 w-[60vw] max-w-[420px] opacity-90 animate-leaf-sway pointer-events-none select-none"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 0.95, x: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.img
        src={leavesCorner}
        alt=""
        aria-hidden
        width={1024}
        height={1024}
        className="absolute -bottom-12 -right-20 w-[55vw] max-w-[400px] opacity-80 rotate-180 animate-leaf-sway pointer-events-none select-none"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 0.85, x: 0 }}
        transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ animationDelay: "1.5s" }}
      />

      <motion.div
        className="paper-card-elegant relative z-10 max-w-md w-full px-7 py-10 sm:px-10 sm:py-14 text-center"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.p
          className="text-[0.7rem] tracking-[0.35em] uppercase text-secondary mb-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }}
        >
          Convite
        </motion.p>

        <motion.h1
          className="font-display text-3xl sm:text-4xl text-primary leading-tight text-balance"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
        >
          Culto de Ação de Graças
        </motion.h1>

        <motion.h2
          className="font-script text-5xl sm:text-6xl text-primary leading-none my-3"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Cacau · 50 anos
        </motion.h2>

        <motion.div
          className="flex items-center justify-center my-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.6 }}
        >
          <span className="block h-px w-12 bg-accent/60" />
          <span className="mx-3 text-accent text-lg">❦</span>
          <span className="block h-px w-12 bg-accent/60" />
        </motion.div>

        <motion.div
          className="inline-block bg-secondary/15 px-5 py-1.5 rounded-full mb-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.6 }}
        >
          <p className="font-script text-base text-primary italic">Venham celebrar comigo!</p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          className="grid grid-cols-4 gap-2 my-6"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.7 }}
        >
          {[
            { label: "Dias", value: countdown.days },
            { label: "Horas", value: countdown.hours },
            { label: "Minutos", value: countdown.minutes },
            { label: "Segundos", value: countdown.seconds },
          ].map((item) => (
            <div key={item.label} className="bg-background/60 rounded-xl py-2 border border-accent/20">
              <div className="font-display text-xl sm:text-2xl text-primary tabular-nums">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="text-[0.6rem] uppercase tracking-wider text-secondary">{item.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.p
          className="font-script text-base text-secondary italic mt-4 px-2 text-balance"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 0.8 }}
        >
          "Até aqui nos ajudou o Senhor"
        </motion.p>
        <motion.p
          className="text-xs text-accent mt-1 tracking-wider"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.6 }}
        >
          1 Samuel 7.12
        </motion.p>

        <motion.a
          href="#confirmar"
          className="inline-block mt-8 bg-gradient-emerald text-primary-foreground px-8 py-3.5 rounded-full font-medium text-sm tracking-wide shadow-elegant hover:shadow-gold transition-all duration-500 hover:scale-105"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1, duration: 0.6 }}
        >
          Confirmar Presença →
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;
