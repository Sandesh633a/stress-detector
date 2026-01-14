import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Analytics() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const q = query(
        collection(db, "sessions"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const snap = await getDocs(q);
      setHistory(snap.docs.map((d) => d.data()));
    };
    load();
  }, []);

  const avgConfidence =
    history.length > 0
      ? Math.round(
          (history.reduce((s, h) => s + (h.confidence || 0), 0) /
            history.length) *
            100
        )
      : 0;

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white px-8 py-24">

      {/* LIGHT AMBIENT (STATIC, NO MOTION) */}
      <div className="absolute -top-40 left-1/3 w-[320px] h-[320px] bg-indigo-500/12 rounded-full blur-optimized" />
      <div className="absolute bottom-0 right-0 w-[320px] h-[320px] bg-purple-500/12 rounded-full blur-optimized" />

      {/* HEADER */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto mb-24"
      >
        <h1 className="text-5xl font-bold mb-6">Emotional Analytics</h1>
        <p className="text-gray-300 max-w-3xl text-lg leading-relaxed">
          A focused overview of emotional trends, stress patterns, and
          confidence signals extracted from your recent voice sessions.
        </p>
      </motion.section>

      {/* QUICK STATS (STATIC) */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-28">
        <StatBox title="Total Sessions" value={history.length} />
        <StatBox title="Average Confidence" value={`${avgConfidence}%`} />
        <StatBox title="Dominant Stress" value={mostCommonStress(history)} />
      </section>

      {/* TIMELINE */}
      <section className="max-w-6xl mx-auto mb-32">
        <h2 className="text-3xl font-bold mb-10">Recent Emotional Timeline</h2>

        {/* Animate container ONCE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          {history.map((h, i) => (
            <div
              key={i}
              className="bg-white/5 rounded-2xl p-6
                         flex flex-col md:flex-row
                         md:items-center md:justify-between gap-6
                         border border-white/10"
            >
              <div>
                <p className="text-xl font-semibold">{h.emotion}</p>
                <p className="text-gray-400 text-sm">
                  Stress: <span className="font-medium">{h.stress}</span>
                </p>
              </div>

              <ConfidenceBar value={h.confidence} />
            </div>
          ))}
        </motion.div>
      </section>

      {/* AI INSIGHTS */}
      <section className="max-w-6xl mx-auto mb-32">
        <h2 className="text-3xl font-bold mb-12">AI Observations</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <InsightCard title="Emotional Consistency" />
          <InsightCard title="Stress Variability" />
          <InsightCard title="Confidence Stability" />
        </div>
      </section>

      {/* MEANING */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10">What This Means</h2>
        <p className="text-gray-300 leading-relaxed max-w-4xl">
          By focusing on voice rather than text, MindSense uncovers emotional
          signals that are otherwise invisible. These insights help you
          identify stress triggers, build confidence, and track emotional
          health over time.
        </p>
      </section>
    </div>
  );
}

/* COMPONENTS */

const StatBox = ({ title, value }) => (
  <div className="bg-white/10 rounded-2xl p-8 shadow-xl">
    <p className="text-gray-400 text-sm mb-1">{title}</p>
    <p className="text-4xl font-bold">{value}</p>
  </div>
);

const ConfidenceBar = ({ value }) => (
  <div className="w-40">
    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-indigo-400 to-purple-500"
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
    <p className="text-xs text-gray-400 mt-1">
      {Math.round(value * 100)}% confidence
    </p>
  </div>
);

const InsightCard = ({ title }) => (
  <div className="bg-white/10 rounded-2xl p-6 shadow-lg">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">
      Patterns observed across recent sessions suggest meaningful emotional
      signals worth monitoring over time.
    </p>
  </div>
);

/* HELPERS */

function mostCommonStress(history) {
  if (history.length === 0) return "—";
  const map = {};
  history.forEach((h) => {
    map[h.stress] = (map[h.stress] || 0) + 1;
  });
  return Object.keys(map).reduce((a, b) => (map[a] > map[b] ? a : b));
}
