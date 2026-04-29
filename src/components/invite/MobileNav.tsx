import { useEffect, useState } from "react";
import { Home, Clock, MapPin, MessageCircle, Heart } from "lucide-react";

const items = [
  { id: "home", label: "Convite", icon: Home },
  { id: "programa", label: "Programa", icon: Clock },
  { id: "local", label: "Local", icon: MapPin },
  { id: "mural", label: "Mural", icon: MessageCircle },
  { id: "confirmar", label: "Confirmar", icon: Heart },
];

const MobileNav = () => {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-card/95 backdrop-blur-md shadow-elegant rounded-full px-2 py-1.5 border border-border/60 flex gap-0.5"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      aria-label="Navegação"
    >
      {items.map(({ id, label, icon: Icon }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`mobile-nav-item relative ${active === id ? "active" : ""}`}
          aria-label={label}
        >
          <Icon className="w-5 h-5" strokeWidth={1.7} />
          <span className="text-[0.6rem] tracking-wide font-medium hidden sm:block">{label}</span>
        </a>
      ))}
    </nav>
  );
};

export default MobileNav;
