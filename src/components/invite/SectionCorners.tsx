import { motion } from "framer-motion";
import foliageTopLeft from "@/assets/foliage-top-left.png";
import foliageBottomLeft from "@/assets/foliage-bottom-left.png";
import foliageBottomRight from "@/assets/foliage-bottom-right.png";

interface SectionCornersProps {
  className?: string;
}

const SectionCorners = ({ className = "z-0" }: SectionCornersProps) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
      }}
    >
      {/* Top Left */}
      <motion.img
        src={foliageTopLeft}
        alt=""
        aria-hidden
        className="absolute -top-6 -left-6 w-32 sm:w-40 opacity-80 animate-leaf-sway"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.8, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Bottom Right */}
      <motion.img
        src={foliageBottomRight}
        alt=""
        aria-hidden
        className="absolute -bottom-8 -right-8 w-36 sm:w-48 opacity-60 animate-leaf-sway"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ animationDelay: "1s" }}
      />

      {/* Bottom Left (opcional, para dar mais profundidade) */}
      <motion.img
        src={foliageBottomLeft}
        alt=""
        aria-hidden
        className="absolute -bottom-4 -left-4 w-28 sm:w-36 opacity-30 animate-leaf-sway"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.3, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
};

export default SectionCorners;
