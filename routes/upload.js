const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const fs = require('fs');

// Set up storage for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'video_file/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Define the route for file upload
router = express.Router(),
router.post('/uploadvideo', upload.single('video'), (req, res) => {
  
  // Handle video upload logic here
     res.status(200).send('Video uploaded successfully!', req.file);
     console.log('Video uploaded:', req.file);
  
});

router.post('/deletevideo', (req, res) => {
  console.log(red);
  const fileName = req.params.name;
  const directoryPath = "./video_file/";
  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    }

    res.status(200).send({
      message: "File is deleted.",
    });
  });
});


module.exports = router