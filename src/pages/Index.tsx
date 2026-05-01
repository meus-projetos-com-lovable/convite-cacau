import { useEffect } from "react";
import Hero from "@/components/invite/Hero";

import Location from "@/components/invite/Location";
import Mural from "@/components/invite/Mural";
import RSVP from "@/components/invite/RSVP";
import MobileNav from "@/components/invite/MobileNav";
import DesktopInvite from "@/components/invite/DesktopInvite";
import branchDivider from "@/assets/branch-divider.png";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const Index = () => {
  const isDesktop = useIsDesktop();

  useEffect(() => {
    document.title = "50 Anos · Ação de Graças — 30 de Maio de 2026";
    const meta = document.querySelector('meta[name="description"]');
    const desc = "Convite digital: celebre 50 anos de vida e gratidão. RSVP, mapa, programa e mural de recados.";
    if (meta) meta.setAttribute("content", desc);
    else {
      const m = document.createElement("meta");
      m.name = "description"; m.content = desc;
      document.head.appendChild(m);
    }
  }, []);

  // Avoid layout flash before viewport is measured
  if (isDesktop === null) {
    return <div className="min-h-screen bg-background" aria-hidden />;
  }

  if (isDesktop) return <DesktopInvite />;

  return (
    <main className="min-h-screen pb-24">
      <Hero />
      <div className="flex justify-center my-2 opacity-70">
        <img src={branchDivider} alt="" aria-hidden width={120} height={120} className="w-20 h-20 object-contain" loading="lazy" />
      </div>
      
      <Location />
      <Mural />
      <RSVP />
      <footer className="text-center py-10 px-5 text-xs text-secondary tracking-wider">
        <p className="font-script text-base text-primary italic mb-1">"Até aqui nos ajudou o Senhor"</p>
        <p>1 Samuel 7.12 · 30 de Maio de 2026</p>
      </footer>
      <MobileNav />
    </main>
  );
};

export default Index;
