import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { useLocation } from "react-router-dom";

export default function SmoothScroll({ children }) {
  const location = useLocation();

  useEffect(() => {
    // ❌ Disable Lenis on analytics
    if (location.pathname === "/analytics") return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [location.pathname]);

  return children;
}
