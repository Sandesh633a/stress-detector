import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function AmbientBackground() {
  const location = useLocation();
  const [idle, setIdle] = useState(true);

  /* 🔕 Pause animation while scrolling */
  useEffect(() => {
    let timeout;

    const onScroll = () => {
      setIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIdle(true), 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* 🧠 Disable heavy background on Analytics page */
  if (location.pathname === "/analytics") {
    return (
      <div className="fixed inset-0 -z-50 bg-[radial-gradient(circle_at_top,_#1e1b4b,_#020617)]" />
    );
  }

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">

      {/* BASE GRADIENT */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e1b4b,_#020617)]" />

      {/* FLOATING BLOBS (PAUSE ON SCROLL) */}
      <div
        className={`absolute -top-40 -left-40 w-[420px] h-[420px]
                    bg-indigo-500/20 rounded-full blur-optimized
                    transition-transform duration-[20000ms] ease-in-out
                    ${idle ? "translate-x-20 translate-y-10" : ""}`}
      />

      <div
        className={`absolute bottom-[-30%] right-[-20%] w-[460px] h-[460px]
                    bg-purple-500/18 rounded-full blur-optimized
                    transition-transform duration-[25000ms] ease-in-out
                    ${idle ? "-translate-x-16 -translate-y-12" : ""}`}
      />
    </div>
  );
}
