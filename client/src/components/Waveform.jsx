import { useEffect, useRef, useState } from "react";

export default function Waveform({ stream, active }) {
  const [levels, setLevels] = useState([10, 15, 20, 15, 10]);
  const analyserRef = useRef(null);
  const dataRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!stream || !active) return;

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 256;
    dataRef.current = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);
    analyserRef.current = analyser;

    const animate = () => {
      analyser.getByteFrequencyData(dataRef.current);

      const avg =
        dataRef.current.reduce((a, b) => a + b, 0) /
        dataRef.current.length;

      const height = Math.min(60, Math.max(10, avg / 2));

      setLevels([
        height * 0.6,
        height,
        height * 1.2,
        height,
        height * 0.6,
      ]);

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      audioCtx.close();
    };
  }, [stream, active]);

  return (
    <div className="flex gap-2 mt-6 h-20 items-end">
      {levels.map((h, i) => (
        <div
          key={i}
          className="w-2 bg-red-500 rounded-full transition-all duration-75"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}
