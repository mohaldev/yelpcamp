const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }]
  });
  
  const Campground = mongoose.model('Campground', campgroundSchema);

  module.exports = Campground;