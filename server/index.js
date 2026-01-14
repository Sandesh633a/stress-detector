const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegPath);

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");

const app = express();
app.use(cors());

// Multer config (store audio temporarily)
const upload = multer({ dest: "uploads/" });

// Health check
app.get("/", (req, res) => {
  res.send("Node backend is running");
});

// Receive audio from React → send to Flask ML API
app.post("/analyze", upload.single("audio"), async (req, res) => {
  let webmPath, wavPath;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio received" });
    }

    webmPath = req.file.path;
    wavPath = webmPath + ".wav";

    // Convert webm → wav
    await new Promise((resolve, reject) => {
      ffmpeg(webmPath)
        .toFormat("wav")
        .on("end", resolve)
        .on("error", reject)
        .save(wavPath);
    });

    const formData = new FormData();
    formData.append("audio", fs.createReadStream(wavPath));

    // Call Flask ML API (DEPLOYED URL)
    const flaskResponse = await axios.post(
      `${process.env.ML_API_URL}/predict`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 60000, // 60s timeout (cold start safe)
      }
    );

    res.json(flaskResponse.data);
  } catch (error) {
    console.error("🔥 ERROR:", error.message);
    res.status(500).json({ error: "Processing failed" });
  } finally {
    // Cleanup temp files safely
    if (webmPath && fs.existsSync(webmPath)) fs.unlinkSync(webmPath);
    if (wavPath && fs.existsSync(wavPath)) fs.unlinkSync(wavPath);
  }
});

// Start server (Render-safe)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});
