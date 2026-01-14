export function generateQuestions(profile) {
  let questions = [];

  // 1️⃣ Universal emotional baseline
  questions.push(
    "How have you been feeling emotionally over the past few days?",
    "Do you generally feel calm or mentally tense?"
  );

  // 2️⃣ Profession-based rules
  const professionMap = {
    IT: [
      "How has your workload been recently?",
      "Do you feel pressure to meet deadlines?",
      "Do you find it hard to disconnect from work after hours?"
    ],
    Student: [
      "How are your studies going currently?",
      "Do exams or assignments cause you stress?",
      "How confident do you feel about your future?"
    ],
    Healthcare: [
      "Do you feel emotionally drained after work?",
      "How often do you feel under pressure while working?"
    ],
    Business: [
      "Does managing responsibilities cause stress?",
      "Do financial concerns affect your mental state?"
    ],
    Other: [
      "Do work responsibilities affect your peace of mind?"
    ]
  };

  if (professionMap[profile.profession]) {
    questions.push(...professionMap[profile.profession]);
  }

  // 3️⃣ Experience level
  const experienceMap = {
    Junior: ["Do you feel anxious about meeting expectations?"],
    Senior: ["Does leadership pressure affect your mental health?"]
  };

  if (experienceMap[profile.experienceLevel]) {
    questions.push(...experienceMap[profile.experienceLevel]);
  }

  // 4️⃣ Screen time
  if (profile.dailyScreenTime === "High" || profile.dailyScreenTime === "Very High") {
    questions.push(
      "Do you feel mentally exhausted due to prolonged screen usage?",
      "Do you take regular breaks from screens?"
    );
  }

  // 5️⃣ Sleep quality
  if (profile.sleepQuality === "Poor") {
    questions.push(
      "Do you feel tired even after waking up?",
      "Does lack of sleep affect your mood during the day?"
    );
  }

  // 6️⃣ Age nuance
  if (profile.age < 25) {
    questions.push("Do you feel uncertain or anxious about your future?");
  } else if (profile.age > 40) {
    questions.push("Do responsibilities weigh on your mental health?");
  }

  // 7️⃣ Final cleanup
  questions = [...new Set(questions)];
  questions.sort(() => Math.random() - 0.5);

  return questions.slice(0, 4);
}



