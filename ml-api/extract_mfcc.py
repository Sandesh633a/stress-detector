# extract_mfcc.py
# STEP 6: Convert cleaned audio into MFCC features

import librosa
import numpy as np

# 1️⃣ Path to audio file
audio_path = "data/ravdess/Actor_01/03-01-02-01-01-01-01.wav"

# 2️⃣ Load audio
signal, sample_rate = librosa.load(audio_path)

# 3️⃣ Remove silence
clean_signal, _ = librosa.effects.trim(signal, top_db=20)

# 4️⃣ Normalize audio
clean_signal = librosa.util.normalize(clean_signal)

print("Audio cleaned and ready")

# 5️⃣ Extract MFCC features
# n_mfcc = 40 is standard for emotion detection
mfcc = librosa.feature.mfcc(
    y=clean_signal,
    sr=sample_rate,
    n_mfcc=40
)

# 6️⃣ Print MFCC details
print("MFCC extracted successfully")
print("MFCC shape:", mfcc.shape)

# 7️⃣ Show first few MFCC values
print("First MFCC values:")
print(mfcc[:, :5])
