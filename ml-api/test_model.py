# test_model.py
# STEP 10: Test trained emotion model on new voice

import librosa
import numpy as np
from tensorflow.keras.models import load_model

# -------------------------
# SETTINGS
# -------------------------
MODEL_PATH = "emotion_model.keras"
AUDIO_PATH = "data/test_audio.wav"

N_MFCC = 40
MAX_LEN = 100

emotion_labels = [
    "Neutral",
    "Calm",
    "Happy",
    "Sad",
    "Angry",
    "Fearful",
    "Disgust",
    "Surprised"
]

# -------------------------
# 1️⃣ LOAD MODEL
# -------------------------
model = load_model(MODEL_PATH)
print("Model loaded successfully")

# -------------------------
# 2️⃣ LOAD & CLEAN AUDIO
# -------------------------
signal, sr = librosa.load(AUDIO_PATH)
signal, _ = librosa.effects.trim(signal, top_db=20)
signal = librosa.util.normalize(signal)

# -------------------------
# 3️⃣ EXTRACT MFCC
# -------------------------
mfcc = librosa.feature.mfcc(y=signal, sr=sr, n_mfcc=N_MFCC)

# Fix MFCC length
if mfcc.shape[1] < MAX_LEN:
    mfcc = np.pad(mfcc, ((0, 0), (0, MAX_LEN - mfcc.shape[1])))
else:
    mfcc = mfcc[:, :MAX_LEN]

# CNN expects 4D input
mfcc = mfcc[np.newaxis, ..., np.newaxis]

# -------------------------
# 4️⃣ PREDICT EMOTION
# -------------------------
prediction = model.predict(mfcc)
emotion_index = np.argmax(prediction)
emotion = emotion_labels[emotion_index]
confidence = np.max(prediction)

print("\nDetected Emotion:", emotion)
print("Confidence:", round(confidence, 2))

# -------------------------
# 5️⃣ EMOTION → STRESS LOGIC
# -------------------------
if emotion in ["Neutral", "Calm"]:
    stress = "Low"
elif emotion in ["Happy", "Sad", "Surprised"]:
    stress = "Medium"
else:
    stress = "High"

print("Detected Stress Level:", stress)
