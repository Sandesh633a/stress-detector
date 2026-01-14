# load_audio.py
# STEP 4: Load ONE audio file using librosa

import librosa

# 1️⃣ Path to ONE audio file (change this path if needed)
audio_path = "data/ravdess/Actor_01/03-01-02-01-01-01-01.wav"

# 2️⃣ Load the audio file
signal, sample_rate = librosa.load(audio_path)

# 3️⃣ Print basic details
print("Audio loaded successfully!")
print("Sample Rate:", sample_rate)
print("Total Samples:", len(signal))

# 4️⃣ Calculate duration
duration = len(signal) / sample_rate
print("Duration (seconds):", duration)

# 5️⃣ Print first 10 audio values
print("First 10 audio samples:")
print(signal[:10])
