const fs = require("fs");
const path = require("path");
const getVideoStream = async (req, res) => {
  try {
    let id = req.query.id; // ID of video to be streamed
    // Check if the header includes range
    if (!id) {
      return res.status(400).send("Missing video ID");
    }
    const videoPath = path.join(__dirname, "videos", `${id}.mp4`); 
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Missing range header");
    }

    // Check if the video file exists
    if (!fs.existsSync(videoPath)) {
      return res.status(404).send("Video not found");
    }


    // const videoPath = "videos/" + id + ".mp4"; // path of the video
    // const videoSize = fs.statSync("videos/" + id + ".mp4").size; // size of the video
    const videoSize = fs.statSync(videoPath).size; 
    const CHUNK_SIZE = 5 * 1024 * 1024;
    // Parse Range
    // const CHUNK_SIZE = 5 ** 6; // Half megabyte
    // let start = Number(range.replace(/\D/g, ""));
    // let end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const rangeParts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(rangeParts[0], 10);
    const end = rangeParts[1] ? parseInt(rangeParts[1], 10) : Math.min(start + CHUNK_SIZE, videoSize - 1);

    if (start >= videoSize || end >= videoSize) {
      return res.status(416).send("Requested range not satisfiable");
    }

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
    videoStream.on("error", (err) => {
      console.error("Error streaming video:", err);
      res.status(500).send("Error streaming video");
    });
  } catch (err) {
    console.log('error in controller',err);
    res.status(500).send("Internal server error");

  }
};


module.exports = {
  getVideoStream,
};