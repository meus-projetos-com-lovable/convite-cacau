import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { z } from "zod";
import {
  DoorOpen, UtensilsCrossed, Cake, Music,
  MapPin, Navigation, Plus, Minus, Check, Loader2, Heart, Send,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import desktopLeaves from "@/assets/desktop-leaves-left.png";
import wreath from "@/assets/wreath.png";
import branchDivider from "@/assets/branch-divider.png";

const ADDRESS = "Rua Mirataia, 350";
const ENCODED = encodeURIComponent(ADDRESS);
const RSVP_DEADLINE = new Date("2026-05-10T23:59:59").getTime();
const EVENT_DATE = new Date("2026-05-30T15:00:00").getTime();

const events = [
  { time: "15h", icon: DoorOpen, title: "Recepção", desc: "Boas-vindas com chá e flores" },
  { time: "16h", icon: UtensilsCrossed, title: "Almoço", desc: "Banquete em família" },
  { time: "17h", icon: Cake, title: "Bolo & Brinde", desc: "Celebração dos 50 anos" },
  { time: "18h", icon: Music, title: "Confraternização", desc: "Música, fotos e abraços" },
];

const navItems = [
  { id: "home", label: "Convite" },
  { id: "local", label: "Local" },
  { id: "mural", label: "Mural" },
  { id: "confirmar", label: "Confirmar" },
];

interface Mensagem { id: string; nome: string; mensagem: string; created_at: string; }

const rsvpSchema = z.object({
  nome: z.string().trim().min(2).max(100),
  telefone: z.string().trim().max(20).optional().or(z.literal("")),
  num_acompanhantes: z.number().int().min(0).max(10),
  acompanhantes: z.array(z.string().trim().min(1).max(100)),
  observacoes: z.string().trim().max(300).optional().or(z.literal("")),
});

const msgSchema = z.object({
  nome: z.string().trim().min(2).max(80),
  mensagem: z.string().trim().min(3).max(500),
});

const DesktopInvite = () => {
  // Countdown — até 10/05 (confirmação) ou até 30/05 (evento)
  const [cd, setCd] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [phase, setPhase] = useState<"rsvp" | "event">(
    Date.now() < RSVP_DEADLINE ? "rsvp" : "event"
  );
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const isRsvp = now < RSVP_DEADLINE;
      setPhase(isRsvp ? "rsvp" : "event");
      const target = isRsvp ? RSVP_DEADLINE : EVENT_DATE;
      const diff = Math.max(0, target - now);
      setCd({
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

  // Active section
  const [active, setActive] = useState("home");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Parallax leaves
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const leavesY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const leavesOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  return (
    <main className="min-h-screen">
      {/* === NAVBAR === */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40"
        initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-baseline gap-2">
            <span className="font-script text-3xl text-primary">L</span>
            <span className="text-[0.65rem] tracking-[0.4em] uppercase text-secondary">50 Anos</span>
          </a>
          <nav className="flex items-center gap-10">
            {navItems.map(({ id, label }) => (
              <a key={id} href={`#${id}`} className="relative group">
                <span className={`text-xs tracking-[0.25em] uppercase transition-colors ${active === id ? "text-primary" : "text-secondary hover:text-primary"}`}>
                  {label}
                </span>
                <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-px bg-accent transition-all duration-500 ${active === id ? "w-full" : "w-0 group-hover:w-1/2"}`} />
              </a>
            ))}
          </nav>
          <a href="#confirmar" className="text-xs tracking-[0.2em] uppercase bg-gradient-emerald text-primary-foreground px-6 py-3 rounded-full hover:shadow-elegant transition-all hover:scale-[1.03]">
            Confirmar
          </a>
        </div>
      </motion.header>

      {/* === HERO === */}
      <section ref={heroRef} id="home" className="relative min-h-screen flex items-center px-10 pt-20 overflow-hidden">
        <motion.img
          src={desktopLeaves}
          alt="" aria-hidden
          width={900} height={1280}
          className="absolute -top-20 -left-40 w-[55vw] max-w-[700px] pointer-events-none select-none opacity-90"
          style={{ y: leavesY, opacity: leavesOpacity }}
        />
        <motion.img
          src={desktopLeaves}
          alt="" aria-hidden
          width={900} height={1280}
          className="absolute -top-32 -right-40 w-[50vw] max-w-[600px] pointer-events-none select-none opacity-80 scale-x-[-1]"
          style={{ y: leavesY, opacity: leavesOpacity }}
        />

        {/* Degradê bege que suaviza a transição entre folhas e o texto */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.92) 28%, hsl(var(--background) / 0.55) 50%, hsl(var(--background) / 0) 75%)",
          }}
        />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-16 items-center relative z-10">
          {/* Texto à esquerda */}
          <motion.div
            className="col-span-7 relative"
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}
          >
            <p className="text-[0.7rem] tracking-[0.5em] uppercase text-accent mb-6">
              Convite · 30.05.2026
            </p>
            <h1 className="font-display text-6xl xl:text-7xl text-primary leading-[1] mb-4 text-balance">
              Culto de Ação de Graças
            </h1>
            <h2 className="font-script text-6xl xl:text-7xl text-primary/90 italic leading-none mb-8">
              Cacau · 50 anos
            </h2>
            <div className="flex items-center gap-4 mb-10">
              <span className="block h-px w-20 bg-accent" />
              <span className="text-accent text-sm">❦</span>
              <span className="font-script italic text-2xl text-secondary">Venham celebrar comigo</span>
            </div>

            <p className="text-base text-muted-foreground max-w-lg leading-relaxed mb-10 text-pretty">
              Meio século atrás, uma vida começou. Hoje, celebro com profunda
              gratidão cada estação vivida — e quero dividir essa alegria com você.
            </p>

            <div className="flex items-center gap-5">
              <a href="#confirmar"
                className="bg-gradient-emerald text-primary-foreground px-10 py-4 rounded-full text-sm tracking-[0.2em] uppercase shadow-elegant hover:shadow-gold transition-all hover:scale-[1.03]">
                Confirmar Presença
              </a>
            </div>
          </motion.div>

          {/* Guirlanda à direita */}
          <motion.div
            className="col-span-5 relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.7 }}
          >
            <motion.img
              src={wreath}
              alt="" aria-hidden
              width={800} height={800}
              className="w-full max-w-[500px] animate-leaf-sway"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="font-script italic text-lg text-secondary mb-1">trinta de maio</p>
              <p className="font-display text-5xl text-primary leading-none mb-1">2026</p>
              <p className="text-xs tracking-[0.35em] uppercase text-accent mt-2">15h às 19h</p>
            </div>
          </motion.div>
        </div>

      </section>

      {/* === COUNTDOWN === */}
      <section className="px-10 -mt-4 mb-4 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        >
          <p className="text-center text-[0.7rem] tracking-[0.5em] uppercase text-accent mb-3">
            {phase === "rsvp"
              ? "Contagem regressiva para confirmar presença · até 10 de maio"
              : "Contagem regressiva para o grande dia · 30 de maio"}
          </p>
          <div className="bg-card/90 backdrop-blur-sm border border-accent/20 rounded-2xl shadow-elegant px-10 py-5 grid grid-cols-4 gap-6">
            {[
              { label: "Dias", value: cd.days },
              { label: "Horas", value: cd.hours },
              { label: "Minutos", value: cd.minutes },
              { label: "Segundos", value: cd.seconds },
            ].map((it, i) => (
              <div key={it.label} className={`text-center ${i > 0 ? "border-l border-border/60" : ""}`}>
                <div className="font-display text-4xl text-primary tabular-nums">
                  {String(it.value).padStart(2, "0")}
                </div>
                <div className="text-[0.65rem] tracking-[0.3em] uppercase text-secondary mt-1">{it.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* === DIVISOR === */}
      <div className="flex justify-center py-8">
        <img src={branchDivider} alt="" aria-hidden width={120} height={120} className="w-24 h-24 object-contain opacity-70" loading="lazy" />
      </div>

      {/* === LOCAL === */}
      <section id="local" className="py-32 px-10 bg-paper-warm/30">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <p className="text-[0.7rem] tracking-[0.5em] uppercase text-accent mb-4">Onde Será</p>
            <h2 className="font-display text-6xl text-primary mb-3">O Local</h2>
            <p className="font-script italic text-xl text-secondary mb-8">um espaço preparado com carinho</p>

            <div className="paper-card p-7 mb-8">
              <div className="flex items-start gap-3 mb-2">
                <MapPin className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-display text-2xl text-primary leading-tight">{ADDRESS}</p>
                  <p className="text-sm text-muted-foreground mt-1">Salão de Festas Principal</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${ENCODED}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-emerald text-primary-foreground py-4 rounded-full text-sm tracking-wider shadow-soft hover:shadow-elegant transition-all hover:scale-[1.02]">
                <Navigation className="w-4 h-4" /> Google Maps
              </a>
              <a href={`https://waze.com/ul?q=${ENCODED}&navigate=yes`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-card text-primary py-4 rounded-full text-sm tracking-wider border border-accent/40 hover:bg-accent/10 transition-all hover:scale-[1.02]">
                <Navigation className="w-4 h-4 text-accent" /> Waze
              </a>
            </div>
          </motion.div>

          <motion.div
            className="paper-card overflow-hidden shadow-elegant"
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <iframe
              title="Mapa do local"
              src={`https://maps.google.com/maps?q=${ENCODED}&output=embed`}
              className="w-full h-[460px] border-0"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* === MURAL === */}
      <MuralDesktop />

      {/* === RSVP === */}
      <RSVPDesktop />

      {/* === FOOTER === */}
      <footer className="py-20 px-10 text-center bg-gradient-emerald text-primary-foreground">
        <p className="font-script italic text-3xl mb-3">"Até aqui nos ajudou o Senhor"</p>
        <p className="text-xs tracking-[0.4em] uppercase opacity-70">1 Samuel 7.12</p>
        <div className="my-8 inline-flex items-center gap-4">
          <span className="block h-px w-20 bg-primary-foreground/30" />
          <span className="text-accent text-base">❦</span>
          <span className="block h-px w-20 bg-primary-foreground/30" />
        </div>
        <p className="text-sm tracking-[0.3em] uppercase opacity-80">30 de Maio de 2026</p>
      </footer>
    </main>
  );
};

/* ============== Mural Desktop ============== */
const MuralDesktop = () => {
  const [items, setItems] = useState<Mensagem[]>([]);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.from("mensagens").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => { if (active && data) setItems(data as Mensagem[]); });
    const ch = supabase.channel("mural-desktop")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensagens" },
        (p) => setItems((prev) => [p.new as Mensagem, ...prev]))
      .subscribe();
    return () => { active = false; supabase.removeChannel(ch); };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = msgSchema.safeParse({ nome, mensagem });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setLoading(true);
    const { error } = await supabase.from("mensagens").insert({ nome: parsed.data.nome, mensagem: parsed.data.mensagem });
    setLoading(false);
    if (error) { toast.error("Erro ao enviar."); return; }
    setNome(""); setMensagem("");
    toast.success("Recado enviado ❦");
  };

  return (
    <section id="mural" className="py-32 px-10">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="text-[0.7rem] tracking-[0.5em] uppercase text-accent mb-4">Recados</p>
          <h2 className="font-display text-6xl text-primary mb-3">Mural de Carinho</h2>
          <p className="font-script italic text-xl text-secondary">deixe uma palavra que ela vai guardar para sempre</p>
        </motion.div>

        <div className="grid grid-cols-12 gap-10">
          <motion.form onSubmit={submit} className="col-span-5 paper-card-elegant p-8 h-fit sticky top-32 space-y-4"
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div>
              <label className="block text-[0.65rem] tracking-[0.3em] uppercase text-secondary mb-2">Seu nome</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} maxLength={80} required
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition" />
            </div>
            <div>
              <label className="block text-[0.65rem] tracking-[0.3em] uppercase text-secondary mb-2">Mensagem</label>
              <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} maxLength={500} required rows={5}
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-emerald text-primary-foreground py-3.5 rounded-full text-sm tracking-[0.2em] uppercase shadow-elegant hover:shadow-gold transition-all hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Enviar Recado</>}
            </button>
          </motion.form>

          <div className="col-span-7 space-y-4 max-h-[600px] overflow-y-auto pr-3">
            {items.length === 0 && (
              <p className="text-center text-muted-foreground italic py-12 font-script text-xl">
                Seja o primeiro a deixar um recado ❦
              </p>
            )}
            {items.map((m, i) => (
              <motion.div key={m.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.04 }}
                className="paper-card p-6">
                <p className="font-script italic text-xl text-foreground leading-relaxed mb-3">"{m.mensagem}"</p>
                <p className="text-xs tracking-[0.3em] uppercase text-accent">— {m.nome}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============== RSVP Desktop ============== */
const RSVPDesktop = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [num, setNum] = useState(0);
  const [companions, setCompanions] = useState<string[]>([]);
  const [obs, setObs] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const updateNum = (next: number) => {
    const c = Math.max(0, Math.min(10, next));
    setNum(c);
    setCompanions((prev) => {
      const a = [...prev];
      while (a.length < c) a.push("");
      return a.slice(0, c);
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = rsvpSchema.safeParse({ nome, telefone, num_acompanhantes: num, acompanhantes: companions, observacoes: obs });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setLoading(true);
    const { error } = await supabase.from("convidados").insert({
      nome: parsed.data.nome,
      telefone: parsed.data.telefone || null,
      num_acompanhantes: parsed.data.num_acompanhantes,
      acompanhantes: parsed.data.acompanhantes,
      observacoes: parsed.data.observacoes || null,
      presenca_confirmada: true,
    });
    setLoading(false);
    if (error) { toast.error("Erro ao confirmar."); return; }
    setDone(true);
    toast.success("Presença confirmada! ❦");
  };

  return (
    <section id="confirmar" className="py-32 px-10 bg-paper-warm/30">
      <div className="max-w-3xl mx-auto">
        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="text-[0.7rem] tracking-[0.5em] uppercase text-accent mb-4">Sua Presença</p>
          <h2 className="font-display text-6xl text-primary mb-3">Confirme sua Presença</h2>
          <p className="font-script italic text-xl text-secondary">é o melhor presente que posso receber</p>
        </motion.div>

        <motion.div className="paper-card-elegant p-12"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          {done ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-emerald flex items-center justify-center mb-6 shadow-elegant">
                <Check className="w-10 h-10 text-primary-foreground" strokeWidth={2} />
              </div>
              <h3 className="font-display text-4xl text-primary mb-3">Confirmado!</h3>
              <p className="text-base text-muted-foreground max-w-md mx-auto">
                Estamos ansiosas para celebrar com você. Até lá! ❦
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[0.65rem] tracking-[0.3em] uppercase text-secondary mb-2">Seu nome</label>
                  <input value={nome} onChange={(e) => setNome(e.target.value)} maxLength={100} required
                    className="w-full bg-background/60 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-accent transition" />
                </div>
                <div>
                  <label className="block text-[0.65rem] tracking-[0.3em] uppercase text-secondary mb-2">Telefone (opcional)</label>
                  <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} maxLength={20}
                    className="w-full bg-background/60 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-accent transition" />
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] tracking-[0.3em] uppercase text-secondary mb-2">Acompanhantes</label>
                <div className="flex items-center gap-3 bg-background/60 border border-border rounded-xl p-2 max-w-xs">
                  <button type="button" onClick={() => updateNum(num - 1)} disabled={num === 0}
                    className="w-10 h-10 rounded-lg bg-card hover:bg-muted flex items-center justify-center disabled:opacity-40 transition">
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center font-display text-2xl text-primary">{num}</div>
                  <button type="button" onClick={() => updateNum(num + 1)} disabled={num === 10}
                    className="w-10 h-10 rounded-lg bg-card hover:bg-muted flex items-center justify-center disabled:opacity-40 transition">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {companions.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {companions.map((c, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <label className="block text-[0.65rem] tracking-[0.3em] uppercase text-secondary mb-2">Acompanhante {i + 1}</label>
                      <input value={c} onChange={(e) => {
                        const n = [...companions]; n[i] = e.target.value; setCompanions(n);
                      }} maxLength={100} required
                        className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition" />
                    </motion.div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-[0.65rem] tracking-[0.3em] uppercase text-secondary mb-2">Observação (opcional)</label>
                <textarea value={obs} onChange={(e) => setObs(e.target.value)} maxLength={300} rows={3}
                  className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition resize-none"
                  placeholder="Restrição alimentar, etc." />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-emerald text-primary-foreground py-4 rounded-full text-sm tracking-[0.25em] uppercase shadow-elegant hover:shadow-gold transition-all hover:scale-[1.01] disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Heart className="w-4 h-4" /> Confirmar Presença</>}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default DesktopInvite;
