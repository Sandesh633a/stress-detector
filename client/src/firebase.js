// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "YOUR_KEY",
//   authDomain: "YOUR_DOMAIN",
//   projectId: "stress-emotion-detector",
//   storageBucket: "YOUR_BUCKET",
//   messagingSenderId: "YOUR_ID",
//   appId: "YOUR_APP_ID",
// };

// const app = initializeApp(firebaseConfig);

// // 🔥 IMPORTANT LINE
// export const db = getFirestore(app, {
//   experimentalForceLongPolling: true,
// });






import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZbXoE8o5gMMW2FhhokzWYCgb10VWIv_8",
  authDomain: "stress-emotion-detector.firebaseapp.com",
  projectId: "stress-emotion-detector",
  storageBucket: "stress-emotion-detector.firebasestorage.app",
  messagingSenderId: "795652130368",
  appId: "1:795652130368:web:985e3688af5d740367c1a5"
};

const app = initializeApp(firebaseConfig);

// ✅ CORRECT WAY (THIS FIXES HANGING ISSUE)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
