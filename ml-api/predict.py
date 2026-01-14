# predict.py

from collections import deque
import os
import librosa
import numpy as np
import tensorflow as tf

# -----------------------------
# 🔁 Prediction smoothing
# -----------------------------
SMOOTHING_WINDOW = 3
prediction_buffer = deque(maxlen=SMOOTHING_WINDOW)

# -----------------------------
# 📦 Model loading (ABSOLUTE + SAFE)
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "emotion_model.h5")

print("🔍 Loading model from:", MODEL_PATH)
print("📁 Model file exists:", os.path.exists(MODEL_PATH))

# Emotion labels (must match training order)
emotion_labels = [
    "Neutral", "Calm", "Happy", "Sad",
    "Angry", "Fearful", "Disgust", "Surprised"
]

# ✅ Load model ONCE at startup
model = tf.keras.models.load_model(MODEL_PATH)
print("✅ Model loaded successfully")

# -----------------------------
# 🎧 Prediction function (MEMORY SAFE)
# -----------------------------
def predict_emotion(audio_path):
    """
    Memory-safe audio inference for Render Free Tier
    """

    # 1️⃣ Load audio with fixed sample rate & mono (CRITICAL)
    signal, sr = librosa.load(audio_path, sr=16000, mono=True)

    # 2️⃣ Limit audio length (max 5 seconds)
    max_len = 5 * sr
    signal = signal[:max_len]

    # 3️⃣ Trim silence
    signal, _ = librosa.effects.trim(signal, top_db=20)

    # 4️⃣ Normalize safely
    if signal.size == 0:
        raise ValueError("Audio is empty after trimming")

    signal = librosa.util.normalize(signal)

    # 5️⃣ Extract MFCCs (fixed size)
    mfcc = librosa.feature.mfcc(
        y=signal,
        sr=sr,
        n_mfcc=40,
        hop_length=160,
        n_fft=512
    )

    # 6️⃣ Pad / trim MFCC frames to exactly 100
    if mfcc.shape[1] < 100:
        mfcc = np.pad(mfcc, ((0, 0), (0, 100 - mfcc.shape[1])))
    else:
        mfcc = mfcc[:, :100]

    # 7️⃣ Add batch & channel dims
    mfcc = mfcc[np.newaxis, ..., np.newaxis]  # (1, 40, 100, 1)

    # 8️⃣ Predict
    pred = model.predict(mfcc, verbose=0)[0]

    # 9️⃣ Smooth predictions
    prediction_buffer.append(pred)
    avg_pred = np.mean(prediction_buffer, axis=0)

    emotion_index = int(np.argmax(avg_pred))
    emotion = emotion_labels[emotion_index]
    confidence = float(avg_pred[emotion_index])

    # 🔟 Stress mapping
    if emotion in ["Neutral", "Calm"]:
        stress = "Low"
    elif emotion in ["Happy", "Sad", "Surprised"]:
        stress = "Medium"
    else:
        stress = "High"

    return {
        "emotion": emotion,
        "stress": stress,
        "confidence": round(min(confidence ** 0.8, 0.95), 2)
    }
