// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function ProfileSetup() {
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState({
//     age: "",
//     gender: "",
//     profession: "",
//     sleepQuality: "",
//     screenTime: "",
//     stressFrequency: "",
//   });

//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const submitProfile = () => {
//     // Save locally for now (later Firebase/Auth)
//     localStorage.setItem("userProfile", JSON.stringify(profile));
//     navigate("/assistant");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-6">
      
//       {/* Glass Card */}
//       <div className="backdrop-blur-xl bg-white/10 border border-white/20 
//                       shadow-2xl rounded-3xl p-10 w-full max-w-lg
//                       animate-fade-in">

//         <h1 className="text-3xl font-bold text-white text-center mb-2">
//           🧠 Personal Setup
//         </h1>

//         <p className="text-gray-300 text-center mb-8">
//           Help us understand you better
//         </p>

//         {/* FORM */}
//         <div className="space-y-5">

//           {/* Age */}
//           <Input
//             label="Age"
//             name="age"
//             type="number"
//             placeholder="Enter your age"
//             value={profile.age}
//             onChange={handleChange}
//           />

//           {/* Gender */}
//           <Select
//             label="Gender"
//             name="gender"
//             value={profile.gender}
//             onChange={handleChange}
//             options={["Male", "Female", "Other"]}
//           />

//           {/* Profession */}
//           <Select
//             label="Profession"
//             name="profession"
//             value={profile.profession}
//             onChange={handleChange}
//             options={["IT", "Student", "Healthcare", "Business", "Other"]}
//           />

//           {/* Sleep */}
//           <Select
//             label="Sleep Quality"
//             name="sleepQuality"
//             value={profile.sleepQuality}
//             onChange={handleChange}
//             options={["Excellent", "Good", "Average", "Poor"]}
//           />

//           {/* Screen Time */}
//           <Select
//             label="Daily Screen Time"
//             name="screenTime"
//             value={profile.screenTime}
//             onChange={handleChange}
//             options={["Low", "Medium", "High", "Very High"]}
//           />

//           {/* Stress Frequency */}
//           <Select
//             label="Stress Frequency"
//             name="stressFrequency"
//             value={profile.stressFrequency}
//             onChange={handleChange}
//             options={["Rarely", "Sometimes", "Often", "Almost Always"]}
//           />

//           {/* CTA */}
//           <button
//             onClick={submitProfile}
//             className="w-full mt-6 py-3 rounded-xl font-semibold text-white
//                        bg-gradient-to-r from-pink-500 to-indigo-500
//                        hover:scale-[1.03] hover:shadow-pink-500/50
//                        transition-all duration-300 shadow-lg"
//           >
//             🚀 Continue to Voice Assistant
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// }

// /* 🔹 Reusable Input */
// function Input({ label, ...props }) {
//   return (
//     <div>
//       <label className="text-sm text-gray-300 mb-1 block">{label}</label>
//       <input
//         {...props}
//         className="w-full px-4 py-3 rounded-xl bg-white/10 text-white
//                    border border-white/20 outline-none
//                    focus:ring-2 focus:ring-pink-500
//                    focus:bg-white/20 transition"
//       />
//     </div>
//   );
// }

// /* 🔹 Reusable Select */
// function Select({ label, options, ...props }) {
//   return (
//     <div>
//       <label className="text-sm text-gray-300 mb-1 block">{label}</label>
//       <select
//         {...props}
//         className="w-full px-4 py-3 rounded-xl bg-white/10 text-white
//                    border border-white/20 outline-none
//                    focus:ring-2 focus:ring-indigo-500
//                    transition"
//       >
//         <option value="">Select</option>
//         {options.map((opt) => (
//           <option key={opt} value={opt} className="text-black">
//             {opt}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }






















import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    age: "",
    gender: "",
    profession: "",
    sleepQuality: "",
    screenTime: "",
    stressFrequency: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const submitProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    navigate("/assistant");
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent flex items-center justify-center">

      {/* 🌌 Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#05060f] via-[#0b1020] to-black" />
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[120px]" />

      {/* 🧊 Glass Card */}
      <div className="relative w-full max-w-xl rounded-3xl 
                      backdrop-blur-2xl bg-white/5 border border-white/10 
                      shadow-[0_0_80px_rgba(0,255,255,0.05)]
                      p-10">

        {/* Header */}
        <h1 className="text-3xl font-semibold text-center mb-2">
          <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Personal Insight Setup
          </span>
        </h1>

        <p className="text-gray-400 text-center mb-10 text-sm">
          This helps our AI adapt questions to you
        </p>

        {/* FORM */}
        <div className="space-y-6">

          <Input
            label="Age"
            name="age"
            type="number"
            placeholder="Your age"
            value={profile.age}
            onChange={handleChange}
          />

          <Select
            label="Gender"
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
          />

          <Select
            label="Profession"
            name="profession"
            value={profile.profession}
            onChange={handleChange}
            options={["IT", "Student", "Healthcare", "Business", "Other"]}
          />

          <Select
            label="Sleep Quality"
            name="sleepQuality"
            value={profile.sleepQuality}
            onChange={handleChange}
            options={["Excellent", "Good", "Average", "Poor"]}
          />

          <Select
            label="Daily Screen Time"
            name="screenTime"
            value={profile.screenTime}
            onChange={handleChange}
            options={["Low", "Medium", "High", "Very High"]}
          />

          <Select
            label="Stress Frequency"
            name="stressFrequency"
            value={profile.stressFrequency}
            onChange={handleChange}
            options={["Rarely", "Sometimes", "Often", "Almost Always"]}
          />

          {/* CTA */}
          <button
            onClick={submitProfile}
            className="w-full mt-8 py-3 rounded-xl font-semibold
                       bg-gradient-to-r from-cyan-400 to-indigo-500
                       text-black tracking-wide
                       hover:scale-[1.04]
                       hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]
                       transition-all duration-300"
          >
            Begin Voice Assessment →
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Input */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-gray-400 mb-2 block">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl 
                   bg-black/40 text-white
                   border border-white/10
                   focus:outline-none focus:border-cyan-400
                   focus:ring-2 focus:ring-cyan-400/20
                   transition"
      />
    </div>
  );
}

/* 🔹 Select */
function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-gray-400 mb-2 block">
        {label}
      </label>
      <select
        {...props}
        className="w-full px-4 py-3 rounded-xl 
                   bg-black/40 text-white
                   border border-white/10
                   focus:outline-none focus:border-indigo-400
                   focus:ring-2 focus:ring-indigo-400/20
                   transition"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-black">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
