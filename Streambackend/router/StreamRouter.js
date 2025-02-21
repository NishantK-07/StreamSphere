const express = require("express");
const VideoRouter = express.Router();
const { getVideoStream} = require("../controller/StreamController");


VideoRouter.get("/", getVideoStream);
module.exports = VideoRouter;