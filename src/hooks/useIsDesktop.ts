import { useEffect, useState } from "react";

// Tailwind 'md' breakpoint is 768px — same logic, but we want desktop layout from lg (1024)
const QUERY = "(min-width: 1024px)";

export function useIsDesktop(): boolean | null {
  // Returns null on first render (SSR-safe / no flicker on hydration in CSR)
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}
