# predict.py

import tensorflow as tf

# 🔥 MUST BE FIRST (before anything touches the model)
tf.config.run_functions_eagerly(True)

from collections import deque
import os
import librosa
import numpy as np

# -----------------------------
# 🔁 Prediction smoothing
# -----------------------------
SMOOTHING_WINDOW = 3
prediction_buffer = deque(maxlen=SMOOTHING_WINDOW)

# -----------------------------
# 📦 Model loading
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "emotion_model.h5")

print("🔍 Loading model from:", MODEL_PATH)
print("📁 Model file exists:", os.path.exists(MODEL_PATH))

emotion_labels = [
    "Neutral", "Calm", "Happy", "Sad",
    "Angry", "Fearful", "Disgust", "Surprised"
]

model = tf.keras.models.load_model(MODEL_PATH)

# secondary safety (does not hurt)
model.run_eagerly = True

print("✅ Model loaded successfully (eager execution)")

# -----------------------------
# 🎧 Prediction function (STABLE)
# -----------------------------
def predict_emotion(audio_path):

    # Load audio safely
    signal, sr = librosa.load(audio_path, sr=16000, mono=True)

    # Limit duration (max 5 seconds)
    signal = signal[:5 * sr]

    # Trim silence
    signal, _ = librosa.effects.trim(signal, top_db=20)
    if signal.size == 0:
        raise ValueError("Empty audio after trimming")

    # Normalize
    signal = librosa.util.normalize(signal)

    # Extract MFCCs
    mfcc = librosa.feature.mfcc(
        y=signal,
        sr=sr,
        n_mfcc=40,
        hop_length=160,
        n_fft=512
    )

    # Pad / trim frames
    if mfcc.shape[1] < 100:
        mfcc = np.pad(mfcc, ((0, 0), (0, 100 - mfcc.shape[1])))
    else:
        mfcc = mfcc[:, :100]

    mfcc = mfcc[np.newaxis, ..., np.newaxis]

    # 🔥 DO NOT USE model.predict()
    pred = model(mfcc, training=False).numpy()[0]

    # Smooth predictions
    prediction_buffer.append(pred)
    avg_pred = np.mean(prediction_buffer, axis=0)

    emotion_index = int(np.argmax(avg_pred))
    emotion = emotion_labels[emotion_index]
    confidence = float(avg_pred[emotion_index])

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
