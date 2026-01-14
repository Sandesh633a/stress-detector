import { useEffect, useRef } from "react";

export default function AudioReactiveWave({ stream }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!stream) return;

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const data = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteFrequencyData(data);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / data.length;

      data.forEach((value, i) => {
        // 🔥 BOOST HEIGHT
        const barHeight = value * 1.2;

        // 🔥 GRADIENT BARS
        const gradient = ctx.createLinearGradient(
          0,
          canvas.height,
          0,
          canvas.height - barHeight
        );
        gradient.addColorStop(0, "rgba(99,102,241,0.2)");
        gradient.addColorStop(0.5, "rgba(139,92,246,0.7)");
        gradient.addColorStop(1, "rgba(236,72,153,0.9)");

        ctx.fillStyle = gradient;
        ctx.fillRect(
          i * barWidth,
          canvas.height - barHeight,
          barWidth - 2,
          barHeight
        );
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => audioCtx.close();
  }, [stream]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={220} // ⬆ higher canvas
      className="fixed bottom-0 left-0 pointer-events-none opacity-60"
    />
  );
}
