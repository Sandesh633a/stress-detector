import { motion } from "framer-motion";

export default function VoiceVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative glass rounded-3xl p-6 shadow-2xl
                 w-full max-w-md h-[320px]
                 overflow-hidden"
    >

      {/* GLOW */}
      <div className="absolute -top-24 -left-24 w-72 h-72
                      bg-indigo-500/30 rounded-full blur-[120px]" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72
                      bg-purple-500/30 rounded-full blur-[120px]" />

      {/* TITLE */}
      <div className="relative z-10 mb-4">
        <p className="text-sm uppercase tracking-wide text-gray-400">
          Live Voice Intelligence
        </p>
        <h3 className="text-lg font-semibold">
          Emotional Signal Monitor
        </h3>
      </div>

      {/* WAVEFORM */}
      <div className="relative z-10 flex items-end gap-[3px] h-40">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t
                       from-indigo-500 via-purple-500 to-pink-500"
            animate={{
              height: [
                `${20 + Math.random() * 40}px`,
                `${60 + Math.random() * 80}px`,
                `${20 + Math.random() * 40}px`,
              ],
            }}
            transition={{
              duration: 1.8 + Math.random(),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.03,
            }}
          />
        ))}
      </div>

      {/* STATUS */}
      <div className="relative z-10 mt-4 flex items-center justify-between text-sm text-gray-400">
        <span>Input Level</span>
        <span className="text-green-400">● Active</span>
      </div>
    </motion.div>
  );
}
