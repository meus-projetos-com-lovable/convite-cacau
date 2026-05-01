import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Plus, Minus, Check, Loader2, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SectionCorners from "./SectionCorners";

const rsvpSchema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto").max(100, "Máx 100 caracteres"),
  telefone: z.string().trim().max(20).optional().or(z.literal("")),
  num_acompanhantes: z.number().int().min(0).max(10),
  acompanhantes: z.array(z.string().trim().min(1, "Nome obrigatório").max(100)),
});

const RSVP = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [num, setNum] = useState(0);
  const [companions, setCompanions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const updateNum = (next: number) => {
    const clamped = Math.max(0, Math.min(10, next));
    setNum(clamped);
    setCompanions((prev) => {
      const arr = [...prev];
      while (arr.length < clamped) arr.push("");
      return arr.slice(0, clamped);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = rsvpSchema.safeParse({
      nome, telefone, num_acompanhantes: num, acompanhantes: companions,
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("convidados").insert({
      nome: parsed.data.nome,
      telefone: parsed.data.telefone || null,
      num_acompanhantes: parsed.data.num_acompanhantes,
      acompanhantes: parsed.data.acompanhantes,
      presenca_confirmada: true,
    });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível confirmar. Tente novamente.");
      return;
    }
    setDone(true);
    toast.success("Presença confirmada! Obrigada ❦");
  };

  return (
    <section id="confirmar" className="py-16 px-5 relative overflow-hidden">
      <SectionCorners className="z-0" />
      <div className="max-w-md mx-auto relative z-10">
        <motion.h2
          className="text-center font-display text-3xl text-primary mb-2"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          Confirme sua Presença
        </motion.h2>
        <p className="text-center text-secondary text-xs tracking-[0.3em] uppercase mb-8">
          Sua presença é o melhor presente
        </p>

        <motion.div
          className="paper-card-elegant p-7 sm:p-9"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-emerald flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-primary-foreground" strokeWidth={2} />
                </div>
                <h3 className="font-display text-2xl text-primary mb-2">Confirmado!</h3>
                <p className="text-sm text-muted-foreground text-balance">
                  Estamos ansiosas para celebrar com você. Até lá! ❦
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider text-secondary mb-1.5">Seu nome</label>
                  <input
                    value={nome} onChange={(e) => setNome(e.target.value)}
                    maxLength={100} required
                    className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent transition"
                    placeholder="Como vai assinar"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-secondary mb-1.5">Telefone (opcional)</label>
                  <input
                    type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)}
                    maxLength={20}
                    className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent transition"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-secondary mb-2">Acompanhantes</label>
                  <div className="flex items-center gap-3 bg-background/60 border border-border rounded-xl px-2 py-2">
                    <button type="button" onClick={() => updateNum(num - 1)}
                      className="w-9 h-9 rounded-lg bg-card hover:bg-muted flex items-center justify-center transition disabled:opacity-40"
                      disabled={num === 0}>
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center font-display text-xl text-primary">{num}</div>
                    <button type="button" onClick={() => updateNum(num + 1)}
                      className="w-9 h-9 rounded-lg bg-card hover:bg-muted flex items-center justify-center transition disabled:opacity-40"
                      disabled={num === 10}>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {companions.map((name, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-xs uppercase tracking-wider text-secondary mb-1.5">
                        Acompanhante {i + 1}
                      </label>
                      <input
                        value={name}
                        onChange={(e) => {
                          const next = [...companions];
                          next[i] = e.target.value;
                          setCompanions(next);
                        }}
                        maxLength={100} required
                        className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent transition"
                        placeholder="Nome completo"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-gradient-emerald text-primary-foreground py-3.5 rounded-full font-medium tracking-wide shadow-elegant hover:shadow-gold transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : <><Heart className="w-4 h-4" /> Confirmar Presença</>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default RSVP;
