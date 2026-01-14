# predict.py

from collections import deque
import os
import librosa
import numpy as np
from tensorflow.keras.models import load_model

# -----------------------------
# 🔁 Prediction smoothing
# -----------------------------
SMOOTHING_WINDOW = 3
prediction_buffer = deque(maxlen=SMOOTHING_WINDOW)

# -----------------------------
# 📦 Model loading (SAFE)
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "emotion_model.keras")

print("🔍 Loading model from:", MODEL_PATH)
print("📁 Model file exists:", os.path.exists(MODEL_PATH))

# Emotion labels (must match training order)
emotion_labels = [
    "Neutral", "Calm", "Happy", "Sad",
    "Angry", "Fearful", "Disgust", "Surprised"
]

# Load model ONCE at startup
model = load_model(MODEL_PATH)
print("✅ Model loaded successfully")

# -----------------------------
# 🎧 Prediction function
# -----------------------------
def predict_emotion(audio_path):
    # Load audio
    signal, sr = librosa.load(audio_path, sr=None)
    signal, _ = librosa.effects.trim(signal, top_db=20)
    signal = librosa.util.normalize(signal)

    # Extract MFCCs
    mfcc = librosa.feature.mfcc(y=signal, sr=sr, n_mfcc=40)

    # Pad / trim to fixed length (100 frames)
    if mfcc.shape[1] < 100:
        mfcc = np.pad(mfcc, ((0, 0), (0, 100 - mfcc.shape[1])))
    else:
        mfcc = mfcc[:, :100]

    # Add batch & channel dimensions
    mfcc = mfcc[np.newaxis, ..., np.newaxis]  # (1, 40, 100, 1)

    # Predict
    pred = model.predict(mfcc, verbose=0)[0]  # shape (8,)

    # Smooth predictions
    prediction_buffer.append(pred)
    avg_pred = np.mean(prediction_buffer, axis=0)

    emotion_index = int(np.argmax(avg_pred))
    emotion = emotion_labels[emotion_index]
    confidence = float(avg_pred[emotion_index])

    # Stress mapping
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
