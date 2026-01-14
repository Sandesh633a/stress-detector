# clean_audio.py
# STEP 5: Remove silence and normalize audio

import librosa
import numpy as np

# 1️⃣ Path to audio file (same one you used before)
audio_path = "data/ravdess/Actor_01/03-01-02-01-01-01-01.wav"

# 2️⃣ Load audio
signal, sample_rate = librosa.load(audio_path)

print("Original audio loaded")
print("Original samples:", len(signal))

# 3️⃣ Remove silence from beginning and end
# top_db = 20 means anything quieter than this is considered silence
clean_signal, _ = librosa.effects.trim(signal, top_db=20)

print("Silence removed")
print("Samples after trimming:", len(clean_signal))

# 4️⃣ Normalize audio (make volume consistent)
normalized_signal = librosa.util.normalize(clean_signal)

print("Audio normalized")

# 5️⃣ Calculate durations
original_duration = len(signal) / sample_rate
clean_duration = len(normalized_signal) / sample_rate

print("Original duration (seconds):", original_duration)
print("Cleaned duration (seconds):", clean_duration)

# 6️⃣ Print first 10 samples (after cleaning)
print("First 10 cleaned audio samples:")
print(normalized_signal[:10])
