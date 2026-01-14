// import React, { useState, useRef } from "react";

// function App() {
//   const [recording, setRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [result, setResult] = useState(null);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const mediaRecorder = new MediaRecorder(stream);



//     mediaRecorderRef.current = mediaRecorder;
//     audioChunksRef.current = [];

//     mediaRecorder.ondataavailable = (event) => {
//       audioChunksRef.current.push(event.data);
//     };

//     mediaRecorder.onstop = () => {
//       const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
//       setAudioBlob(blob);
//     };

//     mediaRecorder.start();
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current.stop();
//     setRecording(false);
//   };

//   const analyzeAudio = async () => {
//     const formData = new FormData();
//     formData.append("audio", audioBlob);

//     const response = await fetch("http://localhost:5000/analyze", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();
//     setResult(data);
//   };

//   return (
//     <div style={{ padding: "40px", fontFamily: "Arial" }}>
//       <h1>🎧 Stress & Emotion Detector</h1>

//       {!recording ? (
//         <button onClick={startRecording}>Start Recording</button>
//       ) : (
//         <button onClick={stopRecording}>Stop Recording</button>
//       )}

//       <br /><br />

//       {audioBlob && (
//         <>
//           <audio controls src={URL.createObjectURL(audioBlob)} />
//           <br /><br />
//           <button onClick={analyzeAudio}>Analyze</button>
//         </>
//       )}

//       {result && (
//         <div style={{ marginTop: "30px" }}>
//           <h3>Result</h3>
//           <p><strong>Emotion:</strong> {result.emotion}</p>
//           <p><strong>Stress:</strong> {result.stress}</p>
//           <p><strong>Confidence:</strong> {result.confidence}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


























































// import React, { useState, useRef } from "react";
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
// } from "chart.js";
// import { Line } from "react-chartjs-2";

// ChartJS.register(
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale
// );

// function App() {
//   const [recording, setRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [result, setResult] = useState(null);
//   const [history, setHistory] = useState([]);

//   // 🟢 DASHBOARD STATE
//   const [dashboard, setDashboard] = useState({
//     total: 0,
//     lowStress: 0,
//     mediumStress: 0,
//     highStress: 0,
//     dominantEmotion: null,
//   });

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   const SMOOTHING_WINDOW = 3;

//   // Emotion → numeric mapping for graph
//   const emotionToValue = {
//     Neutral: 0,
//     Calm: 1,
//     Happy: 2,
//     Sad: 3,
//     Angry: 4,
//     Fearful: 5,
//     Disgust: 6,
//     Surprised: 7,
//   };

//   // 🎙️ Start recording
//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const mediaRecorder = new MediaRecorder(stream);

//     mediaRecorderRef.current = mediaRecorder;
//     audioChunksRef.current = [];

//     mediaRecorder.ondataavailable = (event) => {
//       audioChunksRef.current.push(event.data);
//     };

//     mediaRecorder.onstop = () => {
//       const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//       setAudioBlob(blob);
//     };

//     mediaRecorder.start();
//     setRecording(true);
//   };

//   // ⏹️ Stop recording
//   const stopRecording = () => {
//     mediaRecorderRef.current.stop();
//     setRecording(false);
//   };

//   // 🧠 Analyze audio + smoothing + dashboard update
//   const analyzeAudio = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("audio", audioBlob);

//       const response = await fetch("http://localhost:5000/analyze", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       setHistory((prev) => {
//         const updated = [...prev, data].slice(-SMOOTHING_WINDOW);

//         // 🔹 Smoothing
//         const emotionCounts = {};
//         updated.forEach((r) => {
//           emotionCounts[r.emotion] = (emotionCounts[r.emotion] || 0) + 1;
//         });

//         const smoothedEmotion = Object.keys(emotionCounts).reduce((a, b) =>
//           emotionCounts[a] > emotionCounts[b] ? a : b
//         );

//         const avgConfidence =
//           updated.reduce((sum, r) => sum + r.confidence, 0) / updated.length;

//         let stress = "Medium";
//         if (["Calm", "Neutral"].includes(smoothedEmotion)) stress = "Low";
//         else if (["Angry", "Fearful", "Disgust"].includes(smoothedEmotion))
//           stress = "High";

//         const finalResult = {
//           emotion: smoothedEmotion,
//           stress,
//           confidence: avgConfidence.toFixed(2),
//         };

//         setResult(finalResult);

//         // 🔹 DASHBOARD UPDATE
//         setDashboard((prevDash) => {
//           const total = prevDash.total + 1;

//           const lowStress =
//             prevDash.lowStress + (finalResult.stress === "Low" ? 1 : 0);
//           const mediumStress =
//             prevDash.mediumStress + (finalResult.stress === "Medium" ? 1 : 0);
//           const highStress =
//             prevDash.highStress + (finalResult.stress === "High" ? 1 : 0);

//           const emotionCount = {};
//           [...history, finalResult].forEach((h) => {
//             emotionCount[h.emotion] =
//               (emotionCount[h.emotion] || 0) + 1;
//           });

//           const dominantEmotion = Object.keys(emotionCount).reduce((a, b) =>
//             emotionCount[a] > emotionCount[b] ? a : b
//           );

//           return {
//             total,
//             lowStress,
//             mediumStress,
//             highStress,
//             dominantEmotion,
//           };
//         });

//         return updated;
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Error analyzing audio");
//     }
//   };

//   // 📈 Chart data
//   const chartData = {
//     labels: history.map((_, i) => `Clip ${i + 1}`),
//     datasets: [
//       {
//         label: "Emotion Trend",
//         data: history.map((h) => emotionToValue[h.emotion]),
//         borderColor: "#2563eb",
//         backgroundColor: "rgba(37,99,235,0.15)",
//         tension: 0.4,
//       },
//     ],
//   };

//   const chartOptions = {
//     scales: {
//       y: {
//         min: 0,
//         max: 7,
//         ticks: {
//           callback: (value) =>
//             Object.keys(emotionToValue).find(
//               (key) => emotionToValue[key] === value
//             ),
//         },
//       },
//     },
//   };

//   const cardStyle = {
//     padding: "20px",
//     width: "180px",
//     borderRadius: "12px",
//     background: "#f4f6f8",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//     textAlign: "center",
//   };

//   return (
//     <div style={{ padding: "40px", fontFamily: "Arial" }}>
//       <h1>🎧 Stress & Emotion Detector</h1>

//       {!recording ? (
//         <button onClick={startRecording}>Start Recording</button>
//       ) : (
//         <button onClick={stopRecording}>Stop Recording</button>
//       )}

//       <br /><br />

//       {audioBlob && (
//         <>
//           <audio controls src={URL.createObjectURL(audioBlob)} />
//           <br /><br />
//           <button onClick={analyzeAudio}>Analyze</button>
//         </>
//       )}

//       {result && (
//         <div style={{ marginTop: "30px" }}>
//           <h3>Result</h3>
//           <p><strong>Emotion:</strong> {result.emotion}</p>
//           <p><strong>Stress:</strong> {result.stress}</p>
//           <p><strong>Confidence:</strong> {result.confidence}</p>
//         </div>
//       )}

//       {/* 🟢 DASHBOARD */}
//       {dashboard.total > 0 && (
//         <div style={{ marginTop: "40px" }}>
//           <h2>📊 Dashboard</h2>
//           <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
//             <div style={cardStyle}><h4>Total</h4><p>{dashboard.total}</p></div>
//             <div style={cardStyle}><h4>Low Stress</h4><p>{dashboard.lowStress}</p></div>
//             <div style={cardStyle}><h4>Medium Stress</h4><p>{dashboard.mediumStress}</p></div>
//             <div style={cardStyle}><h4>High Stress</h4><p>{dashboard.highStress}</p></div>
//             <div style={cardStyle}><h4>Dominant Emotion</h4><p>{dashboard.dominantEmotion}</p></div>
//           </div>
//         </div>
//       )}

//       {/* 📈 TREND GRAPH */}
//       {history.length > 1 && (
//         <div style={{ width: "450px", marginTop: "40px" }}>
//           <h3>Emotion Trend</h3>
//           <Line data={chartData} options={chartOptions} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;












































































// import React, { useEffect, useRef, useState } from "react";
// import { generateQuestions } from "./questionGenerator";

// function App() {











//   // 🔹 APP PHASE CONTROL
//   const [phase, setPhase] = useState("profile");

//   // 🔹 USER PROFILE STATE
//   const [profile, setProfile] = useState({
//     age: "",
//     gender: "",
//     profession: "",
//     experienceLevel: "",
//     workType: "",
//     dailyScreenTime: "",
//     sleepQuality: "",
//   });

//   // 🔹 QUESTION FLOW STATE
//   const [questions, setQuestions] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [audioResponses, setAudioResponses] = useState([]);
//   const [recording, setRecording] = useState(false);
//   const [mlResult, setMlResult] = useState(null);

//   // 🔹 AUDIO REFS
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   // ---------------- PROFILE HANDLERS ----------------
//   const handleProfileChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const submitProfile = (e) => {
//     e.preventDefault();

//     // simple validation
//     if (!profile.age || !profile.profession || !profile.sleepQuality) {
//       alert("Please fill required fields");
//       return;
//     }

//     const qs = generateQuestions({
//       ...profile,
//       age: Number(profile.age),
//     });

//     setQuestions(qs);
//     setPhase("questions");
//   };

//   // ---------------- TEXT TO SPEECH ----------------
//   const speakQuestion = (text) => {
//     if (!window.speechSynthesis) return;
//     window.speechSynthesis.cancel();

//     const u = new SpeechSynthesisUtterance(text);
//     u.rate = 0.9;
//     u.pitch = 1;
//     speechSynthesis.speak(u);
//   };

//   useEffect(() => {



    
//     if (phase === "questions" && questions.length > 0) {
//       speakQuestion(questions[currentIndex]);
//     }
//   }, [currentIndex, questions, phase]);

//   // ---------------- RECORDING ----------------
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
//     if (currentIndex + 1 < questions.length) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       setPhase("analyze");
//     }
//   };

//   // ---------------- AUDIO AGGREGATION ----------------
//   async function combineAudioBlobs(blobs) {
//     const ctx = new AudioContext();
//     const buffers = [];

//     for (let blob of blobs) {
//       const buf = await blob.arrayBuffer();
//       buffers.push(await ctx.decodeAudioData(buf));
//     }

//     const silence = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
//     let totalLen =
//       buffers.reduce((s, b) => s + b.length, 0) +
//       silence.length * (buffers.length - 1);

//     const output = ctx.createBuffer(1, totalLen, ctx.sampleRate);
//     let offset = 0;

//     buffers.forEach((b, i) => {
//       output.getChannelData(0).set(b.getChannelData(0), offset);
//       offset += b.length;
//       if (i < buffers.length - 1) offset += silence.length;
//     });

//     return audioBufferToWav(output);
//   }

//   function audioBufferToWav(buffer) {
//     const len = buffer.length * 2 + 44;
//     const ab = new ArrayBuffer(len);
//     const view = new DataView(ab);
//     let off = 0;

//     const write = (s) => {
//       for (let i = 0; i < s.length; i++) view.setUint8(off++, s.charCodeAt(i));
//     };

//     write("RIFF");
//     view.setUint32(off, 36 + buffer.length * 2, true); off += 4;
//     write("WAVEfmt ");
//     view.setUint32(off, 16, true); off += 4;
//     view.setUint16(off, 1, true); off += 2;
//     view.setUint16(off, 1, true); off += 2;
//     view.setUint32(off, buffer.sampleRate, true); off += 4;
//     view.setUint32(off, buffer.sampleRate * 2, true); off += 4;
//     view.setUint16(off, 2, true); off += 2;
//     view.setUint16(off, 16, true); off += 2;
//     write("data");
//     view.setUint32(off, buffer.length * 2, true); off += 4;

//     buffer.getChannelData(0).forEach((s) => {
//       view.setInt16(off, Math.max(-1, Math.min(1, s)) * 0x7fff, true);
//       off += 2;
//     });

//     return new Blob([view], { type: "audio/wav" });
//   }

//   const analyze = async () => {
//     const audio = await combineAudioBlobs(audioResponses);
//     const fd = new FormData();
//     fd.append("audio", audio, "final.wav");

//     const res = await fetch("http://localhost:5000/analyze", {
//       method: "POST",
//       body: fd,
//     });

//     setMlResult(await res.json());
//     setPhase("result");
//   };

//   // ---------------- UI ----------------

//   if (phase === "profile") {
//     return (
//       <form onSubmit={submitProfile} style={{ padding: 40, maxWidth: 500 }}>
//         <h2>🧠 User Profile</h2>

//         <input name="age" placeholder="Age" onChange={handleProfileChange} />
//         <select name="gender" onChange={handleProfileChange}>
//           <option value="">Gender</option><option>Male</option><option>Female</option>
//         </select>
//         <select name="profession" onChange={handleProfileChange}>
//           <option value="">Profession</option>
//           <option>IT</option><option>Student</option><option>Healthcare</option>
//         </select>
//         <select name="experienceLevel" onChange={handleProfileChange}>
//           <option value="">Experience</option>
//           <option>Junior</option><option>Mid</option><option>Senior</option>
//         </select>
//         <select name="dailyScreenTime" onChange={handleProfileChange}>
//           <option value="">Screen Time</option>
//           <option>Low</option><option>Medium</option><option>High</option>
//         </select>
//         <select name="sleepQuality" onChange={handleProfileChange}>
//           <option value="">Sleep Quality</option>
//           <option>Good</option><option>Average</option><option>Poor</option>
//         </select>

//         <br /><br />
//         <button type="submit">Start Assessment</button>
//       </form>
//     );
//   }

//   if (phase === "questions") {
//     return (
//       <div style={{ padding: 40 }}>
//         <h3>Question {currentIndex + 1} / {questions.length}</h3>
//         <p>{questions[currentIndex]}</p>

//         <button onClick={() => speakQuestion(questions[currentIndex])}>🔊 Repeat</button>
//         <br /><br />

//         {!recording
//           ? <button onClick={startRecording}>🎙 Start</button>
//           : <button onClick={stopRecording}>⏹ Stop</button>}

//         <br /><br />
//         {!recording && audioResponses.length === currentIndex + 1 &&
//           <button onClick={nextQuestion}>Next</button>}
//       </div>
//     );
//   }

//   if (phase === "analyze") {
//     return (
//       <div style={{ padding: 40 }}>
//         <h2>✅ Answers Recorded</h2>
//         <button onClick={analyze}>Analyze Stress</button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 40 }}>
//       <h2>📊 Result</h2>
//       <p><b>Emotion:</b> {mlResult.emotion}</p>
//       <p><b>Stress:</b> {mlResult.stress}</p>
//       <p><b>Confidence:</b> {mlResult.confidence}</p>
//     </div>
//   );
// }

// export default App;


















































































// import React, { useEffect, useRef, useState } from "react";
// import { db } from "./firebase";
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   getDocs,
//   query,
//   orderBy,
//   limit,
// } from "firebase/firestore";
// import { generateQuestions } from "./questionGenerator";

// /* ------------------- UI HELPERS ------------------- */
// const stressColor = {
//   Low: "#16a34a",
//   Medium: "#f59e0b",
//   High: "#dc2626",
// };

// const stressEmoji = {
//   Low: "😌",
//   Medium: "😐",
//   High: "😰",
// };

// /* ------------------- APP ------------------- */
// function App() {
//   const [phase, setPhase] = useState("profile");

//   const [profile, setProfile] = useState({
//     age: "",
//     gender: "",
//     profession: "",
//     experienceLevel: "",
//     workType: "",
//     dailyScreenTime: "",
//     sleepQuality: "",
//   });

//   const [questions, setQuestions] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const [recording, setRecording] = useState(false);
//   const [audioResponses, setAudioResponses] = useState([]);
//   const [mlResult, setMlResult] = useState(null);
//   const [history, setHistory] = useState([]);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   /* ------------------- PROFILE ------------------- */
//   const handleProfileChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const submitProfile = async (e) => {
//     e.preventDefault();

//     if (!profile.age || !profile.profession || !profile.sleepQuality) {
//       alert("Please fill required fields");
//       return;
//     }

//     await addDoc(collection(db, "users"), {
//       ...profile,
//       age: Number(profile.age),
//       createdAt: serverTimestamp(),
//     });

//     const qs = generateQuestions({ ...profile, age: Number(profile.age) });
//     setQuestions(qs);
//     setPhase("questions");
//   };

//   /* ------------------- TEXT TO SPEECH ------------------- */
//   const speakQuestion = (text) => {
//     if (!window.speechSynthesis) return;
//     window.speechSynthesis.cancel();
//     const u = new SpeechSynthesisUtterance(text);
//     u.rate = 0.9;
//     speechSynthesis.speak(u);
//   };

//   useEffect(() => {
//     if (phase === "questions" && questions.length > 0) {
//       speakQuestion(questions[currentIndex]);
//     }
//   }, [currentIndex, phase, questions]);

//   /* ------------------- RECORDING ------------------- */
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
//     if (currentIndex + 1 < questions.length) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       setPhase("analyze");
//     }
//   };

//   /* ------------------- AUDIO MERGE ------------------- */
//   async function combineAudioBlobs(blobs) {
//     const ctx = new AudioContext();
//     const buffers = [];

//     for (let blob of blobs) {
//       const ab = await blob.arrayBuffer();
//       buffers.push(await ctx.decodeAudioData(ab));
//     }

//     const silence = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
//     let totalLen =
//       buffers.reduce((s, b) => s + b.length, 0) +
//       silence.length * (buffers.length - 1);

//     const output = ctx.createBuffer(1, totalLen, ctx.sampleRate);
//     let offset = 0;

//     buffers.forEach((b, i) => {
//       output.getChannelData(0).set(b.getChannelData(0), offset);
//       offset += b.length;
//       if (i < buffers.length - 1) offset += silence.length;
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

//   /* ------------------- ANALYZE ------------------- */
//   const loadHistory = async () => {
//     const q = query(
//       collection(db, "assessments"),
//       orderBy("createdAt", "desc"),
//       limit(10)
//     );
//     const snap = await getDocs(q);
//     setHistory(snap.docs.map((d) => d.data()).reverse());
//   };

//   const analyze = async () => {
//     const audio = await combineAudioBlobs(audioResponses);
//     const fd = new FormData();
//     fd.append("audio", audio, "final.wav");

//     const res = await fetch("http://localhost:5000/analyze", {
//       method: "POST",
//       body: fd,
//     });

//     const data = await res.json();
//     setMlResult(data);

//     await addDoc(collection(db, "assessments"), {
//       ...data,
//       profession: profile.profession,
//       createdAt: serverTimestamp(),
//     });

//     await loadHistory();
//     setPhase("result");
//   };

//   /* ------------------- UI ------------------- */
//   if (phase === "profile") {
//     return (
//       <form onSubmit={submitProfile} style={{ padding: 40, maxWidth: 500 }}>
//         <h2>🧠 User Profile</h2>

//         <input name="age" placeholder="Age" onChange={handleProfileChange} />
//         <select name="gender" onChange={handleProfileChange}>
//           <option value="">Gender</option><option>Male</option><option>Female</option>
//         </select>
//         <select name="profession" onChange={handleProfileChange}>
//           <option value="">Profession</option>
//           <option>IT</option><option>Student</option><option>Healthcare</option>
//         </select>
//         <select name="experienceLevel" onChange={handleProfileChange}>
//           <option value="">Experience</option>
//           <option>Junior</option><option>Mid</option><option>Senior</option>
//         </select>
//         <select name="dailyScreenTime" onChange={handleProfileChange}>
//           <option value="">Screen Time</option>
//           <option>Low</option><option>Medium</option><option>High</option>
//         </select>
//         <select name="sleepQuality" onChange={handleProfileChange}>
//           <option value="">Sleep Quality</option>
//           <option>Good</option><option>Average</option><option>Poor</option>
//         </select>

//         <br /><br />
//         <button type="submit">Start Assessment</button>
//       </form>
//     );
//   }

//   if (phase === "questions") {
//     return (
//       <div style={{ padding: 40 }}>
//         <h3>Question {currentIndex + 1} / {questions.length}</h3>
//         <p>{questions[currentIndex]}</p>

//         <button onClick={() => speakQuestion(questions[currentIndex])}>🔊 Repeat</button>
//         <br /><br />

//         {!recording
//           ? <button onClick={startRecording}>🎙 Start</button>
//           : <button onClick={stopRecording}>⏹ Stop</button>}

//         <br /><br />
//         {!recording && audioResponses.length === currentIndex + 1 &&
//           <button onClick={nextQuestion}>Next</button>}
//       </div>
//     );
//   }

//   if (phase === "analyze") {
//     return (
//       <div style={{ padding: 40 }}>
//         <h2>✅ Answers Recorded</h2>
//         <button onClick={analyze}>Analyze Stress</button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 40 }}>
//       <div style={{
//         background: "#f9fafb",
//         padding: 25,
//         borderRadius: 14,
//         boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
//         maxWidth: 400
//       }}>
//         <h2>📊 Result</h2>
//         <p><b>Emotion:</b> {mlResult.emotion}</p>
//         <p style={{ color: stressColor[mlResult.stress], fontSize: 20 }}>
//           <b>Stress:</b> {mlResult.stress} {stressEmoji[mlResult.stress]}
//         </p>
//         <p><b>Confidence:</b> {mlResult.confidence}</p>
//       </div>

//       {history.length > 0 && (
//         <div style={{ marginTop: 40 }}>
//           <h3>📈 Past Sessions</h3>
//           {history.map((h, i) => (
//             <div key={i}>
//               {i + 1}. {h.emotion} — {h.stress} ({h.confidence})
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


























import SmoothScroll from "./components/SmoothScroll";



import { BrowserRouter } from "react-router-dom";
import Topbar from "./components/Topbar";
import AmbientBackground from "./components/AmbientBackground";
import AnimatedRoutes from "./AnimatedRoutes";

export default function App() {
  return (
    <BrowserRouter>
    <SmoothScroll>
      {/* 🌌 FULL-SCREEN CANVAS */}
      <div className="relative min-h-screen w-full bg-transparent overflow-x-hidden">
        
        {/* 🌊 Ambient animated background */}
        <AmbientBackground />

        {/* 🧭 Top Navigation */}
        <Topbar />

        {/* 🎬 Page Transitions */}
        <AnimatedRoutes />

      </div>
      </SmoothScroll>
    </BrowserRouter>
  );
}












