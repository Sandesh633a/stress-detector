import VoiceVisual from "../components/VoiceVisual";


import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [latest, setLatest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const q = query(
        collection(db, "sessions"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setLatest(snap.docs[0].data());
      }
    };
    load();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white overflow-hidden">

      {/* 🌊 LOCAL AMBIENT GRADIENTS */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-optimized motion-safe" />
      <div className="absolute top-[30%] right-[-200px] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-optimized motion-safe" />

      <section className="relative px-10 py-32 max-w-7xl mx-auto">
  <div className="grid md:grid-cols-2 gap-20 items-center">

    {/* LEFT CONTENT */}
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold max-w-4xl leading-tight"
      >
        Decode Human Emotions
        <br />
        <span className="text-indigo-400 relative">
          Through Voice Intelligence
          <span className="absolute left-0 -bottom-2 w-full h-[3px]
                           bg-indigo-500/60 rounded-full blur-sm" />
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-300 mt-6 max-w-xl"
      >
        MindSense is an AI-driven system that analyzes speech patterns to
        uncover emotional states, stress levels, and confidence markers
        hidden beyond words.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/profile")}
        className="mt-12 px-9 py-4 rounded-2xl text-lg font-semibold
                   bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                   shadow-[0_0_40px_rgba(139,92,246,0.6)]"
      >
        🎙 Start New Voice Session
      </motion.button>
    </div>

    {/* RIGHT VISUAL */}
    <div className="hidden md:flex justify-center">
      <VoiceVisual />
    </div>

  </div>
</section>


      {/* PROJECT OVERVIEW */}
      <section className="px-10 py-24 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-10"
        >
          What is MindSense?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          <InfoCard
            title="Voice-First Intelligence"
            desc="Our system focuses on how you speak, not just what you say — capturing subtle emotional cues in tone, pitch, and rhythm."
          />
          <InfoCard
            title="Emotion & Stress Detection"
            desc="Detects emotional patterns such as calmness, tension, anxiety, and confidence using machine learning models."
          />
          <InfoCard
            title="Context-Aware Analysis"
            desc="Questions adapt based on your profile, making each assessment personalized and meaningful."
          />
        </div>
      </section>

      {/* STATS */}
      {latest && (
        <section className="px-10 py-24 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Latest Session Snapshot</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Stat title="Detected Emotion" value={latest.emotion ?? "—"} />
            <Stat title="Stress Level" value={latest.stress ?? "—"} />
            <Stat
              title="Confidence Score"
              value={
                latest.confidence !== undefined
                  ? `${Math.round(latest.confidence * 100)}%`
                  : "—"
              }
            />
          </div>
        </section>
      )}

      {/* WHY THIS MATTERS */}
      <section className="px-10 py-24 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-14">Why This Matters</h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          <Card
            title="Mental Wellness"
            desc="Track emotional health and stress trends over time to understand your mental well-being."
          />
          <Card
            title="Interview Readiness"
            desc="Analyze confidence and stress during mock interviews or presentations."
          />
          <Card
            title="Voice Journaling"
            desc="Turn spoken reflections into emotional insights without manual effort."
          />
          <Card
            title="Therapy Support"
            desc="Provide therapists with objective emotional data to complement sessions."
          />
          <Card
            title="Workplace Insights"
            desc="Understand burnout and pressure patterns in high-stress professions."
          />
          <Card
            title="Self Awareness"
            desc="Recognize emotional shifts early and take proactive steps."
          />
        </div>
      </section>
    </div>
  );
}

/* UI PARTS */

const Stat = ({ title, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl"
  >
    <p className="text-gray-400 text-sm">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </motion.div>
);

const Card = ({ title, desc }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-white/5 p-6 rounded-xl border border-white/10
               hover:border-indigo-500 transition shadow-lg"
  >
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const InfoCard = ({ title, desc }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-lg"
  >
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);
