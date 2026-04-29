import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Mensagem {
  id: string;
  nome: string;
  mensagem: string;
  created_at: string;
}

const msgSchema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto").max(80),
  mensagem: z.string().trim().min(3, "Mensagem muito curta").max(500),
});

const Mural = () => {
  const [items, setItems] = useState<Mensagem[]>([]);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from("mensagens")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (active && data) setItems(data as Mensagem[]);
      });

    const channel = supabase
      .channel("mensagens-mural")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensagens" }, (payload) => {
        setItems((prev) => [payload.new as Mensagem, ...prev]);
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = msgSchema.safeParse({ nome, mensagem });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("mensagens").insert({ nome: parsed.data.nome, mensagem: parsed.data.mensagem });
    setLoading(false);
    if (error) {
      toast.error("Não foi possível enviar.");
      return;
    }
    setNome("");
    setMensagem("");
    toast.success("Recado enviado com carinho ❦");
  };

  return (
    <section id="mural" className="py-16 px-5">
      <div className="max-w-md mx-auto">
        <motion.h2
          className="text-center font-display text-3xl text-primary mb-2"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          Mural de Recados
        </motion.h2>
        <p className="text-center text-secondary text-xs tracking-[0.3em] uppercase mb-8">
          Deixe um recado carinhoso
        </p>

        <motion.form
          onSubmit={handleSubmit}
          className="paper-card p-5 mb-6 space-y-3"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <input
            value={nome} onChange={(e) => setNome(e.target.value)}
            maxLength={80} required placeholder="Seu nome"
            className="w-full bg-background/60 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition"
          />
          <textarea
            value={mensagem} onChange={(e) => setMensagem(e.target.value)}
            maxLength={500} required rows={3} placeholder="Escreva um recado para ela..."
            className="w-full bg-background/60 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition resize-none"
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-gradient-emerald text-primary-foreground py-2.5 rounded-full text-sm font-medium shadow-soft hover:shadow-elegant transition-all hover:scale-[1.01] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Enviar</>}
          </button>
        </motion.form>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="paper-card p-4"
              >
                <p className="text-sm text-foreground italic font-script text-base leading-snug">
                  "{m.mensagem}"
                </p>
                <p className="text-xs text-accent mt-2 tracking-wider uppercase">— {m.nome}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <p className="text-center text-sm text-muted-foreground italic py-6">
              Seja o primeiro a deixar um recado ❦
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Mural;
