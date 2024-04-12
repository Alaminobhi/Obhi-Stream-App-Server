const { Schema, model, models } = require("mongoose");

const MediaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    videos: [{ type: String }],
  },
  {
    timestamps: true,
  }
);
const Media = models.Media || model("Media", MediaSchema);
module.exports = Media;