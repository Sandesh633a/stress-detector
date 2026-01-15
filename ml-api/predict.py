import tensorflow as tf
from collections import deque
import os
import librosa
import numpy as np

SMOOTHING_WINDOW = 3
prediction_buffer = deque(maxlen=SMOOTHING_WINDOW)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "emotion_model_tf")

print("🔥 Loading TensorFlow SavedModel from:", MODEL_PATH)

model = tf.saved_model.load(MODEL_PATH)
infer = model.signatures["serving_default"]

emotion_labels = [
    "Neutral", "Calm", "Happy", "Sad",
    "Angry", "Fearful", "Disgust", "Surprised"
]

def predict_emotion(audio_path):

    signal, sr = librosa.load(audio_path, sr=16000, mono=True)
    signal = signal[:5 * sr]
    signal, _ = librosa.effects.trim(signal, top_db=20)

    if signal.size == 0:
        raise ValueError("Empty audio")

    signal = librosa.util.normalize(signal)

    mfcc = librosa.feature.mfcc(
        y=signal,
        sr=sr,
        n_mfcc=40,
        hop_length=160,
        n_fft=512
    )

    if mfcc.shape[1] < 100:
        mfcc = np.pad(mfcc, ((0, 0), (0, 100 - mfcc.shape[1])))
    else:
        mfcc = mfcc[:, :100]

    mfcc = mfcc[np.newaxis, ..., np.newaxis].astype("float32")

    outputs = infer(tf.constant(mfcc))
    pred = list(outputs.values())[0].numpy()[0]

    prediction_buffer.append(pred)
    avg_pred = np.mean(prediction_buffer, axis=0)

    emotion_index = int(np.argmax(avg_pred))
    emotion = emotion_labels[emotion_index]
    confidence = float(avg_pred[emotion_index])

    stress = (
        "Low" if emotion in ["Neutral", "Calm"]
        else "Medium" if emotion in ["Happy", "Sad", "Surprised"]
        else "High"
    )

    return {
        "emotion": emotion,
        "stress": stress,
        "confidence": round(min(confidence ** 0.8, 0.95), 2)
    }
