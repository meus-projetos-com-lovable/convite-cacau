import { motion } from "framer-motion";
import { DoorOpen, UtensilsCrossed, Cake, Music } from "lucide-react";

const events = [
  { time: "15h", icon: DoorOpen, title: "Recepção", desc: "Boas-vindas com chá e flores" },
  { time: "16h", icon: UtensilsCrossed, title: "Almoço", desc: "Banquete em família" },
  { time: "17h", icon: Cake, title: "Bolo & Brinde", desc: "Celebração dos 50 anos" },
  { time: "18h", icon: Music, title: "Confraternização", desc: "Música, fotos e abraços" },
];

const Timeline = () => (
  <section id="programa" className="py-16 px-5">
    <div className="max-w-md mx-auto">
      <motion.h2
        className="text-center font-display text-3xl text-primary mb-2"
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
      >
        Programa
      </motion.h2>
      <p className="text-center text-secondary text-xs tracking-[0.3em] uppercase mb-10 ornament inline-block left-1/2 -translate-x-1/2 relative">
        <span>Da Tarde</span>
      </p>

      <div className="relative">
        <div className="absolute left-8 top-2 bottom-2 w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />
        {events.map((ev, i) => {
          const Icon = ev.icon;
          return (
            <motion.div
              key={ev.time}
              className="flex items-start gap-5 mb-7 relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <div className="shrink-0 w-16 h-16 rounded-full bg-gradient-emerald flex items-center justify-center shadow-elegant border-4 border-background relative z-10">
                <Icon className="w-6 h-6 text-primary-foreground" strokeWidth={1.5} />
              </div>
              <div className="paper-card flex-1 px-4 py-3.5">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <h3 className="font-display text-lg text-primary">{ev.title}</h3>
                  <span className="font-script text-base text-accent">{ev.time}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{ev.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Timeline;
