const Media = require("../Models/Media");
const path = require("path");

exports.getAll = async (req, res) => {
  try {
    const media = await Media.find();
console.log(media);
res.status(200).json(media);
    
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
// Backendurl/public/videos/file_name.mp4
exports.create = async (req, res) => {
  const { name } = req.body;
  let videosPaths = [];

  if (Array.isArray(req.files.videos) && req.files.videos.length > 0) {
    for (let video of req.files.videos) {
      let bass = path.basename(video.path)
      videosPaths.push("videos/" + bass);
    }
  }

  // let bass = path.basename(videosPaths);
  // let url = `/videos/${bass}`

  try {
    const createdMedia = await Media.create({
      name,
      videos: videosPaths,
    });

    res.json({ message: "Media created successfully", createdMedia });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};