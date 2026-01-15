const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegPath);

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const FormData = require("form-data");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

// Health check
app.get("/", (req, res) => {
  res.send("Node backend is running");
});

// React → Node → Flask ML API
app.post("/analyze", upload.single("audio"), async (req, res) => {
  let webmPath, wavPath;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio received" });
    }

    webmPath = req.file.path;
    wavPath = webmPath + ".wav";

    // Convert to WAV
    await new Promise((resolve, reject) => {
      ffmpeg(webmPath)
        .toFormat("wav")
        .on("end", resolve)
        .on("error", reject)
        .save(wavPath);
    });

    const formData = new FormData();
    formData.append("audio", fs.createReadStream(wavPath));

    // 🔥 CALL LOCAL FLASK API
    const mlResponse = await axios.post(
      "http://10.40.97.100:9000/predict",
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 120000,
      }
    );

    res.json(mlResponse.data);

  } catch (error) {
    console.error("🔥 NODE ERROR:", error.message);
    res.status(500).json({ error: "Processing failed" });
  } finally {
    if (webmPath && fs.existsSync(webmPath)) fs.unlinkSync(webmPath);
    if (wavPath && fs.existsSync(wavPath)) fs.unlinkSync(wavPath);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Node server running on port ${PORT}`);
});

