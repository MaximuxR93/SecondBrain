const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

if (!fs.existsSync("downloads")) {
  fs.mkdirSync("downloads");
}

app.post("/analyze", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "URL is required",
      });
    }

    const data = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
    });

    const uniqueFormats = [];

    const seen = new Set();

    (data.formats || []).forEach((f) => {
      if (
        f.ext === "mp4" &&
        f.height &&
        f.format_id
      ) {
        const quality = `${f.height}p`;

        if (!seen.has(quality)) {
          seen.add(quality);

          uniqueFormats.push({
            quality,
            formatId: f.format_id,
          });
        }
      }
    });

    uniqueFormats.sort(
      (a, b) =>
        parseInt(b.quality) -
        parseInt(a.quality)
    );

    res.json({
      title: data.title,
      thumbnail: data.thumbnail,
      duration: data.duration,
      uploader: data.uploader,
      formats: uniqueFormats,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to analyze video",
    });
  }
});

app.post("/download", async (req, res) => {
  try {
    const { url, formatId } = req.body;

    if (!url || !formatId) {
      return res.status(400).json({
        error: "Missing data",
      });
    }

    const output =
      "downloads/%(title)s.%(ext)s";

    await ytdlp(url, {
      format: `${formatId}+bestaudio/best`,
      output,
      mergeOutputFormat: "mp4",
    });

    res.json({
      success: true,
      message:
        "Video downloaded successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Download failed",
    });
  }
});

app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});