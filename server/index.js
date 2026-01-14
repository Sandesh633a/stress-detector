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

// Multer config (store audio temporarily)
const upload = multer({ dest: "uploads/" });

// Health check
app.get("/", (req, res) => {
  res.send("Node backend is running");
});

// Receive audio from React, send to Flask
app.post("/analyze", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio received" });
    }

    const webmPath = req.file.path;
    const wavPath = webmPath + ".wav";

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

    const flaskResponse = await axios.post(
      "http://127.0.0.1:9000/predict",
      formData,
      { headers: formData.getHeaders() }
    );

    fs.unlinkSync(webmPath);
    fs.unlinkSync(wavPath);

    res.json(flaskResponse.data);
  } catch (error) {
    console.error("🔥 ERROR:", error.message);
    res.status(500).json({ error: "Processing failed" });
  }
});


// Start server
app.listen(5000, () => {
  console.log("Node server running on http://localhost:5000");
});
