# split_dataset.py
# STEP 8: Split dataset into training and testing sets

import numpy as np
from sklearn.model_selection import train_test_split
import librosa
import os

# SAME CODE AS STEP 7 (to load data)
DATASET_PATH = "data/ravdess/Actor_01"

N_MFCC = 40
MAX_LEN = 100

emotion_map = {
    "01": 0,
    "02": 1,
    "03": 2,
    "04": 3,
    "05": 4,
    "06": 5,
    "07": 6,
    "08": 7
}

X = []
y = []

for file in os.listdir(DATASET_PATH):
    if file.endswith(".wav"):
        file_path = os.path.join(DATASET_PATH, file)

        emotion_code = file.split("-")[2]
        label = emotion_map[emotion_code]

        signal, sr = librosa.load(file_path)
        signal, _ = librosa.effects.trim(signal, top_db=20)
        signal = librosa.util.normalize(signal)

        mfcc = librosa.feature.mfcc(y=signal, sr=sr, n_mfcc=N_MFCC)

        if mfcc.shape[1] < MAX_LEN:
            pad_width = MAX_LEN - mfcc.shape[1]
            mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)))
        else:
            mfcc = mfcc[:, :MAX_LEN]

        X.append(mfcc)
        y.append(label)

X = np.array(X)
y = np.array(y)

print("Total samples:", X.shape[0])

# 🔟 SPLIT DATA
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,     # 20% for testing
    random_state=42,
    stratify=y         # keep emotion balance
)

print("Training samples:", X_train.shape[0])
print("Testing samples:", X_test.shape[0])

# 1️⃣1️⃣ Check shapes
print("X_train shape:", X_train.shape)
print("X_test shape:", X_test.shape)
