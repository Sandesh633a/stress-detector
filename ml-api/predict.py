# predict.py

from collections import deque

# Store last N predictions
SMOOTHING_WINDOW = 3
prediction_buffer = deque(maxlen=SMOOTHING_WINDOW)



import os
import librosa
import numpy as np
from tensorflow.keras.models import load_model

# ✅ ALWAYS load model relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "emotion_model.keras")

emotion_labels = [
    "Neutral", "Calm", "Happy", "Sad",
    "Angry", "Fearful", "Disgust", "Surprised"
]

# ✅ Load model safely
model = load_model(MODEL_PATH)

def predict_emotion(audio_path):
    signal, sr = librosa.load(audio_path)
    signal, _ = librosa.effects.trim(signal, top_db=20)
    signal = librosa.util.normalize(signal)

    mfcc = librosa.feature.mfcc(y=signal, sr=sr, n_mfcc=40)

    if mfcc.shape[1] < 100:
        mfcc = np.pad(mfcc, ((0, 0), (0, 100 - mfcc.shape[1])))
    else:
        mfcc = mfcc[:, :100]

    mfcc = mfcc[np.newaxis, ..., np.newaxis]



    pred = model.predict(mfcc, verbose=0)[0]  # shape (8,)

    # Store prediction
    prediction_buffer.append(pred)
    # Average last N predictions
    avg_pred = np.mean(prediction_buffer, axis=0)
    emotion_index = np.argmax(avg_pred)
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
