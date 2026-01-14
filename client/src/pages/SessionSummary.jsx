import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SessionSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/");
    return null;
  }

  const { emotion, stress, confidence } = state;

  const emotionStyle = {
    Calm: {
      emoji: "😌",
      gradient: "from-cyan-400 to-indigo-500",
      glow: "rgba(56,189,248,0.45)",
      message: "Your voice reflects calmness, balance, and emotional stability.",
    },
    Happy: {
      emoji: "😊",
      gradient: "from-emerald-400 to-green-500",
      glow: "rgba(16,185,129,0.45)",
      message: "Positive emotional signals were strongly present in your speech.",
    },
    Sad: {
      emoji: "😔",
      gradient: "from-blue-400 to-indigo-600",
      glow: "rgba(99,102,241,0.45)",
      message: "Your tone suggests emotional heaviness or reduced energy.",
    },
    Angry: {
      emoji: "😠",
      gradient: "from-red-400 to-pink-600",
      glow: "rgba(239,68,68,0.5)",
      message: "Strong emotional intensity and vocal tension were detected.",
    },
    Fearful: {
      emoji: "😟",
      gradient: "from-violet-400 to-purple-600",
      glow: "rgba(168,85,247,0.45)",
      message: "Your voice indicates nervousness or underlying uncertainty.",
    },
    Neutral: {
      emoji: "🙂",
      gradient: "from-slate-400 to-gray-500",
      glow: "rgba(148,163,184,0.35)",
      message: "Your emotional state appears balanced and neutral.",
    },
  };

  const style = emotionStyle[emotion] || emotionStyle.Neutral;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-6">

      {/* 🌈 MOVING GRADIENT BACKGROUND */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background:
            "linear-gradient(120deg, #1e1b4b, #312e81, #020617, #4c1d95)",
          backgroundSize: "300% 300%",
        }}
      />

      {/* ✨ SOFT COLOR BLOBS */}
      <motion.div
        className="absolute top-[-25%] left-[-15%] w-[450px] h-[450px]
                   rounded-full blur-[120px]"
        style={{ backgroundColor: style.glow }}
        animate={{ x: [0, 60, -40, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[-30%] right-[-20%] w-[500px] h-[500px]
                   rounded-full blur-[140px]"
        style={{ backgroundColor: style.glow }}
        animate={{ x: [0, -50, 30, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🧊 GLASS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass rounded-3xl p-8 max-w-md w-full
                   shadow-2xl flex flex-col gap-6"
      >

        {/* HEADER */}
        <div className="text-center">
          <div className="text-5xl mb-2">{style.emoji}</div>
          <h2 className="text-2xl font-bold">Session Insight</h2>
          <p className="text-gray-400 text-sm">
            Voice-based emotional analysis
          </p>
        </div>

        {/* EMOTION BLOCK */}
        <div
          className={`rounded-2xl p-4 bg-gradient-to-r ${style.gradient}
                      shadow-[0_0_25px_${style.glow}]`}
        >
          <p className="text-xs uppercase tracking-wide opacity-80 mb-1">
            Dominant Emotion
          </p>
          <p className="text-xl font-bold">{emotion}</p>
          <p className="text-sm mt-1 opacity-90">
            {style.message}
          </p>
        </div>

        {/* STRESS + CONFIDENCE */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-xs text-gray-400 mb-1">Stress Level</p>
            <p
              className={`text-lg font-semibold ${
                stress === "High"
                  ? "text-red-400"
                  : stress === "Medium"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {stress}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">Confidence</p>
            <p className="text-lg font-semibold">
              {Math.round(confidence * 100)}%
            </p>
          </div>
        </div>

        {/* CONFIDENCE BAR */}
        <div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(confidence * 100)}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Higher confidence indicates emotional stability
          </p>
        </div>

        {/* WHAT NEXT */}
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            Use these insights to reflect on your emotional state. Tracking
            patterns over time can help you identify stress triggers and
            build emotional resilience.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/analytics")}
            className="w-full py-3 rounded-xl
                       bg-gradient-to-r from-indigo-500 to-purple-600
                       font-semibold hover:scale-[1.03]
                       transition shadow-lg"
          >
            📊 View Detailed Analytics
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full py-2.5 rounded-xl
                       bg-white/10 hover:bg-white/20
                       transition"
          >
            Back to Dashboard
          </button>
        </div>

      </motion.div>
    </div>
  );
}
