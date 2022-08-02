const { Schema, model } = require("mongoose");

const announcementSchema = new Schema(
  {
    title: String,
    image: String,
    url: String,
  },
  {
    timestamps: true,
  }
);

const Announcement = model("Announcement", announcementSchema);

module.exports = Announcement;
