import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionCorners from "./SectionCorners";

const Hero = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [phase, setPhase] = useState<"rsvp" | "event">("rsvp");

  useEffect(() => {
    const RSVP_DEADLINE = new Date("2026-05-10T23:59:59").getTime();
    const EVENT_DATE = new Date("2026-05-30T15:00:00").getTime();

    const tick = () => {
      const now = Date.now();
      const isRsvp = now < RSVP_DEADLINE;
      setPhase(isRsvp ? "rsvp" : "event");
      const target = isRsvp ? RSVP_DEADLINE : EVENT_DATE;
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
    <>
      <section
        id="home"
        className="relative min-h-[100svh] flex items-center justify-center px-5 py-12 overflow-hidden"
      >
        <SectionCorners className="z-20" />

        <motion.div
          className="paper-card-elegant relative z-10 max-w-md w-full px-7 py-10 sm:px-10 sm:py-14 text-center"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
    
          <motion.h1
            className="font-display text-4xl sm:text-5xl text-primary leading-tight text-balance mb-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Culto de Ação de Graças
          </motion.h1>

          <motion.h2
            className="font-script text-5xl sm:text-6xl text-primary/90 leading-none mb-6 italic"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Cacau · 50 anos
          </motion.h2>

          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >

            <span className="font-script italic text-xl text-secondary">
              Venham celebrar comigo!
            </span>
          </motion.div>

          {/* Detalhes do Evento */}
          <motion.div
            className="w-full mb-7"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="block h-px flex-1 bg-accent/40" />
              <span className="text-accent text-xs">❧</span>
              <span className="block h-px flex-1 bg-accent/40" />
            </div>

            <ul className="space-y-3.5 text-left">
              <li className="flex items-start gap-3.5">
                <span className="shrink-0 w-8 h-8 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </span>
                <div>
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-secondary font-medium mb-0.5">Data</p>
                  <p className="text-[0.9rem] font-medium text-primary">30 de maio de 2026</p>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <span className="shrink-0 w-8 h-8 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9"/>
                    <polyline points="12 7 12 12 15.5 15.5"/>
                  </svg>
                </span>
                <div>
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-secondary font-medium mb-0.5">Horário</p>
                  <p className="text-[0.9rem] font-medium text-primary">Das 15h às 19h</p>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <span className="shrink-0 w-8 h-8 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <div>
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-secondary font-medium mb-0.5">Endereço</p>
                  <p className="text-[0.9rem] font-medium text-primary">Rua Mirataia, 350</p>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <span className="shrink-0 w-8 h-8 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </span>
                <div>
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-secondary font-medium mb-0.5">Local</p>
                  <p className="text-[0.9rem] font-medium text-primary">Salão de Festa Principal</p>
                </div>
              </li>
            </ul>

            {/* Versículo */}
            <div className="mt-6 px-2 text-center">
              <span className="block h-px w-16 bg-accent/30 mx-auto mb-4" />
              <p className="font-script italic text-lg text-primary/80 leading-snug mb-1">
                "Até aqui nos ajudou o Senhor"
              </p>
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-secondary">1 Samuel 7.12</p>
              <span className="block h-px w-16 bg-accent/30 mx-auto mt-4" />
            </div>
          </motion.div>

          <motion.a
            href="#confirmar"
            className="inline-block bg-gradient-emerald text-primary-foreground px-8 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase shadow-elegant hover:shadow-gold transition-all duration-500 hover:scale-[1.03]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            Confirmar Presença
          </motion.a>
        </motion.div>
      </section>

      {/* === COUNTDOWN === */}
      <section className="px-5 mt-16 mb-16 relative z-10">
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-center text-[0.65rem] font-medium tracking-[0.2em] uppercase text-secondary mb-3">
            {phase === "rsvp"
              ? "Para confirmar presença · até 10/05"
              : "Para o grande dia · 30/05"}
          </p>
          <div className="bg-card/90 backdrop-blur-sm border border-accent/20 rounded-2xl shadow-elegant px-5 py-5 grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { label: "Dias", value: countdown.days },
              { label: "Horas", value: countdown.hours },
              { label: "Minutos", value: countdown.minutes },
              { label: "Segundos", value: countdown.seconds },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-display text-2xl sm:text-3xl text-primary tabular-nums">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[0.55rem] uppercase tracking-wider text-secondary mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
