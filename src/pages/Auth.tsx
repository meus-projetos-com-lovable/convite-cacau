import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Senha mínima de 6 caracteres").max(72),
});

const Auth = () => {
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Acesso Admin · 50 Anos";
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/admin", { replace: true });
    });
  }, [nav]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) {
        toast.error(error.message.includes("already") ? "Este email já está cadastrado." : error.message);
        return;
      }
      toast.success("Conta criada! Entre agora.");
      setMode("login");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      setLoading(false);
      if (error) {
        toast.error("Email ou senha incorretos.");
        return;
      }
      nav("/admin", { replace: true });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-16">
      <motion.div
        className="paper-card-elegant w-full max-w-sm p-8"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-7">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-emerald flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl text-primary">Área Reservada</h1>
          <p className="text-xs text-secondary mt-1 tracking-wider uppercase">
            {mode === "login" ? "Entrar" : "Criar Conta"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-secondary mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required maxLength={255} autoComplete="email"
              className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-secondary mb-1.5">Senha</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required minLength={6} maxLength={72}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-gradient-emerald text-primary-foreground py-3 rounded-full text-sm font-medium shadow-elegant hover:shadow-gold transition-all hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "login" ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full mt-5 text-xs text-secondary hover:text-primary transition tracking-wider"
        >
          {mode === "login" ? "Primeira vez? Criar conta" : "Já tem conta? Entrar"}
        </button>

        <p className="text-[0.65rem] text-muted-foreground text-center mt-6 leading-relaxed">
          Apenas administradores autorizados podem ver a lista de convidados.
        </p>
      </motion.div>
    </main>
  );
};

export default Auth;
