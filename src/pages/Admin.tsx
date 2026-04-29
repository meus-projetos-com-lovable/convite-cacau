import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Users, Loader2, ShieldAlert, Phone, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Convidado {
  id: string;
  nome: string;
  telefone: string | null;
  num_acompanhantes: number;
  acompanhantes: unknown;
  observacoes: string | null;
  presenca_confirmada: boolean;
  created_at: string;
}

const Admin = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [convidados, setConvidados] = useState<Convidado[]>([]);

  useEffect(() => {
    let mounted = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) nav("/auth", { replace: true });
    });

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        nav("/auth", { replace: true });
        return;
      }
      if (!mounted) return;
      setUserId(session.user.id);

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!mounted) return;
      const admin = !!roleData;
      setIsAdmin(admin);

      if (admin) {
        const { data, error } = await supabase
          .from("convidados")
          .select("*")
          .order("created_at", { ascending: false });
        if (mounted && data) setConvidados(data as Convidado[]);
        if (error) toast.error("Erro ao carregar convidados.");
      }
      setLoading(false);
    })();

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [nav]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    nav("/auth", { replace: true });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5">
        <div className="paper-card-elegant max-w-sm p-8 text-center">
          <ShieldAlert className="w-10 h-10 text-accent mx-auto mb-3" />
          <h1 className="font-display text-xl text-primary mb-2">Acesso restrito</h1>
          <p className="text-sm text-muted-foreground mb-5">
            Sua conta ainda não tem permissão de administrador.
            Peça para um admin liberar seu acesso.
          </p>
          <p className="text-[0.65rem] text-muted-foreground mb-5 break-all">
            ID: {userId}
          </p>
          <button onClick={handleLogout}
            className="text-xs text-secondary hover:text-primary tracking-wider">
            Sair
          </button>
        </div>
      </main>
    );
  }

  const totalPessoas = convidados.reduce(
    (sum, c) => sum + 1 + (c.num_acompanhantes ?? 0),
    0
  );

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-secondary">Painel</p>
          <h1 className="font-display text-3xl text-primary">Convidados</h1>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition px-3 py-2 rounded-full hover:bg-card">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="paper-card p-4">
          <p className="text-xs uppercase tracking-wider text-secondary mb-1">Confirmações</p>
          <p className="font-display text-3xl text-primary">{convidados.length}</p>
        </div>
        <div className="paper-card p-4">
          <p className="text-xs uppercase tracking-wider text-secondary mb-1">Total Pessoas</p>
          <p className="font-display text-3xl text-primary">{totalPessoas}</p>
        </div>
      </div>

      <div className="space-y-3">
        {convidados.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground italic">
            Ainda não há confirmações.
          </div>
        )}
        {convidados.map((c, i) => {
          const acomp = Array.isArray(c.acompanhantes) ? (c.acompanhantes as string[]) : [];
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="paper-card p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-display text-lg text-primary">{c.nome}</h3>
                  {c.telefone && (
                    <a href={`tel:${c.telefone}`} className="text-xs text-secondary flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {c.telefone}
                    </a>
                  )}
                </div>
                <span className="text-xs bg-accent/15 text-accent px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                  <Users className="w-3 h-3" /> {1 + c.num_acompanhantes}
                </span>
              </div>
              {acomp.length > 0 && (
                <div className="text-xs text-muted-foreground mb-2">
                  <span className="text-secondary">Com:</span> {acomp.join(", ")}
                </div>
              )}
              {c.observacoes && (
                <p className="text-xs text-muted-foreground italic flex items-start gap-1.5 mt-2">
                  <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" /> {c.observacoes}
                </p>
              )}
              <p className="text-[0.65rem] text-muted-foreground/70 mt-2 tracking-wider">
                {new Date(c.created_at).toLocaleString("pt-BR")}
              </p>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
};

export default Admin;
