# from flask import Flask, request, jsonify
# from predict import predict_emotion
# import os

# app = Flask(__name__)

# @app.route("/predict", methods=["POST"])
# def predict():
#     if "audio" not in request.files:
#         return jsonify({"error": "No audio file received"}), 400

#     audio = request.files["audio"]
#     audio_path = "temp.wav"
#     audio.save(audio_path)

#     result = predict_emotion(audio_path)

#     os.remove(audio_path)
#     return jsonify(result)

# if __name__ == "__main__":
#     app.run(port=5001)






from flask import Flask, request, jsonify
from predict import predict_emotion
import os
import librosa
import soundfile as sf


print(">>> FINAL FLASK ML API RUNNING <<<")

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return "FLASK ML API IS RUNNING"

# @app.route("/predict", methods=["POST"])
# def predict():
#     if "audio" not in request.files:
#         return jsonify({"error": "No audio file received"}), 400

#     audio = request.files["audio"]
#     audio_path = "temp.wav"
#     audio.save(audio_path)

#     result = predict_emotion(audio_path)

#     os.remove(audio_path)
#     return jsonify(result)







@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "audio" not in request.files:
            return jsonify({"error": "No audio file received"}), 400

        audio = request.files["audio"]
        audio_path = "temp.wav"
        audio.save(audio_path)

        result = predict_emotion(audio_path)

        os.remove(audio_path)
        return jsonify(result)

    except Exception as e:
        print("🔥 FLASK ERROR:", repr(e))
        return jsonify({"error": repr(e)}), 500
















def predict_emotion_from_signal(signal, sr):
    signal, _ = librosa.effects.trim(signal, top_db=20)
    signal = librosa.util.normalize(signal)

    mfcc = librosa.feature.mfcc(y=signal, sr=sr, n_mfcc=40)

    if mfcc.shape[1] < 100:
        mfcc = np.pad(mfcc, ((0,0),(0,100-mfcc.shape[1])))
    else:
        mfcc = mfcc[:, :100]

    mfcc = mfcc[np.newaxis, ..., np.newaxis]

    pred = model.predict(mfcc, verbose=0)
    emotion = emotion_labels[np.argmax(pred)]
    confidence = float(np.max(pred))

    if emotion in ["Neutral", "Calm"]:
        stress = "Low"
    elif emotion in ["Happy", "Sad", "Surprised"]:
        stress = "Medium"
    else:
        stress = "High"

    return {
        "emotion": emotion,
        "stress": stress,
        "confidence": round(confidence, 2)
    }







if __name__ == "__main__":
    app.run(host="127.0.0.1", port=9000)
