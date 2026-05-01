import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import leavesCorner from "@/assets/leaves-corner.png";

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
        {/* Folhas decorativas com fade mask para não conflitar com background */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          }}
        >
          <motion.img
            src={leavesCorner}
            alt=""
            aria-hidden
            width={1024}
            height={1024}
            className="absolute -top-10 -left-16 w-[60vw] max-w-[420px] opacity-90 animate-leaf-sway"
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
            className="absolute -bottom-12 -right-20 w-[55vw] max-w-[400px] opacity-30 rotate-180 animate-leaf-sway"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 0.3, x: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <motion.div
          className="paper-card-elegant relative z-10 max-w-md w-full px-7 py-10 sm:px-10 sm:py-14 text-center"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className="text-[0.7rem] tracking-[0.35em] uppercase text-accent mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Convite · 30.05.2026
          </motion.p>

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
            <span className="block h-px w-10 sm:w-16 bg-accent" />
            <span className="text-accent text-sm">❦</span>
            <span className="font-script italic text-xl text-secondary">
              Venham celebrar comigo!
            </span>
          </motion.div>


          <motion.a
            href="#confirmar"
            className="inline-block bg-gradient-emerald text-primary-foreground px-8 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase shadow-elegant hover:shadow-gold transition-all duration-500 hover:scale-[1.03]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            Confirmar Presença
          </motion.a>
        </motion.div>
      </section>

      {/* === COUNTDOWN === */}
      <section className="px-5 -mt-6 mb-12 relative z-10">
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
