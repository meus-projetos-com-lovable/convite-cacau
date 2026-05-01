import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import SectionCorners from "./SectionCorners";

const ADDRESS = "Rua Mirataia, 350";
const ENCODED = encodeURIComponent(ADDRESS);

const Location = () => (
  <section id="local" className="py-16 px-5 relative overflow-hidden">
    <SectionCorners className="z-0" />
    <div className="max-w-md mx-auto relative z-10">
      <motion.h2
        className="text-center font-display text-3xl text-primary mb-2"
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
      >
        O Local
      </motion.h2>
      <p className="text-center text-secondary text-xs tracking-[0.3em] uppercase mb-8">
        Salão de Festas Principal
      </p>

      <motion.div
        className="paper-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
      >
        <div className="aspect-video w-full bg-muted relative">
          <iframe
            title="Mapa do local"
            src={`https://maps.google.com/maps?q=${ENCODED}&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-1 text-primary">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="font-display text-lg">{ADDRESS}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-5">Salão de Festas Principal</p>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${ENCODED}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gradient-emerald text-primary-foreground py-3 rounded-full text-sm font-medium shadow-soft hover:shadow-elegant transition-all hover:scale-[1.02]"
            >
              <Navigation className="w-4 h-4" /> Google Maps
            </a>
            <a
              href={`https://waze.com/ul?q=${ENCODED}&navigate=yes`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-card text-primary py-3 rounded-full text-sm font-medium border border-accent/40 hover:bg-accent/10 transition-all hover:scale-[1.02]"
            >
              <Navigation className="w-4 h-4 text-accent" /> Waze
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Location;
