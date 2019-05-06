const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
  });
  
  const Campground = mongoose.model('Campground', campgroundSchema);

  module.exports = Campground;