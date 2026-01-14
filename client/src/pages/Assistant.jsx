// import React, { useEffect, useRef, useState } from "react";
// import { db } from "../firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { generateQuestions } from "../questionGenerator";
// import { useNavigate } from "react-router-dom";

// function Assistant() {
//   const navigate = useNavigate();

//   // 🔹 TEMP profile (later from auth)
//   const profile = {
//     age: 23,
//     profession: "IT",
//     sleepQuality: "Poor",
//     dailyScreenTime: "High",
//   };

//   const [questions, setQuestions] = useState([]);
//   const [index, setIndex] = useState(0);
//   const [recording, setRecording] = useState(false);
//   const [audioResponses, setAudioResponses] = useState([]);
//   const [status, setStatus] = useState("question");

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   /* ---------- Generate Questions ---------- */
//   useEffect(() => {
//     const qs = generateQuestions(profile);
//     setQuestions(qs);
//     speak(qs[0]);
//   }, []);

//   /* ---------- Text To Speech ---------- */
//   const speak = (text) => {
//     if (!window.speechSynthesis) return;
//     window.speechSynthesis.cancel();
//     const u = new SpeechSynthesisUtterance(text);
//     u.rate = 0.9;
//     speechSynthesis.speak(u);
//   };

//   /* ---------- Recording ---------- */
//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);

//     mediaRecorderRef.current = recorder;
//     audioChunksRef.current = [];

//     recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

//     recorder.onstop = () => {
//       const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//       setAudioResponses((prev) => [...prev, blob]);
//     };

//     recorder.start();
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current.stop();
//     setRecording(false);
//   };

//   const nextQuestion = () => {
//     if (index + 1 < questions.length) {
//       const next = index + 1;
//       setIndex(next);
//       speak(questions[next]);
//     } else {
//       setStatus("analyze");
//     }
//   };

//   /* ---------- Audio Merge ---------- */
//   async function combineAudio(blobs) {
//     const ctx = new AudioContext();
//     const buffers = [];

//     for (let blob of blobs) {
//       const buf = await blob.arrayBuffer();
//       buffers.push(await ctx.decodeAudioData(buf));
//     }

//     let totalLength = buffers.reduce((s, b) => s + b.length, 0);
//     const output = ctx.createBuffer(1, totalLength, ctx.sampleRate);
//     let offset = 0;

//     buffers.forEach((b) => {
//       output.getChannelData(0).set(b.getChannelData(0), offset);
//       offset += b.length;
//     });

//     return audioBufferToWav(output);
//   }

//   function audioBufferToWav(buffer) {
//     const len = buffer.length * 2 + 44;
//     const view = new DataView(new ArrayBuffer(len));
//     let pos = 0;

//     const write = (s) => {
//       for (let i = 0; i < s.length; i++) view.setUint8(pos++, s.charCodeAt(i));
//     };

//     write("RIFF");
//     view.setUint32(pos, 36 + buffer.length * 2, true); pos += 4;
//     write("WAVEfmt ");
//     view.setUint32(pos, 16, true); pos += 4;
//     view.setUint16(pos, 1, true); pos += 2;
//     view.setUint16(pos, 1, true); pos += 2;
//     view.setUint32(pos, buffer.sampleRate, true); pos += 4;
//     view.setUint32(pos, buffer.sampleRate * 2, true); pos += 4;
//     view.setUint16(pos, 2, true); pos += 2;
//     view.setUint16(pos, 16, true); pos += 2;
//     write("data");
//     view.setUint32(pos, buffer.length * 2, true); pos += 4;

//     buffer.getChannelData(0).forEach((s) => {
//       view.setInt16(pos, Math.max(-1, Math.min(1, s)) * 0x7fff, true);
//       pos += 2;
//     });

//     return new Blob([view], { type: "audio/wav" });
//   }

//   /* ---------- Analyze ---------- */
//   const analyze = async () => {
//     const audio = await combineAudio(audioResponses);
//     const fd = new FormData();
//     fd.append("audio", audio);

//     const res = await fetch("http://localhost:5000/analyze", {
//       method: "POST",
//       body: fd,
//     });

//     const result = await res.json();

//     await addDoc(collection(db, "assessments"), {
//       ...result,
//       createdAt: serverTimestamp(),
//     });

//     navigate("/");
//   };

//   /* ---------- UI ---------- */
//   if (status === "analyze") {
//     return (
//       <div>
//         <h2>Analyzing your stress…</h2>
//         <button onClick={analyze}>Run Analysis</button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2>🎙 Voice Assistant</h2>
//       <p>{questions[index]}</p>

//       {!recording ? (
//         <button onClick={startRecording}>🎤 Start</button>
//       ) : (
//         <button onClick={stopRecording}>⏹ Stop</button>
//       )}

//       {!recording && audioResponses.length === index + 1 && (
//         <button onClick={nextQuestion}>Next</button>
//       )}
//     </div>
//   );
// }

// export default Assistant;



















// import { useEffect, useRef, useState } from "react";
// import { generateQuestions } from "../questionGenerator";
// import Waveform from "../components/Waveform";
// import { db } from "../firebase";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// export default function Assistant() {
//   const navigate = useNavigate();

//   const profile = JSON.parse(localStorage.getItem("userProfile"));

//   const [questions, setQuestions] = useState([]);
//   const [index, setIndex] = useState(0);
//   const [ui, setUi] = useState("idle");
//   const [stream, setStream] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [result, setResult] = useState(null);

//   const recorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   // 🎯 Generate questions on load
//   useEffect(() => {
//     const qs = generateQuestions(profile);
//     setQuestions(qs);
//     speak(qs[0]);
//   }, []);

//   // 🔊 Speak question
//   const speak = (text) => {
//     speechSynthesis.cancel();
//     const u = new SpeechSynthesisUtterance(text);
//     u.rate = 0.9;
//     u.pitch = 1.1;
//     speechSynthesis.speak(u);
//   };

//   // 🎤 Start recording
//   const startRecording = async () => {
//     setUi("listening");
//     const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     setStream(micStream);

//     const recorder = new MediaRecorder(micStream);
//     recorderRef.current = recorder;
//     chunksRef.current = [];

//     recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

//     recorder.onstop = () => {
//       const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//       setResponses((prev) => [...prev, blob]);

//       micStream.getTracks().forEach((t) => t.stop());
//       setStream(null);
//       setUi("saved");

//       setTimeout(nextQuestion, 800);
//     };

//     recorder.start();
//   };

//   const stopRecording = () => recorderRef.current.stop();

//   // ➡ Next question or analyze
//   const nextQuestion = () => {
//     if (index + 1 < questions.length) {
//       const next = index + 1;
//       setIndex(next);
//       setUi("idle");
//       speak(questions[next]);
//     } else {
//       analyze();
//     }
//   };

//   // 🧠 ML Analysis
//   const analyze = async () => {
//     try {
//       setUi("analyzing");

//       const audio = await mergeAudio(responses);
//       const formData = new FormData();
//       formData.append("audio", audio);

//       const res = await fetch("http://localhost:5000/analyze", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error("ML API failed");

//       const mlResult = await res.json();

//       await addDoc(collection(db, "sessions"), {
//         profile,
//         questions,
//         answersCount: responses.length,
//         ...mlResult,
//         createdAt: serverTimestamp(),
//       });

//       setResult(mlResult);
//       navigate("/summary", { state: mlResult });

//     } catch (err) {
//       console.error(err);
//       alert("Analysis failed");
//       setUi("idle");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-indigo-900 px-6">
//       <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md text-center text-white">

//         <h2 className="text-xl font-bold mb-4">🎧 Voice Assistant</h2>

//         {ui !== "result" && (
//           <>
//             <p className="text-lg mb-2">{questions[index]}</p>
//             <p className="text-sm text-gray-300 mb-6">
//               Question {index + 1} of {questions.length}
//             </p>
//           </>
//         )}

//         {ui !== "analyzing" && (
//           <button
//             onClick={ui === "listening" ? stopRecording : startRecording}
//             className={`w-24 h-24 rounded-full text-3xl transition-all
//               ${ui === "listening"
//                 ? "bg-red-500 animate-pulse"
//                 : "bg-green-500 hover:scale-105"}
//             `}
//           >
//             🎤
//           </button>
//         )}

//         {ui === "listening" && <Waveform stream={stream} active />}

//         {ui === "saved" && <p className="mt-4 text-green-400">✅ Answer saved</p>}

//         {ui === "analyzing" && (
//           <p className="mt-6 text-lg font-medium">🧠 Analyzing your stress…</p>
//         )}
//       </div>
//     </div>
//   );
// }

// /* 🔊 AUDIO MERGE */
// async function mergeAudio(blobs) {
//   const ctx = new AudioContext();
//   const buffers = [];

//   for (let blob of blobs) {
//     const arrayBuffer = await blob.arrayBuffer();
//     buffers.push(await ctx.decodeAudioData(arrayBuffer));
//   }

//   let totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
//   const output = ctx.createBuffer(1, totalLength, ctx.sampleRate);

//   let offset = 0;
//   buffers.forEach(b => {
//     output.getChannelData(0).set(b.getChannelData(0), offset);
//     offset += b.length;
//   });

//   return audioBufferToWav(output);
// }

// function audioBufferToWav(buffer) {
//   const length = buffer.length * 2 + 44;
//   const view = new DataView(new ArrayBuffer(length));
//   let pos = 0;

//   const write = s => [...s].forEach(c => view.setUint8(pos++, c.charCodeAt(0)));

//   write("RIFF");
//   view.setUint32(pos, 36 + buffer.length * 2, true); pos += 4;
//   write("WAVEfmt ");
//   view.setUint32(pos, 16, true); pos += 4;
//   view.setUint16(pos, 1, true); pos += 2;
//   view.setUint16(pos, 1, true); pos += 2;
//   view.setUint32(pos, buffer.sampleRate, true); pos += 4;
//   view.setUint32(pos, buffer.sampleRate * 2, true); pos += 4;
//   view.setUint16(pos, 2, true); pos += 2;
//   view.setUint16(pos, 16, true); pos += 2;
//   write("data");
//   view.setUint32(pos, buffer.length * 2, true); pos += 4;

//   buffer.getChannelData(0).forEach(s => {
//     view.setInt16(pos, Math.max(-1, Math.min(1, s)) * 0x7fff, true);
//     pos += 2;
//   });

//   return new Blob([view], { type: "audio/wav" });
// }

















































































import { useEffect, useRef, useState } from "react";
import { generateQuestions } from "../questionGenerator";
import Waveform from "../components/Waveform";
import AudioReactiveWave from "../components/AudioReactiveWave";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Assistant() {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("userProfile"));

  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [ui, setUi] = useState("idle"); // idle | listening | analyzing
  const [stream, setStream] = useState(null);
  const [responses, setResponses] = useState([]);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const chatRef = useRef(null);
  const initialized = useRef(false); // 🔒 prevents double question

  /* 🚀 INIT (ONLY ONCE) */
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const qs = generateQuestions(profile);
    setQuestions(qs);

    setTimeout(() => {
      pushAI(qs[0]);
      speak(qs[0]);
    }, 400);
  }, [profile]);

  /* 🔽 AUTO SCROLL */
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, ui]);

  /* 🔊 TEXT TO SPEECH */
  const speak = (text) => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.pitch = 1.05;
    speechSynthesis.speak(u);
  };

  /* 💬 MESSAGE HELPERS */
  const pushAI = (text) =>
    setMessages((prev) => [...prev, { role: "ai", text }]);

  const pushUser = () =>
    setMessages((prev) => [
      ...prev,
      { role: "user", text: "🎤 Voice response recorded" },
    ]);

  /* 🎤 START RECORDING */
  const startRecording = async () => {
    setUi("listening");

    const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(mic);

    const recorder = new MediaRecorder(mic);
    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setResponses((prev) => [...prev, blob]);
      pushUser();

      mic.getTracks().forEach((t) => t.stop());
      setStream(null);
      setUi("idle");

      setTimeout(nextQuestion, 700);
    };

    recorder.start();
  };

  const stopRecording = () => recorderRef.current?.stop();

  /* ➡ NEXT QUESTION */
  const nextQuestion = () => {
    if (qIndex + 1 < questions.length) {
      const next = qIndex + 1;
      setQIndex(next);
      pushAI(questions[next]);
      speak(questions[next]);
    } else {
      analyze();
    }
  };

  /* 🧠 ANALYZE */
  const analyze = async () => {
    try {
      setUi("analyzing");
      pushAI("Analyzing emotional patterns…");

      const audio = await mergeAudio(responses);
      const fd = new FormData();
      fd.append("audio", audio);

      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: fd,
      });

      const result = await res.json();

      await addDoc(collection(db, "sessions"), {
        profile,
        emotion: result.emotion,
        stress: result.stress,
        confidence: result.confidence,
        createdAt: serverTimestamp(),
      });

      navigate("/summary", { state: result });
    } catch {
      alert("Analysis failed");
      setUi("idle");
    }
  };

  return (
    
    <div className="relative min-h-screen w-full bg-transparent text-white">

      {/* 🌊 AUDIO-REACTIVE BACKGROUND */}
      {ui === "listening" && <AudioReactiveWave stream={stream} />}

      {/* HEADER */}
      <div className="px-6 py-4 border-b border-white/10 backdrop-blur-md">
        <h1 className="text-lg font-semibold tracking-wide">
          🧠 AI Voice Assistant
        </h1>
      </div>

      {/* CHAT AREA */}
      <div
        ref={chatRef}
        className="pb-32 px-6 py-6 space-y-6 overflow-y-auto max-w-3xl mx-auto"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm shadow-lg
              ${m.role === "ai"
                ? "bg-white/10 backdrop-blur self-start"
                : "bg-indigo-600 self-end ml-auto"}
            `}
          >
            {m.text}
          </div>
        ))}

        {ui === "analyzing" && (
          <div className="bg-white/10 px-4 py-2 rounded-xl w-fit animate-pulse">
            AI is thinking…
          </div>
        )}

        {ui === "listening" && <Waveform stream={stream} active />}
      </div>

      {/* 🎤 FIXED BOTTOM MIC BAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2
                      w-[92%] max-w-2xl glass rounded-2xl p-4 z-40">

        <button
          onClick={ui === "listening" ? stopRecording : startRecording}
          className={`w-full py-4 rounded-xl text-lg font-semibold
            transition-all duration-300
            ${ui === "listening"
              ? "bg-red-500 animate-pulse"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.02]"}
          `}
        >
          {ui === "listening" ? "● Listening…" : "🎤 Tap to Speak"}
        </button>
      </div>
    </div>
  );
}

/* 🔊 AUDIO MERGE */
async function mergeAudio(blobs) {
  const ctx = new AudioContext();
  const buffers = [];

  for (let b of blobs) {
    const ab = await b.arrayBuffer();
    buffers.push(await ctx.decodeAudioData(ab));
  }

  const total = buffers.reduce((s, b) => s + b.length, 0);
  const out = ctx.createBuffer(1, total, ctx.sampleRate);

  let offset = 0;
  buffers.forEach((b) => {
    out.getChannelData(0).set(b.getChannelData(0), offset);
    offset += b.length;
  });

  return audioBufferToWav(out);
}

function audioBufferToWav(buffer) {
  const len = buffer.length * 2 + 44;
  const view = new DataView(new ArrayBuffer(len));
  let pos = 0;

  const write = (s) =>
    [...s].forEach((c) => view.setUint8(pos++, c.charCodeAt(0)));

  write("RIFF");
  view.setUint32(pos, 36 + buffer.length * 2, true); pos += 4;
  write("WAVEfmt ");
  view.setUint32(pos, 16, true); pos += 4;
  view.setUint16(pos, 1, true); pos += 2;
  view.setUint16(pos, 1, true); pos += 2;
  view.setUint32(pos, buffer.sampleRate, true); pos += 4;
  view.setUint32(pos, buffer.sampleRate * 2, true); pos += 4;
  view.setUint16(pos, 2, true); pos += 2;
  view.setUint16(pos, 16, true); pos += 2;
  write("data");
  view.setUint32(pos, buffer.length * 2, true); pos += 4;

  buffer.getChannelData(0).forEach((s) => {
    view.setInt16(pos, Math.max(-1, Math.min(1, s)) * 0x7fff, true);
    pos += 2;
  });

  return new Blob([view], { type: "audio/wav" });
}
