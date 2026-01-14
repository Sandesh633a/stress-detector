# # train_model.py
# # STEP 9: Train CNN model for emotion detection

# import numpy as np
# import os
# import librosa
# from sklearn.model_selection import train_test_split
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
# from tensorflow.keras.utils import to_categorical

# # -------------------------
# # 1️⃣ LOAD DATA (same as step 8)
# # -------------------------

# DATASET_PATH = "data/ravdess/Actor_01"

# N_MFCC = 40
# MAX_LEN = 100

# emotion_map = {
#     "01": 0,
#     "02": 1,
#     "03": 2,
#     "04": 3,
#     "05": 4,
#     "06": 5,
#     "07": 6,
#     "08": 7
# }

# X = []
# y = []

# for file in os.listdir(DATASET_PATH):
#     if file.endswith(".wav"):
#         path = os.path.join(DATASET_PATH, file)

#         emotion_code = file.split("-")[2]
#         label = emotion_map[emotion_code]

#         signal, sr = librosa.load(path)
#         signal, _ = librosa.effects.trim(signal, top_db=20)
#         signal = librosa.util.normalize(signal)

#         mfcc = librosa.feature.mfcc(y=signal, sr=sr, n_mfcc=N_MFCC)

#         if mfcc.shape[1] < MAX_LEN:
#             mfcc = np.pad(mfcc, ((0, 0), (0, MAX_LEN - mfcc.shape[1])))
#         else:
#             mfcc = mfcc[:, :MAX_LEN]

#         X.append(mfcc)
#         y.append(label)

# X = np.array(X)
# y = np.array(y)

# # -------------------------
# # 2️⃣ PREPARE DATA FOR CNN
# # -------------------------

# # CNN needs 4D input: (samples, height, width, channels)
# X = X[..., np.newaxis]

# y = to_categorical(y, num_classes=8)

# # Split
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42, stratify=y
# )

# print("Training data shape:", X_train.shape)
# print("Testing data shape:", X_test.shape)

# # -------------------------
# # 3️⃣ BUILD CNN MODEL
# # -------------------------

# model = Sequential()

# model.add(Conv2D(32, (3, 3), activation="relu", input_shape=X_train.shape[1:]))
# model.add(MaxPooling2D((2, 2)))

# model.add(Conv2D(64, (3, 3), activation="relu"))
# model.add(MaxPooling2D((2, 2)))

# model.add(Flatten())
# model.add(Dense(128, activation="relu"))
# model.add(Dropout(0.3))
# model.add(Dense(8, activation="softmax"))

# # -------------------------
# # 4️⃣ COMPILE MODEL
# # -------------------------

# model.compile(
#     optimizer="adam",
#     loss="categorical_crossentropy",
#     metrics=["accuracy"]
# )

# model.summary()

# # -------------------------
# # 5️⃣ TRAIN MODEL
# # -------------------------

# history = model.fit(
#     X_train,
#     y_train,
#     epochs=20,
#     batch_size=8,
#     validation_data=(X_test, y_test)
# )

# # -------------------------
# # 6️⃣ EVALUATE MODEL
# # -------------------------

# loss, accuracy = model.evaluate(X_test, y_test)
# print("Test Accuracy:", accuracy)

# # -------------------------
# # 7️⃣ SAVE MODEL
# # -------------------------

# model.save("emotion_model.keras")
# print("Model saved as emotion_model.keras")


























# train_model.py
# Train improved emotion recognition model

import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    Conv2D, MaxPooling2D, Dense, Dropout,
    Flatten, BatchNormalization, Input
)
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.utils import to_categorical

# 1️⃣ Load prepared dataset
X = np.load("X.npy")
y = np.load("y.npy")

print("Loaded data:")
print("X shape:", X.shape)
print("y shape:", y.shape)

# 2️⃣ Reshape for CNN
X = X[..., np.newaxis]  # (samples, 40, 100, 1)

# 3️⃣ One-hot encode labels
y = to_categorical(y, num_classes=8)

# 4️⃣ Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("Train shape:", X_train.shape)
print("Test shape:", X_test.shape)

# 5️⃣ Build improved CNN model
model = Sequential([
    Input(shape=(40, 100, 1)),

    Conv2D(32, (3, 3), activation="relu"),
    BatchNormalization(),
    MaxPooling2D((2, 2)),

    Conv2D(64, (3, 3), activation="relu"),
    BatchNormalization(),
    MaxPooling2D((2, 2)),

    Conv2D(128, (3, 3), activation="relu"),
    BatchNormalization(),
    MaxPooling2D((2, 2)),

    Flatten(),
    Dense(256, activation="relu"),
    Dropout(0.5),

    Dense(8, activation="softmax")
])

model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# 6️⃣ Early stopping to avoid overfitting
early_stop = EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True
)

# 7️⃣ Train model
history = model.fit(
    X_train,
    y_train,
    validation_data=(X_test, y_test),
    epochs=40,
    batch_size=32,
    callbacks=[early_stop]
)

# 8️⃣ Evaluate model
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {accuracy:.4f}")

# 9️⃣ Save model (modern format)
model.save("emotion_model.keras")
print("Model saved as emotion_model.keras")
