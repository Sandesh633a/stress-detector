# # prepare_dataset.py
# # STEP 7: Make MFCC fixed-size and prepare ML input

# import librosa
# import numpy as np
# import os

# # 1️⃣ Path to RAVDESS dataset (change if needed)
# DATASET_PATH = "data/ravdess/Actor_01"

# # 2️⃣ Fixed MFCC settings
# N_MFCC = 40
# MAX_LEN = 100   # fixed time length

# # 3️⃣ Emotion mapping (from RAVDESS)
# emotion_map = {
#     "01": 0,  # neutral
#     "02": 1,  # calm
#     "03": 2,  # happy
#     "04": 3,  # sad
#     "05": 4,  # angry
#     "06": 5,  # fearful
#     "07": 6,  # disgust
#     "08": 7   # surprised
# }

# X = []  # features
# y = []  # labels

# print("Preparing dataset...")

# # 4️⃣ Loop through all audio files
# for file in os.listdir(DATASET_PATH):
#     if file.endswith(".wav"):
#         file_path = os.path.join(DATASET_PATH, file)

#         # 5️⃣ Extract emotion from filename
#         emotion_code = file.split("-")[2]
#         label = emotion_map[emotion_code]

#         # 6️⃣ Load audio
#         signal, sr = librosa.load(file_path)

#         # 7️⃣ Clean audio
#         signal, _ = librosa.effects.trim(signal, top_db=20)
#         signal = librosa.util.normalize(signal)

#         # 8️⃣ Extract MFCC
#         mfcc = librosa.feature.mfcc(
#             y=signal,
#             sr=sr,
#             n_mfcc=N_MFCC
#         )

#         # 9️⃣ Fix MFCC length
#         if mfcc.shape[1] < MAX_LEN:
#             pad_width = MAX_LEN - mfcc.shape[1]
#             mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)))
#         else:
#             mfcc = mfcc[:, :MAX_LEN]

#         # 🔟 Store data
#         X.append(mfcc)
#         y.append(label)

# print("Dataset preparation completed!")

# # 1️⃣1️⃣ Convert lists to numpy arrays
# X = np.array(X)
# y = np.array(y)

# print("X shape:", X.shape)
# print("y shape:", y.shape)














# prepare_dataset.py
# Improved dataset preparation with augmentation

import librosa
import numpy as np
import os

# 1️⃣ Path to RAVDESS dataset root
DATASET_PATH = "data/ravdess"

# 2️⃣ MFCC settings
N_MFCC = 40
MAX_LEN = 100
SR = 22050

# 3️⃣ Emotion mapping
emotion_map = {
    "01": 0,  # neutral
    "02": 1,  # calm
    "03": 2,  # happy
    "04": 3,  # sad
    "05": 4,  # angry
    "06": 5,  # fearful
    "07": 6,  # disgust
    "08": 7   # surprised
}

X = []
y = []

print("Preparing dataset (ALL actors + augmentation)...")

# 4️⃣ Audio augmentation function
def augment_audio(signal, sr):
    augmented = []

    # Original
    augmented.append(signal)

    # Add noise
    noise = signal + 0.005 * np.random.randn(len(signal))
    augmented.append(noise)

    # Pitch shift
    pitch = librosa.effects.pitch_shift(signal, sr=sr, n_steps=2)
    augmented.append(pitch)

    # Time stretch
    stretch = librosa.effects.time_stretch(signal, rate=0.9)
    augmented.append(stretch)

    return augmented

# 5️⃣ Loop through all actors
for actor in os.listdir(DATASET_PATH):
    actor_path = os.path.join(DATASET_PATH, actor)

    if not actor.startswith("Actor_"):
        continue

    for file in os.listdir(actor_path):
        if not file.endswith(".wav"):
            continue

        file_path = os.path.join(actor_path, file)

        # 6️⃣ Emotion label from filename
        emotion_code = file.split("-")[2]
        label = emotion_map[emotion_code]

        # 7️⃣ Load audio
        signal, sr = librosa.load(file_path, sr=SR)

        # 8️⃣ Clean audio
        signal, _ = librosa.effects.trim(signal, top_db=20)
        signal = librosa.util.normalize(signal)

        # 9️⃣ Apply augmentation
        for aug_signal in augment_audio(signal, sr):

            # Extract MFCC
            mfcc = librosa.feature.mfcc(
                y=aug_signal,
                sr=sr,
                n_mfcc=N_MFCC
            )

            # Fix MFCC length
            if mfcc.shape[1] < MAX_LEN:
                pad_width = MAX_LEN - mfcc.shape[1]
                mfcc = np.pad(mfcc, ((0, 0), (0, pad_width)))
            else:
                mfcc = mfcc[:, :MAX_LEN]

            X.append(mfcc)
            y.append(label)

print("Dataset preparation completed!")

# 🔟 Convert to numpy arrays
X = np.array(X)
y = np.array(y)

print("X shape:", X.shape)
print("y shape:", y.shape)

# 1️⃣1️⃣ Save dataset
np.save("X.npy", X)
np.save("y.npy", y)

print("Saved X.npy and y.npy")
