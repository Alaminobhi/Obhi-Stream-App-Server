const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const fs = require('fs');
router = express.Router(),
router.post("/deletevideo", async (req, res) => {
    console.log(red);
    const fileName = req.params.name;
    await video_file.destroy({
        where: {
          id: fileName,
        },
      });
      res.json("post deleted successfully!");
    // const directoryPath = "./video_file/";
    // fs.unlink(directoryPath + fileName, (err) => {
    //   if (err) {
    //     res.status(500).send({
    //       message: "Could not delete the file. " + err,
    //     });
    //   }
  
    //   res.status(200).send({
    //     message: "File is deleted.",
    //   });
    // });
  });
  module.exports = router