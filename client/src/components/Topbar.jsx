import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Topbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const nav = [
    { name: "Dashboard", path: "/" },
    { name: "Assistant", path: "/assistant" },
    { name: "Analytics", path: "/analytics" },
    { name: "Settings", path: "/settings" },
  ];

  /* 🌊 Scroll depth effect (passive, cheap) */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full h-16 z-50
        transition-all duration-300
        ${scrolled ? "bg-black/90" : "bg-black/65"}
        backdrop-blur-xl
        border-b border-white/5
      `}
    >
      {/* 🌈 Animated glossy line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div className="w-[200%] h-full bg-gradient-to-r
                        from-transparent via-indigo-500/90 to-transparent
                        animate-glow-slide" />
      </div>

      {/* ✨ Subtle glow overlay */}
      <div className="absolute inset-0 pointer-events-none
                      shadow-[0_0_40px_rgba(99,102,241,0.15)]" />

      <div className="relative max-w-7xl mx-auto px-6 h-16
                      flex items-center justify-between">

        {/* 🔷 BRAND */}
        <Link
          to="/"
          className="text-xl font-bold tracking-wide text-white
                     flex items-center gap-1 group"
        >
          <span className="text-indigo-400
                           drop-shadow-[0_0_12px_rgba(99,102,241,0.8)]
                           group-hover:scale-105 transition">
            Mind
          </span>
          <span className="group-hover:text-indigo-200 transition">
            Sense
          </span>
        </Link>

        {/* 🧭 NAVIGATION */}
        <nav className="hidden md:flex items-center gap-10">
          {nav.map((item) => {
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-medium
                  transition-all duration-300
                  ${active
                    ? "text-indigo-400"
                    : "text-gray-300 hover:text-white"}
                `}
              >
                {item.name}

                {/* Active underline */}
                {active && (
                  <span
                    className="absolute -bottom-3 left-0 right-0 h-[2px]
                               bg-gradient-to-r
                               from-indigo-400 to-purple-500
                               rounded-full
                               shadow-[0_0_12px_rgba(99,102,241,0.9)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 👤 USER AVATAR */}
        <div className="flex items-center gap-4">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center
                       bg-gradient-to-br from-indigo-500 to-purple-600
                       shadow-[0_0_20px_rgba(139,92,246,0.9)]
                       hover:scale-110 transition"
          >
            <span className="text-sm font-bold text-white">G</span>
          </div>
        </div>
      </div>
    </header>
  );
}
