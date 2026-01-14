import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import Analytics from "./pages/Analytics";
import SessionSummary from "./pages/SessionSummary";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="pt-16 min-h-screen bg-transparent"
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/summary" element={<SessionSummary />} />
          <Route path="/profile" element={<ProfileSetup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}
